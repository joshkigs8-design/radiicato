# RADIICATO — Supabase Database & Storage Setup Guide

This guide walks you through setting up your Supabase database, executing the schema, enabling storage buckets for photography, and seeding the initial collections.

---

## 1. Quick Setup in Supabase Dashboard

1. Log in to [Supabase](https://supabase.com) and select or create your **RADIICATO** project.
2. In the left navigation, go to **SQL Editor** -> **New Query**.
3. Copy the entire contents of [`schema.sql`](./schema.sql) and paste it into the editor.
4. Click **Run** to execute. This creates:
   - All relational tables (`profiles`, `categories`, `collections`, `products`, `product_images`, `product_variants`, `orders`, `order_items`, `payments`, `reviews`, `lookbook_items`, `drop_waitlists`, `store_settings`).
   - 4 Storage Buckets: `collections`, `products`, `lookbook`, `media`.
   - Automated triggers for updated timestamps, order numbers (`RAD-YYYY-XXXXXX`), stock reduction on payment, and customer spend statistics.
   - Row Level Security (RLS) policies allowing public viewing of active/scheduled collections and products.
   - Storage RLS policies allowing public image reads and authenticated admin uploads.

5. Open another **New Query**, copy the contents of [`seed.sql`](./seed.sql), and click **Run**.
   - Seeds the two active collections: **Broken Record** (White) and **We Are Who We Are** (Black).
   - Seeds the Drop 03 Teaser: **Skull Caps** (Scheduled).
   - Seeds product variants (XS through XXL, plus ONE SIZE for skull caps).
   - Seeds lookbook items, shipping zones, and promotional coupons.

---

## 2. Storage Buckets for Photography

The schema automatically initializes the following storage buckets in `storage.buckets`:

| Bucket Name | Public | Max File Size | Allowed Types | Purpose |
|---|---|---|---|---|
| `collections` | Yes | 10 MB | JPEG, PNG, WebP, AVIF | Collection covers, banners, editorial lookbook spreads |
| `products` | Yes | 15 MB | JPEG, PNG, WebP, AVIF | Product front, back, flat-lay, and detail shots |
| `lookbook` | Yes | 20 MB | JPEG, PNG, WebP, MP4 | Full campaign photography & editorial reels |
| `media` | Yes | 50 MB | JPEG, PNG, WebP, SVG, PDF | General brand marks, logos, vector typography |

### Uploading Photos From the Admin Platform
You can upload photos directly from:
- **Admin Media Library** (`/admin/media`): Drag & drop any collection or product photo into the target bucket.
- **Collections Manager** (`/admin/collections`): Click Edit on any collection to upload new banner or cover photography directly to Supabase.
- **Product Wizard** (`/admin/products/new` or `/admin/products/[id]/edit`): In Step 2 (Garment Imagery), drag and drop front, back, and detail photos to instantly add them to the product gallery.

---

## 3. Environment Variables Configuration

Copy `.env.example` to `.env.local` in your root project directory:

```bash
cp .env.example .env.local
```

Fill in your project credentials from **Project Settings** -> **API**:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

*Note: The platform is built with hybrid resilience. If Supabase keys are not set, the platform will seamlessly run in local development mode using local storage and memory cache.*

