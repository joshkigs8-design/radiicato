'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, ShoppingBag, Check } from 'lucide-react';
import { useStore } from '@/lib/use-store';
import { LookbookModal } from '@/components/lookbook/LookbookModal';
import { formatKES } from '@/lib/utils';
import { Product, Size } from '@/types';

export default function HomePage() {
  const { products, collections, lookbook, addToCart } = useStore();
  const [lookbookModalOpen, setLookbookModalOpen] = useState(false);
  const [selectedLookbookIndex, setSelectedLookbookIndex] = useState(0);

  // Hover states for product strips
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);

  // Quick added toast feedback
  const [quickAddedId, setQuickAddedId] = useState<string | null>(null);

  // Products by Collection
  const brokenRecordProducts = products.filter(
    (p) => p.collectionId === 'col-broken-record' || p.slug.includes('broken-record')
  ).slice(0, 3);

  const weAreWhoWeAreProducts = products.filter(
    (p) => p.collectionId === 'col-we-are-who-we-are' || p.slug.includes('we-are-who-we-are')
  ).slice(0, 3);

  const skullCapProduct = products.find((p) => p.id === 'prod-skull-cap-teaser') || products[0];

  const handleQuickAdd = (product: Product, selectedSize: Size = 'L') => {
    const variant = product.variants.find((v) => v.size === selectedSize) || product.variants[0];
    const primaryImg = product.images.find((i) => i.isPrimary) || product.images[0];

    addToCart({
      productId: product.id,
      variantId: variant.id,
      name: product.name,
      slug: product.slug,
      image: primaryImg?.url || '',
      price: product.salePrice || product.price,
      colorName: variant.colorName,
      colorHex: variant.colorHex,
      size: selectedSize,
      quantity: 1,
      maxStock: variant.stockQuantity,
    });

    setQuickAddedId(product.id);
    setTimeout(() => setQuickAddedId(null), 2200);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('open-cart'));
    }
  };

  const handleOpenLookbook = (index: number) => {
    setSelectedLookbookIndex(index);
    setLookbookModalOpen(true);
  };

  const motionFadeIn = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-60px' },
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] }
  };

  return (
    <div className="bg-white text-[#0A0A0A] min-h-screen selection:bg-[#0A0A0A] selection:text-white">

      {/* =========================================================================
          01 — FULL-SCREEN OPENING / BRAND STATEMENT
          Purpose: The first 3–5 seconds should establish the brand.
          Full viewport image of a Radiicato model wearing one of the pieces.
          Minimal overlay: RADIICATO / WE ARE WHO WE ARE.
          Bottom nav: SHOP · COLLECTIONS · ABOUT · CONTACT
          Tiny: SCROLL TO EXPLORE ↓
          ========================================================================= */}
      <section className="relative h-screen w-full flex flex-col justify-between items-center px-6 sm:px-12 py-10 overflow-hidden bg-black">
        {/* Full Viewport Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/products/broken-record-front.jpg"
            alt="RADIICATO Streetwear Atelier Model"
            fill
            priority
            className="object-cover object-center brightness-[0.88] contrast-[1.05]"
            sizes="100vw"
          />
          {/* Subtle vignette gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/75" />
        </div>

        {/* Top spacer (navigation sits above) */}
        <div className="relative z-10 w-full pt-8" />

        {/* Minimal Center Overlay: RADIICATO / WE ARE WHO WE ARE. */}
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="text-[clamp(3.5rem,14vw,11rem)] font-black tracking-[-0.06em] leading-[0.85] uppercase text-white drop-shadow-sm"
          >
            RADIICATO
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 text-[11px] sm:text-xs font-mono tracking-[0.24em] uppercase text-white/90 font-medium"
          >
            WE ARE WHO WE ARE.
          </motion.p>
        </div>

        {/* Small Bottom Navigation & Scroll Indicator */}
        <div className="relative z-10 w-full flex flex-col items-center gap-4 text-white">
          <nav className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-[11px] font-mono tracking-[0.2em] uppercase">
            <Link href="/shop" className="hover:opacity-60 transition-opacity">
              SHOP
            </Link>
            <span className="text-white/40">·</span>
            <Link href="/collections" className="hover:opacity-60 transition-opacity">
              COLLECTIONS
            </Link>
            <span className="text-white/40">·</span>
            <Link href="/about" className="hover:opacity-60 transition-opacity">
              ABOUT
            </Link>
            <span className="text-white/40">·</span>
            <Link href="/contact" className="hover:opacity-60 transition-opacity">
              CONTACT
            </Link>
          </nav>

          <div className="flex items-center gap-1.5 text-[9px] font-mono tracking-[0.25em] text-white/70 uppercase pt-2">
            <span>SCROLL TO EXPLORE</span>
            <span className="animate-bounce">↓</span>
          </div>
        </div>
      </section>


      {/* =========================================================================
          02 — BROKEN RECORD (Editorial Collection 01 Introduction)
          Large editorial image dominating the section.
          On one side: BROKEN RECORD / COLLECTION 01 / A repetition worth breaking.
          EXPLORE BROKEN RECORD →
          ========================================================================= */}
      <section id="broken-record" className="relative w-full bg-white py-16 sm:py-24 px-5 sm:px-8 lg:px-12 border-b border-[#E4E4E7]">
        <div className="max-w-[1600px] mx-auto">
          <div className="relative w-full aspect-[4/5] sm:aspect-[16/10] lg:aspect-[21/11] overflow-hidden bg-[#F4F4F5] border border-[#E4E4E7]">
            <Image
              src="/images/broken-record.jpg"
              alt="Radiicato Broken Record Collection 01"
              fill
              className="object-cover object-center filter contrast-[1.02]"
              sizes="100vw"
            />
            {/* Editorial overlay on bottom left */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-6 sm:p-12 lg:p-16">
              <motion.div {...motionFadeIn} className="max-w-xl text-white">
                <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-white/70 block mb-2">
                  COLLECTION 01
                </span>
                <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-[-0.04em] leading-[0.9] mb-4">
                  BROKEN RECORD
                </h2>
                <p className="text-sm sm:text-base font-light text-white/90 mb-6 max-w-md leading-relaxed">
                  A repetition worth breaking.
                </p>
                <Link
                  href="/collections/broken-record"
                  className="inline-flex items-center gap-2 text-xs font-mono tracking-[0.2em] uppercase text-white font-bold hover:opacity-70 transition-opacity border-b border-white pb-1"
                >
                  <span>EXPLORE BROKEN RECORD</span>
                  <ArrowRight size={14} />
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>


      {/* =========================================================================
          03 — BROKEN RECORD PRODUCT STRIP
          Switch from editorial storytelling to shopping.
          Show 3–4 products maximum. Large images.
          BROKEN RECORD
          [ PRODUCT ] [ PRODUCT ] [ PRODUCT ]
          Hovering switches to second image.
          Fashion catalogue aesthetic (sharp corners, no SaaS cards).
          ========================================================================= */}
      <section className="w-full bg-white py-20 px-5 sm:px-8 lg:px-12 border-b border-[#E4E4E7]">
        <div className="max-w-[1600px] mx-auto">
          {/* Header */}
          <div className="flex items-baseline justify-between mb-10 pb-4 border-b border-[#E4E4E7]">
            <h3 className="text-xl sm:text-2xl font-black uppercase tracking-[-0.03em]">
              BROKEN RECORD
            </h3>
            <Link
              href="/collections/broken-record"
              className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#71717A] hover:text-[#0A0A0A] transition-colors"
            >
              SHOP CAPSULE →
            </Link>
          </div>

          {/* Product Strip: 3 Clean Catalogue Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10">
            {brokenRecordProducts.map((product) => {
              const primaryImg = product.images[0]?.url || '/images/products/broken-record-front.jpg';
              const hoverImg = product.images[1]?.url || product.images[0]?.url;
              const isHovered = hoveredProduct === product.id;

              return (
                <div
                  key={product.id}
                  className="group flex flex-col"
                  onMouseEnter={() => setHoveredProduct(product.id)}
                  onMouseLeave={() => setHoveredProduct(null)}
                >
                  {/* Clean Rectangular Image Container */}
                  <Link
                    href={`/product/${product.slug}`}
                    className="relative aspect-[3/4] w-full bg-[#F4F4F5] border border-[#E4E4E7] overflow-hidden block"
                  >
                    <Image
                      src={primaryImg}
                      alt={product.name}
                      fill
                      className={`object-cover object-center transition-all duration-700 ease-out ${
                        isHovered && hoverImg ? 'opacity-0 scale-[1.02]' : 'opacity-100 scale-100'
                      }`}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    {hoverImg && (
                      <Image
                        src={hoverImg}
                        alt={`${product.name} alternate view`}
                        fill
                        className={`object-cover object-center transition-all duration-700 ease-out ${
                          isHovered ? 'opacity-100 scale-[1.02]' : 'opacity-0 scale-100'
                        }`}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    )}
                  </Link>

                  {/* Clean Catalogue Metadata underneath */}
                  <div className="pt-4 flex flex-col space-y-1">
                    <div className="flex items-baseline justify-between">
                      <Link 
                        href={`/product/${product.slug}`}
                        className="text-xs sm:text-sm font-bold uppercase tracking-tight text-[#0A0A0A] hover:opacity-60 transition-opacity"
                      >
                        {product.name}
                      </Link>
                      <span className="text-[11px] font-mono font-medium text-[#71717A] ml-2 shrink-0">
                        {formatKES(product.price)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] font-mono tracking-wider uppercase text-[#71717A]">
                        280 GSM · ORGANIC COTTON
                      </span>
                      <button
                        onClick={() => handleQuickAdd(product)}
                        className="text-[10px] font-mono uppercase tracking-[0.16em] font-bold text-[#0A0A0A] hover:opacity-50 transition-opacity cursor-pointer"
                      >
                        {quickAddedId === product.id ? 'ADDED ✓' : '+ ADD TO BAG'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>


      {/* =========================================================================
          04 — FULL-WIDTH TRANSITION IMAGE
          Artistic breather celebrating authentic Kenyan street identity.
          A huge photograph. No product grid.
          RADIICATO / MADE HERE. WORN EVERYWHERE.
          ========================================================================= */}
      <section className="relative w-full h-[70vh] sm:h-[85vh] bg-black overflow-hidden flex items-end p-8 sm:p-14 lg:p-20">
        <Image
          src="/images/owner_editorial.jpg"
          alt="Radiicato Nairobi Street Atelier"
          fill
          className="object-cover object-center brightness-[0.82] contrast-[1.05]"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

        <motion.div {...motionFadeIn} className="relative z-10 text-white max-w-lg">
          <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-white/70 block mb-1">
            RADIICATO
          </span>
          <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-[-0.04em] leading-tight">
            MADE HERE.<br />WORN EVERYWHERE.
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-white/80 font-light leading-relaxed">
            Engineered in Nairobi for those who refuse to blend in. Independent underground luxury.
          </p>
        </motion.div>
      </section>


      {/* =========================================================================
          05 — WE ARE WHO WE ARE (Collection 02 Hero)
          Heavy visual contrast with Broken Record: Inverting to obsidian black.
          Section: COLLECTION 02 / WE ARE WHO WE ARE / No explanation necessary.
          EXPLORE COLLECTION →
          Background/hero: /images/we-are-who-we-are.jpg
          ========================================================================= */}
      <section id="we-are-who-we-are" className="relative w-full bg-[#0A0A0A] text-white py-16 sm:py-24 px-5 sm:px-8 lg:px-12 border-b border-[#27272A]">
        <div className="max-w-[1600px] mx-auto">
          <div className="relative w-full aspect-[4/5] sm:aspect-[16/10] lg:aspect-[21/11] overflow-hidden bg-[#18181B] border border-[#27272A]">
            <Image
              src="/images/we-are-who-we-are.jpg"
              alt="Radiicato We Are Who We Are Collection 02"
              fill
              className="object-cover object-center brightness-90 contrast-105"
              sizes="100vw"
            />
            {/* Editorial overlay on bottom left */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-6 sm:p-12 lg:p-16">
              <motion.div {...motionFadeIn} className="max-w-xl text-white">
                <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-[#71717A] block mb-2">
                  COLLECTION 02
                </span>
                <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-[-0.04em] leading-[0.9] mb-4">
                  WE ARE WHO WE ARE
                </h2>
                <p className="text-xs sm:text-sm font-mono tracking-[0.16em] uppercase text-white/60 mb-6">
                  NO EXPLANATION NECESSARY.
                </p>
                <Link
                  href="/collections/we-are-who-we-are"
                  className="inline-flex items-center gap-2 text-xs font-mono tracking-[0.2em] uppercase text-white font-bold hover:opacity-70 transition-opacity border-b border-white pb-1"
                >
                  <span>EXPLORE COLLECTION</span>
                  <ArrowRight size={14} />
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>


      {/* =========================================================================
          06 — WE ARE WHO WE ARE PRODUCT EDIT ("THE EDIT")
          Show 3–4 selected pieces in the dark theme.
          WE ARE WHO WE ARE
          [ LARGE IMAGE ] [ LARGE IMAGE ]
          PRODUCT NAME / KES XXXX
          Then: VIEW ALL →
          ========================================================================= */}
      <section className="w-full bg-[#0A0A0A] text-white py-20 px-5 sm:px-8 lg:px-12 border-b border-[#27272A]">
        <div className="max-w-[1600px] mx-auto">
          {/* Header */}
          <div className="flex items-baseline justify-between mb-10 pb-4 border-b border-[#27272A]">
            <div>
              <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-[#71717A] block mb-1">
                THE EDIT
              </span>
              <h3 className="text-xl sm:text-2xl font-black uppercase tracking-[-0.03em] text-white">
                WE ARE WHO WE ARE
              </h3>
            </div>
            <Link
              href="/collections/we-are-who-we-are"
              className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#71717A] hover:text-white transition-colors"
            >
              VIEW ALL →
            </Link>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10">
            {weAreWhoWeAreProducts.map((product) => {
              const primaryImg = product.images[0]?.url || '/images/products/we-are-who-we-are-front.jpg';
              const hoverImg = product.images[1]?.url || product.images[0]?.url;
              const isHovered = hoveredProduct === product.id;

              return (
                <div
                  key={product.id}
                  className="group flex flex-col"
                  onMouseEnter={() => setHoveredProduct(product.id)}
                  onMouseLeave={() => setHoveredProduct(null)}
                >
                  {/* Clean Rectangular Image Container */}
                  <Link
                    href={`/product/${product.slug}`}
                    className="relative aspect-[3/4] w-full bg-[#18181B] border border-[#27272A] overflow-hidden block"
                  >
                    <Image
                      src={primaryImg}
                      alt={product.name}
                      fill
                      className={`object-cover object-center transition-all duration-700 ease-out ${
                        isHovered && hoverImg ? 'opacity-0 scale-[1.02]' : 'opacity-100 scale-100'
                      }`}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    {hoverImg && (
                      <Image
                        src={hoverImg}
                        alt={`${product.name} alternate view`}
                        fill
                        className={`object-cover object-center transition-all duration-700 ease-out ${
                          isHovered ? 'opacity-100 scale-[1.02]' : 'opacity-0 scale-100'
                        }`}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    )}
                  </Link>

                  {/* Catalogue Details */}
                  <div className="pt-4 flex flex-col space-y-1">
                    <div className="flex items-baseline justify-between">
                      <Link 
                        href={`/product/${product.slug}`}
                        className="text-xs sm:text-sm font-bold uppercase tracking-tight text-white hover:opacity-60 transition-opacity"
                      >
                        {product.name}
                      </Link>
                      <span className="text-[11px] font-mono font-medium text-[#71717A] ml-2 shrink-0">
                        {formatKES(product.price)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] font-mono tracking-wider uppercase text-[#71717A]">
                        WASHED OBSIDIAN · BOXY CUT
                      </span>
                      <button
                        onClick={() => handleQuickAdd(product)}
                        className="text-[10px] font-mono uppercase tracking-[0.16em] font-bold text-white hover:opacity-50 transition-opacity cursor-pointer"
                      >
                        {quickAddedId === product.id ? 'ADDED ✓' : '+ ADD TO BAG'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/collections/we-are-who-we-are"
              className="inline-flex items-center gap-2 text-xs font-mono tracking-[0.2em] uppercase text-white hover:opacity-60 transition-opacity"
            >
              <span>VIEW ALL COLLECTION 02 PIECES</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>


      {/* =========================================================================
          07 — SKULL CAPS (Intimate Accessory Chapter)
          Rather than another massive hero, slightly more intimate.
          SKULL CAPS
          [ IMAGE ] [ IMAGE ] [ IMAGE ]
          SHOP SKULL CAPS →
          ========================================================================= */}
      <section id="skull-caps" className="w-full bg-white py-24 px-5 sm:px-8 lg:px-12 border-b border-[#E4E4E7]">
        <div className="max-w-[1400px] mx-auto">
          {/* Header */}
          <div className="text-center mb-14">
            <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-[#71717A] block mb-2">
              ACCESSORY CHAPTER 03
            </span>
            <h3 className="text-2xl sm:text-4xl font-black uppercase tracking-[-0.04em]">
              SKULL CAPS
            </h3>
            <p className="mt-2 text-xs font-mono tracking-[0.15em] text-[#71717A] uppercase">
              HEAVYWEIGHT KNIT · CONTOURED NAIROBI FIT · KES 500
            </p>
          </div>

          {/* 3 Colorways */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8 mb-12">
            {/* Colorway 1: Onyx Black */}
            <div className="flex flex-col group">
              <Link 
                href="/product/radiicato-heavyweight-ribbed-knit-skull-cap"
                className="relative aspect-[3/4] w-full bg-[#F4F4F5] border border-[#E4E4E7] overflow-hidden"
              >
                <Image
                  src="/images/products/radiicato-skull-cap-black.jpg"
                  alt="Radiicato Skull Cap Onyx Black"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
              </Link>
              <div className="pt-3 flex items-baseline justify-between text-xs font-mono uppercase">
                <span className="font-bold text-[#0A0A0A]">ONYX BLACK</span>
                <span className="text-[#71717A]">{formatKES(500)}</span>
              </div>
            </div>

            {/* Colorway 2: Slate Grey */}
            <div className="flex flex-col group">
              <Link 
                href="/product/radiicato-skull-cap-slate-grey"
                className="relative aspect-[3/4] w-full bg-[#F4F4F5] border border-[#E4E4E7] overflow-hidden"
              >
                <Image
                  src="/images/products/radiicato-skull-cap-grey.jpg"
                  alt="Radiicato Skull Cap Slate Grey"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
              </Link>
              <div className="pt-3 flex items-baseline justify-between text-xs font-mono uppercase">
                <span className="font-bold text-[#0A0A0A]">SLATE GREY</span>
                <span className="text-[#71717A]">{formatKES(500)}</span>
              </div>
            </div>

            {/* Colorway 3: Night Camo */}
            <div className="flex flex-col group">
              <Link 
                href="/product/radiicato-skull-cap-midnight-camo"
                className="relative aspect-[3/4] w-full bg-[#F4F4F5] border border-[#E4E4E7] overflow-hidden"
              >
                <Image
                  src="/images/products/radiicato-skull-cap-camo.jpg"
                  alt="Radiicato Skull Cap Night Camo"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
              </Link>
              <div className="pt-3 flex items-baseline justify-between text-xs font-mono uppercase">
                <span className="font-bold text-[#0A0A0A]">NIGHT CAMO</span>
                <span className="text-[#71717A]">{formatKES(500)}</span>
              </div>
            </div>
          </div>

          {/* Action Link */}
          <div className="text-center">
            <Link
              href="/collections/skull-caps"
              className="inline-flex items-center gap-2 text-xs font-mono tracking-[0.2em] uppercase font-bold text-[#0A0A0A] hover:opacity-50 transition-opacity border-b border-[#0A0A0A] pb-1"
            >
              <span>SHOP SKULL CAPS</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>


      {/* =========================================================================
          08 — RADIICATO MANIFESTO
          Large typography: WE ARE WHO WE ARE.
          RADIICATO IS A STATE OF MIND.
          AN EXPRESSION OF IDENTITY, CULTURE AND INDIVIDUALITY.
          READ OUR STORY →
          ========================================================================= */}
      <section className="w-full bg-[#FAFAFA] py-24 sm:py-32 px-6 sm:px-12 border-b border-[#E4E4E7]">
        <div className="max-w-[1200px] mx-auto">
          <motion.div {...motionFadeIn} className="space-y-8">
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#71717A] block">
              MANIFESTO // NAIROBI
            </span>

            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-[-0.05em] leading-[0.9] text-[#0A0A0A]">
              WE ARE WHO WE ARE.
            </h2>

            <div className="max-w-2xl space-y-6 pt-4">
              <p className="text-lg sm:text-xl font-bold uppercase tracking-tight text-[#0A0A0A] leading-snug">
                RADIICATO IS A STATE OF MIND. AN EXPRESSION OF IDENTITY, CULTURE AND INDIVIDUALITY.
              </p>
              <p className="text-sm sm:text-base text-[#71717A] font-light leading-relaxed">
                Founded in Nairobi, Radiicato rejects fast-fashion dilution in favor of heavyweight 280 GSM combed organic cotton, hand-finished 3D metallic badges, and subversive street graphics made for those who walk their own path.
              </p>
              <div>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 text-xs font-mono tracking-[0.2em] uppercase font-bold text-[#0A0A0A] hover:opacity-60 transition-opacity border-b border-[#0A0A0A] pb-1"
                >
                  <span>READ OUR STORY</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>


      {/* =========================================================================
          09 — CAMPAIGN / LOOKBOOK
          Full-width campaign imagery.
          Heading: THE WORLD OF RADIICATO
          Masonry/grid of photography.
          Clicking an image opens the campaign/lookbook modal.
          ========================================================================= */}
      <section className="w-full bg-white py-24 px-5 sm:px-8 lg:px-12 border-b border-[#E4E4E7]">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex items-baseline justify-between mb-12 pb-4 border-b border-[#E4E4E7]">
            <h3 className="text-xl sm:text-3xl font-black uppercase tracking-[-0.04em]">
              THE WORLD OF RADIICATO
            </h3>
            <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#71717A]">
              EDITORIAL CAMPAIGN · NAIROBI
            </span>
          </div>

          {/* Masonry / Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6">
            {/* Left Dominant Tall Column (7 cols) */}
            <div 
              onClick={() => handleOpenLookbook(0)}
              className="md:col-span-7 relative aspect-[4/5] sm:aspect-[16/11] md:aspect-[4/5] bg-[#F4F4F5] border border-[#E4E4E7] overflow-hidden cursor-pointer group"
            >
              <Image
                src="/images/broken-record.jpg"
                alt="Broken Record Atelier Rooftop Session"
                fill
                className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"
                sizes="(max-width: 768px) 100vw, 60vw"
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <span className="text-white text-xs font-mono tracking-widest uppercase">
                  LOOK 01 · VIEW FULLSCREEN ↗
                </span>
              </div>
            </div>

            {/* Right Stacked Column (5 cols) */}
            <div className="md:col-span-5 flex flex-col gap-4 sm:gap-6">
              {/* Top Right */}
              <div 
                onClick={() => handleOpenLookbook(1)}
                className="relative aspect-[4/3] bg-[#18181B] border border-[#E4E4E7] overflow-hidden cursor-pointer group"
              >
                <Image
                  src="/images/we-are-who-we-are.jpg"
                  alt="We Are Who We Are Westlands Underground"
                  fill
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"
                  sizes="(max-width: 768px) 100vw, 40vw"
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <span className="text-white text-xs font-mono tracking-widest uppercase">
                    LOOK 02 · VIEW FULLSCREEN ↗
                  </span>
                </div>
              </div>

              {/* Bottom Right */}
              <div 
                onClick={() => handleOpenLookbook(3)}
                className="relative aspect-[4/3] bg-[#F4F4F5] border border-[#E4E4E7] overflow-hidden cursor-pointer group"
              >
                <Image
                  src="/images/owner_editorial.jpg"
                  alt="Nairobi Street Culture & Movement"
                  fill
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"
                  sizes="(max-width: 768px) 100vw, 40vw"
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <span className="text-white text-xs font-mono tracking-widest uppercase">
                    LOOK 03 · VIEW FULLSCREEN ↗
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* =========================================================================
          10 — SHOP ALL
          Large minimalist section:
          SHOP RADIICATO
          VIEW ALL PRODUCTS →
          Row: BROKEN RECORD · WE ARE WHO WE ARE · SKULL CAPS
          ========================================================================= */}
      <section className="w-full bg-white py-24 sm:py-32 px-6 sm:px-12 border-b border-[#E4E4E7] text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-[-0.04em] text-[#0A0A0A]">
            SHOP RADIICATO
          </h2>
          <div>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono tracking-[0.2em] uppercase font-bold text-[#0A0A0A] hover:opacity-50 transition-opacity border-b-2 border-[#0A0A0A] pb-1.5"
            >
              <span>VIEW ALL PRODUCTS</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-[11px] font-mono tracking-[0.2em] uppercase text-[#71717A]">
            <Link href="/collections/broken-record" className="hover:text-[#0A0A0A] transition-colors">
              BROKEN RECORD
            </Link>
            <span className="text-[#D4D4D8]">·</span>
            <Link href="/collections/we-are-who-we-are" className="hover:text-[#0A0A0A] transition-colors">
              WE ARE WHO WE ARE
            </Link>
            <span className="text-[#D4D4D8]">·</span>
            <Link href="/collections/skull-caps" className="hover:text-[#0A0A0A] transition-colors">
              SKULL CAPS
            </Link>
          </div>
        </div>
      </section>


      {/* =========================================================================
          11 — INSTAGRAM / SOCIAL
          Keep this simple.
          FOLLOW THE WORLD
          @RADIICATO
          6–8 photographs.
          No giant social-media widgets. Just beautiful imagery.
          ========================================================================= */}
      <section className="w-full bg-[#FAFAFA] py-20 px-5 sm:px-8 lg:px-12 border-b border-[#E4E4E7]">
        <div className="max-w-[1600px] mx-auto">
          <div className="text-center mb-10">
            <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-[#71717A] block mb-1">
              FOLLOW THE WORLD
            </span>
            <a
              href="https://instagram.com/radiicato"
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg sm:text-xl font-mono font-bold tracking-[0.16em] uppercase text-[#0A0A0A] hover:opacity-60 transition-opacity"
            >
              @RADIICATO
            </a>
          </div>

          {/* Clean 6-photo Instagram Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
            {[
              { src: '/images/products/broken-record-front.jpg', alt: 'Radiicato Editorial 01' },
              { src: '/images/products/we-are-who-we-are-front.jpg', alt: 'Radiicato Editorial 02' },
              { src: '/images/products/radiicato-skull-cap-black.jpg', alt: 'Radiicato Editorial 03' },
              { src: '/images/broken-record.jpg', alt: 'Radiicato Editorial 04' },
              { src: '/images/we-are-who-we-are.jpg', alt: 'Radiicato Editorial 05' },
              { src: '/images/products/radiicato-skull-cap-camo.jpg', alt: 'Radiicato Editorial 06' },
            ].map((img, idx) => (
              <a
                key={idx}
                href="https://instagram.com/radiicato"
                target="_blank"
                rel="noopener noreferrer"
                className="relative aspect-square w-full bg-[#E4E4E7] overflow-hidden block group"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            ))}
          </div>
        </div>
      </section>


      {/* LOOKBOOK MODAL LIGHTBOX */}
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
