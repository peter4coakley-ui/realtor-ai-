/*
  # PropertyLens AI - Core Database Schema
  
  ## Overview
  Complete database schema for PropertyLens AI real estate photo editing platform.
  
  ## New Tables
  
  ### 1. `profiles`
  User profile information extending Supabase auth.users
  - `id` (uuid, primary key, references auth.users)
  - `email` (text, unique, not null)
  - `full_name` (text)
  - `avatar_url` (text)
  - `company_name` (text)
  - `phone` (text)
  - `subscription_tier` (text) - 'free', 'pro', 'enterprise'
  - `subscription_status` (text) - 'active', 'canceled', 'past_due', 'trialing'
  - `stripe_customer_id` (text, unique)
  - `stripe_subscription_id` (text)
  - `trial_ends_at` (timestamptz)
  - `subscription_ends_at` (timestamptz)
  - `monthly_edit_limit` (integer, default 10)
  - `edits_used_this_month` (integer, default 0)
  - `edits_reset_date` (timestamptz)
  - `created_at` (timestamptz, default now())
  - `updated_at` (timestamptz, default now())
  
  ### 2. `properties`
  Real estate properties with their photos
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles, not null)
  - `address` (text, not null)
  - `description` (text)
  - `property_type` (text) - 'residential', 'commercial', 'land'
  - `status` (text) - 'active', 'archived'
  - `metadata` (jsonb) - custom fields
  - `created_at` (timestamptz, default now())
  - `updated_at` (timestamptz, default now())
  
  ### 3. `image_projects`
  Individual images within a property
  - `id` (uuid, primary key)
  - `property_id` (uuid, references properties, not null)
  - `name` (text, not null)
  - `original_file_name` (text)
  - `original_storage_path` (text) - Supabase Storage path
  - `room_type` (text) - 'kitchen', 'bedroom', 'exterior', etc.
  - `order_index` (integer, default 0)
  - `created_at` (timestamptz, default now())
  - `updated_at` (timestamptz, default now())
  
  ### 4. `image_versions`
  Different edited versions of an image
  - `id` (uuid, primary key)
  - `image_project_id` (uuid, references image_projects, not null)
  - `storage_path` (text, not null) - Supabase Storage path
  - `prompt` (text)
  - `version_type` (text) - 'original', 'preset', 'chat', 'inpaint'
  - `is_saved` (boolean, default false)
  - `created_at` (timestamptz, default now())
  
  ### 5. `chat_messages`
  Chat history for each image project
  - `id` (uuid, primary key)
  - `image_project_id` (uuid, references image_projects, not null)
  - `role` (text, not null) - 'user', 'assistant'
  - `content` (text, not null)
  - `image_version_id` (uuid, references image_versions)
  - `created_at` (timestamptz, default now())
  
  ### 6. `usage_logs`
  Track API usage for billing and analytics
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles, not null)
  - `action_type` (text, not null) - 'edit', 'upload', 'export'
  - `image_version_id` (uuid, references image_versions)
  - `credits_used` (integer, default 1)
  - `metadata` (jsonb)
  - `created_at` (timestamptz, default now())
  
  ### 7. `team_members`
  For agency/team collaboration (future feature)
  - `id` (uuid, primary key)
  - `team_owner_id` (uuid, references profiles, not null)
  - `member_user_id` (uuid, references profiles, not null)
  - `role` (text, default 'member') - 'admin', 'member', 'viewer'
  - `created_at` (timestamptz, default now())
  
  ## Security
  - Enable RLS on all tables
  - Users can only access their own data
  - Team members can access shared properties based on permissions
  
  ## Indexes
  - Optimized for common queries (user properties, image lookups, chat history)
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles Table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  avatar_url text,
  company_name text,
  phone text,
  subscription_tier text DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'enterprise')),
  subscription_status text DEFAULT 'trialing' CHECK (subscription_status IN ('active', 'canceled', 'past_due', 'trialing', 'inactive')),
  stripe_customer_id text UNIQUE,
  stripe_subscription_id text,
  trial_ends_at timestamptz DEFAULT (now() + interval '7 days'),
  subscription_ends_at timestamptz,
  monthly_edit_limit integer DEFAULT 10,
  edits_used_this_month integer DEFAULT 0,
  edits_reset_date timestamptz DEFAULT date_trunc('month', now() + interval '1 month'),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Properties Table
CREATE TABLE IF NOT EXISTS properties (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  address text NOT NULL,
  description text,
  property_type text DEFAULT 'residential' CHECK (property_type IN ('residential', 'commercial', 'land', 'other')),
  status text DEFAULT 'active' CHECK (status IN ('active', 'archived')),
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Image Projects Table
CREATE TABLE IF NOT EXISTS image_projects (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id uuid REFERENCES properties(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  original_file_name text,
  original_storage_path text,
  room_type text,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Image Versions Table
CREATE TABLE IF NOT EXISTS image_versions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  image_project_id uuid REFERENCES image_projects(id) ON DELETE CASCADE NOT NULL,
  storage_path text NOT NULL,
  prompt text,
  version_type text DEFAULT 'original' CHECK (version_type IN ('original', 'preset', 'chat', 'inpaint')),
  is_saved boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Chat Messages Table
CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  image_project_id uuid REFERENCES image_projects(id) ON DELETE CASCADE NOT NULL,
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  content text NOT NULL,
  image_version_id uuid REFERENCES image_versions(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- Usage Logs Table
CREATE TABLE IF NOT EXISTS usage_logs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  action_type text NOT NULL CHECK (action_type IN ('edit', 'upload', 'export', 'delete')),
  image_version_id uuid REFERENCES image_versions(id) ON DELETE SET NULL,
  credits_used integer DEFAULT 1,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Team Members Table
CREATE TABLE IF NOT EXISTS team_members (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_owner_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  member_user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  role text DEFAULT 'member' CHECK (role IN ('admin', 'member', 'viewer')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(team_owner_id, member_user_id)
);

-- Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_properties_user_id ON properties(user_id);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_image_projects_property_id ON image_projects(property_id);
CREATE INDEX IF NOT EXISTS idx_image_versions_project_id ON image_versions(image_project_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_project_id ON chat_messages(image_project_id);
CREATE INDEX IF NOT EXISTS idx_usage_logs_user_id ON usage_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_logs_created_at ON usage_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_team_members_owner ON team_members(team_owner_id);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE image_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE image_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Profiles
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- RLS Policies for Properties
CREATE POLICY "Users can view own properties"
  ON properties FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.team_owner_id = properties.user_id
      AND team_members.member_user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own properties"
  ON properties FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own properties"
  ON properties FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own properties"
  ON properties FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- RLS Policies for Image Projects
CREATE POLICY "Users can view image projects from their properties"
  ON image_projects FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM properties
      WHERE properties.id = image_projects.property_id
      AND (
        properties.user_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM team_members
          WHERE team_members.team_owner_id = properties.user_id
          AND team_members.member_user_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Users can insert image projects to their properties"
  ON image_projects FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM properties
      WHERE properties.id = image_projects.property_id
      AND properties.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their image projects"
  ON image_projects FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM properties
      WHERE properties.id = image_projects.property_id
      AND properties.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM properties
      WHERE properties.id = image_projects.property_id
      AND properties.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their image projects"
  ON image_projects FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM properties
      WHERE properties.id = image_projects.property_id
      AND properties.user_id = auth.uid()
    )
  );

-- RLS Policies for Image Versions
CREATE POLICY "Users can view image versions"
  ON image_versions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM image_projects
      JOIN properties ON properties.id = image_projects.property_id
      WHERE image_projects.id = image_versions.image_project_id
      AND (
        properties.user_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM team_members
          WHERE team_members.team_owner_id = properties.user_id
          AND team_members.member_user_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Users can insert image versions"
  ON image_versions FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM image_projects
      JOIN properties ON properties.id = image_projects.property_id
      WHERE image_projects.id = image_versions.image_project_id
      AND properties.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update image versions"
  ON image_versions FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM image_projects
      JOIN properties ON properties.id = image_projects.property_id
      WHERE image_projects.id = image_versions.image_project_id
      AND properties.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM image_projects
      JOIN properties ON properties.id = image_projects.property_id
      WHERE image_projects.id = image_versions.image_project_id
      AND properties.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete image versions"
  ON image_versions FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM image_projects
      JOIN properties ON properties.id = image_projects.property_id
      WHERE image_projects.id = image_versions.image_project_id
      AND properties.user_id = auth.uid()
    )
  );

-- RLS Policies for Chat Messages
CREATE POLICY "Users can view chat messages"
  ON chat_messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM image_projects
      JOIN properties ON properties.id = image_projects.property_id
      WHERE image_projects.id = chat_messages.image_project_id
      AND (
        properties.user_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM team_members
          WHERE team_members.team_owner_id = properties.user_id
          AND team_members.member_user_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Users can insert chat messages"
  ON chat_messages FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM image_projects
      JOIN properties ON properties.id = image_projects.property_id
      WHERE image_projects.id = chat_messages.image_project_id
      AND properties.user_id = auth.uid()
    )
  );

-- RLS Policies for Usage Logs
CREATE POLICY "Users can view own usage logs"
  ON usage_logs FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own usage logs"
  ON usage_logs FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- RLS Policies for Team Members
CREATE POLICY "Team owners can view their team"
  ON team_members FOR SELECT
  TO authenticated
  USING (team_owner_id = auth.uid() OR member_user_id = auth.uid());

CREATE POLICY "Team owners can manage team members"
  ON team_members FOR INSERT
  TO authenticated
  WITH CHECK (team_owner_id = auth.uid());

CREATE POLICY "Team owners can update team members"
  ON team_members FOR UPDATE
  TO authenticated
  USING (team_owner_id = auth.uid())
  WITH CHECK (team_owner_id = auth.uid());

CREATE POLICY "Team owners can delete team members"
  ON team_members FOR DELETE
  TO authenticated
  USING (team_owner_id = auth.uid());

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_image_projects_updated_at BEFORE UPDATE ON image_projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to reset monthly edit count
CREATE OR REPLACE FUNCTION reset_monthly_edits()
RETURNS void AS $$
BEGIN
  UPDATE profiles
  SET edits_used_this_month = 0,
      edits_reset_date = date_trunc('month', now() + interval '1 month')
  WHERE edits_reset_date <= now();
END;
$$ LANGUAGE plpgsql;
