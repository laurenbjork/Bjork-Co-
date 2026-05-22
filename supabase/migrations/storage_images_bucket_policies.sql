-- RLS policies for the 'images' storage bucket
-- Bucket must be created manually in Supabase Dashboard as a public bucket

-- Allow public read access to the images bucket
CREATE POLICY "Public can view images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'images');

-- Allow authenticated users to upload
CREATE POLICY "Authenticated can upload images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'images');

-- Allow authenticated users to update/replace
CREATE POLICY "Authenticated can update images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'images');

-- Allow authenticated users to delete
CREATE POLICY "Authenticated can delete images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'images');
