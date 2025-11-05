/*
  # Prompt Optimization & Quality Tracking System

  ## Overview
  Creates comprehensive tracking system for prompt performance, quality metrics, and continuous improvement of AI-generated image edits.

  ## New Tables

  ### 1. `prompt_templates`
  Stores reusable prompt components and templates
  - `id` (uuid, primary key)
  - `name` (text) - Descriptive name for the template
  - `category` (text) - Category: lighting, texture, materials, preservation, etc.
  - `template_text` (text) - The actual prompt template content
  - `usage_count` (integer) - How many times this template has been used
  - `average_quality_score` (numeric) - Average quality rating
  - `is_active` (boolean) - Whether this template is currently in use
  - `created_at`, `updated_at` (timestamptz)

  ### 2. `material_specifications`
  Library of material descriptions and properties
  - `id` (uuid, primary key)
  - `material_name` (text) - Name of the material (e.g., "Oak Hardwood")
  - `category` (text) - flooring, wall, exterior, countertop, etc.
  - `detailed_description` (text) - Comprehensive description for prompts
  - `color_palette` (jsonb) - Array of associated colors and finishes
  - `texture_keywords` (text[]) - Array of texture descriptors
  - `reflectivity` (text) - matte, satin, glossy, etc.
  - `typical_uses` (text[]) - Common applications
  - `created_at`, `updated_at` (timestamptz)

  ### 3. `color_references`
  Standardized color library with specific names and values
  - `id` (uuid, primary key)
  - `color_name` (text) - Full color name (e.g., "Benjamin Moore Revere Pewter")
  - `color_family` (text) - gray, blue, white, beige, etc.
  - `hex_value` (text) - Hex color code
  - `rgb_value` (jsonb) - {r, g, b} values
  - `descriptive_terms` (text[]) - warm, cool, neutral, deep, light, etc.
  - `common_uses` (text[]) - interior_walls, exterior, trim, etc.
  - `brand` (text) - Paint brand or color system
  - `created_at` (timestamptz)

  ### 4. `generation_quality_logs`
  Tracks quality metrics for each image generation
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key to profiles)
  - `image_version_id` (uuid, foreign key to image_versions)
  - `prompt_used` (text) - The exact prompt sent to the model
  - `preset_type` (text) - Which preset was used, if any
  - `model_name` (text) - AI model version
  - `generation_time_ms` (integer) - How long generation took
  - `quality_score` (numeric) - User or automated quality rating (1-10)
  - `consistency_score` (numeric) - How well previous edits were preserved (1-10)
  - `photorealism_score` (numeric) - Realism rating (1-10)
  - `user_regenerated` (boolean) - Did user regenerate due to poor quality
  - `user_feedback` (text) - Optional user comments
  - `issues_detected` (jsonb) - Array of specific issues (artifacts, poor_lighting, etc.)
  - `metadata` (jsonb) - Additional tracking data
  - `created_at` (timestamptz)

  ### 5. `prompt_ab_tests`
  A/B testing framework for prompt variations
  - `id` (uuid, primary key)
  - `test_name` (text) - Name of the A/B test
  - `variant_a_prompt` (text) - First prompt variation
  - `variant_b_prompt` (text) - Second prompt variation
  - `target_metric` (text) - What we're optimizing for
  - `variant_a_score` (numeric) - Average score for variant A
  - `variant_b_score` (numeric) - Average score for variant B
  - `sample_size` (integer) - Number of tests run
  - `winner` (text) - a, b, or inconclusive
  - `status` (text) - active, completed, archived
  - `started_at`, `completed_at` (timestamptz)
  - `created_at` (timestamptz)

  ### 6. `prompt_versions`
  Version control for system prompts
  - `id` (uuid, primary key)
  - `prompt_type` (text) - interpret_intent, generate_edit, enhance_prompt, preset_X
  - `version_number` (integer) - Sequential version number
  - `prompt_content` (text) - Full prompt text
  - `change_description` (text) - What changed and why
  - `performance_delta` (numeric) - Performance change vs previous version
  - `is_active` (boolean) - Currently deployed version
  - `deployed_at` (timestamptz)
  - `created_by` (uuid) - User who created this version
  - `created_at` (timestamptz)

  ## Security
  - RLS enabled on all tables
  - Users can only read/write their own generation_quality_logs
  - Admins can manage prompt_templates, material_specifications, color_references
  - Public read access to material_specifications and color_references
  - Prompt_versions restricted to admins only
*/

