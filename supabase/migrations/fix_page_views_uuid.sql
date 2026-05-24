-- Fix page_views table UUID function for Supabase compatibility
-- Note: This migration requires the page_views table to exist first
-- Run phase11_seo_suite.sql migration before this one

-- Only run if table exists
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'page_views') THEN
    ALTER TABLE page_views ALTER COLUMN id SET DEFAULT gen_random_uuid();
    ALTER TABLE page_views ALTER COLUMN created_at TYPE TIMESTAMPTZ USING created_at::timestamptz;
  END IF;
END $$;
