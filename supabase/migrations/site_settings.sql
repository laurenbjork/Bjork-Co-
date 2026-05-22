-- Site Settings Table for Social Links and Contact Email
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Public can view site settings" 
  ON site_settings FOR SELECT 
  USING (true);

CREATE POLICY "Only admins can manage site settings" 
  ON site_settings FOR ALL 
  TO authenticated 
  USING (true);

-- Seed default values
INSERT INTO site_settings (key, value) VALUES
('social_instagram', 'bjorkandco'),
('social_facebook', 'BJORKandCO'),
('social_tiktok', ''),
('contact_email', 'hello@bjorkco.com')
ON CONFLICT (key) DO NOTHING;

COMMENT ON TABLE site_settings IS 'Stores site-wide settings like social media links and contact email';
