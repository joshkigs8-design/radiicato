'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowRight, ArrowDown, Clock, Bell, Check, Star, 
  ShoppingBag, Shield, Truck, Zap, Sparkles, Layers, Eye,
  Camera, Flame, Crosshair, ChevronRight, SlidersHorizontal
} from 'lucide-react';
import { useStore } from '@/lib/use-store';
import { LookbookModal } from '@/components/lookbook/LookbookModal';
import { formatKES } from '@/lib/utils';
import { Size } from '@/types';

export default function HomePage() {
  const { products, collections, lookbook, reviews, addToCart } = useStore();
  const [lookbookModalOpen, setLookbookModalOpen] = useState(false);
  const [selectedLookbookIndex, setSelectedLookbookIndex] = useState(0);

  // The Three Official Products
  const brokenRecordProduct = products.find((p) => p.slug === 'broken-record-heavyweight-tee');
  const weAreWhoWeAreProduct = products.find((p) => p.slug === 'we-are-who-we-are-boxy-tee');
  const skullCapProduct = products.find((p) => p.slug === 'radiicato-heavyweight-ribbed-knit-skull-cap') || products.find((p) => p.id === 'prod-skull-cap-teaser');

  // Interactive View Switchers for the Two Showcase Tees
  const [brokenRecordView, setBrokenRecordView] = useState<'front' | 'back' | 'full'>('front');
  const [weAreWhoWeAreView, setWeAreWhoWeAreView] = useState<'front' | 'back' | 'full'>('front');

  // In-Card Size Selectors for Tees
  const [brokenRecordSize, setBrokenRecordSize] = useState<Size>('L');
  const [weAreWhoWeAreSize, setWeAreWhoWeAreSize] = useState<Size>('L');

  // Interactive Colorway Switcher for the Launched Skull Caps
  // 'black' | 'grey' | 'camo'
  const [selectedCapColor, setSelectedCapColor] = useState<'black' | 'grey' | 'camo'>('black');

  // Quick Add Toast feedback
  const [quickAddedId, setQuickAddedId] = useState<string | null>(null);

  // Atelier Newsletter Subscription State
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const handleNewsletterSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    try {
      localStorage.setItem('rad_newsletter_email', newsletterEmail.trim());
    } catch {}
    setNewsletterSubscribed(true);
    setNewsletterEmail('');
  };

  // Quick Add Tee to Cart Handler
  const handleQuickAddTee = (
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

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('open-cart'));
    }
  };

  // Quick Add Skull Cap to Cart Handler (by selected colorway)
  const handleQuickAddSkullCap = () => {
    if (!skullCapProduct) return;

    let targetVariant = skullCapProduct.variants[0];
    let targetImage = skullCapProduct.images[0]?.url || '/images/products/radiicato-skull-cap-black.jpg';

    if (selectedCapColor === 'black') {
      targetVariant = skullCapProduct.variants.find((v) => v.colorName.toLowerCase().includes('black')) || skullCapProduct.variants[0];
      targetImage = '/images/products/radiicato-skull-cap-black.jpg';
    } else if (selectedCapColor === 'grey') {
      targetVariant = skullCapProduct.variants.find((v) => v.colorName.toLowerCase().includes('grey')) || skullCapProduct.variants[1] || skullCapProduct.variants[0];
      targetImage = '/images/products/radiicato-skull-cap-grey.jpg';
    } else if (selectedCapColor === 'camo') {
      targetVariant = skullCapProduct.variants.find((v) => v.colorName.toLowerCase().includes('camo')) || skullCapProduct.variants[2] || skullCapProduct.variants[0];
      targetImage = '/images/products/radiicato-skull-cap-camo.jpg';
    }

    addToCart({
      productId: skullCapProduct.id,
      variantId: targetVariant?.id || 'v-sc-blk',
      name: skullCapProduct.name,
      slug: skullCapProduct.slug,
      image: targetImage,
      price: skullCapProduct.salePrice || skullCapProduct.price || 500,
      colorName: targetVariant?.colorName || 'Onyx Black',
      colorHex: targetVariant?.colorHex || '#0A0A0A',
      size: 'ONE SIZE',
      quantity: 1,
      maxStock: targetVariant?.stockQuantity || 40,
    });

    setQuickAddedId(skullCapProduct.id);
    setTimeout(() => setQuickAddedId(null), 2500);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('open-cart'));
    }
  };

  const handleOpenLookbook = (index: number) => {
    setSelectedLookbookIndex(index);
    setLookbookModalOpen(true);
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

  // Cap Image & Metadata Mapping by Selected Colorway
  const getCapDisplayData = () => {
    switch (selectedCapColor) {
      case 'black':
        return {
          image: '/images/products/radiicato-skull-cap-black.jpg',
          name: 'Onyx Black // White 3D Script Insignia',
          badge: 'MONOCHROME CLASSIC',
          stock: '45 PIECES AVAILABLE',
          sku: 'RAD-CAP-SKULL-BLK',
          accent: 'border-white text-white',
          description: 'Deep carbon double-layered dense knit finished with the iconic high-density raised white Radiicato script logo across the turned cuff.',
        };
      case 'grey':
        return {
          image: '/images/products/radiicato-skull-cap-grey.jpg',
          name: 'Slate Grey // White 3D Script Insignia',
          badge: 'ATELIER HEATHER',
          stock: '35 PIECES AVAILABLE',
          sku: 'RAD-CAP-SKULL-GRY',
          accent: 'border-zinc-400 text-zinc-300',
          description: 'Muted slate heather tone offering a crisp contrast against the high-definition embroidered signature insignia. Clean architectural fit.',
        };
      case 'camo':
        return {
          image: '/images/products/radiicato-skull-cap-camo.jpg',
          name: 'Midnight Blue Camo // Chrome Liquid Insignia',
          badge: 'TACTICAL CAMO',
          stock: '25 PIECES AVAILABLE',
          sku: 'RAD-CAP-SKULL-CMO',
          accent: 'border-[#4D5936] text-[#A3BE75]',
          description: 'Subdued organic blue-grey camo pattern accented with the exclusive metallic chrome high-frequency script insignia badge on the brim.',
        };
    }
  };

  const capData = getCapDisplayData();
  const availableSizes: Size[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  return (
    <div className="bg-[#080808] text-[#EDEDED] selection:bg-[#4D5936] selection:text-white min-h-screen relative overflow-x-hidden">
      
      {/* Ambient Cinematic Atmospheric Backdrop */}
      <div 
        className="fixed inset-0 opacity-[0.035] pointer-events-none z-0"
        style={{
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: '64px 64px'
        }}
      />
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[48rem] h-[48rem] bg-[#4D5936]/10 rounded-full blur-[160px] pointer-events-none z-0" />
      <div className="fixed bottom-1/4 right-1/4 w-[36rem] h-[36rem] bg-white/[0.02] rounded-full blur-[140px] pointer-events-none z-0" />

      {/* =========================================================================
          1. CINEMATIC ATELIER MONOLITH HERO
          ========================================================================= */}
      <section className="relative min-h-[94vh] sm:min-h-screen flex items-end pb-14 sm:pb-24 pt-36 sm:pt-48 px-6 sm:px-12 border-b border-[#1F1F23] overflow-hidden z-10">
        {/* Subtle Watermark Typography */}
        <div className="absolute top-1/4 right-0 select-none pointer-events-none opacity-[0.025] text-[30vw] font-black tracking-tighter leading-none font-display text-white">
          RAD
        </div>

        {/* Cinematic Film Crop Markers */}
        <div className="absolute top-24 left-6 sm:left-12 font-mono text-[9px] text-[#52525B] tracking-widest uppercase flex items-center gap-3 select-none">
          <span className="inline-block w-2 h-2 border-t border-l border-zinc-500" />
          <span>SCENE 01 // 35MM FULL FRAME</span>
          <span>•</span>
          <span>01°16&apos;S 36°49&apos;E // NAIROBI</span>
        </div>
        <div className="absolute top-24 right-6 sm:right-12 font-mono text-[9px] text-[#52525B] tracking-widest uppercase hidden md:flex items-center gap-3 select-none">
          <span className="text-[#A3BE75] font-bold">● REC [24 FPS]</span>
          <span className="inline-block w-2 h-2 border-t border-r border-zinc-500" />
        </div>

        <div className="relative z-10 max-w-[1600px] w-full mx-auto">
          <div className="max-w-4xl space-y-7">
            
            {/* Atelier Status Ribbon */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 bg-[#121214] border border-[#27272A] rounded-full text-xs font-mono tracking-widest uppercase text-[#A1A1AA] shadow-xl backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-[#A3BE75] animate-pulse" />
              <span className="font-extrabold text-white">NAIROBI ATELIER</span>
              <span className="text-zinc-600">•</span>
              <span className="text-zinc-300">3 LIVE CAPSULES</span>
              <span className="text-zinc-600">•</span>
              <span className="text-[#A3BE75] font-extrabold flex items-center gap-1">
                <Flame size={12} /> SKULL CAPS NOW LIVE
              </span>
            </div>

            {/* Monumental Headline */}
            <h1 className="text-5xl sm:text-7xl lg:text-9xl font-black uppercase tracking-tight leading-[0.88] text-white font-display select-none">
              WEAR THE<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-[#A3BE75]/80">
                DIFFERENCE.
              </span>
            </h1>

            {/* Narrative Manifesto Copy */}
            <p className="text-base sm:text-xl text-[#A1A1AA] max-w-2xl font-light tracking-wide leading-relaxed">
              Engineered in Nairobi for those who refuse to conform. Heavyweight 280 GSM combed cottons, liquid chrome badges, and the newly launched signature 3D skull cap series.
            </p>

            {/* Direct Triple Capsule CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <a
                href="#skull-caps-launch"
                className="bg-[#4D5936] hover:bg-[#3D472B] text-white transition-all px-8 py-4 text-xs font-bold tracking-[0.2em] uppercase flex items-center justify-center gap-3 group shadow-lg shadow-[#4D5936]/20 border border-[#A3BE75]/30"
              >
                <Flame size={15} className="text-[#A3BE75]" />
                <span>SKULL CAPS (NOW LIVE)</span>
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
              </a>

              <Link
                href="/collections/broken-record"
                className="bg-[#18181B] hover:bg-[#27272A] border border-[#27272A] text-white transition-all px-7 py-4 text-xs font-bold tracking-[0.18em] uppercase text-center"
              >
                BROKEN RECORD (WHITE)
              </Link>
              
              <Link
                href="/collections/we-are-who-we-are"
                className="bg-[#18181B] hover:bg-[#27272A] border border-[#27272A] text-white transition-all px-7 py-4 text-xs font-bold tracking-[0.18em] uppercase text-center"
              >
                WE ARE WHO WE ARE (BLACK)
              </Link>
            </div>
          </div>

          {/* Technical Telemetry Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12 text-[11px] font-mono tracking-widest text-[#71717A] uppercase border-t border-[#1F1F23] mt-14">
            <div>
              <span className="text-[#52525B] block text-[10px]">WEIGHT SPECIFICATION</span>
              <span className="font-bold text-white text-xs">280 GSM COMBED FLEECE</span>
            </div>
            <div>
              <span className="text-[#52525B] block text-[10px]">CAPSULE 03 STATUS</span>
              <span className="font-bold text-[#A3BE75] text-xs">SKULL CAPS IN STOCK</span>
            </div>
            <div>
              <span className="text-[#52525B] block text-[10px]">KENYA LOGISTICS</span>
              <span className="font-bold text-white text-xs">FARGO, G4S &amp; BODA</span>
            </div>
            <div>
              <span className="text-[#52525B] block text-[10px]">INSTANT CHECKOUT</span>
              <span className="font-bold text-white text-xs">M-PESA STK PUSH LIVE</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. RUNNING EDITORIAL MARQUEE TICKER
          ========================================================================= */}
      <div className="py-3 bg-[#0D0D0F] border-b border-[#1F1F23] overflow-hidden whitespace-nowrap select-none font-mono text-[11px] tracking-[0.25em] text-[#71717A] uppercase">
        <div className="inline-flex gap-8 items-center animate-[marquee_25s_linear_infinite]">
          <span>RADIICATO ATELIER NAIROBI</span>
          <span className="text-[#4D5936] font-bold">✦</span>
          <span>CAPSULE 03 SKULL CAPS NOW LIVE</span>
          <span className="text-[#4D5936] font-bold">✦</span>
          <span>ONYX BLACK • SLATE GREY • MIDNIGHT CAMO</span>
          <span className="text-[#4D5936] font-bold">✦</span>
          <span>280 GSM HEAVYWEIGHT COMBED COTTONS</span>
          <span className="text-[#4D5936] font-bold">✦</span>
          <span>3D METALLIC EMBLEMS</span>
          <span className="text-[#4D5936] font-bold">✦</span>
          <span>SAME-DAY NAIROBI DISPATCH</span>
          <span className="text-[#4D5936] font-bold">✦</span>
          <span>RADIICATO ATELIER NAIROBI</span>
          <span className="text-[#4D5936] font-bold">✦</span>
          <span>CAPSULE 03 SKULL CAPS NOW LIVE</span>
          <span className="text-[#4D5936] font-bold">✦</span>
          <span>ONYX BLACK • SLATE GREY • MIDNIGHT CAMO</span>
        </div>
      </div>

      {/* =========================================================================
          3. CAPSULE 03 CINEMATIC SHOWCASE — SKULL CAPS NOW LIVE
          ========================================================================= */}
      <section id="skull-caps-launch" className="py-24 sm:py-36 px-6 sm:px-12 max-w-[1600px] mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between md:items-end pb-8 mb-12 border-b border-[#1F1F23] gap-4">
          <div className="space-y-2">
            <span className="text-xs sm:text-sm font-mono tracking-[0.35em] uppercase text-[#A3BE75] font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#A3BE75] animate-ping" />
              CAPSULE 03 // OFFICIAL RELEASE // NOW LIVE
            </span>
            <h2 className="text-4xl sm:text-6xl lg:text-8xl font-black uppercase tracking-tight text-white font-display">
              THE SKULL CAPS
            </h2>
          </div>
          <div className="text-left md:text-right font-mono space-y-1">
            <span className="text-xs font-bold text-white bg-[#18181B] px-3 py-1 border border-[#27272A] rounded">
              RETAIL: KES 500 • IN STOCK
            </span>
            <p className="text-[10px] text-[#71717A] uppercase tracking-wider">
              3 EXCLUSIVE COLORWAYS // ALLOCATED BATCH
            </p>
          </div>
        </div>

        {/* Widescreen Cinematic Product Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center bg-[#0E0E10] border border-[#27272A] p-6 sm:p-12 rounded-2xl relative overflow-hidden shadow-2xl shadow-black/80">
          
          {/* Subtle Stage Ambient Glow */}
          <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#4D5936]/15 rounded-full blur-[140px] pointer-events-none" />

          {/* Left Column: High-Res Cinematic Image Frame */}
          <div className="lg:col-span-7 relative aspect-square sm:aspect-[4/3] bg-[#141416] border border-[#27272A] rounded-xl overflow-hidden group">
            <Image
              src={capData.image}
              alt={capData.name}
              fill
              priority
              className="object-contain p-6 sm:p-12 transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 55vw"
            />

            {/* Corner Viewfinder Crop Marks */}
            <div className="absolute top-4 left-4 font-mono text-[9px] text-zinc-500 tracking-widest uppercase flex items-center gap-2">
              <span className="inline-block w-2.5 h-2.5 border-t border-l border-zinc-400" />
              <span>FRAME: CAP-03</span>
            </div>
            <div className="absolute top-4 right-4 font-mono text-[9px] text-zinc-500 tracking-widest uppercase">
              <span className="inline-block w-2.5 h-2.5 border-t border-r border-zinc-400" />
            </div>
            <div className="absolute bottom-4 left-4 font-mono text-[9px] text-zinc-500 tracking-widest uppercase">
              <span className="inline-block w-2.5 h-2.5 border-b border-l border-zinc-400" />
            </div>
            <div className="absolute bottom-4 right-4 font-mono text-[9px] text-zinc-500 tracking-widest uppercase">
              <span className="inline-block w-2.5 h-2.5 border-b border-r border-zinc-400" />
            </div>

            {/* Floating Live Badge */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-[#0A0A0A]/90 backdrop-blur-md border border-[#27272A] text-white text-[10px] font-mono tracking-widest uppercase px-3 py-1 font-bold rounded">
              {capData.badge}
            </div>

            {/* Price Tag Overlay */}
            <div className="absolute bottom-4 right-6 bg-[#4D5936] text-white text-xs font-mono tracking-widest font-black px-3.5 py-1.5 rounded shadow-lg">
              KES 500
            </div>
          </div>

          {/* Right Column: Narrative, Color Selector & 1-Click Purchase */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 bg-[#4D5936]/20 text-[#A3BE75] border border-[#4D5936]/40 rounded font-bold uppercase tracking-wider">
                  NOW LIVE IN ATELIER
                </span>
                <span className="text-[10px] font-mono text-[#71717A]">
                  SKU: {capData.sku}
                </span>
              </div>

              <h3 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white font-display">
                {capData.name}
              </h3>

              <p className="text-xs sm:text-sm text-[#A1A1AA] font-light leading-relaxed pt-1">
                {capData.description}
              </p>
            </div>

            {/* Interactive Colorway Selector */}
            <div className="space-y-3 pt-2">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#71717A] block font-bold">
                SELECT COLORWAY:
              </span>
              <div className="grid grid-cols-3 gap-2.5">
                
                {/* 1. Onyx Black */}
                <button
                  type="button"
                  onClick={() => setSelectedCapColor('black')}
                  className={`p-3 rounded-lg border text-left transition-all flex flex-col justify-between ${
                    selectedCapColor === 'black'
                      ? 'bg-white/10 border-white shadow-lg text-white ring-1 ring-white'
                      : 'bg-[#18181B] border-[#27272A] text-[#71717A] hover:border-zinc-500'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="w-3.5 h-3.5 rounded-full bg-[#0A0A0A] border border-zinc-600 inline-block" />
                    {selectedCapColor === 'black' && <Check size={12} className="text-white" />}
                  </div>
                  <span className="text-[11px] font-bold font-mono uppercase tracking-wider block">
                    ONYX BLACK
                  </span>
                  <span className="text-[9px] text-[#A1A1AA] font-mono">White 3D Logo</span>
                </button>

                {/* 2. Slate Grey */}
                <button
                  type="button"
                  onClick={() => setSelectedCapColor('grey')}
                  className={`p-3 rounded-lg border text-left transition-all flex flex-col justify-between ${
                    selectedCapColor === 'grey'
                      ? 'bg-white/10 border-white shadow-lg text-white ring-1 ring-white'
                      : 'bg-[#18181B] border-[#27272A] text-[#71717A] hover:border-zinc-500'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="w-3.5 h-3.5 rounded-full bg-[#6B7280] border border-zinc-500 inline-block" />
                    {selectedCapColor === 'grey' && <Check size={12} className="text-white" />}
                  </div>
                  <span className="text-[11px] font-bold font-mono uppercase tracking-wider block">
                    SLATE GREY
                  </span>
                  <span className="text-[9px] text-[#A1A1AA] font-mono">White 3D Logo</span>
                </button>

                {/* 3. Midnight Blue Camo */}
                <button
                  type="button"
                  onClick={() => setSelectedCapColor('camo')}
                  className={`p-3 rounded-lg border text-left transition-all flex flex-col justify-between ${
                    selectedCapColor === 'camo'
                      ? 'bg-white/10 border-[#A3BE75] shadow-lg text-white ring-1 ring-[#A3BE75]'
                      : 'bg-[#18181B] border-[#27272A] text-[#71717A] hover:border-zinc-500'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="w-3.5 h-3.5 rounded-full bg-[#2B3A4A] border border-[#4D5936] inline-block" />
                    {selectedCapColor === 'camo' && <Check size={12} className="text-[#A3BE75]" />}
                  </div>
                  <span className="text-[11px] font-bold font-mono uppercase tracking-wider block">
                    NIGHT CAMO
                  </span>
                  <span className="text-[9px] text-[#A3BE75] font-mono">Chrome Badge</span>
                </button>
              </div>
            </div>

            {/* Technical Garment Specs */}
            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono p-3.5 bg-[#141416] border border-[#27272A] rounded-lg text-[#A1A1AA]">
              <div>
                <span className="text-[#52525B] block">FABRICATION</span>
                <span className="text-white font-bold">Double-Layered Dense Knit</span>
              </div>
              <div>
                <span className="text-[#52525B] block">SIZING</span>
                <span className="text-white font-bold">Contoured Low-Profile (Unisex)</span>
              </div>
              <div className="pt-2 border-t border-[#27272A]">
                <span className="text-[#52525B] block">EMBLEM</span>
                <span className="text-white font-bold">3D Raised Script Insignia</span>
              </div>
              <div className="pt-2 border-t border-[#27272A]">
                <span className="text-[#52525B] block">KENYA DELIVERY</span>
                <span className="text-[#A3BE75] font-bold">Same-Day / Next-Day</span>
              </div>
            </div>

            {/* Direct Add to Bag CTA */}
            <div className="space-y-2.5 pt-2">
              <button
                type="button"
                onClick={handleQuickAddSkullCap}
                className="w-full py-4 bg-[#4D5936] hover:bg-[#3D472B] text-white text-xs font-bold tracking-[0.2em] uppercase transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#4D5936]/25 rounded-lg border border-[#A3BE75]/30 group"
              >
                <ShoppingBag size={16} />
                <span>
                  {quickAddedId === skullCapProduct?.id
                    ? 'ADDED TO SHOPPING BAG' 
                    : `ADD TO BAG — KES 500 (${selectedCapColor.toUpperCase()})`}
                </span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="flex items-center justify-between text-xs pt-1">
                <Link
                  href="/collections/skull-caps"
                  className="text-xs text-[#A3BE75] hover:underline font-mono uppercase tracking-wider"
                >
                  View Full Skull Cap Collection &rarr;
                </Link>
                <span className="text-[10px] font-mono text-[#71717A]">
                  M-PESA / CARDS ACCEPTED
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          4. THE TWO SIGNATURE TEES RUNWAY SHOWCASE
          ========================================================================= */}
      <section id="collections" className="py-24 sm:py-36 px-6 sm:px-12 max-w-[1600px] mx-auto border-t border-[#1F1F23]">
        <div className="flex flex-col md:flex-row justify-between md:items-end pb-8 mb-12 border-b border-[#1F1F23] gap-4">
          <div className="space-y-2">
            <span className="text-xs sm:text-sm font-mono tracking-[0.35em] uppercase text-[#4D5936] font-bold block">
              CAPSULE 01 &amp; CAPSULE 02 // 280 GSM FLEECE
            </span>
            <h2 className="text-4xl sm:text-6xl lg:text-8xl font-black uppercase tracking-tight text-white font-display">
              THE SIGNATURE TEES
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
          <div className="bg-[#101012] border border-[#27272A] p-6 sm:p-10 flex flex-col justify-between transition-all hover:border-zinc-500 rounded-2xl shadow-xl shadow-black/60">
            <div>
              {/* Capsule Meta Header */}
              <div className="flex items-center justify-between pb-6 border-b border-[#27272A]">
                <div>
                  <span className="text-[10px] font-mono tracking-[0.25em] text-[#A3BE75] uppercase font-bold block">
                    CAPSULE 01 // WHITE ATELIER
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white font-display mt-0.5">
                    BROKEN RECORD
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-sm sm:text-base font-bold font-mono text-white block">
                    {formatKES(1000)}
                  </span>
                  <span className="text-[10px] font-mono text-[#A3BE75] font-bold uppercase">
                    IN STOCK
                  </span>
                </div>
              </div>

              {/* View Switcher Controls */}
              <div className="flex items-center justify-between pt-5 pb-3">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#71717A]">
                  SELECT VIEW:
                </span>
                <div className="flex gap-1 bg-[#18181B] p-1 rounded border border-[#27272A]">
                  <button
                    onClick={() => setBrokenRecordView('front')}
                    className={`px-3 py-1 text-[10px] font-mono uppercase font-bold transition-all rounded ${
                      brokenRecordView === 'front' 
                        ? 'bg-[#4D5936] text-white shadow-xs' 
                        : 'text-[#71717A] hover:text-white'
                    }`}
                  >
                    FRONT (3D CHROME)
                  </button>
                  <button
                    onClick={() => setBrokenRecordView('back')}
                    className={`px-3 py-1 text-[10px] font-mono uppercase font-bold transition-all rounded ${
                      brokenRecordView === 'back' 
                        ? 'bg-[#4D5936] text-white shadow-xs' 
                        : 'text-[#71717A] hover:text-white'
                    }`}
                  >
                    BACK (DOOM VINYL)
                  </button>
                  <button
                    onClick={() => setBrokenRecordView('full')}
                    className={`px-3 py-1 text-[10px] font-mono uppercase font-bold transition-all rounded ${
                      brokenRecordView === 'full' 
                        ? 'bg-[#4D5936] text-white shadow-xs' 
                        : 'text-[#71717A] hover:text-white'
                    }`}
                  >
                    DETAIL
                  </button>
                </div>
              </div>

              {/* Garment Visual Frame */}
              <div className="relative aspect-square sm:aspect-[4/3] w-full bg-[#18181B] overflow-hidden border border-[#27272A] rounded-xl group my-4">
                <Image
                  src={getBrokenRecordImage()}
                  alt="Radiicato Broken Record White Heavyweight Tee"
                  fill
                  priority
                  className="object-contain p-4 sm:p-8 transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute bottom-3 left-3 bg-[#0A0A0A]/90 backdrop-blur-md px-2.5 py-1 text-[10px] font-mono text-[#A1A1AA] uppercase border border-[#27272A] rounded">
                  {brokenRecordView === 'front' && 'VIEW 01 // 3D CHROME OVAL BADGE'}
                  {brokenRecordView === 'back' && 'VIEW 02 // SHATTERED MF DOOM VINYL REVERSE'}
                  {brokenRecordView === 'full' && 'VIEW 03 // ARCHITECTURAL FLAT-LAY'}
                </div>
              </div>

              {/* Narrative & Fabric Details */}
              <p className="text-xs sm:text-sm text-[#A1A1AA] font-light leading-relaxed pt-2">
                Heavyweight 280 GSM crisp white streetwear tee. Features the signature 3D liquid chrome metallic oval badge on the front chest and the shattered MF DOOM vinyl record tracklist across the back.
              </p>

              {/* In-Card Size Selector */}
              <div className="pt-6 space-y-2">
                <div className="flex justify-between items-center text-[11px] font-mono">
                  <span className="text-[#71717A] uppercase font-bold">SELECT ATELIER SIZE:</span>
                  <Link href="/faq" className="text-[#A3BE75] hover:underline">SIZE GUIDE (BOXY FIT)</Link>
                </div>
                <div className="grid grid-cols-6 gap-1.5">
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setBrokenRecordSize(size)}
                      className={`py-2 text-xs font-mono font-bold uppercase transition-all rounded ${
                        brokenRecordSize === size
                          ? 'bg-white text-black ring-1 ring-white shadow-xs'
                          : 'bg-[#18181B] text-[#71717A] border border-[#27272A] hover:text-white'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Interactive Buy & Explore Actions */}
            <div className="space-y-3 pt-6 border-t border-[#27272A] mt-6">
              <button
                onClick={() => handleQuickAddTee(brokenRecordProduct, brokenRecordSize)}
                className="w-full py-4 bg-white hover:bg-zinc-200 text-black text-xs font-bold tracking-[0.2em] uppercase transition-all flex items-center justify-center gap-2 rounded-lg shadow-sm"
              >
                <ShoppingBag size={15} />
                <span>
                  {quickAddedId === brokenRecordProduct?.id ? 'ADDED TO BAG' : `ADD TO BAG (${brokenRecordSize}) — KES 1,000`}
                </span>
              </button>
              <Link
                href="/collections/broken-record"
                className="block text-center py-3 bg-[#18181B] hover:bg-[#27272A] border border-[#27272A] text-xs font-bold tracking-[0.15em] uppercase text-white transition-colors rounded-lg"
              >
                EXPLORE BROKEN RECORD CAPSULE &rarr;
              </Link>
            </div>
          </div>

          {/* -------------------------------------------------------------
              COLLECTION 02: WE ARE WHO WE ARE (BLACK ATELIER)
              ------------------------------------------------------------- */}
          <div className="bg-[#101012] border border-[#27272A] p-6 sm:p-10 flex flex-col justify-between transition-all hover:border-zinc-500 rounded-2xl shadow-xl shadow-black/60">
            <div>
              {/* Capsule Meta Header */}
              <div className="flex items-center justify-between pb-6 border-b border-[#27272A]">
                <div>
                  <span className="text-[10px] font-mono tracking-[0.25em] text-[#A3BE75] uppercase font-bold block">
                    CAPSULE 02 // BLACK ATELIER
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white font-display mt-0.5">
                    WE ARE WHO WE ARE
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-sm sm:text-base font-bold font-mono text-white block">
                    {formatKES(800)}
                  </span>
                  <span className="text-[10px] font-mono text-[#A3BE75] font-bold uppercase">
                    IN STOCK
                  </span>
                </div>
              </div>

              {/* View Switcher Controls */}
              <div className="flex items-center justify-between pt-5 pb-3">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#71717A]">
                  SELECT VIEW:
                </span>
                <div className="flex gap-1 bg-[#18181B] p-1 rounded border border-[#27272A]">
                  <button
                    onClick={() => setWeAreWhoWeAreView('front')}
                    className={`px-3 py-1 text-[10px] font-mono uppercase font-bold transition-all rounded ${
                      weAreWhoWeAreView === 'front' 
                        ? 'bg-[#4D5936] text-white shadow-xs' 
                        : 'text-[#71717A] hover:text-white'
                    }`}
                  >
                    FRONT (MASCOT)
                  </button>
                  <button
                    onClick={() => setWeAreWhoWeAreView('back')}
                    className={`px-3 py-1 text-[10px] font-mono uppercase font-bold transition-all rounded ${
                      weAreWhoWeAreView === 'back' 
                        ? 'bg-[#4D5936] text-white shadow-xs' 
                        : 'text-[#71717A] hover:text-white'
                    }`}
                  >
                    BACK (WWWRR COLLAGE)
                  </button>
                  <button
                    onClick={() => setWeAreWhoWeAreView('full')}
                    className={`px-3 py-1 text-[10px] font-mono uppercase font-bold transition-all rounded ${
                      weAreWhoWeAreView === 'full' 
                        ? 'bg-[#4D5936] text-white shadow-xs' 
                        : 'text-[#71717A] hover:text-white'
                    }`}
                  >
                    DETAIL
                  </button>
                </div>
              </div>

              {/* Garment Visual Frame */}
              <div className="relative aspect-square sm:aspect-[4/3] w-full bg-[#18181B] overflow-hidden border border-[#27272A] rounded-xl group my-4">
                <Image
                  src={getWeAreWhoWeAreImage()}
                  alt="Radiicato We Are Who We Are Black Heavyweight Tee"
                  fill
                  priority
                  className="object-contain p-4 sm:p-8 transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute bottom-3 left-3 bg-[#0A0A0A]/90 backdrop-blur-md px-2.5 py-1 text-[10px] font-mono text-[#A1A1AA] uppercase border border-[#27272A] rounded">
                  {weAreWhoWeAreView === 'front' && 'VIEW 01 // STREET MASCOT & GRAFFITI TAG'}
                  {weAreWhoWeAreView === 'back' && 'VIEW 02 // "W W W R R" PAPER COLLAGE'}
                  {weAreWhoWeAreView === 'full' && 'VIEW 03 // ARCHITECTURAL FLAT-LAY'}
                </div>
              </div>

              {/* Narrative & Fabric Details */}
              <p className="text-xs sm:text-sm text-[#A1A1AA] font-light leading-relaxed pt-2">
                Heavyweight 280 GSM washed carbon black boxy tee. Features the raw graffiti mascot on the chest and the subversive torn-paper "We Are Who We Are" typographic collage across the shoulders.
              </p>

              {/* In-Card Size Selector */}
              <div className="pt-6 space-y-2">
                <div className="flex justify-between items-center text-[11px] font-mono">
                  <span className="text-[#71717A] uppercase font-bold">SELECT ATELIER SIZE:</span>
                  <Link href="/faq" className="text-[#A3BE75] hover:underline">SIZE GUIDE (BOXY FIT)</Link>
                </div>
                <div className="grid grid-cols-6 gap-1.5">
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setWeAreWhoWeAreSize(size)}
                      className={`py-2 text-xs font-mono font-bold uppercase transition-all rounded ${
                        weAreWhoWeAreSize === size
                          ? 'bg-white text-black ring-1 ring-white shadow-xs'
                          : 'bg-[#18181B] text-[#71717A] border border-[#27272A] hover:text-white'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Interactive Buy & Explore Actions */}
            <div className="space-y-3 pt-6 border-t border-[#27272A] mt-6">
              <button
                onClick={() => handleQuickAddTee(weAreWhoWeAreProduct, weAreWhoWeAreSize)}
                className="w-full py-4 bg-white hover:bg-zinc-200 text-black text-xs font-bold tracking-[0.2em] uppercase transition-all flex items-center justify-center gap-2 rounded-lg shadow-sm"
              >
                <ShoppingBag size={15} />
                <span>
                  {quickAddedId === weAreWhoWeAreProduct?.id ? 'ADDED TO BAG' : `ADD TO BAG (${weAreWhoWeAreSize}) — KES 800`}
                </span>
              </button>
              <Link
                href="/collections/we-are-who-we-are"
                className="block text-center py-3 bg-[#18181B] hover:bg-[#27272A] border border-[#27272A] text-xs font-bold tracking-[0.15em] uppercase text-white transition-colors rounded-lg"
              >
                EXPLORE WE ARE WHO WE ARE CAPSULE &rarr;
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          5. CRAFTSMANSHIP & MACRO ANATOMY (4 MACRO DETAILS)
          ========================================================================= */}
      <section className="py-24 sm:py-36 px-6 sm:px-12 max-w-[1600px] mx-auto border-t border-[#1F1F23]">
        <div className="pb-8 mb-12 border-b border-[#1F1F23] flex flex-col md:flex-row justify-between md:items-end gap-4">
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#A3BE75] font-bold block">
              TEXTILE &amp; METALLIC HARDWARE
            </span>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white font-display">
              GARMENT ANATOMY
            </h2>
          </div>
          <p className="text-xs font-mono text-[#71717A] uppercase">
            INDIVIDUALLY SCREENPRINTED &amp; ASSEMBLED IN NAIROBI
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Detail 1 */}
          <div className="bg-[#121214] border border-[#27272A] p-5 rounded-xl group flex flex-col justify-between hover:border-zinc-500 transition-all">
            <div className="relative aspect-[4/3] w-full bg-[#18181B] overflow-hidden border border-[#27272A] rounded-lg mb-4">
              <Image
                src="/images/products/broken-record-front.jpg"
                alt="Radiicato 3D Chrome Oval Logo Emblem"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 640px) 100vw, 25vw"
              />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-[#A3BE75] font-bold block">
                WHITE CAPSULE — CHEST
              </span>
              <h4 className="text-sm font-bold uppercase tracking-wider text-white mt-1">
                3D Liquid Chrome Emblem
              </h4>
              <p className="text-xs text-[#A1A1AA] mt-2 font-light leading-relaxed">
                High-frequency metallic badge with high-specular chrome sheen and olive green contouring.
              </p>
            </div>
          </div>

          {/* Detail 2 */}
          <div className="bg-[#121214] border border-[#27272A] p-5 rounded-xl group flex flex-col justify-between hover:border-zinc-500 transition-all">
            <div className="relative aspect-[4/3] w-full bg-[#18181B] overflow-hidden border border-[#27272A] rounded-lg mb-4">
              <Image
                src="/images/products/broken-record-back.jpg"
                alt="Shattered MF DOOM Vinyl Record Print"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 640px) 100vw, 25vw"
              />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-[#A3BE75] font-bold block">
                WHITE CAPSULE — REVERSE
              </span>
              <h4 className="text-sm font-bold uppercase tracking-wider text-white mt-1">
                Shattered MF DOOM Vinyl
              </h4>
              <p className="text-xs text-[#A1A1AA] mt-2 font-light leading-relaxed">
                High-density screenprint featuring vinyl record grooves, tracklist titles, and metallic mask medallion.
              </p>
            </div>
          </div>

          {/* Detail 3 */}
          <div className="bg-[#121214] border border-[#27272A] p-5 rounded-xl group flex flex-col justify-between hover:border-zinc-500 transition-all">
            <div className="relative aspect-[4/3] w-full bg-[#18181B] overflow-hidden border border-[#27272A] rounded-lg mb-4">
              <Image
                src="/images/products/we-are-who-we-are-front.jpg"
                alt="Mascot in Bucket Hat and Graffiti"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 640px) 100vw, 25vw"
              />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-[#A3BE75] font-bold block">
                BLACK CAPSULE — CHEST
              </span>
              <h4 className="text-sm font-bold uppercase tracking-wider text-white mt-1">
                Bucket Hat Mascot &amp; Graffiti
              </h4>
              <p className="text-xs text-[#A1A1AA] mt-2 font-light leading-relaxed">
                Hand-rendered Nairobi street mascot in olive bucket hat with raw marker graffiti tag.
              </p>
            </div>
          </div>

          {/* Detail 4 (Featuring the Skull Cap 3D emblem) */}
          <div className="bg-[#121214] border border-[#27272A] p-5 rounded-xl group flex flex-col justify-between hover:border-zinc-500 transition-all">
            <div className="relative aspect-[4/3] w-full bg-[#18181B] overflow-hidden border border-[#27272A] rounded-lg mb-4">
              <Image
                src="/images/products/radiicato-skull-cap-black.jpg"
                alt="Radiicato 3D Raised Script Insignia on Skull Cap Cuff"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 640px) 100vw, 25vw"
              />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-[#A3BE75] font-bold block">
                HEADWEAR CAPSULE — CUFF
              </span>
              <h4 className="text-sm font-bold uppercase tracking-wider text-white mt-1">
                3D Raised Script Insignia
              </h4>
              <p className="text-xs text-[#A1A1AA] mt-2 font-light leading-relaxed">
                High-density 3D script embroidery with crisp relief detailing engineered along the folded cuff brim.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. NAIROBI YOUTH & STREET CULTURE EDITORIAL LOOKBOOK
          ========================================================================= */}
      <section className="py-24 sm:py-36 bg-[#0B0B0D] border-t border-[#1F1F23]">
        <div className="max-w-[1600px] mx-auto px-6 sm:px-12">
          <div className="flex flex-col md:flex-row justify-between md:items-end pb-8 mb-10 border-b border-[#1F1F23] gap-4">
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#A3BE75] font-bold block">
                EDITORIAL ARCHIVE // 2026
              </span>
              <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white font-display">
                NAIROBI LOOKBOOK
              </h2>
            </div>
            <p className="text-xs font-mono text-[#71717A] uppercase">
              CLICK ANY EXHIBIT TO EXPAND FULLSCREEN
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {lookbook.map((item, idx) => (
              <div
                key={item.id}
                onClick={() => handleOpenLookbook(idx)}
                className="group relative aspect-[3/4] bg-[#141416] overflow-hidden border border-[#27272A] rounded-xl cursor-pointer shadow-md hover:border-white transition-all"
              >
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 640px) 50vw, 20vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4 text-white">
                  <span className="text-[9px] font-mono uppercase text-[#A3BE75] font-bold">
                    EXHIBIT 0{idx + 1}
                  </span>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white mt-1 line-clamp-1">
                    {item.title}
                  </h4>
                  <p className="text-[10px] text-zinc-300 mt-0.5 line-clamp-2 font-light">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. GARMENT SPECIFICATIONS MATRIX
          ========================================================================= */}
      <section className="py-24 sm:py-36 px-6 sm:px-12 max-w-[1600px] mx-auto border-t border-[#1F1F23]">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#A3BE75] font-bold block">
              ATELIER STANDARDS
            </span>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white font-display">
              TECHNICAL SPECIFICATIONS
            </h2>
            <p className="text-xs sm:text-sm text-[#A1A1AA] max-w-lg mx-auto font-light">
              We reject cheap mass-production in favor of architectural heavyweight cottons, dense knit ribbing, and artisanal screenprints.
            </p>
          </div>

          <div className="divide-y divide-[#1F1F23] border-y border-[#1F1F23] text-xs font-mono">
            <div className="py-4 flex justify-between items-center">
              <span className="text-[#71717A] uppercase">TEE FABRIC DENSITY</span>
              <span className="font-bold text-white text-right">280 GSM Ring-Spun Combed Cotton</span>
            </div>
            <div className="py-4 flex justify-between items-center">
              <span className="text-[#71717A] uppercase">COLLAR CONSTRUCTION</span>
              <span className="font-bold text-white text-right">1.25" Double-Needle Reinforced Rib (Zero Baconing)</span>
            </div>
            <div className="py-4 flex justify-between items-center">
              <span className="text-[#71717A] uppercase">HEADWEAR FABRICATION</span>
              <span className="font-bold text-white text-right">Double-Layered Heavyweight Stretch-Knit</span>
            </div>
            <div className="py-4 flex justify-between items-center">
              <span className="text-[#71717A] uppercase">SILHOUETTE SPECIFICATION</span>
              <span className="font-bold text-white text-right">Architectural Relaxed Boxy Drop-Shoulder</span>
            </div>
            <div className="py-4 flex justify-between items-center">
              <span className="text-[#71717A] uppercase">HARDWARE &amp; EMBLEMS</span>
              <span className="font-bold text-[#A3BE75] text-right">3D Liquid Chrome Badges &amp; High-Density Script Embroidery</span>
            </div>
            <div className="py-4 flex justify-between items-center">
              <span className="text-[#71717A] uppercase">ORIGIN &amp; DISPATCH</span>
              <span className="font-bold text-white text-right">Engineered &amp; Assembled in Nairobi, Kenya</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          8. VERIFIED COMMUNITY REVIEWS
          ========================================================================= */}
      <section className="py-24 px-6 sm:px-12 max-w-[1600px] mx-auto border-t border-[#1F1F23]">
        <div className="pb-8 mb-10 border-b border-[#1F1F23] flex flex-col sm:flex-row justify-between sm:items-end gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono tracking-widest uppercase text-[#A3BE75] font-bold">
              CUSTOMER SATISFACTION
            </span>
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white font-display">
              KENYAN COMMUNITY FEEDBACK
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#A1A1AA]">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} fill="currentColor" />
              ))}
            </div>
            <span className="font-bold text-white">5.0 / 5.0 VERIFIED STREETWEAR RATING</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.slice(0, 3).map((rev) => (
            <div
              key={rev.id}
              className="p-6 bg-[#121214] border border-[#27272A] rounded-xl flex flex-col justify-between space-y-4 shadow-lg shadow-black/50"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} size={13} fill="currentColor" />
                    ))}
                  </div>
                  <span className="text-[10px] font-mono uppercase bg-[#4D5936]/20 text-[#A3BE75] px-2 py-0.5 rounded font-bold border border-[#4D5936]/40">
                    VERIFIED BUYER
                  </span>
                </div>
                <h4 className="text-sm font-bold uppercase text-white">
                  &ldquo;{rev.title}&rdquo;
                </h4>
                <p className="text-xs text-[#A1A1AA] leading-relaxed font-light">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>

              <div className="pt-3 border-t border-[#1F1F23] flex justify-between items-center text-[11px] font-mono text-[#71717A]">
                <span className="font-semibold text-white">{rev.customerName}</span>
                <span>NAIROBI, KENYA</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          9. OUR STORY — THE NAIROBI MANIFESTO & FOUNDER EXHIBIT
          ========================================================================= */}
      <section id="our-story" className="py-24 sm:py-36 px-6 sm:px-12 max-w-[1600px] mx-auto border-t border-[#1F1F23]">
        {/* Giant Brand Logo Banner */}
        <div className="flex flex-col items-center justify-center text-center pb-16 border-b border-[#1F1F23]">
          <Image
            src="/logo.png"
            alt="RADIICATO"
            width={380}
            height={150}
            className="h-20 sm:h-28 lg:h-36 w-auto object-contain mb-6 transition-transform hover:scale-105 duration-300 invert"
          />
          <span className="text-xs sm:text-sm font-mono tracking-[0.35em] uppercase text-[#A3BE75] font-extrabold block mb-3">
            OUR STORY // NAIROBI ROOFTOP ATELIER
          </span>
          <h2 className="text-4xl sm:text-6xl lg:text-8xl font-black uppercase tracking-tight text-white font-display max-w-5xl leading-[0.92]">
            CRAFTED FOR KENYAN STREET CULTURE.
          </h2>
        </div>

        {/* Two-Column Founder & Narrative Editorial Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 pt-16 items-center">
          {/* Authentic Rooftop Founder Photo */}
          <div className="lg:col-span-5 relative aspect-[3/4] sm:aspect-[4/5] bg-[#121214] overflow-hidden border border-[#27272A] rounded-2xl shadow-2xl shadow-black group">
            <Image
              src="/owner.jpg"
              alt="Radiicato Founder overlooking Nairobi Skyline"
              fill
              className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
              <span className="text-[11px] font-mono tracking-widest uppercase bg-[#4D5936] text-white px-2.5 py-1 font-bold inline-block rounded">
                FOUNDER &amp; CREATIVE DIRECTOR
              </span>
              <p className="text-xs font-mono text-zinc-300 tracking-wider pt-1">
                NAIROBI HQ // SKYLINE ROOFTOP ATELIER
              </p>
              <p className="text-[11px] font-light text-zinc-400 italic">
                &ldquo;We don&apos;t chase international trends &mdash; we define them right here in Nairobi.&rdquo;
              </p>
            </div>
          </div>

          {/* Narrative & Manifesto Copy */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <span className="text-xs font-mono uppercase text-[#A3BE75] font-bold tracking-widest block">
                01 / THE MISSION &amp; HERITAGE
              </span>
              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white font-display leading-tight">
                WE BUILT RADIICATO TO REFUSE THE GENERIC.
              </h3>
            </div>

            <div className="space-y-5 text-base sm:text-xl text-[#A1A1AA] font-light leading-relaxed">
              <p>
                Founded on the rooftops of Nairobi, Radiicato is an ongoing study in non-conformity, architectural silhouettes, and raw underground craftsmanship. We reject fast-fashion dilution in favor of heavyweight 280 GSM combed organic cotton, hand-finished 3D liquid chrome metallic badges, and subversive graphics made for young Kenyans.
              </p>
              <p>
                Every stitch, collar ribbing, and pigment wash is engineered right here in Kenya to outlast seasons and deliver undeniable quiet confidence on every street.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-[#1F1F23] text-xs font-mono">
              <div className="p-4 bg-[#121214] border border-[#27272A] rounded-lg">
                <span className="text-[#71717A] block text-[10px]">ORIGIN</span>
                <span className="font-black text-white text-xs sm:text-sm">NAIROBI, KENYA</span>
              </div>
              <div className="p-4 bg-[#121214] border border-[#27272A] rounded-lg">
                <span className="text-[#71717A] block text-[10px]">PHILOSOPHY</span>
                <span className="font-black text-white text-xs sm:text-sm">100% UNAPOLOGETIC</span>
              </div>
              <div className="p-4 bg-[#121214] border border-[#27272A] rounded-lg col-span-2 sm:col-span-1">
                <span className="text-[#71717A] block text-[10px]">STANDARDS</span>
                <span className="font-black text-[#A3BE75] text-xs sm:text-sm">280 GSM ATELIER</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                href="/about"
                className="bg-white hover:bg-zinc-200 text-black transition-all px-8 py-4 text-xs font-bold tracking-[0.2em] uppercase flex items-center justify-center gap-3 shadow-md rounded-lg group"
              >
                <span>READ OUR FULL STORY &amp; MANIFESTO</span>
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/shop"
                className="bg-[#18181B] hover:bg-[#27272A] border border-[#27272A] text-white transition-all px-8 py-4 text-xs font-bold tracking-[0.2em] uppercase text-center rounded-lg shadow-sm"
              >
                SHOP THE ARCHIVE
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          10. NEWSLETTER / ATELIER PRIVATE ACCESS SECTION
          ========================================================================= */}
      <section className="border-t border-[#1F1F23] bg-[#0E0E10] py-24 px-6 sm:px-12 lg:px-16">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#4D5936]/20 border border-[#4D5936]/40 text-[#A3BE75] text-[10px] font-mono font-bold tracking-widest uppercase rounded-full">
            <Sparkles size={12} />
            <span>ATELIER PRIVATE ACCESS</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white font-display">
            SUBSCRIBE TO THE RADIICATO DISPATCH
          </h2>

          <p className="text-xs sm:text-sm text-[#A1A1AA] max-w-xl mx-auto font-light leading-relaxed">
            Be the first to receive secret capsule passwords, underground drop dates, private lookbooks, and invitations to private Nairobi atelier listening sessions.
          </p>

          <div className="max-w-md mx-auto pt-2">
            {newsletterSubscribed ? (
              <div className="p-4 bg-[#4D5936]/20 border border-[#4D5936]/40 text-xs font-mono text-[#A3BE75] font-bold flex items-center justify-center gap-2 rounded-lg">
                <Check size={16} />
                <span>YOU ARE ON THE PRIVATE DROP LIST. WELCOME TO RADIICATO.</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubscribe} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  required
                  placeholder="ENTER YOUR EMAIL FOR DROP ALERTS"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="flex-1 bg-[#18181B] border border-[#27272A] px-4 py-3.5 text-xs tracking-wider uppercase text-white placeholder-[#71717A] focus:outline-none focus:border-[#4D5936] font-mono shadow-sm rounded-lg"
                />
                <button
                  type="submit"
                  className="bg-[#4D5936] hover:bg-[#3D472B] text-white px-8 py-3.5 text-xs font-bold tracking-widest uppercase transition-colors flex items-center justify-center gap-2 shadow-sm rounded-lg"
                >
                  <span>SUBSCRIBE</span>
                  <ArrowRight size={14} />
                </button>
              </form>
            )}
            <p className="text-[10px] font-mono text-[#71717A] mt-3">
              ZERO SPAM. ONLY PURE ARCHIVAL STREETWEAR DROPS. UNSUBSCRIBE ANYTIME.
            </p>
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
