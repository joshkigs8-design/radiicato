-- ==============================================================================
-- RADIICATO STREETWEAR PLATFORM — PRODUCTION SEED DATA
-- Pre-loaded for Nairobi Atelier & International Storefront
-- Brand: RADIICATO
-- ==============================================================================

-- 1. CATEGORIES
INSERT INTO public.categories (id, name, slug, description, image_url, status, display_order, seo_title, seo_description)
VALUES
    ('c1111111-1111-1111-1111-111111111111', 'T-Shirts', 't-shirts', 'Heavyweight 280 GSM oversized and boxy streetwear tees with 3D chrome emblems, underground graffiti, and custom album tribute graphics.', '/images/products/broken-record-front.jpg', 'active', 1, 'Radiicato Oversized Graphic T-Shirts | Premium Kenyan Streetwear', 'Shop heavyweight 280 GSM Kenyan streetwear tees: Broken Record White Tee and We Are Who We Are Black Tee.'),
    ('c2222222-2222-2222-2222-222222222222', 'Skull Caps & Headwear', 'caps', 'Heavyweight ribbed knit skull caps and beanies with metallic chrome badges. Next release dropping soon in Nairobi.', '/images/products/radiicato-skull-cap.jpg', 'active', 2, 'Radiicato Heavyweight Ribbed Skull Caps | Coming Soon Nairobi', 'Heavyweight ribbed knit streetwear beanies and skull caps. Engineered for Nairobi nights. Dropping soon.'),
    ('c3333333-3333-3333-3333-333333333333', 'Hoodies & Fleece', 'hoodies', 'Custom-milled 460 GSM organic French terry hoodies engineered with oversized hood drape and chrome hardware.', 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1200&auto=format&fit=crop', 'active', 3, 'Radiicato Heavyweight Streetwear Hoodies', 'Luxury 460 GSM streetwear hoodies made for chilly Nairobi nights and global underground aesthetics.'),
    ('c4444444-4444-4444-4444-444444444444', 'Pants & Bottoms', 'pants', 'Tailored utility cargo pants, heavyweight sweatpants, and modular drop-crotch streetwear bottoms.', 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=1200&auto=format&fit=crop', 'active', 4, 'Radiicato Tactical Streetwear Bottoms', 'Architectural cut streetwear cargo pants and sweatpants.')
ON CONFLICT (id) DO NOTHING;

-- 2. COLLECTIONS (THE TWO OFFICIAL LIVE DROPS + DROP 03 TEASER)
INSERT INTO public.collections (id, name, slug, subtitle, description, cover_image, banner_image, gallery_images, color_palette, status, is_scheduled, launch_date, display_order, piece_count_target, seo_title, seo_description)
VALUES
    (
        'b1111111-1111-1111-1111-111111111111', 
        'BROKEN RECORD', 
        'broken-record', 
        'Drop 01 // White Atelier Capsule',
        'The official White Atelier Capsule. Cut in an architectural oversized silhouette from heavyweight 280 GSM combed cotton. Features the signature 3D chrome metallic oval logo badge on the front chest and the iconic shattered MF DOOM vinyl record tribute on the reverse.', 
        '/images/products/broken-record-front.jpg', 
        '/images/broken-record.jpg',
        ARRAY['/images/products/broken-record-front.jpg', '/images/products/broken-record-back.jpg', '/images/products/broken-record-full.jpg'],
        ARRAY['#FFFFFF', '#C0C0C0', '#18181B'],
        'live', 
        false, 
        NULL, 
        1, 
        100,
        'Broken Record White Heavyweight Tee | Radiicato Nairobi', 
        'Radiicato Broken Record White Collection: 280 GSM combed cotton with 3D chrome badge and shattered MF DOOM vinyl.'
    ),
    (
        'b2222222-2222-2222-2222-222222222222', 
        'WE ARE WHO WE ARE', 
        'we-are-who-we-are', 
        'Drop 02 // Black Atelier Capsule',
        'The official Black Atelier Capsule. Rebellious Nairobi underground streetwear cut from washed luxury cotton. Features the signature Radiicato mascot graffiti on the chest and the iconic "W W W R R" (We Are Who We Are) collage on the back.', 
        '/images/products/we-are-who-we-are-front.jpg', 
        '/images/we-are-who-we-are.jpg',
        ARRAY['/images/products/we-are-who-we-are-front.jpg', '/images/products/we-are-who-we-are-back.jpg', '/images/products/we-are-who-we-are-full.jpg'],
        ARRAY['#0A0A0A', '#4D5936', '#E4E4E7'],
        'live', 
        false, 
        NULL, 
        2, 
        100,
        'We Are Who We Are Black Boxy Tee | Radiicato Nairobi', 
        'Radiicato We Are Who We Are Black Collection: 280 GSM washed cotton with mascot graffiti and WWWRR paper collage.'
    ),
    (
        'b3333333-3333-3333-3333-333333333333', 
        'SKULL CAPS', 
        'skull-caps', 
        'Drop 03 // Scheduled Release',
        'Heavyweight ribbed-knit skull caps engineered for chilly Nairobi nights and underground sets. Double-layered construction with brushed chrome insignia badge. Dropping soon.', 
        '/images/products/radiicato-skull-cap.jpg', 
        '/images/skull-cap-banner.jpg',
        ARRAY['/images/products/radiicato-skull-cap.jpg'],
        ARRAY['#0A0A0A', '#D4D4D8'],
        'scheduled', 
        true, 
        '2026-10-20T19:00:00Z', 
        3, 
        100,
        'Radiicato Heavyweight Ribbed Knit Skull Cap | Drop 03 Coming Soon', 
        'Drop 03 teaser: Heavyweight double-knit skull caps with chrome metallic emblem engineered in Nairobi.'
    )
ON CONFLICT (id) DO NOTHING;

-- 3. PRODUCTS
INSERT INTO public.products (id, name, slug, short_description, description, price, cost_price, sku, category_id, collection_id, brand, material, weight_gsm, fit, care_instructions, gender, tags, status, is_featured, is_limited_drop, drop_piece_count, seo_title, seo_description)
VALUES
    (
        '11111111-1111-1111-1111-111111111111',
        'Radiicato "Broken Record" Heavyweight Tee',
        'broken-record-heavyweight-tee',
        'Heavyweight 280 GSM combed organic cotton tee in Crisp Atelier White. Features the signature 3D chrome metallic oval logo badge on the front chest and the iconic shattered MF DOOM vinyl record artwork screen-printed across the back.',
        'Cut in an architectural oversized silhouette, the "Broken Record" tee embodies Radiicato''s philosophy of raw underground authenticity and immaculate tailoring. Milled from dense 280 GSM ring-spun combed cotton, this tee features an ultra-durable 1.25-inch ribbed collar that retains its crisp shape wash after wash. The front chest is anchored by a high-frequency liquid-sheen 3D chrome oval logo badge. The back is a tribute to underground sample culture, presenting a high-density screenprint of a shattered vinyl record intertwined with MF DOOM''s iconic chrome mask and commemorative track engravings.',
        1000.00,
        450.00,
        'RAD-TEE-BR-WHT',
        'c1111111-1111-1111-1111-111111111111',
        'b1111111-1111-1111-1111-111111111111',
        'RADIICATO',
        '100% Combed Heavyweight Organic Cotton',
        280,
        'Boxy Drop-Shoulder Oversized',
        'Machine wash cold inside-out on gentle cycle. Do not bleach. Hang dry in shade. Do not iron directly over chrome badge or print.',
        'unisex',
        ARRAY['Broken Record', 'White Tee', '3D Chrome', 'MF DOOM', 'Heavyweight Cotton', 'Nairobi Atelier', 'Drop 01'],
        'active',
        true,
        true,
        100,
        'Radiicato "Broken Record" Heavyweight White Tee (280 GSM) - KES 1,000',
        'Shop the Radiicato Broken Record White Tee for KES 1,000: 280 GSM combed cotton, 3D chrome chest emblem, and shattered vinyl back.'
    ),
    (
        '22222222-2222-2222-2222-222222222222',
        'Radiicato "We Are Who We Are" Boxy Tee',
        'we-are-who-we-are-boxy-tee',
        'Heavyweight 280 GSM washed obsidian black streetwear tee. Features the signature Radiicato mascot in olive bucket hat with raw marker graffiti on front chest, and the subversive "W W W R R" torn paper typography collage across the reverse.',
        'Representing the rebellious core of Nairobi underground streetwear, the "We Are Who We Are" tee is cut from luxury 280 GSM vintage-washed cotton with subtle distressing along the hemline. The front chest features the hand-drawn Radiicato character mascot clad in an olive bucket hat surrounded by underground marker tags. The reverse carries the striking "W W W R R" (We Are Who We Are) torn paper typography collage, delivering a bold statement for creatives and youth who refuse to conform.',
        800.00,
        350.00,
        'RAD-TEE-WAW-BLK',
        'c1111111-1111-1111-1111-111111111111',
        'b2222222-2222-2222-2222-222222222222',
        'RADIICATO',
        '100% Washed Vintage Obsidian Cotton',
        280,
        'Relaxed Drop-Shoulder Boxy Fit',
        'Machine wash cold inside-out with like colors. Do not tumble dry. Reshape while damp. Iron on reverse.',
        'unisex',
        ARRAY['We Are Who We Are', 'Black Tee', 'Mascot', 'Graffiti', 'Paper Collage', 'Nairobi Underground', 'Drop 02'],
        'active',
        true,
        true,
        100,
        'Radiicato "We Are Who We Are" Boxy Black Tee (280 GSM) - KES 800',
        'Shop the Radiicato We Are Who We Are Black Tee for KES 800: 280 GSM washed cotton, mascot graffiti chest, and WWWRR paper collage back.'
    ),
    (
        '33333333-3333-3333-3333-333333333333',
        'Radiicato Heavyweight Ribbed Knit Skull Cap',
        'radiicato-ribbed-skull-cap-drop-03',
        'Heavyweight double-layer ribbed knit skull cap in Obsidian Black. Features the signature Radiicato liquid chrome metallic emblem badge on the fold cuff. Engineered for chilly Nairobi evenings and studio sessions.',
        'Coming soon to the Radiicato Atelier in an ultra-limited run of 100 units. Constructed from double-layer heavyweight ribbed knit with superior stretch recovery, this skull cap is designed to maintain its structured crown shape. Finished with a riveted brushed chrome metallic insignia badge on the turned cuff.',
        500.00,
        200.00,
        'RAD-CAP-SKULL-BLK',
        'c2222222-2222-2222-2222-222222222222',
        'b3333333-3333-3333-3333-333333333333',
        'RADIICATO',
        '70% Heavyweight Acrylic, 30% Fine Merino Wool',
        NULL,
        'Snug Ribbed Fold-Over Cuff Crown Fit',
        'Hand wash in cold water with mild detergent. Reshape and dry flat. Do not wring or machine dry.',
        'unisex',
        ARRAY['Skull Cap', 'Beanie', 'Drop 03', 'Coming Soon', 'Chrome Badge', 'Nairobi Nights', 'Headwear'],
        'scheduled',
        true,
        true,
        100,
        'Radiicato Heavyweight Ribbed Knit Skull Cap | Drop 03 Coming Soon',
        'Preview the Radiicato Heavyweight Ribbed Knit Skull Cap: Double-layer knit with liquid chrome emblem.'
    )
ON CONFLICT (id) DO NOTHING;

-- 4. PRODUCT IMAGES (FRONT, BACK, FLAT-LAY VIEWS)
INSERT INTO public.product_images (id, product_id, url, alt_text, view_type, is_primary, is_hover, display_order, storage_path)
VALUES
    -- Broken Record Images
    ('11111111-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', '/images/products/broken-record-front.jpg', 'Radiicato Broken Record White Heavyweight Tee - Front View with 3D Chrome Oval Logo', 'front', true, false, 1, 'products/broken-record-front.jpg'),
    ('11111111-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', '/images/products/broken-record-back.jpg', 'Radiicato Broken Record White Heavyweight Tee - Back View with Shattered MF DOOM Vinyl Record Print', 'back', false, true, 2, 'products/broken-record-back.jpg'),
    ('11111111-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111', '/images/products/broken-record-full.jpg', 'Radiicato Broken Record White Heavyweight Tee - Flat Lay Showing Both Front Chrome Emblem and Back Vinyl Graphic', 'flat_lay', false, false, 3, 'products/broken-record-full.jpg'),

    -- We Are Who We Are Images
    ('22222222-0000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222222', '/images/products/we-are-who-we-are-front.jpg', 'Radiicato We Are Who We Are Black Boxy Tee - Front View with Mascot in Bucket Hat and Graffiti', 'front', true, false, 1, 'products/we-are-who-we-are-front.jpg'),
    ('22222222-0000-0000-0000-000000000002', '22222222-2222-2222-2222-222222222222', '/images/products/we-are-who-we-are-back.jpg', 'Radiicato We Are Who We Are Black Boxy Tee - Back View with WWWRR Torn Paper Typography Collage', 'back', false, true, 2, 'products/we-are-who-we-are-back.jpg'),
    ('22222222-0000-0000-0000-000000000003', '22222222-2222-2222-2222-222222222222', '/images/products/we-are-who-we-are-full.jpg', 'Radiicato We Are Who We Are Black Boxy Tee - Flat Lay Showing Both Front Mascot and Back Collage', 'flat_lay', false, false, 3, 'products/we-are-who-we-are-full.jpg'),

    -- Skull Cap Images
    ('33333333-0000-0000-0000-000000000001', '33333333-3333-3333-3333-333333333333', '/images/products/radiicato-skull-cap.jpg', 'Radiicato Heavyweight Ribbed Knit Skull Cap - Front View with Chrome Emblem Badge on Pure White Background', 'front', true, false, 1, 'products/radiicato-skull-cap.jpg')
ON CONFLICT (id) DO NOTHING;

-- 5. PRODUCT VARIANTS (XS THROUGH XXL AND ONE SIZE)
INSERT INTO public.product_variants (id, product_id, color_name, color_hex, size, sku, stock_quantity, low_stock_threshold)
VALUES
    -- Broken Record Variants (XS to XXL)
    ('11111111-aaaa-aaaa-aaaa-000000000001', '11111111-1111-1111-1111-111111111111', 'Crisp Atelier White', '#FFFFFF', 'XS', 'RAD-TEE-BR-WHT-XS', 8, 3),
    ('11111111-aaaa-aaaa-aaaa-000000000002', '11111111-1111-1111-1111-111111111111', 'Crisp Atelier White', '#FFFFFF', 'S', 'RAD-TEE-BR-WHT-S', 18, 5),
    ('11111111-aaaa-aaaa-aaaa-000000000003', '11111111-1111-1111-1111-111111111111', 'Crisp Atelier White', '#FFFFFF', 'M', 'RAD-TEE-BR-WHT-M', 25, 5),
    ('11111111-aaaa-aaaa-aaaa-000000000004', '11111111-1111-1111-1111-111111111111', 'Crisp Atelier White', '#FFFFFF', 'L', 'RAD-TEE-BR-WHT-L', 30, 5),
    ('11111111-aaaa-aaaa-aaaa-000000000005', '11111111-1111-1111-1111-111111111111', 'Crisp Atelier White', '#FFFFFF', 'XL', 'RAD-TEE-BR-WHT-XL', 14, 4),
    ('11111111-aaaa-aaaa-aaaa-000000000006', '11111111-1111-1111-1111-111111111111', 'Crisp Atelier White', '#FFFFFF', 'XXL', 'RAD-TEE-BR-WHT-XXL', 6, 2),

    -- We Are Who We Are Variants (XS to XXL)
    ('22222222-bbbb-bbbb-bbbb-000000000001', '22222222-2222-2222-2222-222222222222', 'Washed Obsidian Black', '#0A0A0A', 'XS', 'RAD-TEE-WAW-BLK-XS', 10, 3),
    ('22222222-bbbb-bbbb-bbbb-000000000002', '22222222-2222-2222-2222-222222222222', 'Washed Obsidian Black', '#0A0A0A', 'S', 'RAD-TEE-WAW-BLK-S', 20, 5),
    ('22222222-bbbb-bbbb-bbbb-000000000003', '22222222-2222-2222-2222-222222222222', 'Washed Obsidian Black', '#0A0A0A', 'M', 'RAD-TEE-WAW-BLK-M', 32, 5),
    ('22222222-bbbb-bbbb-bbbb-000000000004', '22222222-2222-2222-2222-222222222222', 'Washed Obsidian Black', '#0A0A0A', 'L', 'RAD-TEE-WAW-BLK-L', 24, 5),
    ('22222222-bbbb-bbbb-bbbb-000000000005', '22222222-2222-2222-2222-222222222222', 'Washed Obsidian Black', '#0A0A0A', 'XL', 'RAD-TEE-WAW-BLK-XL', 12, 3),
    ('22222222-bbbb-bbbb-bbbb-000000000006', '22222222-2222-2222-2222-222222222222', 'Washed Obsidian Black', '#0A0A0A', 'XXL', 'RAD-TEE-WAW-BLK-XXL', 5, 2),

    -- Skull Cap Variant (ONE SIZE)
    ('33333333-cccc-cccc-cccc-000000000001', '33333333-3333-3333-3333-333333333333', 'Obsidian Black', '#0A0A0A', 'ONE SIZE', 'RAD-CAP-SKULL-BLK', 50, 5)
ON CONFLICT (id) DO NOTHING;

-- 6. EDITORIAL LOOKBOOK ITEMS (KENYAN YOUTH & NAIROBI STREET CULTURE)
INSERT INTO public.lookbook_items (id, title, description, image_url, collection_slug, location_tag, display_order)
VALUES
    ('44444444-4444-4444-4444-000000000001', 'KILIMANI ROOFTOP SESSIONS — BROKEN RECORD', 'Capturing the architectural drape of the Broken Record white tee against the high-rise skyline of Nairobi. Hand-finished 3D chrome metallic emblem catching midday Kenyan sun.', '/images/products/broken-record-front.jpg', 'broken-record', 'Kilimani Rooftops, Nairobi', 1),
    ('44444444-4444-4444-4444-000000000002', 'WESTLANDS UNDERGROUND SOUND — WE ARE WHO WE ARE', 'Shot in an underground recording studio in Westlands, Nairobi. Heavyweight washed black boxy drape commanding presence with the iconic WWWRR paper collage back.', '/images/products/we-are-who-we-are-front.jpg', 'we-are-who-we-are', 'Westlands Studios, Nairobi', 2),
    ('44444444-4444-4444-4444-000000000003', 'ALCHEMIST YARD EDITORIAL — MF DOOM VINYL REVERSE', 'Detailed focus on the shattered metallic vinyl record back print and chrome mask medallion. Nairobi creative youth reclaiming vinyl culture.', '/images/products/broken-record-back.jpg', 'broken-record', 'The Alchemist Yard, Parklands', 3),
    ('44444444-4444-4444-4444-000000000004', 'NAIROBI STREET STUDY — SKULL CAP TEASER', 'First look at the upcoming Radiicato Heavyweight Ribbed Knit Skull Cap styled with the We Are Who We Are drop on the streets of Nairobi.', '/images/products/radiicato-skull-cap.jpg', 'skull-caps', 'Nairobi CBD Rooftops', 4)
ON CONFLICT (id) DO NOTHING;

-- 7. SHIPPING ZONES (KENYA)
INSERT INTO public.shipping_zones (id, name, counties, standard_fee, express_fee, free_shipping_threshold, estimated_days, carrier)
VALUES
    ('55555555-5555-5555-5555-000000000001', 'Nairobi Express Zone', ARRAY['Nairobi', 'Kiambu'], 350.00, 600.00, 10000.00, 'Same Day / 24 Hours', 'Fargo Courier Express'),
    ('55555555-5555-5555-5555-000000000002', 'Major Urban Hubs', ARRAY['Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Machakos', 'Kajiado'], 500.00, 850.00, 10000.00, '24 - 48 Hours', 'Fargo Courier / G4S Kenya'),
    ('55555555-5555-5555-5555-000000000003', 'Rest of Kenya Dispatch', ARRAY['Nyeri', 'Meru', 'Kilifi', 'Uasin Gishu', 'Kakamega', 'Kericho', 'Trans Nzoia'], 650.00, 1100.00, 12000.00, '2 - 3 Business Days', 'G4S Kenya Tracked')
ON CONFLICT (id) DO NOTHING;

-- 8. PROMOTIONAL COUPONS
INSERT INTO public.coupons (id, code, discount_type, value, min_order, usage_limit, times_used, is_active, start_date)
VALUES
    ('66666666-6666-6666-6666-000000000001', 'FIRSTDROP', 'percentage', 10.00, 3500.00, 500, 42, true, '2026-01-01T00:00:00Z'),
    ('66666666-6666-6666-6666-000000000002', 'NAIROBI500', 'fixed', 500.00, 5000.00, 200, 88, true, '2026-01-01T00:00:00Z'),
    ('66666666-6666-6666-6666-000000000003', 'RADIICATOVIP', 'percentage', 15.00, 8000.00, 100, 19, true, '2026-01-01T00:00:00Z')
ON CONFLICT (id) DO NOTHING;

-- 9. COMMUNITY REVIEWS (VERIFIED KENYAN BUYERS)
INSERT INTO public.reviews (id, product_id, product_name, customer_name, customer_email, rating, title, comment, is_verified_purchase, status, created_at)
VALUES
    (
        '77777777-7777-7777-7777-000000000001',
        '11111111-1111-1111-1111-111111111111',
        'Radiicato "Broken Record" Heavyweight Tee',
        'Kariuki Mwangi',
        'k.mwangi@gmail.com',
        5,
        'The MF DOOM shattered vinyl back is insane!',
        'The 3D chrome logo badge on the front looks even better in person, and the shattered record on the back with all the tracks is pure genius. Heavyweight cotton has that perfect boxy drape.',
        true,
        'approved',
        '2026-03-02T14:30:00Z'
    ),
    (
        '77777777-7777-7777-7777-000000000002',
        '22222222-2222-2222-2222-222222222222',
        'Radiicato "We Are Who We Are" Boxy Tee',
        'Zainab Hussein',
        'zainab.h@gmail.com',
        5,
        'Real Nairobi underground quality',
        'The washed black vintage fade is top tier. The mascot graffiti on the chest and the WWWRR collage on the back get compliments every time I wear it out in Kilimani.',
        true,
        'approved',
        '2026-03-04T10:15:00Z'
    ),
    (
        '77777777-7777-7777-7777-000000000003',
        '11111111-1111-1111-1111-111111111111',
        'Radiicato "Broken Record" Heavyweight Tee',
        'Brian Otieno',
        'brian.o@gmail.com',
        5,
        'Worth every shilling',
        'Best heavyweight white tee in Kenya hands down. Thick double-layered collar that does not bacon after washes. M-PESA STK push checkout took literally 5 seconds.',
        true,
        'approved',
        '2026-03-05T18:20:00Z'
    )
ON CONFLICT (id) DO NOTHING;

-- 10. DEFAULT STORE SETTINGS
INSERT INTO public.store_settings (key, value)
VALUES
    ('general', '{
        "storeName": "RADIICATO",
        "tagline": "Independent streetwear engineered in Nairobi for those who refuse to blend in.",
        "contactEmail": "concierge@radiicato.co.ke",
        "contactPhone": "+254 712 904 883",
        "currency": "KES",
        "country": "Kenya",
        "address": "Studio 04, The Alchemist Yard, Parklands Road, Nairobi, Kenya"
    }'::JSONB),
    ('mpesa', '{
        "paybill": "729831",
        "accountName": "RADIICATO APPAREL LTD",
        "isActive": true
    }'::JSONB),
    ('homepage_cms', '{
        "heroHeadline": "WEAR THE DIFFERENCE.",
        "heroSubheadline": "Engineered in Nairobi for young fashion-conscious Kenyans who refuse to blend in.",
        "announcementText": "FREE EXPRESS DELIVERY ACROSS NAIROBI FOR ORDERS OVER KES 10,000 • SAME-DAY DISPATCH VIA FARGO",
        "isAnnouncementActive": true,
        "heroImageUrl": "/images/broken-record.jpg"
    }'::JSONB)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- ------------------------------------------------------------------------------
-- 11. STOREFRONT ANNOUNCEMENTS (MANAGED VIA ADMIN PORTAL)
-- ------------------------------------------------------------------------------
INSERT INTO public.store_announcements (id, title, message, badge, type, link_url, is_active, priority)
VALUES
    (
        'aaaaaaaa-aaaa-aaaa-aaaa-000000000001',
        'Free Express Nairobi Delivery',
        'FREE EXPRESS DELIVERY ACROSS NAIROBI FOR ORDERS OVER KES 10,000 • SAME-DAY DISPATCH VIA FARGO',
        'FREE DELIVERY',
        'delivery',
        '/shipping',
        true,
        1
    ),
    (
        'aaaaaaaa-aaaa-aaaa-aaaa-000000000002',
        'Broken Record Drop 01 Live',
        'DROP 01 // BROKEN RECORD (ATELIER WHITE 280 GSM) IS LIVE • 100 PIECES ALLOCATED',
        'LIMITED DROP',
        'drop',
        '/collections/broken-record',
        false,
        2
    ),
    (
        'aaaaaaaa-aaaa-aaaa-aaaa-000000000003',
        'We Are Who We Are Capsule',
        'DROP 02 // WE ARE WHO WE ARE (WASHED BLACK 280 GSM) NOW DISPATCHING NATIONWIDE',
        'IN STOCK',
        'drop',
        '/collections/we-are-who-we-are',
        false,
        3
    ),
    (
        'aaaaaaaa-aaaa-aaaa-aaaa-000000000004',
        'Skull Caps Teaser',
        'COMING SOON: RADIICATO HEAVYWEIGHT RIBBED KNIT SKULL CAPS IN OBSIDIAN & OLIVE',
        'COMING SOON',
        'drop',
        '/collections/skull-caps',
        false,
        4
    )
ON CONFLICT (id) DO UPDATE SET 
    title = EXCLUDED.title,
    message = EXCLUDED.message,
    badge = EXCLUDED.badge,
    link_url = EXCLUDED.link_url,
    is_active = EXCLUDED.is_active;

-- ------------------------------------------------------------------------------
-- 12. SINGLE ATELIER OWNER / SUPER ADMIN INITIALIZER
-- Grants Super Admin role to joshkigs8@gmail.com
-- ------------------------------------------------------------------------------
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN
        UPDATE public.profiles
        SET role = 'super_admin', full_name = 'Joshua Kigen'
        WHERE email = 'joshkigs8@gmail.com';
    END IF;
END $$;
