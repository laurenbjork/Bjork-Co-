-- Phase 12: Size Guides Table
-- For ring sizes, necklace lengths, bracelet sizes

CREATE TABLE IF NOT EXISTS size_guides (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category TEXT NOT NULL CHECK (category IN ('rings', 'necklaces', 'bracelets')),
  title TEXT NOT NULL,
  content JSONB NOT NULL DEFAULT '{}',
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE size_guides ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Public can view active size guides" 
  ON size_guides FOR SELECT 
  USING (is_active = true);

CREATE POLICY "Only admins can manage size guides" 
  ON size_guides FOR ALL 
  TO authenticated 
  USING (true);

-- Unique constraint on category (one active guide per category)
CREATE UNIQUE INDEX idx_size_guides_category_active 
  ON size_guides(category) 
  WHERE is_active = true;

-- Index on category for lookups
CREATE INDEX idx_size_guides_category ON size_guides(category);

-- Seed default size guides
INSERT INTO size_guides (category, title, content, is_active, sort_order) VALUES
(
  'rings',
  'Ring Size Guide',
  '{
    "description": "To find your ring size, measure the circumference of your finger in millimeters or use a ring sizer. Our rings are available in US sizes 4-10 including half sizes.",
    "sizes": [
      {"label": "Size 4", "value": "46.8 mm", "measurement": "14.9 mm diameter"},
      {"label": "Size 5", "value": "49.3 mm", "measurement": "15.7 mm diameter"},
      {"label": "Size 6", "value": "51.9 mm", "measurement": "16.5 mm diameter"},
      {"label": "Size 7", "value": "54.4 mm", "measurement": "17.3 mm diameter"},
      {"label": "Size 8", "value": "57.0 mm", "measurement": "18.2 mm diameter"},
      {"label": "Size 9", "value": "59.5 mm", "measurement": "19.0 mm diameter"},
      {"label": "Size 10", "value": "62.1 mm", "measurement": "19.8 mm diameter"}
    ],
    "tips": [
      "Measure your finger at the end of the day when it''s at its largest",
      "Ensure the ring sizer fits snugly but can slide over your knuckle",
      "Consider wider bands may require a slightly larger size",
      "If between sizes, we recommend sizing up"
    ]
  }'::jsonb,
  true,
  1
)
ON CONFLICT (category) WHERE is_active = true DO NOTHING;

INSERT INTO size_guides (category, title, content, is_active, sort_order) VALUES
(
  'necklaces',
  'Necklace Length Guide',
  '{
    "description": "Choose the perfect necklace length based on your style and neckline. All lengths include the clasp in the measurement.",
    "sizes": [
      {"label": "Choker", "value": "14-16\"", "measurement": "Sits at base of neck"},
      {"label": "Princess", "value": "17-19\"", "measurement": "Sits at collarbone"},
      {"label": "Matinee", "value": "20-24\"", "measurement": "Sits at top of bust"},
      {"label": "Opera", "value": "28-34\"", "measurement": "Sits at bust line"},
      {"label": "Rope", "value": "36-42\"", "measurement": "Sits below bust"}
    ],
    "tips": [
      "Consider your neckline - lower necklines work with longer chains",
      "Layer different lengths for a trendy look",
      "Petite frames may prefer shorter lengths",
      "Add a pendant to customize the drop length"
    ]
  }'::jsonb,
  true,
  2
)
ON CONFLICT (category) WHERE is_active = true DO NOTHING;

INSERT INTO size_guides (category, title, content, is_active, sort_order) VALUES
(
  'bracelets',
  'Bracelet Size Guide',
  '{
    "description": "Measure your wrist circumference and add 0.5-1 inch for a comfortable fit. Our bracelets are available in multiple sizes or adjustable designs.",
    "sizes": [
      {"label": "Extra Small", "value": "5.5-6\"", "measurement": "13.9-15.2 cm"},
      {"label": "Small", "value": "6-6.5\"", "measurement": "15.2-16.5 cm"},
      {"label": "Medium", "value": "6.5-7\"", "measurement": "16.5-17.8 cm"},
      {"label": "Large", "value": "7-7.5\"", "measurement": "17.8-19.0 cm"},
      {"label": "Extra Large", "value": "7.5-8\"", "measurement": "19.0-20.3 cm"}
    ],
    "tips": [
      "Use a flexible measuring tape for accuracy",
      "Measure at the narrowest point of your wrist",
      "Add 0.5\" for a snug fit, 1\" for a loose fit",
      "Consider the bracelet style - bangles need to fit over your hand"
    ]
  }'::jsonb,
  true,
  3
)
ON CONFLICT (category) WHERE is_active = true DO NOTHING;

COMMENT ON TABLE size_guides IS 'Size guide content for rings, necklaces, and bracelets';
