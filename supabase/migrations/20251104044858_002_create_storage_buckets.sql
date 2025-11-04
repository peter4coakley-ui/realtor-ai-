/*
  # Storage Buckets Setup
  
  ## Overview
  Create Supabase Storage buckets for image hosting with proper RLS policies
  
  ## Storage Buckets
  
  ### 1. `property-images`
  Stores all uploaded and edited property images
  - Original uploads
  - Edited versions
  - Thumbnails (future)
  
  ## Security
  - Users can only upload to their own folders
  - Users can read their own images and team-shared images
  - Public read access disabled for privacy
  - Maximum file size: 10MB
  - Allowed formats: JPG, PNG, WEBP
  
  ## Organization
  - Path structure: `{user_id}/{property_id}/{image_project_id}/{version_id}.png`
  - This ensures clean organization and easy cleanup
*/

-- Create property-images bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'property-images',
  'property-images',
  false,
  10485760, -- 10MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Storage Policy: Users can upload to their own folder
CREATE POLICY "Users can upload own images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'property-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Storage Policy: Users can view their own images
CREATE POLICY "Users can view own images"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'property-images' AND
  (
    (storage.foldername(name))[1] = auth.uid()::text OR
    EXISTS (
      SELECT 1 FROM properties p
      JOIN image_projects ip ON ip.property_id = p.id
      WHERE p.user_id = auth.uid()
    )
  )
);

-- Storage Policy: Users can update their own images
CREATE POLICY "Users can update own images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'property-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Storage Policy: Users can delete their own images
CREATE POLICY "Users can delete own images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'property-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
