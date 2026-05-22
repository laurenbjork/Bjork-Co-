-- FAQ CMS Tables
-- Fully customizable FAQ management with categories and rich text answers

-- ==========================================
-- FAQ CATEGORIES TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS faq_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE faq_categories ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Public can view active categories" 
  ON faq_categories FOR SELECT 
  USING (is_active = true);

CREATE POLICY "Only admins can manage categories" 
  ON faq_categories FOR ALL 
  TO authenticated 
  USING (true);

-- ==========================================
-- FAQS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS faqs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES faq_categories(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL, -- HTML rich text
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Public can view active FAQs" 
  ON faqs FOR SELECT 
  USING (is_active = true);

CREATE POLICY "Only admins can manage FAQs" 
  ON faqs FOR ALL 
  TO authenticated 
  USING (true);

-- Indexes
CREATE INDEX idx_faqs_category ON faqs(category_id);
CREATE INDEX idx_faqs_active ON faqs(is_active);
CREATE INDEX idx_faqs_sort ON faqs(sort_order);

-- ==========================================
-- SEED DEFAULT CATEGORIES
-- ==========================================
INSERT INTO faq_categories (name, sort_order, is_active) VALUES
('General', 1, true),
('Orders', 2, true),
('Shipping', 3, true),
('Returns', 4, true),
('Jewelry Care', 5, true)
ON CONFLICT (name) DO NOTHING;

-- ==========================================
-- SEED EXISTING FAQ DATA
-- ==========================================

-- General FAQs
WITH general_cat AS (SELECT id FROM faq_categories WHERE name = 'General')
INSERT INTO faqs (category_id, question, answer, sort_order, is_active)
SELECT 
  general_cat.id,
  'What are your showroom hours?',
  'Our showroom is open Monday through Friday from 10:00 AM to 6:00 PM, and Saturday from 10:00 AM to 4:00 PM. We are closed on Sundays. Appointments are recommended for custom consultations but walk-ins are welcome for browsing.',
  1,
  true
FROM general_cat
ON CONFLICT DO NOTHING;

WITH general_cat AS (SELECT id FROM faq_categories WHERE name = 'General')
INSERT INTO faqs (category_id, question, answer, sort_order, is_active)
SELECT 
  general_cat.id,
  'Do I need an appointment to visit the showroom?',
  'Appointments are recommended for custom design consultations, bridal appointments, and heirloom revamp discussions to ensure you have dedicated time with our team. For browsing and general inquiries, walk-ins are welcome during business hours.',
  2,
  true
FROM general_cat
ON CONFLICT DO NOTHING;

WITH general_cat AS (SELECT id FROM faq_categories WHERE name = 'General')
INSERT INTO faqs (category_id, question, answer, sort_order, is_active)
SELECT 
  general_cat.id,
  'Where is your showroom located?',
  'Our flagship showroom is located in the heart of the jewelry district. The exact address is provided when you book an appointment. We also offer virtual consultations for clients unable to visit in person.',
  3,
  true
FROM general_cat
ON CONFLICT DO NOTHING;

WITH general_cat AS (SELECT id FROM faq_categories WHERE name = 'General')
INSERT INTO faqs (category_id, question, answer, sort_order, is_active)
SELECT 
  general_cat.id,
  'How can I contact BJÖRK & CO.?',
  'You can reach us via email at hello@bjorkco.com, by phone at (555) 123-4567, or through the contact form on our website. For urgent inquiries, we recommend calling during business hours.',
  4,
  true
FROM general_cat
ON CONFLICT DO NOTHING;

-- Orders FAQs
WITH orders_cat AS (SELECT id FROM faq_categories WHERE name = 'Orders')
INSERT INTO faqs (category_id, question, answer, sort_order, is_active)
SELECT 
  orders_cat.id,
  'How long does it take to create a custom piece?',
  'Custom design timelines vary based on complexity. Simple designs typically take 4-6 weeks, while elaborate pieces with multiple stones or intricate settings may take 8-12 weeks. We provide a detailed timeline during your consultation.',
  1,
  true
FROM orders_cat
ON CONFLICT DO NOTHING;

WITH orders_cat AS (SELECT id FROM faq_categories WHERE name = 'Orders')
INSERT INTO faqs (category_id, question, answer, sort_order, is_active)
SELECT 
  orders_cat.id,
  'Do you offer payment plans?',
  'Yes, we offer flexible payment plans for purchases over $2,000. A 50% deposit is required to begin custom work, with the balance due upon completion. We accept all major credit cards, wire transfers, and certified checks.',
  2,
  true
FROM orders_cat
ON CONFLICT DO NOTHING;

WITH orders_cat AS (SELECT id FROM faq_categories WHERE name = 'Orders')
INSERT INTO faqs (category_id, question, answer, sort_order, is_active)
SELECT 
  orders_cat.id,
  'Can I modify an existing design?',
  'Absolutely. Many of our pieces can be customized with different metals, stones, or proportions. Contact us to discuss modifications to any piece in our collection.',
  3,
  true
FROM orders_cat
ON CONFLICT DO NOTHING;

WITH orders_cat AS (SELECT id FROM faq_categories WHERE name = 'Orders')
INSERT INTO faqs (category_id, question, answer, sort_order, is_active)
SELECT 
  orders_cat.id,
  'How do I place a custom order?',
  'Begin by scheduling a consultation through our website or by phone. During the consultation, we discuss your vision, provide guidance on options, create sketches or renderings, and finalize the design before beginning production.',
  4,
  true
FROM orders_cat
ON CONFLICT DO NOTHING;

-- Shipping FAQs
WITH shipping_cat AS (SELECT id FROM faq_categories WHERE name = 'Shipping')
INSERT INTO faqs (category_id, question, answer, sort_order, is_active)
SELECT 
  shipping_cat.id,
  'What shipping methods do you offer?',
  'We ship all jewelry via insured FedEx Priority Overnight with signature required. This ensures your purchase arrives quickly and securely. International shipping is available via FedEx International Priority.',
  1,
  true
FROM shipping_cat
ON CONFLICT DO NOTHING;

WITH shipping_cat AS (SELECT id FROM faq_categories WHERE name = 'Shipping')
INSERT INTO faqs (category_id, question, answer, sort_order, is_active)
SELECT 
  shipping_cat.id,
  'Is shipping insured?',
  'Yes, all shipments are fully insured for their full value from our door to yours. We use discreet, unmarked packaging for security. A signature is required for all deliveries.',
  2,
  true
FROM shipping_cat
ON CONFLICT DO NOTHING;

WITH shipping_cat AS (SELECT id FROM faq_categories WHERE name = 'Shipping')
INSERT INTO faqs (category_id, question, answer, sort_order, is_active)
SELECT 
  shipping_cat.id,
  'How long does shipping take?',
  'Domestic orders typically arrive within 1-2 business days after shipping. International orders take 3-5 business days depending on the destination and customs processing.',
  3,
  true
FROM shipping_cat
ON CONFLICT DO NOTHING;

WITH shipping_cat AS (SELECT id FROM faq_categories WHERE name = 'Shipping')
INSERT INTO faqs (category_id, question, answer, sort_order, is_active)
SELECT 
  shipping_cat.id,
  'Do you ship internationally?',
  'Yes, we ship to most countries worldwide. International orders may be subject to customs fees and import duties, which are the responsibility of the recipient. Please contact us for specific shipping rates to your country.',
  4,
  true
FROM shipping_cat
ON CONFLICT DO NOTHING;

-- Returns FAQs
WITH returns_cat AS (SELECT id FROM faq_categories WHERE name = 'Returns')
INSERT INTO faqs (category_id, question, answer, sort_order, is_active)
SELECT 
  returns_cat.id,
  'What is your return policy?',
  'We accept returns on ready-to-ship items within 14 days of delivery for a full refund or exchange. Custom and personalized pieces are final sale. All returned items must be in original, unworn condition with all packaging and documentation.',
  1,
  true
FROM returns_cat
ON CONFLICT DO NOTHING;

WITH returns_cat AS (SELECT id FROM faq_categories WHERE name = 'Returns')
INSERT INTO faqs (category_id, question, answer, sort_order, is_active)
SELECT 
  returns_cat.id,
  'How do I initiate a return?',
  'To initiate a return, please contact us within 14 days of receiving your order. We will provide you with a prepaid return shipping label and detailed instructions for securely packaging your item.',
  2,
  true
FROM returns_cat
ON CONFLICT DO NOTHING;

-- Jewelry Care FAQs
WITH care_cat AS (SELECT id FROM faq_categories WHERE name = 'Jewelry Care')
INSERT INTO faqs (category_id, question, answer, sort_order, is_active)
SELECT 
  care_cat.id,
  'How should I care for my jewelry?',
  'Store jewelry separately to prevent scratching, clean regularly with a soft cloth, and avoid exposure to harsh chemicals. We recommend professional cleaning and inspection annually. Remove jewelry before swimming, exercising, or using cleaning products.',
  1,
  true
FROM care_cat
ON CONFLICT DO NOTHING;

WITH care_cat AS (SELECT id FROM faq_categories WHERE name = 'Jewelry Care')
INSERT INTO faqs (category_id, question, answer, sort_order, is_active)
SELECT 
  care_cat.id,
  'Do you offer cleaning services?',
  'Yes, we offer complimentary professional cleaning for all BJÖRK & CO. pieces. Visit our showroom or mail your jewelry to us for cleaning. We also provide ultrasonic cleaning and polishing services for a nominal fee.',
  2,
  true
FROM care_cat
ON CONFLICT DO NOTHING;

WITH care_cat AS (SELECT id FROM faq_categories WHERE name = 'Jewelry Care')
INSERT INTO faqs (category_id, question, answer, sort_order, is_active)
SELECT 
  care_cat.id,
  'How do I know my ring size?',
  'Visit our showroom for professional sizing, or use our online Ring Size Guide. We recommend getting sized in the afternoon when your fingers are at their largest. For wide bands, consider sizing up by half a size.',
  3,
  true
FROM care_cat
ON CONFLICT DO NOTHING;

COMMENT ON TABLE faq_categories IS 'FAQ categories that can be fully customized by admin';
COMMENT ON TABLE faqs IS 'FAQ items with rich text HTML answers';
