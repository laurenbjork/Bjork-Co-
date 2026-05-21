-- BJÖRK & CO. Seed Data
-- Run this after running schema.sql

-- ==========================================
-- CATEGORIES
-- ==========================================
INSERT INTO categories (slug, name, description, sort_order) VALUES
('necklaces', 'Necklaces', 'Elegant necklaces crafted with precision', 1),
('bracelets', 'Bracelets', 'Timeless bracelets for every occasion', 2),
('pendants', 'Pendants', 'Beautiful pendants to treasure', 3),
('rings', 'Rings', 'Stunning rings for all moments', 4),
('bridal', 'Bridal', 'Bridal jewelry collection', 5),
('ready-to-ship', 'Ready to Ship', 'Available immediately', 6),
('custom-designs', 'Custom Designs', 'Bespoke jewelry creations', 7);

-- ==========================================
-- COLLECTIONS
-- ==========================================
INSERT INTO collections (slug, name, description, sort_order) VALUES
('new-arrivals', 'New Arrivals', 'Latest additions to our collection', 1),
('best-sellers', 'Best Sellers', 'Most loved pieces', 2),
('bridal', 'Bridal Collection', 'Wedding and engagement pieces', 3),
('custom-designs', 'Custom Designs', 'One-of-a-kind creations', 4),
('heirloom-revamps', 'Heirloom Revamps', 'Transforming family treasures', 5);

-- ==========================================
-- SAMPLE PRODUCTS
-- ==========================================
INSERT INTO products (
    slug,
    name,
    short_description,
    long_description,
    price_visibility,
    price,
    availability_note,
    hero_image,
    status,
    featured,
    sort_order,
    seo_title,
    seo_description
) VALUES
(
    'golden-harmony-necklace',
    'Golden Harmony Necklace',
    'A delicate gold necklace perfect for everyday elegance',
    'Handcrafted in 18k gold, this necklace features a harmonious blend of classic design and modern sophistication. Each piece is carefully inspected by our master jewelers to ensure exceptional quality.',
    'visible',
    1250.00,
    'In stock, ships within 2-3 business days',
    '/images/products/golden-harmony-necklace.jpg',
    'published',
    true,
    1,
    'Golden Harmony Necklace | BJÖRK & CO.',
    'Elegant 18k gold necklace for everyday wear. Handcrafted with precision by BJÖRK & CO.'
),
(
    'diamond-eternity-band',
    'Diamond Eternity Band',
    'Timeless elegance in a continuous circle of brilliance',
    'A stunning eternity band featuring brilliant-cut diamonds set in platinum. This piece symbolizes never-ending love and commitment.',
    'visible',
    3500.00,
    'Made to order, 3-4 weeks',
    '/images/products/diamond-eternity-band.jpg',
    'published',
    true,
    2,
    'Diamond Eternity Band | BJÖRK & CO.',
    'Platinum eternity band with brilliant-cut diamonds. Symbolizing eternal love.'
),
(
    'sapphire-dream-pendant',
    'Sapphire Dream Pendant',
    'A stunning blue sapphire surrounded by diamonds',
    'This exquisite pendant features a rare Ceylon sapphire, ethically sourced and set in 18k white gold with a halo of brilliant diamonds.',
    'inquiry',
    null,
    'Price available upon request. One-of-a-kind piece.',
    '/images/products/sapphire-dream-pendant.jpg',
    'published',
    false,
    3,
    'Sapphire Dream Pendant | BJÖRK & CO.',
    'Rare Ceylon sapphire pendant with diamond halo. Ethically sourced luxury jewelry.'
),
(
    'emerald-cut-engagement-ring',
    'Emerald Cut Engagement Ring',
    'Modern elegance with vintage appeal',
    'A breathtaking 2-carat emerald-cut diamond set in platinum with pave band. This ring combines modern sophistication with timeless elegance.',
    'visible',
    18500.00,
    'Available for immediate purchase',
    '/images/products/emerald-cut-engagement.jpg',
    'published',
    true,
    1,
    'Emerald Cut Engagement Ring | BJÖRK & CO.',
    'Stunning 2ct emerald-cut diamond engagement ring in platinum. Modern elegance.'
),
(
    'art-deco-revival-bracelet',
    'Art Deco Revival Bracelet',
    'Inspired by the golden age of glamour',
    'A stunning art deco-inspired bracelet featuring geometric patterns and baguette diamonds. Crafted in 18k yellow gold.',
    'coming_soon',
    null,
    'Coming Fall 2025. Join the waitlist.',
    '/images/products/art-deco-bracelet.jpg',
    'published',
    false,
    5,
    'Art Deco Revival Bracelet | BJÖRK & CO.',
    'Geometric art deco bracelet with baguette diamonds in 18k yellow gold.'
);

