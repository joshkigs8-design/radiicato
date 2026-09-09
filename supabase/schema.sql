-- ==============================================================================
-- RADIICATO STREETWEAR PLATFORM — SUPABASE POSTGRESQL PRODUCTION SCHEMA
-- Engineered for Nairobi Atelier & International E-Commerce
-- Brand: RADIICATO
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 0. EXTENSIONS & STORAGE BUCKETS INITIALIZATION
-- ------------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Initialize Public Storage Buckets for Photography & Assets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
    ('collections', 'collections', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif']),
    ('products', 'products', true, 15728640, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif']),
    ('lookbook', 'lookbook', true, 20971520, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'video/mp4']),
    ('media', 'media', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/avif', 'video/mp4', 'application/pdf']),
    ('founder', 'founder', true, 15728640, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- ------------------------------------------------------------------------------
-- 1. PROFILES & USER ROLES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'super_admin', 'inventory_manager', 'order_manager', 'content_manager')),
    loyalty_points INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 2. CATEGORIES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    image_url TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    display_order INT NOT NULL DEFAULT 0,
    seo_title TEXT,
    seo_description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 3. COLLECTIONS (DROPS & CAPSULES)
-- Supporting Broken Record, We Are Who We Are, and Skull Caps (Soon)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.collections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    subtitle TEXT,
    description TEXT,
    cover_image TEXT,
    banner_image TEXT,
    gallery_images TEXT[] DEFAULT '{}',
    color_palette TEXT[] DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'live', 'archived')),
    is_scheduled BOOLEAN NOT NULL DEFAULT FALSE,
    launch_date TIMESTAMPTZ,
    display_order INT NOT NULL DEFAULT 0,
    piece_count_target INT,
    seo_title TEXT,
    seo_description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 4. PRODUCTS (STREETWEAR PIECES)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    short_description TEXT,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    sale_price NUMERIC(10, 2) CHECK (sale_price IS NULL OR sale_price >= 0),
    cost_price NUMERIC(10, 2) CHECK (cost_price IS NULL OR cost_price >= 0),
    sku TEXT UNIQUE NOT NULL,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    collection_id UUID REFERENCES public.collections(id) ON DELETE SET NULL,
    brand TEXT NOT NULL DEFAULT 'RADIICATO',
    material TEXT,
    weight_gsm INT,
    fit TEXT,
    care_instructions TEXT,
    gender TEXT NOT NULL DEFAULT 'unisex' CHECK (gender IN ('unisex', 'mens', 'womens')),
    tags TEXT[] DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('draft', 'active', 'scheduled', 'archived', 'sold_out')),
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    is_limited_drop BOOLEAN NOT NULL DEFAULT FALSE,
    drop_piece_count INT,
    seo_title TEXT,
    seo_description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 5. PRODUCT IMAGES (FRONT, BACK, FULL, ON-MODEL PHOTOGRAPHY)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.product_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    alt_text TEXT,
    view_type TEXT NOT NULL DEFAULT 'front' CHECK (view_type IN ('front', 'back', 'full', 'detail', 'model', 'flat_lay')),
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    is_hover BOOLEAN NOT NULL DEFAULT FALSE,
    display_order INT NOT NULL DEFAULT 0,
    width INT,
    height INT,
    storage_path TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 6. PRODUCT VARIANTS & SIZES
