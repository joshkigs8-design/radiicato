# RADIICATO — Premium Kenyan Streetwear Platform

> **"WEAR THE DIFFERENCE."**  
> Independent luxury streetwear engineered in Nairobi, Kenya.

RADIICATO unites an international editorial high-fashion digital storefront with a SaaS-grade e-commerce operating system.

---

## Brand & Aesthetic Direction
- **Identity**: Bold, Rebellious, Artistic, Youthful, Confident, Underground, Premium, Experimental, Authentic.
- **Palette**: Obsidian Black (`#0A0A0A`), Warm Off-White (`#F5F5F2`), Deep Military Olive (`#45503B`), and Brushed Chrome / Silver details.
- **Textiles**: Custom 280 GSM combed jersey t-shirts and 460 GSM organic French terry loopback outerwear.

---

## Features Matrix

### 1. Storefront Experience
- **Cinematic Editorial Homepage**: Hero video/image with "WEAR THE DIFFERENCE" headline, Latest Drop asymmetric grid, "Radiicato Core" featured capsule, Category discovery tiles, Fullscreen Lookbook lightbox, Brand Story manifesto, Instagram campaign grid, and Private Drop newsletter.
- **Shop & Discovery (`/shop`)**: Filter by category, collection, real size, colorway, price slider, and availability. Grid/List view switcher. Hover front-to-back crossfade. Quick Add modal.
- **Product Details (`/product/[slug]`)**: Multi-angle gallery with zoom, per-size real-time inventory matrix (XS–XXXL), real scarcity indicators ("Only 2 left"), expandable specs (Materials, Fit, Care, Kenyan delivery, Exchanges), size guide, and verified reviews.
- **Collections & Drops (`/collections`, `/collections/[slug]`)**: Archival capsules with live countdown timers for scheduled releases.
- **Cart & Bag (`/cart`, slide-over drawer)**: Instant drawer accessible from any page, live promo code engine, free shipping progress bar for Nairobi.
- **Kenyan Checkout (`/checkout`)**: Frictionless flow supporting County/Town logistics, Safaricom M-PESA STK Push with phone PIN prompt, and Card/Paystack gateway.
- **Order Success (`/order-success`)**: Order number generation (`RAD-2026-XXXXXX`), verified transaction receipt, itemized breakdown, and print/PDF-ready invoice.
- **Customer Account (`/account`, `/orders`, `/profile`)**: Order tracking, timeline status updates, personal wishlist, and default address book.
- **Brand Pages**: Story & Manifesto (`/about`), Concierge & Direct line (`/contact`), FAQ (`/faq`), Shipping rates & Fargo Courier zones (`/shipping`), 7-day exchange terms (`/returns`), and legal policies (`/privacy`, `/terms`).

### 2. Admin Management Platform (`/admin`)
- **SaaS Operating Dashboard**: Executive overview with 10 KPIs (Total sales, Orders count, Awaiting fulfillment, Low stock alerts, AOV, Conversion), interactive Recharts (Revenue trajectory, Sales by category), and date range filters.
- **8-Step Product Wizard (`/admin/products/new`, `.../edit`)**: Basic info, image ordering with primary/hover flags, color & size matrix, inventory allocation, pricing with gross margin calculator, collection assignments, SEO preview, and live storefront preview.
- **Collection Capsule Manager (`/admin/collections`)**: Capsule creation, cover/banner management, product assignment, and drop scheduling with countdown triggers.
- **Inventory Matrix (`/admin/inventory`)**: Dedicated stock matrix with quick adjustments (+ / -), reason logging, and low/out-of-stock threshold alerts.
- **Orders & Dispatches (`/admin/orders`)**: Complete order workflow (Paid, Processing, Packed, Shipped, Delivered), Fargo Courier tracking assignment, internal notes, and customer timeline.
- **Customer CRM (`/admin/customers`)**: Lifetime value (LTV), order frequency, and VIP notes.
- **Discounts & Coupons (`/admin/discounts`)**: Percentage or fixed coupons, spend minimums, and usage limits.
- **Homepage CMS (`/admin/homepage`)**: Code-free editing of hero headline, announcement banner, and brand story.
- **Lookbook Manager (`/admin/lookbook`)**: Campaign image gallery upload and exhibition ordering.
- **Reviews Moderation (`/admin/reviews`)**: Approve, reject, and verify customer feedback.
- **Analytics (`/admin/analytics`)**: Deep financial reporting, best-sellers, repeat customer rates, and cart abandonment.
- **Role-Based Access Control (`/admin/users`)**: 5 roles (Super Admin, Admin, Inventory Manager, Order Dispatcher, Content Manager) with 1-click switcher.
- **Security Audit Log (`/admin/activity`)**: Traceability of all catalog, inventory, and status mutations.
- **Settings (`/admin/settings`)**: Currency (KES), Daraja M-PESA credentials, Paystack keys, and shipping rates.

---

## Tech Stack
- **Framework**: Next.js 14+ (App Router) & React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom editorial brand tokens
- **Data & Charts**: Recharts & Lucide React
- **Animations**: Canvas Confetti & CSS keyframes
- **Backend & Database**: PostgreSQL / Supabase schema provided in `supabase/schema.sql`

---

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Open in browser
# Storefront: http://localhost:3000
# Admin OS:    http://localhost:3000/admin
```

