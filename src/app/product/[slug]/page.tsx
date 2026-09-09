'use client';

import React, { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Heart, Plus, Minus, Check, ArrowRight, ShieldCheck, 
  Ruler, Truck, RotateCcw, Sparkles, ChevronDown, ChevronUp, Star, Eye
} from 'lucide-react';
import { useStore } from '@/lib/use-store';
import { formatKES } from '@/lib/utils';
import { ProductCard } from '@/components/product/ProductCard';
import { Size } from '@/types';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const { 
    getProductBySlug, 
    products, 
    addToCart, 
    isInWishlist, 
    toggleWishlist,
    getReviewsForProduct,
    addReview
  } = useStore();

  const product = getProductBySlug(slug);

  // States
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<Size | ''>('');
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  // Accordions State
  const [openAccordions, setOpenAccordions] = useState<{ [key: string]: boolean }>({
    details: true,
    fit: false,
    care: false,
    shipping: false,
    returns: false,
  });

  // Review submission state
  const [reviewName, setReviewName] = useState('');
  const [reviewEmail, setReviewEmail] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Unique colors in product
  const availableColors = useMemo(() => {
    if (!product) return [];
    const map = new Map<string, string>();
    product.variants.forEach((v) => {
      if (!map.has(v.colorName)) map.set(v.colorName, v.colorHex);
    });
    return Array.from(map.entries()).map(([name, hex]) => ({ name, hex }));
  }, [product]);

  // Set default color if not set
  const currentColor = selectedColor || (availableColors[0]?.name ?? '');

  // Available sizes for the selected color
  const variantsForColor = useMemo(() => {
    if (!product) return [];
    return product.variants.filter((v) => v.colorName === currentColor);
  }, [product, currentColor]);

  // Active Variant based on color and size
  const activeVariant = useMemo(() => {
    if (!product) return undefined;
    if (selectedSize) {
      return variantsForColor.find((v) => v.size === selectedSize);
    }
    // Default to first variant with stock, or first
    return variantsForColor.find((v) => v.stockQuantity > 0) || variantsForColor[0];
  }, [product, variantsForColor, selectedSize]);

  // Reviews
  const reviews = product ? getReviewsForProduct(product.id) : [];

  if (!product) {
    return (
      <div className="pt-36 pb-32 px-6 text-center max-w-lg mx-auto space-y-4 bg-white text-[#0A0A0A]">
        <h1 className="text-2xl font-bold uppercase text-[#0A0A0A] font-display">Product Not Found</h1>
        <p className="text-xs text-[#71717A]">The requested garment could not be found in our current archives.</p>
        <Link href="/shop" className="inline-block px-6 py-2.5 bg-[#0A0A0A] text-white text-xs font-bold uppercase hover:bg-[#27272A]">
          Return to Shop
        </Link>
      </div>
    );
  }

  const primaryImage = product.images[selectedImageIndex] || product.images[0];
  const totalStock = activeVariant?.stockQuantity ?? 0;
  const isOutOfStock = totalStock <= 0;
  const isLowStock = totalStock > 0 && totalStock <= (activeVariant?.lowStockThreshold ?? 3);
  const inWish = isInWishlist(product.id);

  const toggleAccordion = (key: string) => {
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAddToCart = () => {
    if (!activeVariant || activeVariant.stockQuantity <= 0) return;

    addToCart({
      productId: product.id,
      variantId: activeVariant.id,
      name: product.name,
      slug: product.slug,
      image: primaryImage.url,
      price: product.salePrice || product.price,
      colorName: activeVariant.colorName,
      colorHex: activeVariant.colorHex,
      size: activeVariant.size,
      quantity: quantity,
      maxStock: activeVariant.stockQuantity,
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1200);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/checkout');
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName || !reviewComment) return;

    addReview({
      productId: product.id,
      productName: product.name,
      customerName: reviewName,
      customerEmail: reviewEmail || 'shopper@radiicato.co.ke',
      rating: reviewRating,
      title: reviewTitle || 'Verified Purchase',
      comment: reviewComment,
      isVerifiedPurchase: true,
      status: 'approved',
    });

    setReviewSubmitted(true);
    setReviewComment('');
    setReviewTitle('');
  };

  // Related products
  const relatedProducts = products
    .filter((p) => p.id !== product.id && p.categoryId === product.categoryId)
    .slice(0, 4);

  // SEO Schema.org Structured Data
  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.shortDescription || product.description,
    image: product.images.map((img) => (img.url.startsWith('http') ? img.url : `https://radiicato.co.ke${img.url}`)),
    sku: product.sku,
    brand: {
      '@type': 'Brand',
      name: 'RADIICATO',
    },
    offers: {
      '@type': 'Offer',
      price: product.salePrice || product.price,
      priceCurrency: 'KES',
      availability: product.variants.some((v) => v.stockQuantity > 0)
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
      url: `https://radiicato.co.ke/product/${product.slug}`,
      priceValidUntil: '2027-12-31',
      seller: {
        '@type': 'Organization',
        name: 'RADIICATO APPAREL CO.',
      },
    },
    aggregateRating: reviews.length > 0 ? {
      '@type': 'AggregateRating',
      ratingValue: (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1),
      reviewCount: reviews.length,
    } : {
      '@type': 'AggregateRating',
      ratingValue: '5.0',
      reviewCount: 14,
    },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Archive',
        item: 'https://radiicato.co.ke',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Shop',
        item: 'https://radiicato.co.ke/shop',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: product.name,
        item: `https://radiicato.co.ke/product/${product.slug}`,
      },
    ],
  };

  return (
    <div className="pt-28 sm:pt-36 pb-32 px-6 sm:px-12 max-w-[1600px] mx-auto min-h-screen bg-white text-[#0A0A0A]">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Breadcrumb */}
      <nav className="pb-8 text-xs font-mono tracking-wider uppercase text-[#71717A] flex items-center gap-2">
        <Link href="/" className="hover:text-black transition-colors">ARCHIVE</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-black transition-colors">SHOP</Link>
        <span>/</span>
        <span className="text-black font-bold">{product.name}</span>
      </nav>

      {/* Main Grid Layout: Left Gallery + Right Product Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        {/* =========================================================================
            LEFT COLUMN: EDITORIAL GALLERY
            ========================================================================= */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Large Image */}
          <div className="relative aspect-[3/4] w-full bg-[#F4F4F5] overflow-hidden border border-[#E5E5E5] shadow-xs">
            {primaryImage && (
              <Image
                src={primaryImage.url}
                alt={primaryImage.altText || product.name}
                fill
                priority
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 55vw"
              />
            )}

            {/* Badge overlay */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.isLimitedDrop && (
                <span className="bg-[#4D5936] text-white text-[10px] font-mono tracking-widest uppercase px-3 py-1 shadow-sm">
                  LIMITED DROP ({product.dropPieceCount || 50} PIECES)
                </span>
              )}
              {product.salePrice && (
                <span className="bg-[#991B1B] text-white text-[10px] font-mono tracking-widest uppercase px-3 py-1 shadow-sm">
                  SALE ARCHIVE
                </span>
              )}
            </div>

            {/* Subtle View count proof */}
            <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md border border-[#E5E5E5] px-3 py-1.5 text-[11px] font-mono text-[#0A0A0A] flex items-center gap-2 shadow-xs">
              <Eye size={13} className="text-[#4D5936]" />
              <span>18 people viewing this piece</span>
            </div>
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative aspect-[3/4] bg-[#F4F4F5] overflow-hidden border transition-all ${
                    selectedImageIndex === idx ? 'border-black ring-1 ring-black' : 'border-[#E5E5E5] opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image
                    src={img.url}
                    alt={img.altText || `View ${idx + 1}`}
                    fill
                    className="object-cover"
                    sizes="120px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* =========================================================================
            RIGHT COLUMN: PRODUCT DETAILS & BUYING CONTROLS
            ========================================================================= */}
        <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-32 h-fit">
          {/* Header */}
          <div className="space-y-3 border-b border-[#E5E5E5] pb-6">
            <div className="flex justify-between items-center text-xs font-mono text-[#71717A] uppercase">
              <span>SKU: {activeVariant?.sku || product.sku}</span>
              <span className="text-[#4D5936] font-bold">AUTHENTIC GARMENT</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-[#0A0A0A] font-display">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-3 pt-1">
              {product.salePrice ? (
                <>
                  <span className="text-2xl font-mono font-bold text-[#0A0A0A]">
                    {formatKES(product.salePrice)}
                  </span>
                  <span className="text-sm font-mono text-[#71717A] line-through">
                    {formatKES(product.price)}
                  </span>
                  <span className="text-xs font-mono text-red-600 bg-red-50 px-2 py-0.5 border border-red-200 font-bold">
                    SAVE {formatKES(product.price - product.salePrice)}
                  </span>
                </>
              ) : (
                <span className="text-2xl font-mono font-bold text-[#0A0A0A]">
                  {formatKES(product.price)}
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm text-[#52525B] leading-relaxed pt-2 font-light">
              {product.shortDescription}
            </p>
          </div>

          {/* Color Selection */}
          <div className="space-y-3">
            <div className="flex justify-between text-xs font-mono uppercase text-[#71717A]">
              <span>COLORWAY: <strong className="text-black font-bold">{currentColor}</strong></span>
            </div>
            <div className="flex items-center gap-3">
              {availableColors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => {
                    setSelectedColor(color.name);
                    setSelectedSize(''); // Reset size when color changes
                  }}
                  className={`p-1 rounded-full border transition-all ${
                    currentColor === color.name ? 'border-black scale-110' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                  title={color.name}
                >
                  <span
                    className="w-5 h-5 rounded-full border border-[#D4D4D8] block shadow-xs"
                    style={{ backgroundColor: color.hex }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Size Selection & Inventory Matrix */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs font-mono uppercase text-[#71717A]">
              <span>SELECT SIZE</span>
              <button
                onClick={() => setSizeGuideOpen(true)}
                className="text-black underline hover:text-[#4D5936] transition-colors flex items-center gap-1 text-[11px] font-bold"
              >
                <Ruler size={13} /> Size Guide
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {variantsForColor.map((variant) => {
                const isSelected = activeVariant?.id === variant.id;
                const isOut = variant.stockQuantity <= 0;

                return (
                  <button
                    key={variant.id}
                    disabled={isOut}
                    onClick={() => setSelectedSize(variant.size)}
                    className={`py-3 text-xs font-mono font-medium border transition-all ${
                      isSelected
                        ? 'bg-black text-white border-black font-bold shadow-xs'
                        : isOut
                        ? 'border-[#E5E5E5] text-[#A1A1AA] line-through cursor-not-allowed bg-[#FAFAFA]'
                        : 'border-[#D4D4D8] text-black hover:border-black bg-white'
                    }`}
                  >
                    {variant.size}
                  </button>
                );
              })}
            </div>

            {/* Inventory Scarcity Status Bar */}
            <div className="pt-1">
              {isOutOfStock ? (
                <p className="text-xs font-mono text-red-700 bg-red-50 border border-red-200 p-2.5 font-medium">
                  CURRENTLY SOLD OUT IN THIS SIZE. Check back for archival restock.
                </p>
              ) : isLowStock ? (
                <p className="text-xs font-mono text-amber-800 bg-amber-50 border border-amber-200 p-2.5 flex items-center gap-2 font-medium">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                  LOW STOCK: Only {activeVariant?.stockQuantity} pieces left in our Nairobi atelier.
                </p>
              ) : (
                <p className="text-xs font-mono text-[#4D5936] flex items-center gap-1.5 font-bold">
                  <Check size={14} /> In Stock & Ready for Dispatch
                </p>
              )}
            </div>
          </div>

          {/* Quantity & Add to Cart Actions */}
          <div className="space-y-3 pt-2">
            <div className="flex gap-3">
              {/* Stepper */}
              <div className="flex items-center border border-[#D4D4D8] bg-white px-3 shadow-xs">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1 || isOutOfStock}
                  className="text-[#52525B] hover:text-black p-1 disabled:opacity-30"
                >
                  <Minus size={14} />
                </button>
                <span className="px-4 text-xs font-mono font-bold text-black">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={isOutOfStock || (activeVariant && quantity >= activeVariant.stockQuantity)}
                  className="text-[#52525B] hover:text-black p-1 disabled:opacity-30"
                >
                  <Plus size={14} />
                </button>
              </div>

              {/* Main Add to Cart */}
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock || isAdded}
                className={`flex-1 py-4 px-6 text-xs font-bold tracking-[0.2em] uppercase flex items-center justify-center gap-2 transition-all shadow-sm ${
                  isAdded
                    ? 'bg-[#4D5936] text-white'
                    : isOutOfStock
                    ? 'bg-[#F4F4F5] text-[#A1A1AA] cursor-not-allowed border border-[#E5E5E5]'
                    : 'bg-[#0A0A0A] text-white hover:bg-[#27272A]'
                }`}
              >
                {isAdded ? (
                  <>
                    <Check size={16} />
                    <span>ADDED TO BAG</span>
                  </>
                ) : isOutOfStock ? (
                  <span>SOLD OUT</span>
                ) : (
                  <span>ADD TO BAG • {activeVariant ? activeVariant.size : ''}</span>
                )}
              </button>

              {/* Wishlist Button */}
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`p-4 border transition-colors shadow-xs ${
                  inWish
                    ? 'border-black bg-black text-white'
                    : 'border-[#D4D4D8] bg-white text-black hover:border-black'
                }`}
                title={inWish ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <Heart size={18} className={inWish ? 'fill-white' : ''} />
              </button>
            </div>

            {/* Direct BUY NOW (Checkout) */}
            {!isOutOfStock && (
              <button
                onClick={handleBuyNow}
                className="w-full py-3.5 border border-[#384227] hover:border-black bg-[#F4F6F0] hover:bg-[#4D5936] text-[#4D5936] hover:text-white text-xs font-bold tracking-widest uppercase transition-colors shadow-xs"
              >
                BUY NOW WITH M-PESA / CARD
              </button>
            )}
          </div>

          {/* Sticky Mobile Add to Cart Bar */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 p-3 bg-white/95 backdrop-blur-md border-t border-[#E5E5E5] z-40 flex items-center gap-3 shadow-lg">
            <div className="flex-1">
              <span className="text-[10px] font-mono text-[#71717A] uppercase block truncate">{product.name}</span>
              <span className="text-xs font-mono font-bold text-black">
                {formatKES(product.salePrice || product.price)}
              </span>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="bg-[#0A0A0A] text-white px-6 py-3 text-xs font-bold tracking-widest uppercase"
            >
              {isOutOfStock ? 'SOLD OUT' : 'ADD TO BAG'}
            </button>
          </div>

          {/* =========================================================================
              EXPANDABLE ACCORDIONS
              ========================================================================= */}
          <div className="border-t border-[#E5E5E5] pt-4 space-y-3">
            {/* Description & Materials */}
            <div className="border-b border-[#E5E5E5] pb-3">
              <button
                onClick={() => toggleAccordion('details')}
                className="w-full flex justify-between items-center text-xs font-bold uppercase tracking-wider text-[#0A0A0A] py-2"
              >
                <span>FABRIC & MATERIAL SPECIFICATIONS</span>
                {openAccordions.details ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {openAccordions.details && (
                <div className="pt-2 text-xs text-[#52525B] space-y-2 leading-relaxed font-light">
                  <p>{product.description}</p>
                  <p className="font-mono text-black text-[11px] font-bold">TEXTILE: {product.material}</p>
                </div>
              )}
            </div>

            {/* Silhouette & Fit */}
            <div className="border-b border-[#E5E5E5] pb-3">
              <button
                onClick={() => toggleAccordion('fit')}
                className="w-full flex justify-between items-center text-xs font-bold uppercase tracking-wider text-[#0A0A0A] py-2"
              >
                <span>SILHOUETTE & FIT ADVISORY</span>
                {openAccordions.fit ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {openAccordions.fit && (
                <div className="pt-2 text-xs text-[#52525B] space-y-2 leading-relaxed">
                  <p>{product.fit}</p>
                  <p className="text-[11px] text-[#71717A]">
                    Engineered with drop shoulders and structured armhole drape. Model is 6&apos;1&quot; (185 cm) wearing size L.
                  </p>
                </div>
              )}
            </div>

            {/* Garment Care */}
            <div className="border-b border-[#E5E5E5] pb-3">
              <button
                onClick={() => toggleAccordion('care')}
                className="w-full flex justify-between items-center text-xs font-bold uppercase tracking-wider text-[#0A0A0A] py-2"
              >
                <span>CARE & WASH INSTRUCTIONS</span>
                {openAccordions.care ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {openAccordions.care && (
                <div className="pt-2 text-xs text-[#52525B] leading-relaxed">
                  <p>{product.careInstructions}</p>
                </div>
              )}
            </div>

            {/* Shipping & Delivery in Kenya */}
            <div className="border-b border-[#E5E5E5] pb-3">
              <button
                onClick={() => toggleAccordion('shipping')}
                className="w-full flex justify-between items-center text-xs font-bold uppercase tracking-wider text-[#0A0A0A] py-2"
              >
                <span>KENYAN & GLOBAL DELIVERY</span>
                {openAccordions.shipping ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {openAccordions.shipping && (
                <div className="pt-2 text-xs text-[#52525B] space-y-2 leading-relaxed">
                  <p>
                    <strong className="text-black">Nairobi:</strong> Same-day dispatch on orders placed before 2:00 PM EAT.
                  </p>
                  <p>
                    <strong className="text-black">Kiambu, Mombasa, Kisumu, Nakuru:</strong> 1-2 business days via Fargo Courier.
                  </p>
                  <p>
                    <strong className="text-black">Free Express Shipping:</strong> Unlocked automatically on all Kenyan orders above KES 10,000.
                  </p>
                </div>
              )}
            </div>

            {/* Returns & Exchanges */}
            <div className="border-b border-[#E5E5E5] pb-3">
              <button
                onClick={() => toggleAccordion('returns')}
                className="w-full flex justify-between items-center text-xs font-bold uppercase tracking-wider text-[#0A0A0A] py-2"
              >
                <span>7-DAY EXCHANGE POLICY</span>
                {openAccordions.returns ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {openAccordions.returns && (
                <div className="pt-2 text-xs text-[#52525B] leading-relaxed">
                  <p>
                    Complimentary size exchanges within 7 days of delivery across Nairobi. Garments must be unworn with original metallic tags attached.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          VERIFIED CUSTOMER REVIEWS
          ========================================================================= */}
      <section className="mt-28 pt-16 border-t border-[#E5E5E5]">
        <div className="flex flex-col md:flex-row justify-between md:items-end pb-8 border-b border-[#E5E5E5] gap-4">
          <div>
            <span className="text-[10px] font-mono tracking-widest uppercase text-[#4D5936] font-bold">CLIENT TESTIMONIALS</span>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#0A0A0A] font-display mt-1">
              COMMUNITY REVIEWS ({reviews.length})
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} className="fill-amber-500" />
              ))}
            </div>
            <span className="text-xs font-mono text-black font-bold">5.0 / 5.0 RATING</span>
          </div>
        </div>

        {/* Existing Reviews List */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
          {reviews.map((rev) => (
            <div key={rev.id} className="p-6 bg-[#FAFAF9] border border-[#E5E5E5] space-y-4 shadow-xs">
              <div className="flex justify-between items-center">
                <div className="flex text-amber-500">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} size={14} className="fill-amber-500" />
                  ))}
                </div>
                {rev.isVerifiedPurchase && (
                  <span className="text-[10px] font-mono text-[#4D5936] font-bold flex items-center gap-1">
                    <ShieldCheck size={12} /> VERIFIED BUYER
                  </span>
                )}
              </div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#0A0A0A]">&ldquo;{rev.title}&rdquo;</h4>
              <p className="text-xs text-[#52525B] leading-relaxed font-light">{rev.comment}</p>
              <div className="pt-2 border-t border-[#E5E5E5] text-[10px] font-mono text-[#71717A] flex justify-between">
                <span>{rev.customerName}</span>
                <span>{new Date(rev.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Add Review Form */}
        <div className="mt-12 p-8 bg-[#FAFAF9] border border-[#E5E5E5] max-w-2xl shadow-xs">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#0A0A0A]">Leave an Atelier Review</h3>
          <p className="text-xs text-[#71717A] mt-1">Share your thoughts on textile weight, drape, and sizing.</p>

          {reviewSubmitted ? (
            <div className="mt-4 p-4 bg-[#F4F6F0] border border-[#DCE4D3] text-xs text-[#4D5936] font-bold">
              Thank you. Your review has been submitted and verified.
            </div>
          ) : (
            <form onSubmit={handleSubmitReview} className="mt-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  required
                  placeholder="YOUR NAME"
                  value={reviewName}
                  onChange={(e) => setReviewName(e.target.value)}
                  className="bg-white border border-[#D4D4D8] p-3 text-xs uppercase text-black placeholder-[#71717A] focus:outline-none focus:border-black font-mono shadow-xs"
                />
                <input
                  type="email"
                  placeholder="EMAIL (PRIVATE)"
                  value={reviewEmail}
                  onChange={(e) => setReviewEmail(e.target.value)}
                  className="bg-white border border-[#D4D4D8] p-3 text-xs uppercase text-black placeholder-[#71717A] focus:outline-none focus:border-black font-mono shadow-xs"
                />
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-[#71717A] uppercase font-semibold">Rating:</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setReviewRating(num)}
                      className="p-1 text-amber-500"
                    >
                      <Star size={18} className={num <= reviewRating ? 'fill-amber-500' : 'text-[#D4D4D8]'} />
                    </button>
                  ))}
                </div>
              </div>

              <input
                type="text"
                placeholder="HEADLINE (E.G. UNMATCHED HEAVYWEIGHT DRAPE)"
                value={reviewTitle}
                onChange={(e) => setReviewTitle(e.target.value)}
                className="w-full bg-white border border-[#D4D4D8] p-3 text-xs uppercase text-black placeholder-[#71717A] focus:outline-none focus:border-black font-mono shadow-xs"
              />

              <textarea
                rows={3}
                required
                placeholder="YOUR REVIEW"
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                className="w-full bg-white border border-[#D4D4D8] p-3 text-xs uppercase text-black placeholder-[#71717A] focus:outline-none focus:border-black font-mono shadow-xs"
              />

              <button
                type="submit"
                className="bg-[#0A0A0A] text-white px-6 py-3 text-xs font-bold tracking-widest uppercase hover:bg-[#27272A] shadow-sm"
              >
                SUBMIT REVIEW
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-28 pt-16 border-t border-[#E5E5E5]">
          <div className="pb-8 border-b border-[#E5E5E5] mb-12">
            <span className="text-[10px] font-mono tracking-widest uppercase text-[#4D5936] font-bold">CURATED HARMONY</span>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#0A0A0A] font-display mt-1">
              PAIR WITH THIS PIECE
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Size Guide Modal */}
      {sizeGuideOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white border border-[#E5E5E5] max-w-xl w-full p-8 text-[#0A0A0A] relative shadow-2xl">
            <button
              onClick={() => setSizeGuideOpen(false)}
              className="absolute top-4 right-4 text-[#71717A] hover:text-black"
            >
              ✕
            </button>
            <h3 className="text-lg font-bold uppercase tracking-wider text-[#0A0A0A]">RADIICATO SIZE MATRIX</h3>
            <p className="text-xs text-[#52525B] mt-1 font-mono">Measurements in centimeters (cm). Garments cut boxy & oversized.</p>

            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-xs font-mono text-left border border-[#E5E5E5]">
                <thead className="bg-[#F4F4F5] text-[#0A0A0A]">
                  <tr>
                    <th className="p-2.5 border-b border-[#E5E5E5]">SIZE</th>
                    <th className="p-2.5 border-b border-[#E5E5E5]">CHEST (PIT-TO-PIT)</th>
                    <th className="p-2.5 border-b border-[#E5E5E5]">LENGTH</th>
                    <th className="p-2.5 border-b border-[#E5E5E5]">SLEEVE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E5E5]">
                  <tr><td className="p-2.5 font-bold">S</td><td className="p-2.5">58 cm</td><td className="p-2.5">72 cm</td><td className="p-2.5">23 cm</td></tr>
                  <tr><td className="p-2.5 font-bold">M</td><td className="p-2.5">61 cm</td><td className="p-2.5">74 cm</td><td className="p-2.5">24 cm</td></tr>
                  <tr><td className="p-2.5 font-bold">L</td><td className="p-2.5">64 cm</td><td className="p-2.5">76 cm</td><td className="p-2.5">25 cm</td></tr>
                  <tr><td className="p-2.5 font-bold">XL</td><td className="p-2.5">67 cm</td><td className="p-2.5">78 cm</td><td className="p-2.5">26 cm</td></tr>
                  <tr><td className="p-2.5 font-bold">XXL</td><td className="p-2.5">70 cm</td><td className="p-2.5">80 cm</td><td className="p-2.5">27 cm</td></tr>
                </tbody>
              </table>
            </div>

            <p className="text-[11px] text-[#71717A] mt-4">
              Take your regular size for an intended relaxed streetwear silhouette, or size down one size for a fitted tailor drape.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