-- Supporting XS through XXL, and ONE SIZE for skull caps
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    color_name TEXT NOT NULL,
    color_hex TEXT NOT NULL,
    size TEXT NOT NULL CHECK (size IN ('XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'ONE SIZE')),
    sku TEXT UNIQUE NOT NULL,
    price_override NUMERIC(10, 2),
    stock_quantity INT NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    low_stock_threshold INT NOT NULL DEFAULT 3,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 7. INVENTORY AUDIT LOGS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.inventory_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    variant_id UUID NOT NULL REFERENCES public.product_variants(id) ON DELETE CASCADE,
    change_amount INT NOT NULL,
    previous_stock INT NOT NULL,
    new_stock INT NOT NULL,
    reason TEXT NOT NULL CHECK (reason IN ('sale', 'restock', 'adjustment', 'return', 'damaged', 'promo_allocation')),
    note TEXT,
    reference_id TEXT,
    created_by TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 8. CUSTOMERS & SAVED ADDRESSES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT NOT NULL,
    orders_count INT NOT NULL DEFAULT 0,
    total_spent NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    is_vip BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    county TEXT NOT NULL,
    town TEXT NOT NULL,
    street_address TEXT NOT NULL,
    delivery_instructions TEXT,
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 9. SHIPPING ZONES & RATES (KENYA)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.shipping_zones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    counties TEXT[] NOT NULL,
    standard_fee NUMERIC(10, 2) NOT NULL,
    express_fee NUMERIC(10, 2) NOT NULL,
    free_shipping_threshold NUMERIC(10, 2) NOT NULL DEFAULT 10000.00,
    estimated_days TEXT NOT NULL,
    carrier TEXT DEFAULT 'Fargo Courier / G4S Kenya'
);

-- ------------------------------------------------------------------------------
-- 10. COUPONS & PROMOTIONAL DISCOUNTS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL,
    discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    value NUMERIC(10, 2) NOT NULL CHECK (value > 0),
    min_order NUMERIC(10, 2) NOT NULL DEFAULT 0,
    max_discount NUMERIC(10, 2),
    start_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    end_date TIMESTAMPTZ,
    usage_limit INT,
    times_used INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    applicable_collections TEXT[] DEFAULT '{}',
    applicable_products TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 11. ORDERS & ORDER ITEMS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number TEXT UNIQUE NOT NULL,
    customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    shipping_county TEXT NOT NULL,
    shipping_town TEXT NOT NULL,
    shipping_address TEXT NOT NULL,
    delivery_instructions TEXT,
    subtotal NUMERIC(10, 2) NOT NULL,
    discount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    discount_code TEXT,
    shipping_fee NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    total NUMERIC(10, 2) NOT NULL,
    payment_method TEXT NOT NULL CHECK (payment_method IN ('mpesa', 'card', 'paystack', 'cash_on_delivery')),
    payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
    fulfillment_status TEXT NOT NULL DEFAULT 'pending' CHECK (fulfillment_status IN ('pending', 'paid', 'processing', 'packed', 'shipped', 'delivered', 'cancelled', 'refunded')),
    mpesa_receipt_number TEXT,
    tracking_number TEXT,
    carrier TEXT DEFAULT 'Fargo Courier',
    internal_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    variant_id UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    variant_title TEXT NOT NULL,
    sku TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    total NUMERIC(10, 2) NOT NULL,
    image_url TEXT
);

-- ------------------------------------------------------------------------------
-- 12. PAYMENTS (M-PESA / PAYSTACK / CARD)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    provider TEXT NOT NULL,
    reference TEXT NOT NULL,
    mpesa_receipt_number TEXT,
    phone_number TEXT,
    amount NUMERIC(10, 2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    raw_payload JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 13. REVIEWS (KENYAN STREETWEAR COMMUNITY)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    product_name TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title TEXT NOT NULL,
    comment TEXT NOT NULL,
    is_verified_purchase BOOLEAN NOT NULL DEFAULT FALSE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 14. EDITORIAL LOOKBOOK & NAIROBI STREET CAMPAIGNS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.lookbook_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT NOT NULL,
    collection_slug TEXT,
    location_tag TEXT,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 15. WAITLIST & VIP DROP SUBSCRIBERS (FOR SKULL CAPS & SECRET RELEASES)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.drop_waitlists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    collection_slug TEXT NOT NULL,
    contact_value TEXT NOT NULL,
    is_notified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 16. MEDIA LIBRARY & CLOUD ASSET RECORDS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    file_name TEXT NOT NULL,
    bucket TEXT NOT NULL DEFAULT 'products',
    storage_path TEXT NOT NULL,
    url TEXT NOT NULL,
    file_size INT NOT NULL,
    mime_type TEXT NOT NULL,
    width INT,
    height INT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 17. ADMIN NOTIFICATIONS & AUDIT LOGS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('order', 'inventory', 'payment', 'review', 'system')),
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    link TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_name TEXT NOT NULL,
    user_role TEXT NOT NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT,
    details TEXT,
    ip_address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 18. STORE SETTINGS & HOMEPAGE CMS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.store_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 19. STOREFRONT ANNOUNCEMENTS & DELIVERY NOTIFICATIONS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.store_announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    badge TEXT DEFAULT 'FREE DELIVERY',
    type TEXT NOT NULL DEFAULT 'delivery' CHECK (type IN ('delivery', 'drop', 'promo', 'general')),
    link_url TEXT DEFAULT '/shipping',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    priority INT NOT NULL DEFAULT 1,
    starts_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    created_by TEXT DEFAULT 'admin@radiicato.co.ke',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- DATABASE FUNCTIONS & TRIGGERS