-- Link products to categories
INSERT INTO product_categories (product_id, category_id)
SELECT p.id, c.id FROM products p, categories c
WHERE p.slug = 'golden-harmony-necklace' AND c.slug = 'necklaces';

INSERT INTO product_categories (product_id, category_id)
SELECT p.id, c.id FROM products p, categories c
WHERE p.slug = 'diamond-eternity-band' AND c.slug = 'rings';

INSERT INTO product_categories (product_id, category_id)
SELECT p.id, c.id FROM products p, categories c
WHERE p.slug = 'sapphire-dream-pendant' AND c.slug = 'pendants';

INSERT INTO product_categories (product_id, category_id)
SELECT p.id, c.id FROM products p, categories c
WHERE p.slug = 'emerald-cut-engagement-ring' AND c.slug = 'bridal';

INSERT INTO product_categories (product_id, category_id)
SELECT p.id, c.id FROM products p, categories c
WHERE p.slug = 'art-deco-revival-bracelet' AND c.slug = 'bracelets';

-- Link products to collections
INSERT INTO product_collections (product_id, collection_id)
SELECT p.id, c.id FROM products p, collections c
WHERE p.featured = true AND c.slug = 'best-sellers';

INSERT INTO product_collections (product_id, collection_id)
SELECT p.id, c.id FROM products p, collections c
WHERE p.slug = 'emerald-cut-engagement-ring' AND c.slug = 'bridal';

-- ==========================================
-- BLOG POSTS
-- ==========================================
INSERT INTO blog_posts (
    slug,
    title,
    excerpt,
    content,
    featured_image,
    category,
    author,
    read_time,
    status,
    published_at,
    seo_title,
    seo_description
) VALUES
(
    'how-to-choose-engagement-ring',
    'How to Choose the Perfect Engagement Ring',
    'A comprehensive guide to selecting an engagement ring that reflects your unique love story.',
    'Choosing an engagement ring is one of the most significant purchases you will make. At BJÖRK & CO., we believe the perfect ring reflects not just your love, but your individual style and values.

## Understanding the 4Cs

The quality of a diamond is determined by the 4Cs: Cut, Color, Clarity, and Carat weight.

## Selecting the Right Metal

From classic platinum to warm rose gold, the metal you choose sets the tone for your ring.

## Finding Your Style

Whether you prefer timeless solitaires or modern tension settings, your ring should feel like an extension of your personal aesthetic.',
    '/images/blog/engagement-ring.jpg',
    'Bridal',
    'Elena Björk',
    '8 min read',
    'published',
    NOW(),
    'How to Choose the Perfect Engagement Ring | BJÖRK & CO.',
    'A comprehensive guide to selecting an engagement ring that reflects your unique love story.'
),
(
    'caring-for-fine-jewelry',
    'Caring for Your Fine Jewelry',
    'Expert tips on cleaning, storing, and maintaining your precious pieces.',
    'Fine jewelry deserves proper care. With the right maintenance, your pieces can remain as brilliant as the day you received them.

## Daily Care

Remove jewelry before swimming, exercising, or applying cosmetics.

## Cleaning at Home

Most jewelry can be cleaned with warm water, mild soap, and a soft brush.

## Professional Maintenance

Visit us annually for professional cleaning and inspection.',
    '/images/blog/jewelry-care.jpg',
    'Education',
    'Sarah Mitchell',
    '5 min read',
    'published',
    NOW(),
    'Caring for Your Fine Jewelry | BJÖRK & CO.',
    'Expert tips on cleaning, storing, and maintaining your precious jewelry pieces.'
);

-- ==========================================
-- SITE SETTINGS
-- ==========================================
INSERT INTO site_settings (key, value, description) VALUES
('site_name', '"BJÖRK & CO."', 'Website name'),
('site_tagline', '"Heritage Craftsmanship Meets Modern Elegance"', 'Website tagline'),
('contact_email', '"hello@bjorkco.com"', 'Primary contact email'),
('contact_phone', '"(555) 123-4567"', 'Primary contact phone'),
('address', '"123 Jewelry District Avenue, New York, NY 10001"', 'Physical address'),
('business_hours', '{"monday_friday": "10:00 AM - 6:00 PM", "saturday": "10:00 AM - 4:00 PM", "sunday": "Closed"}', 'Business hours'),
('social_instagram', '"@bjorkandco"', 'Instagram handle'),
('social_facebook', '"BJORKandCO"', 'Facebook page'),
('seo_default_title', '"BJÖRK & CO. | Heritage Jewelry Craftsmanship"', 'Default SEO title'),
('seo_default_description', '"Discover timeless jewelry crafted with heritage and modern elegance at BJÖRK & CO."', 'Default SEO description');

