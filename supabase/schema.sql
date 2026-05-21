-- BJÖRK & CO. Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- CATEGORIES
-- ==========================================
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    image TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- COLLECTIONS
-- ==========================================
CREATE TABLE collections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    image TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- TAGS
-- ==========================================
CREATE TABLE tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- PRODUCTS
-- ==========================================
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    short_description TEXT,
    long_description TEXT,
    
    -- Pricing
    price_visibility TEXT CHECK (price_visibility IN ('visible', 'inquiry', 'coming_soon')),
    price DECIMAL(10, 2),
    price_range TEXT,
    
    -- Availability & CTA
    availability_note TEXT,
    cta_type TEXT DEFAULT 'inquire' CHECK (cta_type IN ('inquire', 'request_details', 'book_appointment')),
    
    -- Media
    hero_image TEXT,
    gallery_images TEXT[] DEFAULT '{}',
    video_url TEXT,
    
    -- Status & Publishing
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    featured BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    published_at TIMESTAMPTZ,
    
    -- SEO
    seo_title TEXT,
    seo_description TEXT,
    og_image TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- PRODUCT-CATEGORY RELATIONSHIPS
-- ==========================================
CREATE TABLE product_categories (
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    PRIMARY KEY (product_id, category_id)
);

-- ==========================================
-- PRODUCT-COLLECTION RELATIONSHIPS
-- ==========================================
CREATE TABLE product_collections (
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    collection_id UUID REFERENCES collections(id) ON DELETE CASCADE,
    PRIMARY KEY (product_id, collection_id)
);

-- ==========================================
-- PRODUCT-TAG RELATIONSHIPS
-- ==========================================
CREATE TABLE product_tags (
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (product_id, tag_id)
);

-- ==========================================
-- RELATED PRODUCTS
-- ==========================================
CREATE TABLE related_products (
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    related_product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    PRIMARY KEY (product_id, related_product_id)
);

-- ==========================================
-- BLOG POSTS
-- ==========================================
CREATE TABLE blog_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    excerpt TEXT,
    content TEXT,
    featured_image TEXT,
    category TEXT,
    author TEXT,
    read_time TEXT,
    
    -- Status & Publishing
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    published_at TIMESTAMPTZ,
    
    -- SEO
    seo_title TEXT,
    seo_description TEXT,
    og_image TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- FORM SUBMISSIONS
-- ==========================================
CREATE TABLE form_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    form_type TEXT CHECK (form_type IN ('product_inquiry', 'custom_request', 'appointment', 'contact')),
    
    -- Product reference (for product inquiries)
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    product_name TEXT, -- Denormalized for history
    
    -- Contact Info
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT,
    message TEXT NOT NULL,
    
    -- Appointment specific fields
    preferred_date DATE,
    preferred_time TEXT,
    
    -- Status tracking
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'completed', 'archived')),
    internal_notes TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- SITE SETTINGS
-- ==========================================
CREATE TABLE site_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- NAVIGATION ITEMS
-- ==========================================
CREATE TABLE navigation_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    label TEXT NOT NULL,
    href TEXT NOT NULL,
    parent_id UUID REFERENCES navigation_items(id) ON DELETE CASCADE,
    sort_order INTEGER DEFAULT 0,
    is_visible BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- HOMEPAGE SECTIONS
-- ==========================================
CREATE TABLE homepage_sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    section_type TEXT NOT NULL, -- 'hero', 'featured_products', 'collections', 'quote', 'instagram', 'cta'
    title TEXT,
    subtitle TEXT,
    content JSONB, -- Flexible content structure
    sort_order INTEGER DEFAULT 0,
    is_visible BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- INDEXES FOR PERFORMANCE
-- ==========================================
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_featured ON products(featured);
CREATE INDEX idx_products_published_at ON products(published_at);
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_collections_slug ON collections(slug);
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_category ON blog_posts(category);
CREATE INDEX idx_form_submissions_status ON form_submissions(status);
CREATE INDEX idx_form_submissions_type ON form_submissions(form_type);
CREATE INDEX idx_navigation_parent ON navigation_items(parent_id);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- Enable RLS on all tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE navigation_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_sections ENABLE ROW LEVEL SECURITY;

-- Public read access for published products
CREATE POLICY "Public can view published products" ON products
    FOR SELECT USING (status = 'published');

-- Public read access for categories
CREATE POLICY "Public can view categories" ON categories
    FOR SELECT TO public USING (true);

-- Public read access for collections
CREATE POLICY "Public can view collections" ON collections
    FOR SELECT TO public USING (true);

-- Public read access for tags
CREATE POLICY "Public can view tags" ON tags
    FOR SELECT TO public USING (true);

-- Public read access for published blog posts
CREATE POLICY "Public can view published blog posts" ON blog_posts
    FOR SELECT USING (status = 'published');

-- Public read access for navigation
CREATE POLICY "Public can view navigation" ON navigation_items
    FOR SELECT TO public USING (is_visible = true);

-- Public read access for homepage sections
CREATE POLICY "Public can view homepage sections" ON homepage_sections
    FOR SELECT TO public USING (is_visible = true);

-- Public read access for site settings
CREATE POLICY "Public can view site settings" ON site_settings
    FOR SELECT TO public USING (true);

-- Only authenticated admin users can modify data
CREATE POLICY "Only admin can modify products" ON products
    FOR ALL TO authenticated USING (auth.role() = 'authenticated');

CREATE POLICY "Only admin can modify categories" ON categories
    FOR ALL TO authenticated USING (auth.role() = 'authenticated');

CREATE POLICY "Only admin can modify collections" ON collections
    FOR ALL TO authenticated USING (auth.role() = 'authenticated');

CREATE POLICY "Only admin can modify tags" ON tags
    FOR ALL TO authenticated USING (auth.role() = 'authenticated');

CREATE POLICY "Only admin can modify blog posts" ON blog_posts
    FOR ALL TO authenticated USING (auth.role() = 'authenticated');

CREATE POLICY "Only admin can view and modify form submissions" ON form_submissions
    FOR ALL TO authenticated USING (auth.role() = 'authenticated');

CREATE POLICY "Only admin can modify site settings" ON site_settings
    FOR ALL TO authenticated USING (auth.role() = 'authenticated');

CREATE POLICY "Only admin can modify navigation" ON navigation_items
    FOR ALL TO authenticated USING (auth.role() = 'authenticated');

CREATE POLICY "Only admin can modify homepage sections" ON homepage_sections
    FOR ALL TO authenticated USING (auth.role() = 'authenticated');

-- Public can create form submissions (important for contact forms)
CREATE POLICY "Public can create form submissions" ON form_submissions
    FOR INSERT TO public WITH CHECK (true);

-- ==========================================
-- TRIGGERS FOR UPDATED_AT
-- ==========================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_collections_updated_at BEFORE UPDATE ON collections
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_form_submissions_updated_at BEFORE UPDATE ON form_submissions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON site_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_homepage_sections_updated_at BEFORE UPDATE ON homepage_sections
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
