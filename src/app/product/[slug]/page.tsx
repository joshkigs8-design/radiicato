'use client';

import React, { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Heart, Plus, Minus, Check, ArrowRight, ShieldCheck, 
  Ruler, Star, Eye, AlertCircle, Loader2
} from 'lucide-react';
import { useStore } from '@/lib/use-store';
import { formatKES } from '@/lib/utils';
import { ProductCard } from '@/components/product/ProductCard';
import { Size } from '@/types';
import { createReviewInSupabase } from '@/lib/supabase';

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
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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
  const avgRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  if (!product) {
    return (
      <div className="pt-36 pb-32 px-6 text-center max-w-lg mx-auto space-y-4 text-white font-sans">
        <h1 className="text-2xl font-bold uppercase text-white">Product Not Found</h1>
        <p className="text-xs text-white/60">The requested garment could not be found in our current archives.</p>
        <Link href="/shop" className="inline-block px-6 py-2.5 glass-button text-white text-xs font-bold uppercase rounded-xl hover:bg-white hover:text-black transition-colors">
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

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('open-cart'));
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/checkout');
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewError('');

    const numericRating = Math.round(Number(reviewRating));
    if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      setReviewError('Please select a valid rating between 1 and 5 stars.');
      return;
    }

    if (!reviewName.trim() || reviewName.trim().length < 2) {
      setReviewError('Please enter your name (minimum 2 characters).');
      return;
    }

    if (!reviewComment.trim() || reviewComment.trim().length < 5) {
      setReviewError('Please provide a detailed review comment (minimum 5 characters).');
      return;
    }

    const emailToUse = reviewEmail.trim() || 'shopper@radiicato.co.ke';
    if (reviewEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(reviewEmail.trim())) {
      setReviewError('Please enter a valid email address.');
      return;
    }

    setIsSubmittingReview(true);

    try {
      const reviewPayload = {
        productId: product.id,
        productName: product.name,
        customerName: reviewName.trim(),
        customerEmail: emailToUse,
        rating: numericRating,
        title: reviewTitle.trim() || `${numericRating}-Star Atelier Review`,
        comment: reviewComment.trim(),
        isVerifiedPurchase: true,
        status: 'approved' as const,
      };

      addReview(reviewPayload);

      try {
        await createReviewInSupabase(reviewPayload);
      } catch (sbError) {
        console.warn('Supabase reviews table note:', sbError);
      }

      setReviewSubmitted(true);
      setToastMessage(`Your ${numericRating}-star review has been published to the Atelier!`);
      setReviewComment('');
      setReviewTitle('');
      setReviewName('');
      setReviewEmail('');
      setReviewRating(5);

      setTimeout(() => setToastMessage(null), 5000);
      setTimeout(() => {
        setReviewSubmitted(false);
        setShowReviewForm(false);
      }, 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Review submission failed. Please try again.';
      setReviewError(msg);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const relatedProducts = products
    .filter((p) => p.id !== product.id && p.categoryId === product.categoryId)
    .slice(0, 4);

  return (
    <div className="pt-24 sm:pt-32 pb-32 px-4 sm:px-8 lg:px-12 max-w-[1600px] mx-auto min-h-screen text-white font-sans">
      {/* Breadcrumb */}
      <nav className="pb-6 sm:pb-8 text-[10px] sm:text-[11px] font-mono tracking-[0.18em] uppercase text-white/50 flex items-center gap-2">
        <Link href="/" className="hover:text-white transition-colors">ARCHIVE</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-white transition-colors">SHOP</Link>
        <span>/</span>
        <span className="text-white font-bold truncate max-w-[200px] sm:max-w-none">{product.name}</span>
      </nav>

      {/* Main Grid Layout: Left Gallery + Right Product Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14">
        {/* =========================================================================
            LEFT COLUMN: EDITORIAL GALLERY (7 Cols on desktop)
            ========================================================================= */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Large Image */}
          <div className="relative aspect-[3/4] w-full bg-[#0a0a0a] rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
            {primaryImage && (
              <Image
                src={primaryImage.url}
                alt={primaryImage.altText || product.name}
                fill
                priority
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 58vw"
              />
            )}

            {/* Badge overlay */}
            <div className="absolute top-3.5 left-3.5 sm:top-5 sm:left-5 flex flex-col gap-2 pointer-events-none">
              {product.isLimitedDrop && (
                <span className="glass-pill bg-black/80 text-white text-[9px] sm:text-[10px] font-mono tracking-widest uppercase px-3 py-1">
                  LIMITED DROP ({product.dropPieceCount || 50} PIECES)
                </span>
              )}
              {product.salePrice && (
                <span className="glass-pill bg-black/80 text-rose-300 text-[9px] sm:text-[10px] font-mono tracking-widest uppercase px-3 py-1">
                  SALE ARCHIVE
                </span>
              )}
            </div>

            {/* View count proof */}
            <div className="absolute bottom-3.5 right-3.5 sm:bottom-5 sm:right-5 glass-pill bg-black/75 px-3 py-1.5 text-[10px] sm:text-[11px] font-mono text-white/90 flex items-center gap-2">
              <Eye size={13} className="text-white" />
              <span>18 people viewing</span>
            </div>
          </div>

          {/* Thumbnails Stack */}
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative aspect-[3/4] bg-[#0a0a0a] rounded-xl overflow-hidden border transition-all cursor-pointer ${
                    selectedImageIndex === idx ? 'border-white shadow-lg scale-[1.02]' : 'border-white/15 opacity-60 hover:opacity-100'
                  }`}
                >
                  <Image
                    src={img.url}
                    alt={img.altText || `View ${idx + 1}`}
                    fill
                    className="object-cover"
                    sizes="25vw"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* =========================================================================
            RIGHT COLUMN: PRODUCT DETAILS & BUYING CONTROLS (5 Cols on desktop)
            ========================================================================= */}
        <div className="lg:col-span-5 space-y-6 sm:space-y-8 lg:sticky lg:top-28 lg:self-start">
          {/* Header */}
          <div className="space-y-3 border-b border-white/10 pb-6">
            <div className="flex justify-between items-center text-[10px] sm:text-[11px] font-mono text-white/50 uppercase">
              <span>SKU: {activeVariant?.sku || product.sku}</span>
              <span className="text-white font-bold">NAIROBI ATELIER</span>
            </div>

            <h1 className="pesos-text-face text-2xl sm:text-3xl lg:text-4xl font-bold uppercase tracking-[-0.03em] text-white">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-3 pt-1">
              {product.salePrice ? (
                <>
                  <span className="text-2xl sm:text-3xl font-mono font-bold text-white">
                    {formatKES(product.salePrice)}
                  </span>
                  <span className="text-sm font-mono text-white/40 line-through">
                    {formatKES(product.price)}
                  </span>
                  <span className="text-[11px] font-mono text-rose-300 glass-pill px-2.5 py-0.5 border-rose-500/30 font-bold">
                    SAVE {formatKES(product.price - product.salePrice)}
                  </span>
                </>
              ) : (
                <span className="text-2xl sm:text-3xl font-mono font-bold text-white">
                  {formatKES(product.price)}
                </span>
              )}
            </div>

            {product.shortDescription && (
              <p className="text-xs sm:text-sm text-white/70 leading-relaxed pt-1">
                {product.shortDescription}
              </p>
            )}
          </div>

          {/* Color Selection */}
          <div className="space-y-2.5">
            <div className="flex justify-between text-xs font-mono uppercase text-white/60">
              <span>COLORWAY: <strong className="text-white font-bold">{currentColor}</strong></span>
            </div>
            <div className="flex gap-2 flex-wrap">
              {availableColors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => {
                    setSelectedColor(color.name);
                    setSelectedSize('');
                  }}
                  className={`w-11 h-11 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                    currentColor === color.name ? 'border-white bg-white/20 shadow-md' : 'border-white/15 hover:border-white/40 bg-white/5'
                  }`}
                  title={color.name}
                >
                  <span
                    className="w-4 h-4 rounded-full border border-white/20 block"
                    style={{ backgroundColor: color.hex }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Size Selection & Inventory Matrix */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs font-mono uppercase text-white/60">
              <span>SELECT SIZE</span>
              <button
                onClick={() => setSizeGuideOpen(true)}
                className="text-white underline hover:opacity-70 transition-opacity flex items-center gap-1 text-[11px] font-bold cursor-pointer"
              >
                <Ruler size={13} /> Size Guide
              </button>
            </div>

            <div className="flex gap-2 flex-wrap">
              {variantsForColor.map((variant) => {
                const isSelected = activeVariant?.id === variant.id;
                const isOut = variant.stockQuantity <= 0;

                return (
                  <button
                    key={variant.id}
                    disabled={isOut}
                    onClick={() => setSelectedSize(variant.size)}
                    className={`w-12 h-12 rounded-xl text-[11px] font-mono font-bold tracking-wider transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white text-black shadow-lg scale-105'
                        : isOut
                        ? 'border border-white/10 opacity-30 line-through bg-white/5 text-white/30 cursor-not-allowed'
                        : 'border border-white/20 hover:border-white bg-white/5 text-white'
                    }`}
                  >
                    {variant.size}
                  </button>
                );
              })}
            </div>

            {/* Inventory Status Bar */}
            <div className="pt-1">
              {isOutOfStock ? (
                <p className="text-xs font-mono text-rose-300 glass-card p-3 rounded-xl border-rose-500/30">
                  CURRENTLY SOLD OUT IN THIS SIZE.
                </p>
              ) : isLowStock ? (
                <p className="text-xs font-mono text-amber-300 glass-card p-3 rounded-xl border-amber-500/30 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  LOW STOCK: Only {activeVariant?.stockQuantity} pieces left in our Nairobi atelier.
                </p>
              ) : (
                <p className="text-xs font-mono text-emerald-300 flex items-center gap-1.5 font-bold">
                  <Check size={14} /> In Stock &amp; Ready for Dispatch in Nairobi
                </p>
              )}
            </div>
          </div>

          {/* Quantity & Add to Cart Actions */}
          <div className="space-y-3 pt-2">
            <div className="flex gap-3">
              {/* Stepper */}
              <div className="flex items-center glass-card rounded-xl px-2.5 py-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1 || isOutOfStock}
                  className="text-white/60 hover:text-white p-1 disabled:opacity-30 cursor-pointer"
                >
                  <Minus size={14} />
                </button>
                <span className="px-3 text-xs font-mono font-bold text-white">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={isOutOfStock || (activeVariant && quantity >= activeVariant.stockQuantity)}
                  className="text-white/60 hover:text-white p-1 disabled:opacity-30 cursor-pointer"
                >
                  <Plus size={14} />
                </button>
              </div>

              {/* Main Add to Cart */}
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock || isAdded}
                className={`flex-1 py-4 text-[12px] font-mono font-bold tracking-[0.14em] uppercase rounded-xl transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2 cursor-pointer ${
                  isAdded
                    ? 'bg-emerald-500 text-black'
                    : isOutOfStock
                    ? 'bg-white/10 text-white/30 cursor-not-allowed border border-white/10'
                    : 'glass-button bg-white text-black hover:bg-white/90'
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
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  inWish
                    ? 'bg-white text-black border-white'
                    : 'glass-card border-white/20 text-white hover:border-white'
                }`}
                title={inWish ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <Heart size={18} className={inWish ? 'fill-black' : ''} />
              </button>
            </div>

            {/* Direct BUY NOW (Checkout) */}
            {!isOutOfStock && (
              <button
                onClick={handleBuyNow}
                className="w-full py-3.5 glass-card rounded-xl text-white hover:border-white text-[11px] font-mono font-bold tracking-widest uppercase transition-all shadow-md active:scale-95 cursor-pointer"
              >
                BUY NOW WITH M-PESA / CARD
              </button>
            )}
          </div>

          {/* Sticky Mobile Add to Cart Bar */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 p-3 bg-black/90 backdrop-blur-2xl border-t border-white/15 z-40 flex items-center gap-3 shadow-[0_-8px_30px_rgba(0,0,0,0.8)] pb-[max(0.75rem,env(safe-area-inset-bottom))]">
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-mono text-white/50 uppercase block truncate">{product.name}</span>
              <span className="text-sm font-mono font-bold text-white">
                {formatKES(product.salePrice || product.price)}
              </span>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="glass-button bg-white text-black px-6 py-3 text-xs font-mono font-bold tracking-wider uppercase rounded-xl active:scale-95 cursor-pointer"
            >
              {isOutOfStock ? 'SOLD OUT' : 'ADD TO BAG'}
            </button>
          </div>

          {/* =========================================================================
              EXPANDABLE ACCORDIONS
              ========================================================================= */}
          <div className="space-y-0 pt-4">
            {/* Description & Materials */}
            <div className="border-t border-white/10">
              <button
                onClick={() => toggleAccordion('details')}
                className="w-full flex justify-between items-center text-[11px] font-mono font-semibold tracking-[0.14em] uppercase py-4 text-white/90 hover:text-white transition-colors cursor-pointer"
              >
                <span>FABRIC &amp; SPECIFICATIONS</span>
                {openAccordions.details ? <span>−</span> : <span>+</span>}
              </button>
              {openAccordions.details && (
                <div className="text-xs sm:text-sm text-white/70 leading-relaxed pb-4 space-y-2">
                  <p>{product.description}</p>
                  <p className="font-mono text-white text-[11px] font-bold">TEXTILE: {product.material}</p>
                </div>
              )}
            </div>

            {/* Silhouette & Fit */}
            <div className="border-t border-white/10">
              <button
                onClick={() => toggleAccordion('fit')}
                className="w-full flex justify-between items-center text-[11px] font-mono font-semibold tracking-[0.14em] uppercase py-4 text-white/90 hover:text-white transition-colors cursor-pointer"
              >
                <span>SILHOUETTE &amp; FIT ADVISORY</span>
                {openAccordions.fit ? <span>−</span> : <span>+</span>}
              </button>
              {openAccordions.fit && (
                <div className="text-xs sm:text-sm text-white/70 leading-relaxed pb-4 space-y-1">
                  <p>{product.fit}</p>
                  <p className="text-[11px] text-white/50">
                    Engineered with drop shoulders and boxy drape. Model is wearing size L.
                  </p>
                </div>
              )}
            </div>

            {/* Garment Care */}
            <div className="border-t border-white/10">
              <button
                onClick={() => toggleAccordion('care')}
                className="w-full flex justify-between items-center text-[11px] font-mono font-semibold tracking-[0.14em] uppercase py-4 text-white/90 hover:text-white transition-colors cursor-pointer"
              >
                <span>CARE &amp; WASH INSTRUCTIONS</span>
                {openAccordions.care ? <span>−</span> : <span>+</span>}
              </button>
              {openAccordions.care && (
                <div className="text-xs sm:text-sm text-white/70 leading-relaxed pb-4">
                  <p>{product.careInstructions}</p>
                </div>
              )}
            </div>

            {/* Shipping & Delivery in Kenya */}
            <div className="border-t border-white/10">
              <button
                onClick={() => toggleAccordion('shipping')}
                className="w-full flex justify-between items-center text-[11px] font-mono font-semibold tracking-[0.14em] uppercase py-4 text-white/90 hover:text-white transition-colors cursor-pointer"
              >
                <span>KENYAN &amp; GLOBAL DELIVERY</span>
                {openAccordions.shipping ? <span>−</span> : <span>+</span>}
              </button>
              {openAccordions.shipping && (
                <div className="text-xs sm:text-sm text-white/70 leading-relaxed pb-4 space-y-1">
                  <p><strong className="text-white">Nairobi:</strong> Same-day dispatch on orders placed before 2:00 PM EAT.</p>
                  <p><strong className="text-white">Kiambu, Mombasa, Kisumu, Nakuru:</strong> 1-2 business days via Fargo Courier.</p>
                  <p><strong className="text-white">Free Express Shipping:</strong> Unlocked automatically on all Kenyan orders above KES 10,000.</p>
                </div>
              )}
            </div>

            {/* Returns & Exchanges */}
            <div className="border-t border-white/10">
              <button
                onClick={() => toggleAccordion('returns')}
                className="w-full flex justify-between items-center text-[11px] font-mono font-semibold tracking-[0.14em] uppercase py-4 text-white/90 hover:text-white transition-colors cursor-pointer"
              >
                <span>7-DAY EXCHANGE POLICY</span>
                {openAccordions.returns ? <span>−</span> : <span>+</span>}
              </button>
              {openAccordions.returns && (
                <div className="text-xs sm:text-sm text-white/70 leading-relaxed pb-4">
                  <p>Complimentary size exchanges within 7 days of delivery across Nairobi. Garments must be unworn with original metallic tags attached.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          VERIFIED CUSTOMER REVIEWS
          ========================================================================= */}
      <section id="reviews-section" className="mt-20 sm:mt-28 pt-12 sm:pt-16 border-t border-white/10">
        <div className="flex flex-col md:flex-row justify-between md:items-end pb-8 border-b border-white/10 gap-4">
          <div>
            <span className="text-[10px] font-mono tracking-widest uppercase text-white/50 font-bold block mb-1">CLIENT TESTIMONIALS</span>
            <h2 className="pesos-text-face text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white">
              COMMUNITY REVIEWS ({reviews.length})
            </h2>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            {avgRating ? (
              <div className="flex items-center gap-2">
                <div className="flex text-amber-400">
                  {[...Array(Math.round(Number(avgRating)))].map((_, i) => (
                    <Star key={i} size={15} className="fill-amber-400" />
                  ))}
                </div>
                <span className="text-xs font-mono text-white font-bold">{avgRating} / 5.0</span>
              </div>
            ) : (
              <span className="text-xs font-mono text-white/50 uppercase tracking-wider">NO REVIEWS YET</span>
            )}
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="glass-button text-white px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider rounded-xl hover:bg-white hover:text-black transition-all cursor-pointer"
            >
              {showReviewForm ? 'CLOSE REVIEW FORM' : 'WRITE A REVIEW'}
            </button>
          </div>
        </div>

        {/* Write a Review Form */}
        {showReviewForm && (
          <div className="mt-8 max-w-2xl glass-card rounded-2xl p-6 sm:p-8 border-white/15">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">Leave an Atelier Review</h3>
            <p className="text-xs text-white/60 mt-1 font-mono">Share your thoughts on textile weight, drape, and sizing.</p>

            {reviewSubmitted ? (
              <div className="mt-4 p-5 glass-panel rounded-xl text-xs text-white flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500 text-black flex items-center justify-center shrink-0">
                  <Check size={18} />
                </div>
                <div>
                  <h4 className="font-bold uppercase tracking-wider text-white text-xs">Review Published to Atelier</h4>
                  <p className="text-[11px] text-white/70 font-mono mt-0.5">
                    Thank you! Your verified community review is now live on this garment.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="mt-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-mono uppercase text-white/60 block mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="E.G. JOSHUA KIGEN"
                      value={reviewName}
                      onChange={(e) => setReviewName(e.target.value)}
                      className="w-full bg-white/5 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-white transition-colors placeholder-white/30"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono uppercase text-white/60 block mb-1">Email (Private) *</label>
                    <input
                      type="email"
                      required
                      placeholder="E.G. JOSHUA@GMAIL.COM"
                      value={reviewEmail}
                      onChange={(e) => setReviewEmail(e.target.value)}
                      className="w-full bg-white/5 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-white transition-colors placeholder-white/30"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <span className="text-xs font-mono text-white/60 uppercase font-semibold">Rating:</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setReviewRating(num)}
                        className="p-1 text-white hover:scale-110 transition-transform cursor-pointer"
                      >
                        <Star size={18} className={num <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-white/20'} />
                      </button>
                    ))}
                  </div>
                  <span className="text-xs font-mono font-bold text-white ml-2">{reviewRating}.0 / 5.0</span>
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase text-white/60 block mb-1">Review Headline *</label>
                  <input
                    type="text"
                    required
                    placeholder="HEADLINE (E.G. UNMATCHED HEAVYWEIGHT 280 GSM DRAPE)"
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-white transition-colors placeholder-white/30"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase text-white/60 block mb-1">Detailed Review *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="HOW DOES IT FIT? WHAT DO YOU THINK OF THE 3D METALLIC CHROME EMBLEM AND COMBED COTTON?"
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-white transition-colors placeholder-white/30"
                  />
                  <p className="text-[10px] font-mono text-white/40 mt-1">Minimum 5 characters required.</p>
                </div>

                {reviewError && (
                  <div className="p-3 glass-card rounded-xl border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle size={15} className="shrink-0" />
                    <span className="font-mono text-[11px]">{reviewError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="glass-button bg-white text-black px-8 py-3 text-xs font-mono font-bold tracking-widest uppercase rounded-xl hover:bg-white/90 shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {isSubmittingReview ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>PUBLISHING REVIEW...</span>
                    </>
                  ) : (
                    <span>SUBMIT REVIEW</span>
                  )}
                </button>
              </form>
            )}
          </div>
        )}

        {/* Existing Reviews List */}
        {reviews.length === 0 ? (
          <div className="mt-8 p-10 glass-card rounded-2xl text-center space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">NO COMMUNITY REVIEWS YET</h3>
            <p className="text-xs text-white/60 max-w-sm mx-auto font-mono">
              Be the first to share your experience wearing this atelier garment.
            </p>
            {!showReviewForm && (
              <div className="pt-2">
                <button
                  onClick={() => setShowReviewForm(true)}
                  className="glass-button text-white px-6 py-2.5 text-xs font-mono font-bold uppercase tracking-widest rounded-xl hover:bg-white hover:text-black transition-all cursor-pointer"
                >
                  BE THE FIRST TO REVIEW
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 pt-8">
            {reviews.map((rev) => (
              <div key={rev.id} className="glass-card rounded-2xl p-5 space-y-3 border-white/10">
                <div className="flex justify-between items-center">
                  <div className="flex text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} size={13} className="fill-amber-400" />
                    ))}
                  </div>
                  {rev.isVerifiedPurchase && (
                    <span className="text-[10px] font-mono text-emerald-300 font-bold flex items-center gap-1">
                      <ShieldCheck size={12} /> VERIFIED
                    </span>
                  )}
                </div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">&ldquo;{rev.title}&rdquo;</h4>
                <p className="text-xs text-white/70 leading-relaxed font-light">{rev.comment}</p>
                <div className="pt-2 border-t border-white/10 text-[10px] font-mono text-white/40 flex justify-between">
                  <span>{rev.customerName}</span>
                  <span>{new Date(rev.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-20 sm:mt-28 pt-12 sm:pt-16 border-t border-white/10">
          <div className="pb-6 sm:pb-8 border-b border-white/10 mb-8 sm:mb-12">
            <span className="text-[10px] font-mono tracking-widest uppercase text-white/50 font-bold block mb-1">CURATED HARMONY</span>
            <h2 className="pesos-text-face text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white">
              PAIR WITH THIS PIECE
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Size Guide Modal */}
      {sizeGuideOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in font-sans">
          <div className="glass-panel-heavy rounded-2xl border border-white/20 max-w-xl w-full p-6 sm:p-8 text-white relative shadow-2xl">
            <button
              onClick={() => setSizeGuideOpen(false)}
              className="absolute top-4 right-4 text-white/60 hover:text-white p-1 rounded-full cursor-pointer"
            >
              ✕
            </button>
            <h3 className="text-lg font-bold uppercase tracking-wider text-white">RADIICATO SIZE MATRIX</h3>
            <p className="text-xs text-white/60 mt-1 font-mono">Measurements in centimeters (cm). Garments cut boxy &amp; oversized.</p>

            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-xs font-mono text-left border border-white/10">
                <thead className="bg-white/5 text-white">
                  <tr>
                    <th className="p-2.5 border-b border-white/10">SIZE</th>
                    <th className="p-2.5 border-b border-white/10">CHEST (PIT-TO-PIT)</th>
                    <th className="p-2.5 border-b border-white/10">LENGTH</th>
                    <th className="p-2.5 border-b border-white/10">SLEEVE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 text-white/80">
                  <tr><td className="p-2.5 font-bold text-white">S</td><td className="p-2.5">58 cm</td><td className="p-2.5">72 cm</td><td className="p-2.5">23 cm</td></tr>
                  <tr><td className="p-2.5 font-bold text-white">M</td><td className="p-2.5">61 cm</td><td className="p-2.5">74 cm</td><td className="p-2.5">24 cm</td></tr>
                  <tr><td className="p-2.5 font-bold text-white">L</td><td className="p-2.5">64 cm</td><td className="p-2.5">76 cm</td><td className="p-2.5">25 cm</td></tr>
                  <tr><td className="p-2.5 font-bold text-white">XL</td><td className="p-2.5">67 cm</td><td className="p-2.5">78 cm</td><td className="p-2.5">26 cm</td></tr>
                  <tr><td className="p-2.5 font-bold text-white">XXL</td><td className="p-2.5">70 cm</td><td className="p-2.5">80 cm</td><td className="p-2.5">27 cm</td></tr>
                </tbody>
              </table>
            </div>

            <p className="text-[11px] text-white/60 mt-4 leading-relaxed">
              Take your regular size for an intended relaxed streetwear silhouette, or size down one size for a fitted tailor drape.
            </p>
          </div>
        </div>
      )}

      {/* Floating Review Success Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 glass-card bg-black/90 text-white px-5 py-3.5 rounded-xl shadow-2xl border border-white/20 flex items-center gap-3 animate-fade-in">
          <div className="w-5 h-5 rounded-full bg-emerald-500 text-black flex items-center justify-center shrink-0">
            <Check size={12} />
          </div>
          <span className="text-xs font-mono tracking-wider">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
