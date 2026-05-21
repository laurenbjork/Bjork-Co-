-- Phase 8: Advanced Product Management
-- Database schema for product images, categories, and collections

-- ==========================================
-- PRODUCT IMAGES TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_hero BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Public can view product images" 
  ON product_images FOR SELECT 
  USING (true);

CREATE POLICY "Only admins can insert product images" 
  ON product_images FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

CREATE POLICY "Only admins can update product images" 
  ON product_images FOR UPDATE 
  TO authenticated 
  USING (true);

CREATE POLICY "Only admins can delete product images" 
  ON product_images FOR DELETE 
  TO authenticated 
  USING (true);

-- Index for faster lookups
CREATE INDEX idx_product_images_product_id ON product_images(product_id);
CREATE INDEX idx_product_images_hero ON product_images(is_hero) WHERE is_hero = true;

-- ==========================================
-- PRODUCT CATEGORIES JUNCTION TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS product_categories (
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, category_id)
);

-- Enable RLS
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Public can view product categories" 
  ON product_categories FOR SELECT 
  USING (true);

CREATE POLICY "Only admins can manage product categories" 
  ON product_categories FOR ALL 
  TO authenticated 
  USING (true);

-- Indexes
CREATE INDEX idx_product_categories_product ON product_categories(product_id);
CREATE INDEX idx_product_categories_category ON product_categories(category_id);

-- ==========================================
-- PRODUCT COLLECTIONS JUNCTION TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS product_collections (
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  collection_id UUID REFERENCES collections(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, collection_id)
);

-- Enable RLS
ALTER TABLE product_collections ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Public can view product collections" 
  ON product_collections FOR SELECT 
  USING (true);

CREATE POLICY "Only admins can manage product collections" 
  ON product_collections FOR ALL 
  TO authenticated 
  USING (true);

-- Indexes
CREATE INDEX idx_product_collections_product ON product_collections(product_id);
CREATE INDEX idx_product_collections_collection ON product_collections(collection_id);

-- ==========================================
-- STORAGE BUCKET FOR PRODUCT IMAGES
-- ==========================================
-- Note: Create bucket in Supabase Dashboard or via API
-- Bucket name: product-images
-- Public: true
-- Allowed mime types: image/jpeg, image/png, image/webp
-- Max file size: 5MB

-- ==========================================
-- HELPER FUNCTIONS
-- ==========================================

-- Function to get products with their images
CREATE OR REPLACE FUNCTION get_products_with_images()
RETURNS TABLE (
  product_id UUID,
  product_name TEXT,
  hero_image TEXT,
  all_images JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id as product_id,
    p.name as product_name,
    p.hero_image,
    COALESCE(
      jsonb_agg(
        jsonb_build_object(
          'id', pi.id,
          'url', pi.image_url,
          'sort_order', pi.sort_order,
          'is_hero', pi.is_hero
        ) ORDER BY pi.sort_order
      ) FILTER (WHERE pi.id IS NOT NULL),
      '[]'::jsonb
    ) as all_images
  FROM products p
  LEFT JOIN product_images pi ON p.id = pi.product_id
  GROUP BY p.id, p.name, p.hero_image;
END;
$$ LANGUAGE plpgsql;

-- ==========================================
-- SEED DATA (Sample images for testing)
-- ==========================================
-- Add sample images to existing products if needed
-- This can be run after products exist

COMMENT ON TABLE product_images IS 'Gallery images for products, supports multiple images with ordering';
COMMENT ON TABLE product_categories IS 'Many-to-many relationship between products and categories';
COMMENT ON TABLE product_collections IS 'Many-to-many relationship between products and collections';
