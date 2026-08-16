-- ──────────────────────────────────────────────────────────────────────────
-- V2: Seed data.
--   Users  : one admin + one demo customer (BCrypt-hashed passwords).
--             admin    → username "admin",    password "admin123"
--             customer → username "demo",      password "customer123"
--   Products: the storefront catalogue (mirrors the original UI mock data).
-- created_at/updated_at are set explicitly because SQL inserts bypass the
-- JPA @PrePersist hook.
-- ──────────────────────────────────────────────────────────────────────────

INSERT IGNORE INTO users (username, email, password, role, created_at, updated_at) VALUES
('admin', 'admin@mercantix.com', '$2a$10$b0ipCtV.6drBYobUC878/uj8KCGUsLheGMy.s4/2W/.tludNvUbEa', 'ADMIN',    NOW(6), NOW(6)),
('demo',  'demo@mercantix.com',  '$2a$10$ljl0vGFk4BIy3Ro60hE6..VLhCzUqFE144UsJrVU9qg2Y61FGUvDu', 'CUSTOMER', NOW(6), NOW(6));

INSERT INTO products
    (name, brand, description, price, original_price, stock, category, sub_category, color, rating, review_count, tag, sizes, gallery, image_url, created_at, updated_at)
VALUES
('Linen Oxford Shirt', 'Mercantix Atelier',
 'A relaxed-fit oxford cut from European linen, garment-washed for a lived-in hand. Mother-of-pearl buttons, tailored collar.',
 78.00, 110.00, 40, 'men', 'shirts', 'Ivory', 4.80, 124, 'Best Seller',
 '["S","M","L","XL"]',
 '["https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=1200&q=80&auto=format","https://images.unsplash.com/photo-1603252109303-2751441dd157?w=1200&q=80&auto=format"]',
 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=70&auto=format', NOW(6), NOW(6)),

('Heritage Wool Coat', 'Mercantix Atelier',
 'Double-breasted silhouette in Italian wool melange. Lined, tailored shoulders.',
 389.00, NULL, 18, 'men', 'outerwear', 'Camel', 4.90, 56, 'New',
 '["S","M","L"]', '[]',
 'https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=800&q=70&auto=format', NOW(6), NOW(6)),

('Cashmere Crew Knit', 'Mercantix Atelier',
 'Pure Mongolian cashmere in a clean crewneck. Effortless layer.',
 165.00, NULL, 32, 'men', 'knitwear', 'Stone', 4.70, 89, NULL,
 '["S","M","L","XL"]', '[]',
 'https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?w=800&q=70&auto=format', NOW(6), NOW(6)),

('Selvedge Straight Denim', 'Mercantix Denim Co.',
 'Japanese selvedge denim, straight cut, raw indigo finish.',
 128.00, NULL, 50, 'men', 'denim', 'Indigo', 4.60, 211, 'Best Seller',
 '["28","30","32","34","36"]', '[]',
 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=70&auto=format', NOW(6), NOW(6)),

('Silk Slip Dress', 'Mercantix Atelier',
 'Bias-cut silk charmeuse with adjustable straps. The little luxe dress.',
 245.00, NULL, 22, 'women', 'dresses', 'Champagne', 4.90, 67, 'New',
 '["XS","S","M","L"]', '[]',
 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=70&auto=format', NOW(6), NOW(6)),

('Wool Trench Coat', 'Mercantix Atelier',
 'Classic trench reinterpreted in heritage wool. Belted waist, storm flap.',
 425.00, NULL, 15, 'women', 'outerwear', 'Sand', 4.80, 42, NULL,
 '["XS","S","M","L"]', '[]',
 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=70&auto=format', NOW(6), NOW(6)),

('Pleated Wide Trousers', 'Mercantix Atelier',
 'High-rise pleated trousers in lightweight wool. Easy elegance.',
 148.00, NULL, 28, 'women', 'trousers', 'Charcoal', 4.50, 38, NULL,
 '["XS","S","M","L"]', '[]',
 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&q=70&auto=format', NOW(6), NOW(6)),

('Cashmere Turtleneck', 'Mercantix Atelier',
 'Fine-gauge cashmere turtleneck. Layer it or wear it alone.',
 198.00, NULL, 30, 'women', 'knitwear', 'Ivory', 4.70, 91, 'Best Seller',
 '["XS","S","M","L"]', '[]',
 'https://images.unsplash.com/photo-1638725722593-1bee45c8a4d6?w=800&q=70&auto=format', NOW(6), NOW(6)),

('Leather Tote', 'Mercantix',
 'Full-grain leather tote with brass hardware. Made in Italy.',
 295.00, NULL, 24, 'accessories', 'bags', 'Cognac', 4.90, 154, 'Best Seller',
 '["One Size"]', '[]',
 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=70&auto=format', NOW(6), NOW(6)),

('Silk Twill Scarf', 'Mercantix',
 'Hand-rolled silk twill scarf, woven in Como.',
 88.00, NULL, 60, 'accessories', 'scarves', 'Emerald', 4.60, 22, NULL,
 '["One Size"]', '[]',
 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=800&q=70&auto=format', NOW(6), NOW(6)),

('Minimalist Leather Watch', 'Mercantix',
 'Slim profile, sapphire crystal, Swiss movement.',
 220.00, NULL, 20, 'accessories', 'watches', 'Black', 4.80, 78, NULL,
 '["One Size"]', '[]',
 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&q=70&auto=format', NOW(6), NOW(6)),

('Italian Loafer', 'Mercantix Atelier',
 'Hand-stitched penny loafer in Italian calfskin.',
 348.00, NULL, 26, 'men', 'shoes', 'Brown', 4.70, 33, 'New',
 '["7","8","9","10","11"]', '[]',
 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=800&q=70&auto=format', NOW(6), NOW(6));
