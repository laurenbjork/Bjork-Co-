-- ==========================================
-- Storage RLS policies for product-images bucket
-- ==========================================

-- Drop any conflicting policies first
DROP POLICY IF EXISTS "Authenticated can upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can update product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can delete product images" ON storage.objects;
DROP POLICY IF EXISTS "Public can view product images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update product images" ON storage.objects;

-- Allow any user (anon or authenticated) to upload to product-images bucket
-- Admin routes are protected at the application level
CREATE POLICY "Anyone can upload product images"
  ON storage.objects FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id = 'product-images');

-- Allow any user to update objects in product-images bucket
CREATE POLICY "Anyone can update product images"
  ON storage.objects FOR UPDATE
  TO anon, authenticated
  USING (bucket_id = 'product-images');

-- Allow authenticated users to delete objects in product-images bucket
CREATE POLICY "Authenticated can delete product images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'product-images');

-- Allow public to read objects from product-images bucket
CREATE POLICY "Public can view product images"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'product-images');

-- ==========================================
-- Fix site_settings RLS to allow anon upserts
-- (API routes use anon client; admin is protected at app level)
-- ==========================================

DROP POLICY IF EXISTS "Only admins can manage site settings" ON site_settings;

CREATE POLICY "Anyone can manage site settings"
  ON site_settings FOR ALL
  USING (true)
  WITH CHECK (true);
