-- Fix page_views table UUID function for Supabase compatibility
ALTER TABLE page_views ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE page_views ALTER COLUMN created_at TYPE TIMESTAMPTZ USING created_at::timestamptz;