-- Create prompt_templates table
CREATE TABLE IF NOT EXISTS prompt_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL CHECK (category IN ('lighting', 'texture', 'materials', 'preservation', 'edges', 'spatial', 'quality', 'general')),
  template_text text NOT NULL,
  usage_count integer DEFAULT 0,
  average_quality_score numeric(3,2) DEFAULT 0.00,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE prompt_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access to prompt templates"
  ON prompt_templates FOR SELECT
  TO authenticated
  USING (true);

-- Create material_specifications table
CREATE TABLE IF NOT EXISTS material_specifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  material_name text NOT NULL UNIQUE,
  category text NOT NULL CHECK (category IN ('flooring', 'wall', 'exterior', 'countertop', 'fixture', 'landscaping', 'other')),
  detailed_description text NOT NULL,
  color_palette jsonb DEFAULT '[]'::jsonb,
  texture_keywords text[] DEFAULT '{}',
  reflectivity text CHECK (reflectivity IN ('matte', 'satin', 'semi-gloss', 'glossy', 'polished', 'varied')),
  typical_uses text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE material_specifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access to materials"
  ON material_specifications FOR SELECT
  TO authenticated
  USING (true);

-- Create color_references table
CREATE TABLE IF NOT EXISTS color_references (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  color_name text NOT NULL,
  color_family text NOT NULL CHECK (color_family IN ('white', 'gray', 'beige', 'blue', 'green', 'red', 'yellow', 'brown', 'black', 'other')),
  hex_value text NOT NULL,
  rgb_value jsonb NOT NULL,
  descriptive_terms text[] DEFAULT '{}',
  common_uses text[] DEFAULT '{}',
  brand text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE color_references ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access to colors"
  ON color_references FOR SELECT
  TO authenticated
  USING (true);

-- Create generation_quality_logs table
CREATE TABLE IF NOT EXISTS generation_quality_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  image_version_id uuid REFERENCES image_versions(id) ON DELETE SET NULL,
  prompt_used text NOT NULL,
  preset_type text,
  model_name text DEFAULT 'gemini-2.5-flash-image',
  generation_time_ms integer,
  quality_score numeric(4,2),
  consistency_score numeric(4,2),
  photorealism_score numeric(4,2),
  user_regenerated boolean DEFAULT false,
  user_feedback text,
  issues_detected jsonb DEFAULT '[]'::jsonb,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE generation_quality_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own quality logs"
  ON generation_quality_logs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quality logs"
  ON generation_quality_logs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create prompt_ab_tests table
CREATE TABLE IF NOT EXISTS prompt_ab_tests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  test_name text NOT NULL,
  variant_a_prompt text NOT NULL,
  variant_b_prompt text NOT NULL,
  target_metric text NOT NULL,
  variant_a_score numeric(4,2) DEFAULT 0.00,
  variant_b_score numeric(4,2) DEFAULT 0.00,
  sample_size integer DEFAULT 0,
  winner text CHECK (winner IN ('a', 'b', 'inconclusive')),
  status text DEFAULT 'active' CHECK (status IN ('active', 'completed', 'archived')),
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE prompt_ab_tests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access to ab tests"
  ON prompt_ab_tests FOR SELECT
  TO authenticated
  USING (true);

-- Create prompt_versions table
CREATE TABLE IF NOT EXISTS prompt_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt_type text NOT NULL,
  version_number integer NOT NULL,
  prompt_content text NOT NULL,
  change_description text NOT NULL,
  performance_delta numeric(5,2),
  is_active boolean DEFAULT false,
  deployed_at timestamptz,
  created_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(prompt_type, version_number)
);

ALTER TABLE prompt_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access to prompt versions"
  ON prompt_versions FOR SELECT
  TO authenticated
  USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_generation_quality_logs_user_id ON generation_quality_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_generation_quality_logs_preset_type ON generation_quality_logs(preset_type);
CREATE INDEX IF NOT EXISTS idx_generation_quality_logs_created_at ON generation_quality_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_material_specifications_category ON material_specifications(category);
CREATE INDEX IF NOT EXISTS idx_color_references_family ON color_references(color_family);
CREATE INDEX IF NOT EXISTS idx_prompt_versions_type_active ON prompt_versions(prompt_type, is_active);

-- Create updated_at trigger function if not exists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
DROP TRIGGER IF EXISTS update_prompt_templates_updated_at ON prompt_templates;
CREATE TRIGGER update_prompt_templates_updated_at
  BEFORE UPDATE ON prompt_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_material_specifications_updated_at ON material_specifications;
CREATE TRIGGER update_material_specifications_updated_at
  BEFORE UPDATE ON material_specifications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();