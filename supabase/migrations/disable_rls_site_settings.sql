-- Disable RLS on site_settings so the API route can write without service role key
-- This table contains non-sensitive public site configuration (hero image, headings, social links)
ALTER TABLE site_settings DISABLE ROW LEVEL SECURITY;
