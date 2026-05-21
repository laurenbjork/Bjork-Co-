-- Phase 14: Full Page CMS
-- Database schema for page content management

-- ==========================================
-- PAGE CONTENT TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS page_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_slug TEXT NOT NULL,
  section_key TEXT NOT NULL,
  content JSONB NOT NULL DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(page_slug, section_key)
);

-- Enable RLS
ALTER TABLE page_content ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Public can view active page content" 
  ON page_content FOR SELECT 
  USING (is_active = true);

CREATE POLICY "Only admins can manage page content" 
  ON page_content FOR ALL 
  TO authenticated 
  USING (true);

-- Indexes
CREATE INDEX idx_page_content_slug ON page_content(page_slug);
CREATE INDEX idx_page_content_active ON page_content(is_active);

-- ==========================================
-- NAVIGATION ITEMS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS navigation_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  label TEXT NOT NULL,
  href TEXT NOT NULL,
  parent_id UUID REFERENCES navigation_items(id) ON DELETE CASCADE,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  is_dropdown BOOLEAN DEFAULT false,
  icon TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE navigation_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Public can view active navigation items" 
  ON navigation_items FOR SELECT 
  USING (is_active = true);

CREATE POLICY "Only admins can manage navigation items" 
  ON navigation_items FOR ALL 
  TO authenticated 
  USING (true);

-- Indexes
CREATE INDEX idx_navigation_items_parent ON navigation_items(parent_id);
CREATE INDEX idx_navigation_items_sort ON navigation_items(sort_order);
CREATE INDEX idx_navigation_items_active ON navigation_items(is_active);

-- Seed default navigation structure
INSERT INTO navigation_items (label, href, sort_order, is_active, is_dropdown) VALUES
('Shop', '/shop', 1, true, true),
('Bridal', '/bridal', 2, true, true),
('Custom', '/custom', 3, true, true),
('Blog', '/blog', 4, true, false),
('About', '/about', 5, true, false),
('Contact', '/contact', 6, true, false)
ON CONFLICT DO NOTHING;

-- ==========================================
-- SEED DEFAULT ABOUT PAGE CONTENT
-- ==========================================
INSERT INTO page_content (page_slug, section_key, content, sort_order) VALUES
('about', 'hero', '{
  "title": "Our Story",
  "subtitle": "Handcrafted Fine Jewelry Since 1995",
  "description": "At BJÖRK & CO., we believe jewelry should tell a story. For nearly three decades, we have been creating timeless pieces that celebrate life\'s most precious moments.",
  "button_text": "Explore Our Craft",
  "button_link": "/shop"
}'::jsonb, 1)
ON CONFLICT (page_slug, section_key) DO NOTHING;

INSERT INTO page_content (page_slug, section_key, content, sort_order) VALUES
('about', 'mission', '{
  "title": "Our Mission",
  "description": "To create exceptional jewelry that becomes a cherished part of your story. Every piece is designed with intention, crafted with precision, and made to last generations.",
  "values": [
    {"title": "Craftsmanship", "description": "Master artisans with decades of experience"},
    {"title": "Quality", "description": "Only the finest ethically-sourced materials"},
    {"title": "Customization", "description": "Unique pieces designed just for you"}
  ]
}'::jsonb, 2)
ON CONFLICT (page_slug, section_key) DO NOTHING;

INSERT INTO page_content (page_slug, section_key, content, sort_order) VALUES
('about', 'team', '{
  "title": "Meet Our Team",
  "description": "Our master jewelers bring decades of experience and passion to every piece.",
  "members": [
    {"name": "Elsa Björk", "role": "Founder & Master Jeweler", "bio": "With 30 years of experience..."},
    {"name": "Marcus Chen", "role": "Design Director", "bio": "Award-winning designer..."}
  ]
}'::jsonb, 3)
ON CONFLICT (page_slug, section_key) DO NOTHING;