-- ==============================================================================

-- 1. Automated Updated_At Trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_profiles_modtime ON public.profiles;
CREATE TRIGGER update_profiles_modtime BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS update_categories_modtime ON public.categories;
CREATE TRIGGER update_categories_modtime BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS update_collections_modtime ON public.collections;
CREATE TRIGGER update_collections_modtime BEFORE UPDATE ON public.collections FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS update_products_modtime ON public.products;
CREATE TRIGGER update_products_modtime BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS update_product_variants_modtime ON public.product_variants;
CREATE TRIGGER update_product_variants_modtime BEFORE UPDATE ON public.product_variants FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS update_orders_modtime ON public.orders;
CREATE TRIGGER update_orders_modtime BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS update_customers_modtime ON public.customers;
CREATE TRIGGER update_customers_modtime BEFORE UPDATE ON public.customers FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS update_store_announcements_modtime ON public.store_announcements;
CREATE TRIGGER update_store_announcements_modtime BEFORE UPDATE ON public.store_announcements FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 2. Automated Sequential Order Number Generator: RAD-YYYY-XXXXXX
CREATE SEQUENCE IF NOT EXISTS order_number_seq START WITH 101;

CREATE OR REPLACE FUNCTION public.set_order_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
        NEW.order_number := 'RAD-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(NEXTVAL('order_number_seq')::TEXT, 6, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_set_order_number ON public.orders;
CREATE TRIGGER trigger_set_order_number BEFORE INSERT ON public.orders FOR EACH ROW EXECUTE FUNCTION public.set_order_number();

-- 3. Automatic Inventory Deduction Trigger on Paid Order
CREATE OR REPLACE FUNCTION public.handle_order_inventory_deduction()
RETURNS TRIGGER AS $$
DECLARE
    item RECORD;
BEGIN
    IF (NEW.payment_status = 'completed' AND (OLD.payment_status IS NULL OR OLD.payment_status <> 'completed')) THEN
        FOR item IN SELECT variant_id, quantity FROM public.order_items WHERE order_id = NEW.id LOOP
            -- Decrement variant stock
            UPDATE public.product_variants
            SET stock_quantity = GREATEST(stock_quantity - item.quantity, 0)
            WHERE id = item.variant_id;

            -- Log transaction
            INSERT INTO public.inventory_transactions (
                variant_id, change_amount, previous_stock, new_stock, reason, reference_id, created_by
            )
            SELECT 
                item.variant_id,
                -item.quantity,
                stock_quantity + item.quantity,
                stock_quantity,
                'sale',
                NEW.order_number,
                'System Order Processing'
            FROM public.product_variants WHERE id = item.variant_id;
        END LOOP;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_deduct_inventory ON public.orders;
CREATE TRIGGER trigger_deduct_inventory AFTER UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.handle_order_inventory_deduction();

-- 4. Automatic Customer Metrics Updater
CREATE OR REPLACE FUNCTION public.update_customer_spending()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.customer_id IS NOT NULL AND NEW.payment_status = 'completed' THEN
        UPDATE public.customers
        SET 
            orders_count = orders_count + 1,
            total_spent = total_spent + NEW.total,
            updated_at = NOW()
        WHERE id = NEW.customer_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_customer_spending ON public.orders;
CREATE TRIGGER trigger_update_customer_spending AFTER INSERT OR UPDATE OF payment_status ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_customer_spending();

-- 5. Automatic User Profile & Super Admin Provisioner
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, email, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', CASE WHEN NEW.email = 'admin@radiicato.co.ke' THEN 'Radiicato Founder & Creative Director' ELSE split_part(NEW.email, '@', 1) END),
        NEW.email,
        CASE WHEN NEW.email = 'admin@radiicato.co.ke' THEN 'super_admin' ELSE COALESCE(NEW.raw_user_meta_data->>'role', 'customer') END
    )
    ON CONFLICT (id) DO UPDATE SET
        role = CASE WHEN EXCLUDED.email = 'admin@radiicato.co.ke' THEN 'super_admin' ELSE EXCLUDED.role END,
        full_name = EXCLUDED.full_name,
        updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- PERFORMANCE & LOOKUP INDEXES
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_collection ON public.products(collection_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);