-- ==========================================
-- NAVIGATION ITEMS
-- ==========================================
-- Top-level navigation
INSERT INTO navigation_items (label, href, sort_order) VALUES
('SHOP', '/shop', 1),
('BRIDAL', '/bridal', 2),
('CUSTOM', '/custom', 3),
('JOURNAL', '/blog', 4),
('ABOUT', '/about', 5),
('CONTACT', '/contact', 6);

-- Shop dropdown items
INSERT INTO navigation_items (label, href, parent_id, sort_order)
SELECT 'Necklaces', '/collections/necklaces', id, 1 FROM navigation_items WHERE label = 'SHOP';

INSERT INTO navigation_items (label, href, parent_id, sort_order)
SELECT 'Bracelets', '/collections/bracelets', id, 2 FROM navigation_items WHERE label = 'SHOP';

INSERT INTO navigation_items (label, href, parent_id, sort_order)
SELECT 'Pendants', '/collections/pendants', id, 3 FROM navigation_items WHERE label = 'SHOP';

INSERT INTO navigation_items (label, href, parent_id, sort_order)
SELECT 'Rings', '/collections/rings', id, 4 FROM navigation_items WHERE label = 'SHOP';

-- Bridal dropdown items
INSERT INTO navigation_items (label, href, parent_id, sort_order)
SELECT 'Ready to Ship', '/collections/ready-to-ship', id, 1 FROM navigation_items WHERE label = 'BRIDAL';

INSERT INTO navigation_items (label, href, parent_id, sort_order)
SELECT 'Engagement Rings', '/collections/engagement-rings', id, 2 FROM navigation_items WHERE label = 'BRIDAL';

INSERT INTO navigation_items (label, href, parent_id, sort_order)
SELECT 'Eternity Bands', '/collections/eternity-bands', id, 3 FROM navigation_items WHERE label = 'BRIDAL';

-- Custom dropdown items
INSERT INTO navigation_items (label, href, parent_id, sort_order)
SELECT 'Custom Designs', '/custom/custom-designs-heirloom-revamps', id, 1 FROM navigation_items WHERE label = 'CUSTOM';

INSERT INTO navigation_items (label, href, parent_id, sort_order)
SELECT 'Heirloom Revamps', '/custom/custom-designs-heirloom-revamps', id, 2 FROM navigation_items WHERE label = 'CUSTOM';

INSERT INTO navigation_items (label, href, parent_id, sort_order)
SELECT 'Showroom Appointments', '/custom/showroom-appointments', id, 3 FROM navigation_items WHERE label = 'CUSTOM';

-- ==========================================
-- HOMEPAGE SECTIONS
-- ==========================================
INSERT INTO homepage_sections (section_type, title, subtitle, content, sort_order, is_visible) VALUES
(
    'hero',
    'BJÖRK & CO.',
    'Heritage Craftsmanship Meets Modern Elegance',
    '{"cta_text": "Shop Now", "cta_href": "/shop", "image": "/images/hero.jpg"}',
    1,
    true
),
(
    'featured_products',
    'New Arrivals',
    'Discover our latest handcrafted pieces',
    '{"collection": "new-arrivals", "limit": 4}',
    2,
    true
),
(
    'quote',
    NULL,
    'Every piece tells a story. What will yours be?',
    '{"author": "Elena Björk", "position": "Founder"}',
    3,
    true
),
(
    'collections',
    'Shop by Collection',
    NULL,
    '{"collections": ["new-arrivals", "bridal", "custom-designs"]}',
    4,
    true
),
(
    'instagram',
    'Follow @bjorkandco',
    NULL,
    '{"handle": "bjorkandco", "images_count": 6}',
    5,
    true
),
(
    'cta',
    'Create Something Unique',
    'Schedule a consultation with our master jewelers',
    '{"cta_text": "Book Appointment", "cta_href": "/custom/showroom-appointments"}',
    6,
    true
);