-- ==========================================
-- SEED DEFAULT CONTACT PAGE CONTENT
-- ==========================================
INSERT INTO page_content (page_slug, section_key, content, sort_order) VALUES
('contact', 'hero', '{
  "title": "Get In Touch",
  "subtitle": "We would love to hear from you",
  "description": "Whether you are looking for a custom design, have questions about our collection, or want to schedule a showroom appointment, our team is here to help."
}'::jsonb, 1)
ON CONFLICT (page_slug, section_key) DO NOTHING;

INSERT INTO page_content (page_slug, section_key, content, sort_order) VALUES
('contact', 'contact_info', '{
  "email": "hello@bjorkco.com",
  "phone": "+1 (555) 123-4567",
  "address": "123 Jewelry District, Suite 400, New York, NY 10001",
  "hours": [
    {"day": "Monday - Friday", "time": "10:00 AM - 6:00 PM"},
    {"day": "Saturday", "time": "11:00 AM - 5:00 PM"},
    {"day": "Sunday", "time": "By Appointment"}
  ]
}'::jsonb, 2)
ON CONFLICT (page_slug, section_key) DO NOTHING;

INSERT INTO page_content (page_slug, section_key, content, sort_order) VALUES
('contact', 'map', '{
  "title": "Visit Our Showroom",
  "description": "Experience our collection in person at our New York showroom.",
  "embed_url": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.1!2d-74.0!3d40.7!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDQyJzAwLjAiTiA3NMKwMDAnMDAuMCJX!5e0!3m2!1sen!2sus!4v1609459200000!5m2!1sen!2sus"
}'::jsonb, 3)
ON CONFLICT (page_slug, section_key) DO NOTHING;

-- ==========================================
-- SEED DEFAULT HOMEPAGE CONTENT
-- ==========================================
INSERT INTO page_content (page_slug, section_key, content, sort_order) VALUES
('homepage', 'hero_slider', '{
  "slides": [
    {
      "title": "Timeless Elegance",
      "subtitle": "Handcrafted fine jewelry for life\'s precious moments",
      "button_text": "Shop Collection",
      "button_link": "/shop"
    },
    {
      "title": "Custom Design",
      "subtitle": "Create something uniquely yours",
      "button_text": "Start Your Design",
      "button_link": "/custom"
    }
  ]
}'::jsonb, 1)
ON CONFLICT (page_slug, section_key) DO NOTHING;

INSERT INTO page_content (page_slug, section_key, content, sort_order) VALUES
('homepage', 'featured_collections', '{
  "title": "Featured Collections",
  "description": "Explore our curated collections of fine jewelry",
  "show_collections": true
}'::jsonb, 2)
ON CONFLICT (page_slug, section_key) DO NOTHING;

INSERT INTO page_content (page_slug, section_key, content, sort_order) VALUES
('homepage', 'featured_products', '{
  "title": "Featured Pieces",
  "description": "Handpicked favorites from our collection",
  "show_products": true,
  "product_count": 4
}'::jsonb, 3)
ON CONFLICT (page_slug, section_key) DO NOTHING;

INSERT INTO page_content (page_slug, section_key, content, sort_order) VALUES
('homepage', 'testimonials', '{
  "title": "What Our Clients Say",
  "show_testimonials": true,
  "testimonials": [
    {"quote": "Absolutely stunning craftsmanship!", "author": "Sarah M.", "location": "New York"},
    {"quote": "The custom ring exceeded all expectations.", "author": "Michael T.", "location": "Los Angeles"}
  ]
}'::jsonb, 4)
ON CONFLICT (page_slug, section_key) DO NOTHING;

INSERT INTO page_content (page_slug, section_key, content, sort_order) VALUES
('homepage', 'instagram_feed', '{
  "title": "Follow Our Journey",
  "description": "Get inspired by our latest designs and behind-the-scenes moments",
  "show_instagram": true
}'::jsonb, 5)
ON CONFLICT (page_slug, section_key) DO NOTHING;

COMMENT ON TABLE page_content IS 'CMS content for pages like About, Contact, and Homepage sections';
COMMENT ON TABLE navigation_items IS 'Navigation menu items with parent/child relationships';
