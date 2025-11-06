/*
  # Fix User Credits RLS Policies

  1. Changes
    - Add UPDATE policy for user_credits table to allow users to update their own credits
    - Add INSERT policy for credit_transactions table
    - This allows the use_credits function to work properly

  2. Security
    - Users can only update their own credits
    - All policies use auth.uid() for security
*/

-- Add UPDATE policy for user_credits (needed by use_credits function)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_credits' 
    AND policyname = 'Users can update their own credits'
  ) THEN
    CREATE POLICY "Users can update their own credits"
      ON user_credits
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- Add INSERT policy for credit_transactions (needed by use_credits function)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'credit_transactions' 
    AND policyname = 'Users can insert their own transactions'
  ) THEN
    CREATE POLICY "Users can insert their own transactions"
      ON credit_transactions
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;
