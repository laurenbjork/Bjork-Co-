-- Add hover_image field to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS hover_image TEXT;

-- Add comment
COMMENT ON COLUMN products.hover_image IS 'Secondary image shown on hover in product cards';
