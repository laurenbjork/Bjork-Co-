-- Instagram Posts Table
CREATE TABLE IF NOT EXISTS instagram_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE instagram_posts ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Public can view active instagram posts" 
  ON instagram_posts FOR SELECT 
  USING (is_active = true);

CREATE POLICY "Only admins can manage instagram posts" 
  ON instagram_posts FOR ALL 
  TO authenticated 
  USING (true);

-- Indexes
CREATE INDEX idx_instagram_posts_sort ON instagram_posts(sort_order);
CREATE INDEX idx_instagram_posts_active ON instagram_posts(is_active);
