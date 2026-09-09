'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowRight, ArrowDown, Clock, Bell, Check, Star, 
  ShoppingBag, Shield, Truck, Zap, Sparkles, Layers, Eye
} from 'lucide-react';
import { useStore } from '@/lib/use-store';
import { LookbookModal } from '@/components/lookbook/LookbookModal';
import { formatKES } from '@/lib/utils';
import { Size } from '@/types';

export default function HomePage() {
  const { products, collections, lookbook, reviews, addToCart } = useStore();
  const [lookbookModalOpen, setLookbookModalOpen] = useState(false);
  const [selectedLookbookIndex, setSelectedLookbookIndex] = useState(0);

  // The Two Official Products
  const brokenRecordProduct = products.find((p) => p.slug === 'broken-record-heavyweight-tee');
  const weAreWhoWeAreProduct = products.find((p) => p.slug === 'we-are-who-we-are-boxy-tee');

  // Interactive View Switchers for the Two Showcase Cards
  // 'front' | 'back' | 'full'
  const [brokenRecordView, setBrokenRecordView] = useState<'front' | 'back' | 'full'>('front');
  const [weAreWhoWeAreView, setWeAreWhoWeAreView] = useState<'front' | 'back' | 'full'>('front');

  // In-Card Size Selectors
  const [brokenRecordSize, setBrokenRecordSize] = useState<Size>('L');
  const [weAreWhoWeAreSize, setWeAreWhoWeAreSize] = useState<Size>('L');

  // Quick Add Toast feedback
  const [quickAddedId, setQuickAddedId] = useState<string | null>(null);

  // Skull Cap Drop 03 Waitlist RSVP State
  const [rsvpContact, setRsvpContact] = useState('');
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);

  // Live Drop 03 Countdown Timer (Days, Hours, Minutes, Seconds)
  const [countdown, setCountdown] = useState({
    days: 41,
    hours: 18,
    minutes: 42,
    seconds: 15,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Quick Add to Cart Handler
  const handleQuickAdd = (
    product: typeof brokenRecordProduct,
    selectedSize: Size
  ) => {
    if (!product) return;
    const variant = product.variants.find((v) => v.size === selectedSize) || product.variants[0];
    const primaryImage = product.images.find((i) => i.isPrimary) || product.images[0];
    
    addToCart({
      productId: product.id,
      variantId: variant.id,
      name: product.name,
      slug: product.slug,
      image: primaryImage?.url || '',
      price: product.salePrice || product.price,
      colorName: variant.colorName,
      colorHex: variant.colorHex,
      size: selectedSize,
      quantity: 1,
      maxStock: variant.stockQuantity,
    });

    setQuickAddedId(product.id);
    setTimeout(() => setQuickAddedId(null), 2500);

    // Trigger cart drawer open event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('open-cart'));
    }
  };

  const handleOpenLookbook = (index: number) => {
    setSelectedLookbookIndex(index);
    setLookbookModalOpen(true);
  };

  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rsvpContact.trim()) {
      setRsvpSubmitted(true);
      setRsvpContact('');
    }
  };

  // Image Mapping based on View Switcher
  const getBrokenRecordImage = () => {
    switch (brokenRecordView) {
      case 'front':
        return '/images/products/broken-record-front.jpg';
      case 'back':
        return '/images/products/broken-record-back.jpg';
      case 'full':
        return '/images/products/broken-record-full.jpg';
    }
  };

  const getWeAreWhoWeAreImage = () => {
    switch (weAreWhoWeAreView) {
      case 'front':
        return '/images/products/we-are-who-we-are-front.jpg';
      case 'back':
        return '/images/products/we-are-who-we-are-back.jpg';
      case 'full':
        return '/images/products/we-are-who-we-are-full.jpg';
    }
  };

  const availableSizes: Size[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  return (
    <div className="bg-white text-[#0A0A0A] selection:bg-[#4D5936] selection:text-white">
      
      {/* =========================================================================
          1. EDITORIAL MONOLITH HERO
          ========================================================================= */}
      <section className="relative min-h-[92vh] sm:min-h-screen flex items-end pb-14 sm:pb-24 pt-36 sm:pt-48 px-6 sm:px-12 bg-white border-b border-[#E5E5E5] overflow-hidden">
        {/* Subtle Background Watermark Typography */}
        <div className="absolute top-1/4 right-0 select-none pointer-events-none opacity-[0.03] text-[28vw] font-black tracking-tighter leading-none font-display text-black">
          RAD
        </div>

        <div className="relative z-10 max-w-[1600px] w-full mx-auto">
          <div className="max-w-4xl space-y-7">
            {/* Atelier Status Ribbon */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-2 bg-[#F4F4F5] border border-[#E4E4E7] rounded text-xs sm:text-sm font-mono tracking-widest uppercase text-[#52525B]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#4D5936] animate-pulse" />
              <span className="font-extrabold text-black">NAIROBI ATELIER</span>
              <span>•</span>
              <span>TWO LIVE CAPSULES</span>
              <span>•</span>
              <span className="text-[#4D5936] font-extrabold">DROP 03 COMING SOON</span>
            </div>

            {/* Monumental Headline */}
            <h1 className="text-5xl sm:text-7xl lg:text-9xl font-black uppercase tracking-tight leading-[0.88] text-[#0A0A0A] font-display select-none">
              WEAR THE DIFFERENCE.
            </h1>

            {/* Narrative Manifesto Copy */}
            <p className="text-base sm:text-xl text-[#52525B] max-w-2xl font-light tracking-wide leading-relaxed">
              Engineered in Nairobi for young fashion-conscious Kenyans who refuse to conform. Cut from 280 GSM combed organic cotton with hand-finished liquid chrome badges and subversive graphics.
            </p>

            {/* Direct Dual Drop CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <Link
                href="/collections/broken-record"
                className="bg-[#0A0A0A] text-white hover:bg-[#27272A] transition-all px-8 py-4 text-xs font-bold tracking-[0.2em] uppercase flex items-center justify-center gap-3 group shadow-sm"
              >
                <span>BROKEN RECORD (WHITE)</span>
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/collections/we-are-who-we-are"
                className="bg-white border-2 border-black text-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white transition-all px-8 py-4 text-xs font-bold tracking-[0.2em] uppercase text-center shadow-sm"
              >
                WE ARE WHO WE ARE (BLACK)
              </Link>
              <Link
                href="/collections/skull-caps"
                className="bg-[#4D5936]/10 text-[#4D5936] hover:bg-[#4D5936] hover:text-white border border-[#4D5936]/25 transition-all px-6 py-4 text-xs font-bold tracking-[0.15em] uppercase text-center flex items-center justify-center gap-2"
              >
                <Clock size={14} />
                <span>SKULL CAPS (DROP 03)</span>
              </Link>
            </div>
          </div>

          {/* Technical Telemetry Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-14 text-[11px] font-mono tracking-widest text-[#71717A] uppercase border-t border-[#E5E5E5] mt-14">
            <div>
              <span className="text-[#A1A1AA] block text-[10px]">WEIGHT SPECIFICATION</span>
              <span className="font-bold text-black text-xs">280 GSM COMBED COTTON</span>
            </div>
            <div>
              <span className="text-[#A1A1AA] block text-[10px]">COLLAR INTEGRITY</span>
              <span className="font-bold text-black text-xs">ANTI-BACON DOUBLE RIB</span>
            </div>
            <div>
              <span className="text-[#A1A1AA] block text-[10px]">LOCAL DISPATCH</span>
              <span className="font-bold text-black text-xs">FARGO & G4S KENYA</span>
            </div>
            <div>
              <span className="text-[#A1A1AA] block text-[10px]">INSTANT CHECKOUT</span>
              <span className="font-bold text-[#4D5936] text-xs">M-PESA STK PUSH LIVE</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. THE TWO OFFICIAL COLLECTIONS (SIDE-BY-SIDE RUNWAY SHOWCASE)
          ========================================================================= */}
      <section id="collections" className="py-20 sm:py-32 px-6 sm:px-12 max-w-[1600px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between md:items-end pb-8 mb-12 border-b border-[#E5E5E5] gap-4">
          <div className="space-y-2">
            <span className="text-xs sm:text-sm font-mono tracking-[0.35em] uppercase text-[#4D5936] font-bold block">
              THE EXCLUSIVE RELEASES // ATELIER DROPS
            </span>
            <h2 className="text-4xl sm:text-6xl lg:text-8xl font-black uppercase tracking-tight text-[#0A0A0A] font-display">
              THE TWO COLLECTIONS
            </h2>
          </div>
          <p className="text-xs sm:text-sm font-mono font-bold text-[#71717A] uppercase tracking-wider">
            STRICT ATELIER ALLOCATION • 100 PIECES PER CAPSULE
          </p>
        </div>

        {/* The Two Runway Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* -------------------------------------------------------------
              COLLECTION 01: BROKEN RECORD (WHITE ATELIER)
              ------------------------------------------------------------- */}
          <div className="bg-[#FAFAF9] border border-[#E4E4E7] p-6 sm:p-10 flex flex-col justify-between transition-all hover:border-black shadow-xs">
            <div>
              {/* Header */}
              <div className="flex items-start justify-between pb-5 border-b border-[#E5E5E5]">
                <div>
                  <span className="text-xs font-mono tracking-widest uppercase font-bold text-[#4D5936]">
                    DROP 01 // WHITE CAPSULE
                  </span>
                  <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-[#0A0A0A] font-display mt-1">
                    BROKEN RECORD
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-sm sm:text-base font-mono font-bold px-3.5 py-1.5 bg-white border border-[#E5E5E5] rounded text-black block">
                    KES 1,000
                  </span>
                  <span className="text-[10px] font-mono text-[#71717A] mt-1 block">IN STOCK</span>
                </div>
              </div>

              {/* Interactive View Switcher Tabs */}
              <div className="flex items-center justify-between mt-5 mb-3">
                <div className="flex gap-1.5 bg-white p-1 border border-[#E5E5E5] rounded text-[10px] font-mono uppercase font-bold">
                  <button
                    onClick={() => setBrokenRecordView('front')}
                    className={`px-3 py-1 transition-colors rounded ${
                      brokenRecordView === 'front' ? 'bg-[#0A0A0A] text-white' : 'text-[#71717A] hover:text-black'
                    }`}
                  >
                    1. FRONT BADGE
                  </button>
                  <button
                    onClick={() => setBrokenRecordView('back')}
                    className={`px-3 py-1 transition-colors rounded ${
                      brokenRecordView === 'back' ? 'bg-[#0A0A0A] text-white' : 'text-[#71717A] hover:text-black'
                    }`}
                  >
                    2. BACK VINYL
                  </button>
                  <button
                    onClick={() => setBrokenRecordView('full')}
                    className={`px-3 py-1 transition-colors rounded ${
                      brokenRecordView === 'full' ? 'bg-[#0A0A0A] text-white' : 'text-[#71717A] hover:text-black'
                    }`}
                  >
                    3. FLAT LAY
                  </button>
                </div>
                <span className="text-[10px] font-mono text-[#71717A] uppercase hidden sm:inline">
                  {brokenRecordView === 'front' && '3D CHROME OVAL BADGE'}
                  {brokenRecordView === 'back' && 'MF DOOM VINYL REVERSE'}
                  {brokenRecordView === 'full' && 'ARCHITECTURAL DRAPE'}
                </span>
              </div>

              {/* High-Resolution Dynamic Garment Frame */}
              <div className="relative aspect-[4/3] w-full bg-white overflow-hidden border border-[#E5E5E5] mb-6 group">
                <Image
                  src={getBrokenRecordImage()}
                  alt="Radiicato Broken Record White Heavyweight Streetwear Tee"
                  fill
                  priority
                  className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-xs text-white text-[10px] font-mono uppercase px-2.5 py-1 tracking-wider">
                  280 GSM CRISP ATELIER WHITE
                </div>
              </div>

              {/* Specs Narrative */}
              <p className="text-sm text-[#52525B] leading-relaxed font-light mb-6">
                Cut in an architectural relaxed streetwear silhouette from dense 280 GSM combed cotton. Features the signature 3D liquid chrome metallic oval logo on the front chest and the iconic shattered MF DOOM vinyl record tribute across the reverse.
              </p>

              {/* Quick Size Selector */}
              <div className="space-y-2 mb-6">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-[#71717A] uppercase font-semibold">SELECT SIZE:</span>
                  <span className="font-bold text-black font-mono">{brokenRecordSize} (TRUE TO STREETWEAR FIT)</span>
                </div>
                <div className="grid grid-cols-6 gap-2">
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setBrokenRecordSize(size)}
                      className={`py-2 text-xs font-mono font-bold uppercase transition-all border ${
                        brokenRecordSize === size
                          ? 'bg-[#0A0A0A] text-white border-black shadow-xs'
                          : 'bg-white text-[#52525B] border-[#D4D4D8] hover:border-black hover:text-black'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Interactive Buy & Explore Actions */}
            <div className="space-y-3 pt-4 border-t border-[#E5E5E5]">
              <button
                onClick={() => handleQuickAdd(brokenRecordProduct, brokenRecordSize)}
                className="w-full py-4 bg-[#0A0A0A] hover:bg-[#27272A] text-white text-xs font-bold tracking-[0.2em] uppercase transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <ShoppingBag size={15} />
                <span>
                  {quickAddedId === brokenRecordProduct?.id ? 'ADDED TO BAG' : `ADD TO BAG (${brokenRecordSize}) — KES 1,000`}
                </span>
              </button>
              <Link
                href="/collections/broken-record"
                className="block text-center py-3 bg-white hover:bg-[#F4F4F5] border border-[#D4D4D8] text-xs font-bold tracking-[0.15em] uppercase text-black transition-colors"
              >
                EXPLORE BROKEN RECORD CAPSULE &rarr;
              </Link>
            </div>
          </div>

          {/* -------------------------------------------------------------
              COLLECTION 02: WE ARE WHO WE ARE (BLACK ATELIER)
              ------------------------------------------------------------- */}
          <div className="bg-[#18181B] text-white border border-[#27272A] p-6 sm:p-10 flex flex-col justify-between transition-all hover:border-[#52525B] shadow-xs">
            <div>
              {/* Header */}
              <div className="flex items-start justify-between pb-5 border-b border-[#27272A]">
                <div>
                  <span className="text-xs font-mono tracking-widest uppercase font-bold text-[#A3B88C]">
                    DROP 02 // BLACK CAPSULE
                  </span>
                  <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white font-display mt-1">
                    WE ARE WHO WE ARE
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-sm sm:text-base font-mono font-bold px-3.5 py-1.5 bg-black border border-[#3F3F46] rounded text-white block">
                    KES 800
                  </span>
                  <span className="text-[10px] font-mono text-[#A1A1AA] mt-1 block">IN STOCK</span>
                </div>
              </div>

              {/* Interactive View Switcher Tabs */}
              <div className="flex items-center justify-between mt-5 mb-3">
                <div className="flex gap-1.5 bg-[#09090B] p-1 border border-[#27272A] rounded text-[10px] font-mono uppercase font-bold">
                  <button
                    onClick={() => setWeAreWhoWeAreView('front')}
                    className={`px-3 py-1 transition-colors rounded ${
                      weAreWhoWeAreView === 'front' ? 'bg-white text-black' : 'text-[#71717A] hover:text-white'
                    }`}
                  >
                    1. FRONT MASCOT
                  </button>
                  <button
                    onClick={() => setWeAreWhoWeAreView('back')}
                    className={`px-3 py-1 transition-colors rounded ${
                      weAreWhoWeAreView === 'back' ? 'bg-white text-black' : 'text-[#71717A] hover:text-white'
                    }`}
                  >
                    2. BACK COLLAGE
                  </button>
                  <button
                    onClick={() => setWeAreWhoWeAreView('full')}
                    className={`px-3 py-1 transition-colors rounded ${
                      weAreWhoWeAreView === 'full' ? 'bg-white text-black' : 'text-[#71717A] hover:text-white'
                    }`}
                  >
                    3. FLAT LAY
                  </button>
                </div>
                <span className="text-[10px] font-mono text-[#A1A1AA] uppercase hidden sm:inline">
                  {weAreWhoWeAreView === 'front' && 'BUCKET HAT MASCOT & TAG'}
                  {weAreWhoWeAreView === 'back' && 'WWWRR PAPER COLLAGE'}
                  {weAreWhoWeAreView === 'full' && 'WASHED OBSIDIAN DRAPE'}
                </span>
              </div>

              {/* High-Resolution Dynamic Garment Frame */}
              <div className="relative aspect-[4/3] w-full bg-[#09090B] overflow-hidden border border-[#27272A] mb-6 group">
                <Image
                  src={getWeAreWhoWeAreImage()}
                  alt="Radiicato We Are Who We Are Black Boxy Streetwear Tee"
                  fill
                  priority
                  className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-xs text-black text-[10px] font-mono uppercase px-2.5 py-1 tracking-wider font-bold">
                  280 GSM WASHED VINTAGE OBSIDIAN
                </div>
              </div>

              {/* Specs Narrative */}
              <p className="text-sm text-zinc-300 leading-relaxed font-light mb-6">
                Rebellious Nairobi underground streetwear cut from washed luxury cotton. Features the signature Radiicato character mascot in an olive bucket hat with marker tags on the chest, and the iconic "W W W R R" torn paper collage across the back.
              </p>

              {/* Quick Size Selector */}
              <div className="space-y-2 mb-6">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-[#A1A1AA] uppercase font-semibold">SELECT SIZE:</span>
                  <span className="font-bold text-white font-mono">{weAreWhoWeAreSize} (BOXY OVERSIZED FIT)</span>
                </div>
                <div className="grid grid-cols-6 gap-2">
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setWeAreWhoWeAreSize(size)}
                      className={`py-2 text-xs font-mono font-bold uppercase transition-all border ${
                        weAreWhoWeAreSize === size
                          ? 'bg-white text-black border-white shadow-xs'
                          : 'bg-[#09090B] text-zinc-300 border-[#27272A] hover:border-white hover:text-white'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Interactive Buy & Explore Actions */}
            <div className="space-y-3 pt-4 border-t border-[#27272A]">
              <button
                onClick={() => handleQuickAdd(weAreWhoWeAreProduct, weAreWhoWeAreSize)}
                className="w-full py-4 bg-white hover:bg-zinc-200 text-black text-xs font-bold tracking-[0.2em] uppercase transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <ShoppingBag size={15} />
                <span>
                  {quickAddedId === weAreWhoWeAreProduct?.id ? 'ADDED TO BAG' : `ADD TO BAG (${weAreWhoWeAreSize}) — KES 800`}
                </span>
              </button>
              <Link
                href="/collections/we-are-who-we-are"
                className="block text-center py-3 bg-[#09090B] hover:bg-zinc-900 border border-[#3F3F46] text-xs font-bold tracking-[0.15em] uppercase text-white transition-colors"
              >
                EXPLORE WE ARE WHO WE ARE CAPSULE &rarr;
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          3. DROP 03 EXCLUSIVE TEASER — SKULL CAPS ARE COMING SOON
          ========================================================================= */}
      <section className="py-20 sm:py-28 bg-[#FAFAF9] border-y border-[#E5E5E5] overflow-hidden">
        <div className="max-w-[1600px] mx-auto px-6 sm:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Visual Frame */}
            <div className="lg:col-span-6 relative aspect-square sm:aspect-[4/3] bg-white overflow-hidden border border-[#E5E5E5] group shadow-sm">
              <Image
                src="/images/products/radiicato-skull-cap.jpg"
                alt="Radiicato Heavyweight Ribbed Knit Skull Cap with Chrome Insignia"
                fill
                priority
                className="object-contain p-6 sm:p-10 group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute top-4 left-4 bg-black text-white text-[10px] font-mono tracking-widest uppercase px-3 py-1 font-bold">
                DROP 03 // COMING SOON
              </div>
              <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-xs text-[#4D5936] text-[10px] font-mono tracking-widest uppercase px-3 py-1 font-bold border border-[#4D5936]/20">
                RETAIL: KES 500 • 100 PIECES ALLOCATED
              </div>
            </div>

            {/* Narrative & VIP Waitlist Signup */}
            <div className="lg:col-span-6 space-y-6">
              <div className="space-y-2">
                <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-[#4D5936] font-bold flex items-center gap-2">
                  <Clock size={14} className="animate-spin text-[#4D5936]" />
                  NEXT ATELIER RELEASE
                </span>
                <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-[#0A0A0A] font-display">
                  SKULL CAPS ARE COMING SOON.
                </h2>
              </div>

              <p className="text-base text-[#52525B] font-light leading-relaxed">
                Engineered specifically for chilly Nairobi evenings, Westlands sets, and late studio sessions. Double-layered dense ribbed knit from premium acrylic-merino blend with the Radiicato signature brushed chrome metallic insignia emblem.
              </p>

              {/* Drop Countdown Ticker */}
              <div className="grid grid-cols-4 gap-3 p-4 bg-white border border-[#E5E5E5] text-center font-mono">
                <div>
                  <span className="text-2xl sm:text-3xl font-black text-black block">{countdown.days}</span>
                  <span className="text-[10px] text-[#71717A] tracking-wider uppercase">DAYS</span>
                </div>
                <div>
                  <span className="text-2xl sm:text-3xl font-black text-black block">{String(countdown.hours).padStart(2, '0')}</span>
                  <span className="text-[10px] text-[#71717A] tracking-wider uppercase">HOURS</span>
                </div>
                <div>
                  <span className="text-2xl sm:text-3xl font-black text-black block">{String(countdown.minutes).padStart(2, '0')}</span>
                  <span className="text-[10px] text-[#71717A] tracking-wider uppercase">MINS</span>
                </div>
                <div>
                  <span className="text-2xl sm:text-3xl font-black text-black block">{String(countdown.seconds).padStart(2, '0')}</span>
                  <span className="text-[10px] text-[#71717A] tracking-wider uppercase">SECS</span>
                </div>
              </div>

              {/* VIP Waitlist RSVP */}
              <div className="pt-2">
                <span className="text-xs font-mono uppercase tracking-widest text-[#0A0A0A] font-bold block mb-3">
                  JOIN VIP DROP LIST FOR 1-HOUR EARLY ACCESS PASS:
                </span>
                {rsvpSubmitted ? (
                  <div className="p-4 bg-[#F4F6F0] border border-[#D1D9C5] text-xs text-[#4D5936] font-medium flex items-center gap-3">
                    <Check size={18} />
                    <span>You are on the priority list. You will receive an SMS and private release password before the drop opens to the public.</span>
                  </div>
                ) : (
                  <form onSubmit={handleRsvpSubmit} className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      required
                      placeholder="ENTER EMAIL OR M-PESA NUMBER"
                      value={rsvpContact}
                      onChange={(e) => setRsvpContact(e.target.value)}
                      className="flex-1 bg-white border border-[#D4D4D8] px-4 py-3.5 text-xs font-mono uppercase text-black placeholder-[#A1A1AA] focus:outline-none focus:border-black shadow-xs"
                    />
                    <button
                      type="submit"
                      className="bg-[#0A0A0A] hover:bg-[#27272A] text-white px-8 py-3.5 text-xs font-bold tracking-widest uppercase transition-colors flex items-center justify-center gap-2 shadow-xs"
                    >
                      <Bell size={14} />
                      <span>NOTIFY ME</span>
                    </button>
                  </form>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          4. CRAFTSMANSHIP & GRAPHIC ANATOMY (4 MACRO DETAILS)
          ========================================================================= */}
      <section className="py-20 sm:py-28 px-6 sm:px-12 max-w-[1600px] mx-auto">
        <div className="pb-8 mb-12 border-b border-[#E5E5E5] flex flex-col md:flex-row justify-between md:items-end gap-4">
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#4D5936] font-bold block">
              TEXTILE & METALLIC HARDWARE
            </span>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-[#0A0A0A] font-display">
              GARMENT ANATOMY
            </h2>
          </div>
          <p className="text-xs font-mono text-[#71717A] uppercase">
            INDIVIDUALLY SCREENPRINTED & ASSEMBLED IN NAIROBI
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Detail 1 */}
          <div className="bg-[#FAFAF9] border border-[#E5E5E5] p-5 group flex flex-col justify-between hover:border-black transition-all">
            <div className="relative aspect-[4/3] w-full bg-white overflow-hidden border border-[#E5E5E5] mb-4">
              <Image
                src="/images/products/broken-record-front.jpg"
                alt="Radiicato 3D Chrome Oval Logo Emblem"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 640px) 100vw, 25vw"
              />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-[#4D5936] font-bold block">
                WHITE CAPSULE — CHEST
              </span>
              <h4 className="text-sm font-bold uppercase tracking-wider text-black mt-1">
                3D Liquid Chrome Emblem
              </h4>
              <p className="text-xs text-[#71717A] mt-2 font-light leading-relaxed">
                High-frequency metallic badge with high-specular chrome sheen and olive green contouring.
              </p>
            </div>
          </div>

          {/* Detail 2 */}
          <div className="bg-[#FAFAF9] border border-[#E5E5E5] p-5 group flex flex-col justify-between hover:border-black transition-all">
            <div className="relative aspect-[4/3] w-full bg-white overflow-hidden border border-[#E5E5E5] mb-4">
              <Image
                src="/images/products/broken-record-back.jpg"
                alt="Shattered MF DOOM Vinyl Record Print"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 640px) 100vw, 25vw"
              />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-[#4D5936] font-bold block">
                WHITE CAPSULE — REVERSE
              </span>
              <h4 className="text-sm font-bold uppercase tracking-wider text-black mt-1">
                Shattered MF DOOM Vinyl
              </h4>
              <p className="text-xs text-[#71717A] mt-2 font-light leading-relaxed">
                High-density multi-layered screenprint featuring shattered record grooves, tracklist titles, and metallic mask medallion.
              </p>
            </div>
          </div>

          {/* Detail 3 */}
          <div className="bg-[#FAFAF9] border border-[#E5E5E5] p-5 group flex flex-col justify-between hover:border-black transition-all">
            <div className="relative aspect-[4/3] w-full bg-[#18181B] overflow-hidden border border-[#27272A] mb-4">
              <Image
                src="/images/products/we-are-who-we-are-front.jpg"
                alt="Mascot in Bucket Hat and Graffiti"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 640px) 100vw, 25vw"
              />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-[#4D5936] font-bold block">
                BLACK CAPSULE — CHEST
              </span>
              <h4 className="text-sm font-bold uppercase tracking-wider text-black mt-1">
                Bucket Hat Mascot & Graffiti
              </h4>
              <p className="text-xs text-[#71717A] mt-2 font-light leading-relaxed">
                Hand-rendered Nairobi street mascot in olive bucket hat with raw marker graffiti tag.
              </p>
            </div>
          </div>

          {/* Detail 4 */}
          <div className="bg-[#FAFAF9] border border-[#E5E5E5] p-5 group flex flex-col justify-between hover:border-black transition-all">
            <div className="relative aspect-[4/3] w-full bg-[#18181B] overflow-hidden border border-[#27272A] mb-4">
              <Image
                src="/images/products/we-are-who-we-are-back.jpg"
                alt="WWWRR Paper Typography Collage"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 640px) 100vw, 25vw"
              />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-[#4D5936] font-bold block">
                BLACK CAPSULE — REVERSE
              </span>
              <h4 className="text-sm font-bold uppercase tracking-wider text-black mt-1">
                "W W W R R" Paper Collage
              </h4>
              <p className="text-xs text-[#71717A] mt-2 font-light leading-relaxed">
                Torn paper newspaper collage expressing "We Are Who We Are" across the shoulders.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. NAIROBI YOUTH & STREET CULTURE EDITORIAL LOOKBOOK
          ========================================================================= */}
      <section className="py-20 sm:py-28 bg-[#F8F8F9] border-t border-[#E5E5E5]">
        <div className="max-w-[1600px] mx-auto px-6 sm:px-12">
          <div className="flex flex-col md:flex-row justify-between md:items-end pb-8 mb-10 border-b border-[#E5E5E5] gap-4">
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#4D5936] font-bold block">
                EDITORIAL ARCHIVE // 2026
              </span>
              <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-[#0A0A0A] font-display">
                NAIROBI LOOKBOOK
              </h2>
            </div>
            <p className="text-xs font-mono text-[#71717A] uppercase">
              CLICK ANY EXHIBIT TO EXPAND FULLSCREEN
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {lookbook.map((item, idx) => (
              <div
                key={item.id}
                onClick={() => handleOpenLookbook(idx)}
                className="group relative aspect-[3/4] bg-white overflow-hidden border border-[#E5E5E5] cursor-pointer shadow-xs hover:border-black transition-all"
              >
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 640px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-black/65 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-5 text-white">
                  <span className="text-[10px] font-mono uppercase text-[#A3B88C] font-bold">
                    EXHIBIT 0{idx + 1}
                  </span>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white mt-1">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-zinc-300 mt-1 line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. GARMENT SPECIFICATIONS MATRIX
          ========================================================================= */}
      <section className="py-20 sm:py-28 px-6 sm:px-12 max-w-[1600px] mx-auto border-t border-[#E5E5E5]">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#4D5936] font-bold block">
              ATELIER STANDARDS
            </span>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-[#0A0A0A] font-display">
              TECHNICAL SPECIFICATIONS
            </h2>
            <p className="text-xs sm:text-sm text-[#71717A] max-w-lg mx-auto font-light">
              We reject cheap mass-production in favor of architectural heavyweight cottons and artisanal screenprints.
            </p>
          </div>

          <div className="divide-y divide-[#E5E5E5] border-y border-[#E5E5E5] text-xs font-mono">
            <div className="py-4 flex justify-between items-center">
              <span className="text-[#71717A] uppercase">FABRIC DENSITY</span>
              <span className="font-bold text-black text-right">280 GSM Ring-Spun Combed Cotton</span>
            </div>
            <div className="py-4 flex justify-between items-center">
              <span className="text-[#71717A] uppercase">COLLAR CONSTRUCTION</span>
              <span className="font-bold text-black text-right">1.25" Double-Needle Reinforced Rib (Zero Baconing)</span>
            </div>
            <div className="py-4 flex justify-between items-center">
              <span className="text-[#71717A] uppercase">SILHOUETTE</span>
              <span className="font-bold text-black text-right">Architectural Relaxed Boxy Drop-Shoulder</span>
            </div>
            <div className="py-4 flex justify-between items-center">
              <span className="text-[#71717A] uppercase">PRE-SHRUNK TREATMENT</span>
              <span className="font-bold text-black text-right">Pre-Washed for Zero Post-Wash Shrinkage</span>
            </div>
            <div className="py-4 flex justify-between items-center">
              <span className="text-[#71717A] uppercase">HARDWARE & EMBLEMS</span>
              <span className="font-bold text-black text-right">3D Liquid Chrome High-Frequency Metallic Badge</span>
            </div>
            <div className="py-4 flex justify-between items-center">
              <span className="text-[#71717A] uppercase">ORIGIN</span>
              <span className="font-bold text-[#4D5936] text-right">Engineered & Finished in Nairobi, Kenya</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. VERIFIED COMMUNITY REVIEWS (REAL KENYAN VOICES)
          ========================================================================= */}
      <section className="py-20 px-6 sm:px-12 max-w-[1600px] mx-auto border-t border-[#E5E5E5]">
        <div className="pb-8 mb-10 border-b border-[#E5E5E5] flex flex-col sm:flex-row justify-between sm:items-end gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono tracking-widest uppercase text-[#4D5936] font-bold">
              CUSTOMER SATISFACTION
            </span>
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-[#0A0A0A] font-display">
              KENYAN COMMUNITY FEEDBACK
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#52525B]">
            <div className="flex text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} fill="currentColor" />
              ))}
            </div>
            <span className="font-bold">5.0 / 5.0 VERIFIED STREETWEAR RATING</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.slice(0, 3).map((rev) => (
            <div
              key={rev.id}
              className="p-6 bg-[#FAFAF9] border border-[#E5E5E5] flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-500">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} size={13} fill="currentColor" />
                    ))}
                  </div>
                  <span className="text-[10px] font-mono uppercase bg-[#F4F6F0] text-[#4D5936] px-2 py-0.5 rounded font-bold">
                    VERIFIED BUYER
                  </span>
                </div>
                <h4 className="text-sm font-bold uppercase text-black">
                  "{rev.title}"
                </h4>
                <p className="text-xs text-[#52525B] leading-relaxed font-light">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-3 border-t border-[#E5E5E5] flex justify-between items-center text-[11px] font-mono text-[#71717A]">
                <span className="font-semibold text-black">{rev.customerName}</span>
                <span>NAIROBI, KENYA</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          8. OUR STORY — THE NAIROBI MANIFESTO & FOUNDER EXHIBIT (ENLARGED)
          ========================================================================= */}
      <section id="our-story" className="py-24 sm:py-36 px-6 sm:px-12 max-w-[1600px] mx-auto border-t border-[#E5E5E5]">
        {/* Giant Centered Brand Logo Banner */}
        <div className="flex flex-col items-center justify-center text-center pb-16 border-b border-[#E5E5E5]">
          <Image
            src="/logo.png"
            alt="RADIICATO"
            width={380}
            height={150}
            className="h-20 sm:h-28 lg:h-36 w-auto object-contain mb-6 transition-transform hover:scale-105 duration-300"
          />
          <span className="text-xs sm:text-sm font-mono tracking-[0.35em] uppercase text-[#4D5936] font-extrabold block mb-3">
            OUR STORY // NAIROBI ROOFTOP ATELIER
          </span>
          <h2 className="text-4xl sm:text-6xl lg:text-8xl font-black uppercase tracking-tight text-[#0A0A0A] font-display max-w-5xl leading-[0.92]">
            CRAFTED FOR KENYAN STREET CULTURE.
          </h2>
        </div>

        {/* Two-Column Founder & Narrative Editorial Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 pt-16 items-center">
          {/* Authentic Rooftop Founder Photo */}
          <div className="lg:col-span-5 relative aspect-[3/4] sm:aspect-[4/5] bg-[#0A0A0A] overflow-hidden border border-[#E4E4E7] shadow-xl group">
            <Image
              src="/owner.jpg"
              alt="Radiicato Founder & Creative Director overlooking Nairobi Skyline"
              fill
              className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90" />
            <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
              <span className="text-[11px] font-mono tracking-widest uppercase bg-[#4D5936] text-white px-2.5 py-1 font-bold inline-block">
                FOUNDER &amp; CREATIVE DIRECTOR
              </span>
              <p className="text-xs font-mono text-zinc-300 tracking-wider pt-1">
                NAIROBI HQ // SKYLINE ROOFTOP ATELIER
              </p>
              <p className="text-[11px] font-light text-zinc-400 italic">
                "We don't chase international trends — we define them right here in Nairobi."
              </p>
            </div>
          </div>

          {/* Narrative & Manifesto Copy - Enlarged Editorial Scale */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <span className="text-xs font-mono uppercase text-[#4D5936] font-bold tracking-widest block">
                01 / THE MISSION &amp; HERITAGE
              </span>
              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-[#0A0A0A] font-display leading-tight">
                WE BUILT RADIICATO TO REFUSE THE GENERIC.
              </h3>
            </div>

            <div className="space-y-5 text-base sm:text-xl text-[#52525B] font-light leading-relaxed">
              <p>
                Founded on the rooftops of Nairobi, Radiicato is an ongoing study in non-conformity, architectural silhouettes, and raw underground craftsmanship. We reject fast-fashion dilution in favor of heavyweight 280 GSM combed organic cotton, hand-finished 3D liquid chrome metallic badges, and subversive graphics made for young Kenyans.
              </p>
              <p>
                Every stitch, collar ribbing, and pigment wash is engineered right here in Kenya to outlast seasons and deliver undeniable quiet confidence on every street.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-[#E5E5E5] text-xs font-mono">
              <div className="p-4 bg-[#FAFAF9] border border-[#E5E5E5]">
                <span className="text-[#A1A1AA] block text-[10px]">ORIGIN</span>
                <span className="font-black text-black text-xs sm:text-sm">NAIROBI, KENYA</span>
              </div>
              <div className="p-4 bg-[#FAFAF9] border border-[#E5E5E5]">
                <span className="text-[#A1A1AA] block text-[10px]">PHILOSOPHY</span>
                <span className="font-black text-black text-xs sm:text-sm">100% UNAPOLOGETIC</span>
              </div>
              <div className="p-4 bg-[#FAFAF9] border border-[#E5E5E5] col-span-2 sm:col-span-1">
                <span className="text-[#A1A1AA] block text-[10px]">STANDARDS</span>
                <span className="font-black text-[#4D5936] text-xs sm:text-sm">280 GSM ATELIER</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                href="/about"
                className="bg-[#0A0A0A] text-white hover:bg-[#27272A] transition-all px-8 py-4 text-xs font-bold tracking-[0.2em] uppercase flex items-center justify-center gap-3 shadow-md group"
              >
                <span>READ OUR FULL STORY &amp; MANIFESTO</span>
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/shop"
                className="bg-white border-2 border-black text-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white transition-all px-8 py-4 text-xs font-bold tracking-[0.2em] uppercase text-center shadow-sm"
              >
                SHOP THE ARCHIVE
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      <LookbookModal
        items={lookbook}
        selectedIndex={selectedLookbookIndex}
        isOpen={lookbookModalOpen}
        onClose={() => setLookbookModalOpen(false)}
        onSelectIndex={setSelectedLookbookIndex}
      />

    </div>
  );
}