CREATE INDEX IF NOT EXISTS idx_collections_slug ON public.collections(slug);
CREATE INDEX IF NOT EXISTS idx_collections_status ON public.collections(status);

CREATE INDEX IF NOT EXISTS idx_product_images_product ON public.product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_product_variants_product ON public.product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_product_variants_sku ON public.product_variants(sku);

CREATE INDEX IF NOT EXISTS idx_orders_customer ON public.orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_email ON public.orders(email);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_reviews_product ON public.reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_status ON public.reviews(status);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lookbook_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drop_waitlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_announcements ENABLE ROW LEVEL SECURITY;

-- 0. Profiles Policies
DROP POLICY IF EXISTS "Allow public insert for profile creation" ON public.profiles;
CREATE POLICY "Allow public insert for profile creation" 
    ON public.profiles FOR INSERT 
    WITH CHECK (true);

DROP POLICY IF EXISTS "Public can view profiles" ON public.profiles;
CREATE POLICY "Public can view profiles" 
    ON public.profiles FOR SELECT 
    USING (true);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" 
    ON public.profiles FOR UPDATE 
    USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins have full access to profiles" ON public.profiles;
CREATE POLICY "Admins have full access to profiles" 
    ON public.profiles TO authenticated 
    USING (true) WITH CHECK (true);

-- 1. Storefront Public Read Policies (Allowing active & scheduled drops like Skull Caps)
DROP POLICY IF EXISTS "Public can view active or scheduled products" ON public.products;
CREATE POLICY "Public can view active or scheduled products" 
    ON public.products FOR SELECT 
    USING (status IN ('active', 'scheduled'));

DROP POLICY IF EXISTS "Public can view product images" ON public.product_images;
CREATE POLICY "Public can view product images" 
    ON public.product_images FOR SELECT 
    USING (true);

DROP POLICY IF EXISTS "Public can view product variants" ON public.product_variants;
CREATE POLICY "Public can view product variants" 
    ON public.product_variants FOR SELECT 
    USING (true);

DROP POLICY IF EXISTS "Public can view active categories" ON public.categories;
CREATE POLICY "Public can view active categories" 
    ON public.categories FOR SELECT 
    USING (status = 'active');

DROP POLICY IF EXISTS "Public can view live or scheduled collections" ON public.collections;
CREATE POLICY "Public can view live or scheduled collections" 
    ON public.collections FOR SELECT 
    USING (status IN ('live', 'scheduled'));

DROP POLICY IF EXISTS "Public can view approved reviews" ON public.reviews;
CREATE POLICY "Public can view approved reviews" 
    ON public.reviews FOR SELECT 
    USING (status = 'approved');

DROP POLICY IF EXISTS "Public can view lookbook" ON public.lookbook_items;
CREATE POLICY "Public can view lookbook" 
    ON public.lookbook_items FOR SELECT 
    USING (true);

DROP POLICY IF EXISTS "Public can view store settings" ON public.store_settings;
CREATE POLICY "Public can view store settings" 
    ON public.store_settings FOR SELECT 
    USING (true);

DROP POLICY IF EXISTS "Public can view active store announcements" ON public.store_announcements;
CREATE POLICY "Public can view active store announcements" 
    ON public.store_announcements FOR SELECT 
    USING (is_active = true);

-- 2. Storefront Public Write Policies
DROP POLICY IF EXISTS "Public can submit drop waitlist RSVP" ON public.drop_waitlists;
CREATE POLICY "Public can submit drop waitlist RSVP" 
    ON public.drop_waitlists FOR INSERT 
    WITH CHECK (true);

DROP POLICY IF EXISTS "Public can submit reviews" ON public.reviews;
CREATE POLICY "Public can submit reviews" 
    ON public.reviews FOR INSERT 
    WITH CHECK (true);

DROP POLICY IF EXISTS "Public can create orders" ON public.orders;
CREATE POLICY "Public can create orders" 
    ON public.orders FOR INSERT 
    WITH CHECK (true);

