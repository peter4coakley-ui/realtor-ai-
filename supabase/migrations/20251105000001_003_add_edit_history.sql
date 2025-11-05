/*
  # Add Edit History Tracking to Image Versions

  ## Summary
  This migration adds cumulative edit history tracking to the image_versions table,
  enabling the system to maintain a complete record of all editing prompts applied
  to each image version. This supports the cumulative editing feature where each
  subsequent edit builds upon all previous modifications.

  ## Changes
  1. New Column
     - `edit_history` (jsonb, nullable)
       - Stores an array of all previous editing prompts in chronological order
       - Enables the AI to understand the full context of modifications
       - Default is NULL for backward compatibility with existing versions
       - Original images and first edits will have empty or minimal history

  2. Notes
     - Existing image_versions records are not affected (NULL is acceptable)
     - The application layer will handle populating this field for new edits
     - The jsonb type allows flexible querying and efficient storage
     - No RLS changes needed as this inherits from the parent table's policies
*/

-- Add edit_history column to track cumulative editing context
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'image_versions' AND column_name = 'edit_history'
  ) THEN
    ALTER TABLE image_versions ADD COLUMN edit_history jsonb DEFAULT NULL;
  END IF;
END $$;

-- Add index for efficient querying when analyzing edit patterns
CREATE INDEX IF NOT EXISTS idx_image_versions_edit_history ON image_versions USING gin(edit_history);

-- Add comment for documentation
COMMENT ON COLUMN image_versions.edit_history IS 'Array of previous editing prompts applied to reach this version, stored chronologically';
