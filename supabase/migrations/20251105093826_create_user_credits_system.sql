/*
  # User Credits System

  1. New Tables
    - `user_credits`: Tracks available credits for each user
      - `user_id` (uuid, references auth.users) - The user
      - `credits` (integer) - Current available credits
      - `total_used` (integer) - Total credits used (for analytics)
      - `created_at` (timestamptz) - When account was created
      - `updated_at` (timestamptz) - Last credit update

    - `credit_transactions`: Audit log of all credit changes
      - `user_id` (uuid, references auth.users) - The user
      - `amount` (integer) - Credits added (positive) or used (negative)
      - `transaction_type` (enum) - Type of transaction
      - `description` (text) - Details about the transaction
      - `created_at` (timestamptz) - When transaction occurred

  2. Functions
    - Trigger to auto-create user_credits record on signup with 10 free credits
    - Function to use credits (with validation)
    - Function to add credits (from purchases)

  3. Security
    - Enable RLS on all tables
    - Users can only view/use their own credits
    - Only system can add credits directly
*/

-- Create transaction type enum
CREATE TYPE credit_transaction_type AS ENUM (
    'signup_bonus',
    'purchase',
    'refund',
    'ai_edit',
    'admin_adjustment'
);

-- Create user_credits table
CREATE TABLE IF NOT EXISTS user_credits (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  credits integer NOT NULL DEFAULT 10,
  total_used integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT credits_non_negative CHECK (credits >= 0)
);

ALTER TABLE user_credits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own credits"
  ON user_credits
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create credit_transactions table
CREATE TABLE IF NOT EXISTS credit_transactions (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount integer NOT NULL,
  transaction_type credit_transaction_type NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own transactions"
  ON credit_transactions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Function to automatically create credits for new users
CREATE OR REPLACE FUNCTION handle_new_user_credits()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_credits (user_id, credits, total_used)
  VALUES (NEW.id, 10, 0);
  
  INSERT INTO credit_transactions (user_id, amount, transaction_type, description)
  VALUES (NEW.id, 10, 'signup_bonus', 'Welcome bonus: 10 free credits');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create credits on user signup
DROP TRIGGER IF EXISTS on_auth_user_created_credits ON auth.users;
CREATE TRIGGER on_auth_user_created_credits
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user_credits();

-- Function to use credits
CREATE OR REPLACE FUNCTION use_credits(credit_amount integer, operation_description text)
RETURNS boolean AS $$
DECLARE
  current_credits integer;
BEGIN
  -- Get current credits
  SELECT credits INTO current_credits
  FROM user_credits
  WHERE user_id = auth.uid();
  
  -- Check if user exists
  IF current_credits IS NULL THEN
    RAISE EXCEPTION 'User credits not found';
  END IF;
  
  -- Check if enough credits
  IF current_credits < credit_amount THEN
    RETURN false;
  END IF;
  
  -- Deduct credits and update usage
  UPDATE user_credits
  SET 
    credits = credits - credit_amount,
    total_used = total_used + credit_amount,
    updated_at = now()
  WHERE user_id = auth.uid();
  
  -- Log transaction
  INSERT INTO credit_transactions (user_id, amount, transaction_type, description)
  VALUES (auth.uid(), -credit_amount, 'ai_edit', operation_description);
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to add credits (from purchases)
CREATE OR REPLACE FUNCTION add_credits(credit_amount integer, transaction_desc text, trans_type credit_transaction_type DEFAULT 'purchase')
RETURNS void AS $$
BEGIN
  -- Add credits
  UPDATE user_credits
  SET 
    credits = credits + credit_amount,
    updated_at = now()
  WHERE user_id = auth.uid();
  
  -- Log transaction
  INSERT INTO credit_transactions (user_id, amount, transaction_type, description)
  VALUES (auth.uid(), credit_amount, trans_type, transaction_desc);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_credit_transactions_user_id ON credit_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_created_at ON credit_transactions(created_at DESC);