DROP POLICY IF EXISTS "Public can create order items" ON public.order_items;
CREATE POLICY "Public can create order items" 
    ON public.order_items FOR INSERT 
    WITH CHECK (true);

-- 3. Authenticated Staff / Admin Full Access Policies
DROP POLICY IF EXISTS "Admins have full access to products" ON public.products;
CREATE POLICY "Admins have full access to products" 
    ON public.products TO authenticated 
    USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admins have full access to product_images" ON public.product_images;
CREATE POLICY "Admins have full access to product_images" 
    ON public.product_images TO authenticated 
    USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admins have full access to product_variants" ON public.product_variants;
CREATE POLICY "Admins have full access to product_variants" 
    ON public.product_variants TO authenticated 
    USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admins have full access to categories" ON public.categories;
CREATE POLICY "Admins have full access to categories" 
    ON public.categories TO authenticated 
    USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admins have full access to collections" ON public.collections;
CREATE POLICY "Admins have full access to collections" 
    ON public.collections TO authenticated 
    USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admins have full access to orders" ON public.orders;
CREATE POLICY "Admins have full access to orders" 
    ON public.orders TO authenticated 
    USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admins have full access to order_items" ON public.order_items;
CREATE POLICY "Admins have full access to order_items" 
    ON public.order_items TO authenticated 
    USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admins have full access to reviews" ON public.reviews;
CREATE POLICY "Admins have full access to reviews" 
    ON public.reviews TO authenticated 
    USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admins have full access to lookbook" ON public.lookbook_items;
CREATE POLICY "Admins have full access to lookbook" 
    ON public.lookbook_items TO authenticated 
    USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admins have full access to store_settings" ON public.store_settings;
CREATE POLICY "Admins have full access to store_settings" 
    ON public.store_settings TO authenticated 
    USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admins have full access to store_announcements" ON public.store_announcements;
CREATE POLICY "Admins have full access to store_announcements" 
    ON public.store_announcements TO authenticated 
    USING (true) WITH CHECK (true);

-- ------------------------------------------------------------------------------
-- STORAGE BUCKET RLS POLICIES (FOR COLLECTION & PRODUCT PHOTO UPLOADS)
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public Access for Collections Images" ON storage.objects;
CREATE POLICY "Public Access for Collections Images"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'collections');

DROP POLICY IF EXISTS "Public Access for Products Images" ON storage.objects;
CREATE POLICY "Public Access for Products Images"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'products');

DROP POLICY IF EXISTS "Public Access for Lookbook Images" ON storage.objects;
CREATE POLICY "Public Access for Lookbook Images"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'lookbook');

DROP POLICY IF EXISTS "Public Access for Media Assets" ON storage.objects;
CREATE POLICY "Public Access for Media Assets"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'media');

DROP POLICY IF EXISTS "Public Access for Founder Images" ON storage.objects;
CREATE POLICY "Public Access for Founder Images"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'founder');

DROP POLICY IF EXISTS "Authenticated Users Can Upload Collections Images" ON storage.objects;
CREATE POLICY "Authenticated Users Can Upload Collections Images"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'collections');

DROP POLICY IF EXISTS "Authenticated Users Can Upload Products Images" ON storage.objects;
CREATE POLICY "Authenticated Users Can Upload Products Images"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'products');

DROP POLICY IF EXISTS "Authenticated Users Can Upload Lookbook Images" ON storage.objects;
CREATE POLICY "Authenticated Users Can Upload Lookbook Images"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'lookbook');

DROP POLICY IF EXISTS "Authenticated Users Can Upload Media Assets" ON storage.objects;
CREATE POLICY "Authenticated Users Can Upload Media Assets"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'media');

DROP POLICY IF EXISTS "Authenticated Users Can Upload Founder Images" ON storage.objects;
CREATE POLICY "Authenticated Users Can Upload Founder Images"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'founder');

DROP POLICY IF EXISTS "Authenticated Users Can Update Storage Objects" ON storage.objects;
CREATE POLICY "Authenticated Users Can Update Storage Objects"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id IN ('collections', 'products', 'lookbook', 'media', 'founder'));

DROP POLICY IF EXISTS "Authenticated Users Can Delete Storage Objects" ON storage.objects;
CREATE POLICY "Authenticated Users Can Delete Storage Objects"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id IN ('collections', 'products', 'lookbook', 'media', 'founder'));
