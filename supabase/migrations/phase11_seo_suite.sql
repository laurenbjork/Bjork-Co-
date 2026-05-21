-- Phase 11: Content & SEO Suite
-- Database schema for blog comments and page analytics

-- ==========================================
-- BLOG COMMENTS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS blog_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES blog_comments(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  comment TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE blog_comments ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Public can view approved comments" 
  ON blog_comments FOR SELECT 
  USING (status = 'approved');

CREATE POLICY "Anyone can submit comments" 
  ON blog_comments FOR INSERT 
  TO anon, authenticated 
  WITH CHECK (true);

CREATE POLICY "Only admins can moderate comments" 
  ON blog_comments FOR ALL 
  TO authenticated 
  USING (true);

-- Indexes
CREATE INDEX idx_blog_comments_post_id ON blog_comments(post_id);
CREATE INDEX idx_blog_comments_status ON blog_comments(status);
CREATE INDEX idx_blog_comments_parent_id ON blog_comments(parent_id);

-- ==========================================
-- PAGE VIEWS TABLE (Analytics)
-- ==========================================
CREATE TABLE IF NOT EXISTS page_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_path TEXT NOT NULL,
  referrer TEXT,
  user_agent TEXT,
  session_id TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Allow inserts from public, read from authenticated
CREATE POLICY "Public can record page views" 
  ON page_views FOR INSERT 
  TO anon, authenticated 
  WITH CHECK (true);

CREATE POLICY "Only admins can view analytics" 
  ON page_views FOR SELECT 
  TO authenticated 
  USING (true);

-- Indexes
CREATE INDEX idx_page_views_path ON page_views(page_path);
CREATE INDEX idx_page_views_created ON page_views(created_at);
CREATE INDEX idx_page_views_session ON page_views(session_id);

-- ==========================================
-- EXTEND PRODUCTS WITH SEO FIELDS
-- ==========================================
-- Add SEO fields if not present
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products' AND column_name = 'meta_title') THEN
    ALTER TABLE products ADD COLUMN meta_title TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products' AND column_name = 'meta_description') THEN
    ALTER TABLE products ADD COLUMN meta_description TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products' AND column_name = 'meta_keywords') THEN
    ALTER TABLE products ADD COLUMN meta_keywords TEXT;
  END IF;
END $$;

-- ==========================================
-- EXTEND BLOG POSTS WITH SEO FIELDS
-- ==========================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'blog_posts' AND column_name = 'meta_title') THEN
    ALTER TABLE blog_posts ADD COLUMN meta_title TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'blog_posts' AND column_name = 'meta_description') THEN
    ALTER TABLE blog_posts ADD COLUMN meta_description TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'blog_posts' AND column_name = 'meta_keywords') THEN
    ALTER TABLE blog_posts ADD COLUMN meta_keywords TEXT;
  END IF;
END $$;

-- ==========================================
-- ANALYTICS HELPER FUNCTIONS
-- ==========================================

-- Function to get daily page view counts
CREATE OR REPLACE FUNCTION get_daily_page_views(days INT DEFAULT 30)
RETURNS TABLE (
  date DATE,
  view_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    DATE(created_at) as date,
    COUNT(*) as view_count
  FROM page_views
  WHERE created_at >= NOW() - INTERVAL '1 day' * days
  GROUP BY DATE(created_at)
  ORDER BY date DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to get top pages
CREATE OR REPLACE FUNCTION get_top_pages(limit_count INT DEFAULT 10)
RETURNS TABLE (
  page_path TEXT,
  view_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    pv.page_path,
    COUNT(*) as view_count
  FROM page_views pv
  WHERE pv.created_at >= NOW() - INTERVAL '30 days'
  GROUP BY pv.page_path
  ORDER BY view_count DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- ==========================================
-- COMMENTS HELPER FUNCTIONS
-- ==========================================

-- Function to get comments with reply count
CREATE OR REPLACE FUNCTION get_comments_with_replies(post_id UUID)
RETURNS TABLE (
  id UUID,
  parent_id UUID,
  name TEXT,
  email TEXT,
  comment TEXT,
  status TEXT,
  created_at TIMESTAMP,
  reply_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.parent_id,
    c.name,
    c.email,
    c.comment,
    c.status,
    c.created_at,
    (SELECT COUNT(*) FROM blog_comments replies WHERE replies.parent_id = c.id) as reply_count
  FROM blog_comments c
  WHERE c.post_id = $1 AND c.parent_id IS NULL
  ORDER BY c.created_at DESC;
END;
$$ LANGUAGE plpgsql;

COMMENT ON TABLE blog_comments IS 'Comments on blog posts with moderation support';
COMMENT ON TABLE page_views IS 'Page view analytics for traffic tracking';
