'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useStore } from '@/lib/use-store';
import { LookbookModal } from '@/components/lookbook/LookbookModal';
import { ChromeWebGLViewer } from '@/components/home/ChromeWebGLViewer';
import { formatKES } from '@/lib/utils';
import { Product, Size } from '@/types';

export default function HomePage() {
  const { products, lookbook, addToCart } = useStore();
  const [lookbookModalOpen, setLookbookModalOpen] = useState(false);
  const [selectedLookbookIndex, setSelectedLookbookIndex] = useState(0);

  // Hover states for product cards
  const [hoveredProductId, setHoveredProductId] = useState<string | null>(null);

  // Quick added toast feedback
  const [quickAddedId, setQuickAddedId] = useState<string | null>(null);

  // Products by Collection
  const brokenRecordProducts = products.filter(
    (p) => p.collectionId === 'col-broken-record' || p.slug.includes('broken-record')
  ).slice(0, 3);

  const weAreWhoWeAreProducts = products.filter(
    (p) => p.collectionId === 'col-we-are-who-we-are' || p.slug.includes('we-are-who-we-are')
  ).slice(0, 3);

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

  /* ─── Glassmorphic Product Card Component ─── */
  const ProductCard = ({ product, fallbackImg }: { product: Product; fallbackImg: string }) => {
    const primaryImg = product.images[0]?.url || fallbackImg;
    const hoverImg = product.images[1]?.url || product.images[0]?.url;
    const isHovered = hoveredProductId === product.id;

    return (
      <div
        className="glass-card rounded-xl sm:rounded-2xl p-2.5 sm:p-3.5 flex flex-col group transition-all duration-300"
        onMouseEnter={() => setHoveredProductId(product.id)}
        onMouseLeave={() => setHoveredProductId(null)}
      >
        {/* Frame with subtle border */}
        <Link
          href={`/product/${product.slug}`}
          className="relative aspect-[3/4] w-full bg-[#0a0a0a] rounded-lg sm:rounded-xl border border-white/10 group-hover:border-white/30 transition-colors duration-300 overflow-hidden block"
        >
          <Image
            src={primaryImg}
            alt={product.name}
            fill
            className={`object-cover object-center transition-all duration-700 ease-out ${
              isHovered && hoverImg ? 'opacity-0 scale-[1.03]' : 'opacity-100 scale-100'
            }`}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
          />
          {hoverImg && (
            <Image
              src={hoverImg}
              alt={`${product.name} alternate view`}
              fill
              className={`object-cover object-center transition-all duration-700 ease-out ${
                isHovered ? 'opacity-100 scale-[1.03]' : 'opacity-0 scale-100'
              }`}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
            />
          )}
        </Link>

        {/* Metadata underneath with glass styling */}
        <div className="pt-2.5 sm:pt-4 flex flex-col space-y-1 sm:space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-0.5 sm:gap-2">
            <Link
              href={`/product/${product.slug}`}
              className="text-[12px] sm:text-[15px] font-bold uppercase tracking-tight text-white hover:opacity-70 transition-opacity line-clamp-1"
            >
              {product.name}
            </Link>
            <span className="text-[11px] sm:text-[13px] font-mono font-medium text-white/90 shrink-0">
              {formatKES(product.price)}
            </span>
          </div>

          <div className="flex items-center justify-between pt-0.5 sm:pt-1 gap-1">
            <span className="text-[9px] sm:text-[11px] font-mono tracking-wider uppercase text-white/50 truncate">
              280 GSM · COTTON
            </span>
            <button
              onClick={() => handleQuickAdd(product)}
              className="glass-button text-[9px] sm:text-[11px] font-mono uppercase tracking-[0.14em] font-semibold text-white/90 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg cursor-pointer shrink-0"
            >
              {quickAddedId === product.id ? 'ADDED ✓' : '+ ADD'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-black text-white min-h-screen selection:bg-white selection:text-black font-sans">

      {/* =========================================================================
          01 — TRUE WEBGL 3D CHROME STUDY VIEWER (THREE.JS ENGINE)
          True 3D polygon mesh with HDR studio reflections, camera lighting,
          drag-to-orbit physics, wireframe toggle, and glassmorphic HUD.
          ========================================================================= */}
      <section className="pesos-below-navbar-fixed relative w-full overflow-hidden bg-black">
        <ChromeWebGLViewer />
      </section>


      {/* =========================================================================
          02 — BROKEN RECORD (Collection 01 Introduction)
          Editorial photograph with glassmorphism overlay card.
          ========================================================================= */}
      <section id="broken-record" className="relative w-full bg-black py-12 sm:py-24 px-4 sm:px-10 lg:px-14 border-b border-white/10">
        <div className="max-w-[1600px] mx-auto">
          <div className="relative w-full aspect-[4/5] sm:aspect-[16/10] lg:aspect-[21/11] overflow-hidden rounded-2xl sm:rounded-3xl bg-[#0d0d0d] border border-white/15 shadow-2xl">
            <Image
              src="/images/broken-record.jpg"
              alt="Broken Record Collection 01"
              fill
              className="object-cover object-center brightness-90 contrast-105"
              sizes="100vw"
            />
            {/* Glassmorphic editorial card overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-4 sm:p-10 lg:p-16">
              <motion.div {...motionFadeIn} className="glass-panel p-5 sm:p-10 rounded-xl sm:rounded-2xl max-w-xl text-white">
                <span className="text-[10px] sm:text-[12px] font-mono tracking-[0.22em] uppercase text-white/60 block mb-1.5 sm:mb-2">
                  COLLECTION 01
                </span>
                <h2 className="pesos-text-face text-[clamp(24px,5vw,60px)] font-bold uppercase tracking-[-0.04em] leading-[0.88] mb-3 sm:mb-4 text-white">
                  BROKEN RECORD
                </h2>
                <p className="text-[13px] sm:text-[16px] text-white/80 font-normal mb-6 sm:mb-8 leading-snug">
                  A repetition worth breaking.
                </p>
                <div>
                  <Link
                    href="/collections/broken-record"
                    className="inline-flex items-center justify-center gap-3 glass-button w-full sm:w-auto px-5 sm:px-6 py-3.5 sm:py-4 text-[12px] sm:text-[14px] font-semibold uppercase tracking-[0.14em] rounded-xl text-center"
                  >
                    <span>EXPLORE BROKEN RECORD</span>
                    <ArrowRight size={15} />
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>


      {/* =========================================================================
          03 — BROKEN RECORD PRODUCT STRIP
          Glassmorphic catalogue grid with hover luminescence.
          ========================================================================= */}
      <section className="w-full bg-black py-12 sm:py-20 px-4 sm:px-10 lg:px-14 border-b border-white/10">
        <div className="max-w-[1600px] mx-auto">
          {/* Header */}
          <div className="flex items-baseline justify-between mb-6 sm:mb-10 pb-4 sm:pb-5 border-b border-white/15">
            <h3 className="pesos-text-face text-lg sm:text-2xl font-bold uppercase tracking-[-0.03em] text-white">
              BROKEN RECORD
            </h3>
            <Link
              href="/collections/broken-record"
              className="text-[11px] sm:text-[12px] font-mono tracking-[0.16em] uppercase text-white/60 hover:text-white transition-colors"
            >
              SHOP CAPSULE →
            </Link>
          </div>

          {/* Product Strip: 2 columns on mobile, 3 on desktop */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
            {brokenRecordProducts.map((product) => (
              <ProductCard key={product.id} product={product} fallbackImg="/images/products/broken-record-front.jpg" />
            ))}
          </div>
        </div>
      </section>


      {/* =========================================================================
          04 — FULL-WIDTH TRANSITION IMAGE
          Nairobi Street Culture & Movement
          ========================================================================= */}
      <section className="relative w-full h-[60vh] sm:h-[90vh] bg-black overflow-hidden flex items-end p-4 sm:p-12 lg:p-20 border-b border-white/10">
        <Image
          src="/images/owner_editorial.jpg"
          alt="Radiicato Nairobi Street Atelier"
          fill
          className="object-cover object-center brightness-[0.75] contrast-[1.1]"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

        <motion.div {...motionFadeIn} className="relative z-10 glass-panel p-5 sm:p-10 rounded-xl sm:rounded-2xl max-w-xl text-white">
          <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.25em] uppercase text-white/60 block mb-1.5 sm:mb-2">
            RADIICATO
          </span>
          <h2 className="pesos-text-face text-[clamp(24px,4.5vw,56px)] font-bold uppercase tracking-[-0.04em] leading-[0.9]">
            MADE HERE.<br />WORN EVERYWHERE.
          </h2>
          <p className="mt-3 sm:mt-4 text-[13px] sm:text-[15px] text-white/80 font-normal leading-relaxed">
            Engineered in Nairobi for those who refuse to blend in. Independent underground luxury.
          </p>
        </motion.div>
      </section>


      {/* =========================================================================
          05 — WE ARE WHO WE ARE (Collection 02 Hero)
          Obsidian atmosphere with glassmorphic editorial panel.
          ========================================================================= */}
      <section id="we-are-who-we-are" className="relative w-full bg-black py-12 sm:py-24 px-4 sm:px-10 lg:px-14 border-b border-white/10">
        <div className="max-w-[1600px] mx-auto">
          <div className="relative w-full aspect-[4/5] sm:aspect-[16/10] lg:aspect-[21/11] overflow-hidden rounded-2xl sm:rounded-3xl bg-[#0d0d0d] border border-white/15 shadow-2xl">
            <Image
              src="/images/we-are-who-we-are.jpg"
              alt="We Are Who We Are Collection 02"
              fill
              className="object-cover object-center brightness-[0.85] contrast-110"
              sizes="100vw"
            />
            {/* Glassmorphic Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-4 sm:p-10 lg:p-16">
              <motion.div {...motionFadeIn} className="glass-panel p-5 sm:p-10 rounded-xl sm:rounded-2xl max-w-xl text-white">
                <span className="text-[10px] sm:text-[12px] font-mono tracking-[0.22em] uppercase text-white/60 block mb-1.5 sm:mb-2">
                  COLLECTION 02
                </span>
                <h2 className="pesos-text-face text-[clamp(24px,5vw,60px)] font-bold uppercase tracking-[-0.04em] leading-[0.88] mb-3 sm:mb-4 text-white">
                  WE ARE WHO WE ARE
                </h2>
                <p className="text-[12px] sm:text-[14px] font-mono tracking-[0.16em] uppercase text-white/60 mb-6 sm:mb-8">
                  NO EXPLANATION NECESSARY.
                </p>
                <div>
                  <Link
                    href="/collections/we-are-who-we-are"
                    className="inline-flex items-center justify-center gap-3 glass-button w-full sm:w-auto px-5 sm:px-6 py-3.5 sm:py-4 text-[12px] sm:text-[14px] font-semibold uppercase tracking-[0.14em] rounded-xl text-center"
                  >
                    <span>EXPLORE COLLECTION</span>
                    <ArrowRight size={15} />
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>


      {/* =========================================================================
          06 — WE ARE WHO WE ARE PRODUCT EDIT ("THE EDIT")
          ========================================================================= */}
      <section className="w-full bg-black py-12 sm:py-20 px-4 sm:px-10 lg:px-14 border-b border-white/10">
        <div className="max-w-[1600px] mx-auto">
          {/* Header */}
          <div className="flex items-baseline justify-between mb-6 sm:mb-10 pb-4 sm:pb-5 border-b border-white/15">
            <div>
              <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.22em] uppercase text-white/50 block mb-1">
                THE EDIT
              </span>
              <h3 className="pesos-text-face text-lg sm:text-2xl font-bold uppercase tracking-[-0.03em] text-white">
                WE ARE WHO WE ARE
              </h3>
            </div>
            <Link
              href="/collections/we-are-who-we-are"
              className="text-[11px] sm:text-[12px] font-mono tracking-[0.16em] uppercase text-white/60 hover:text-white transition-colors"
            >
              VIEW ALL →
            </Link>
          </div>

          {/* Product Grid: 2 columns on mobile, 3 on desktop */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
            {weAreWhoWeAreProducts.map((product) => (
              <ProductCard key={product.id} product={product} fallbackImg="/images/products/we-are-who-we-are-front.jpg" />
            ))}
          </div>

          <div className="mt-8 sm:mt-14 text-center">
            <Link
              href="/collections/we-are-who-we-are"
              className="inline-flex items-center justify-center gap-2 glass-pill px-4 sm:px-5 py-2 text-[11px] sm:text-[12px] font-mono tracking-[0.18em] uppercase text-white/80 hover:text-white transition-colors w-full sm:w-auto"
            >
              <span>VIEW ALL COLLECTION 02 PIECES</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>


      {/* =========================================================================
          07 — SKULL CAPS (Intimate Accessory Chapter)
          ========================================================================= */}
      {/* =========================================================================
          07 — SKULL CAPS (Intimate Accessory Chapter)
          ========================================================================= */}
      <section id="skull-caps" className="w-full bg-black py-12 sm:py-24 px-4 sm:px-10 lg:px-14 border-b border-white/10">
        <div className="max-w-[1400px] mx-auto">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-14">
            <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.24em] uppercase text-white/50 block mb-1.5 sm:mb-2">
              ACCESSORY CHAPTER 03
            </span>
            <h3 className="pesos-text-face text-[clamp(24px,5vw,52px)] font-bold uppercase tracking-[-0.04em] text-white">
              SKULL CAPS
            </h3>
            <p className="mt-1.5 sm:mt-2 text-[11px] sm:text-[13px] font-mono tracking-[0.16em] text-white/60 uppercase">
              STRETCH DOME SILHOUETTE · FLAT HEM BAND · KES 500
            </p>
          </div>

          {/* Model Rocking Skull Cap + 3 Colorways in 2x2 Mobile / 1x4 Desktop Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8 mb-8 sm:mb-12">
            {/* Model Editorial Shot */}
            <div className="glass-card rounded-xl sm:rounded-2xl p-2.5 sm:p-3 flex flex-col group">
              <div className="relative aspect-[3/4] w-full bg-[#0a0a0a] rounded-lg sm:rounded-xl border border-white/10 group-hover:border-white/30 transition-colors duration-300 overflow-hidden">
                <Image
                  src="/images/skull-cap-model.jpg"
                  alt="Model rocking Radiicato Skull Cap"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, 25vw"
                />
                <div className="absolute inset-x-0 bottom-0 p-2 sm:p-3 bg-gradient-to-t from-black/80 to-transparent">
                  <span className="text-[9px] sm:text-[10px] font-mono tracking-widest uppercase text-white/80 glass-pill px-2 py-0.5">
                    WORN IN NAIROBI
                  </span>
                </div>
              </div>
              <div className="pt-2.5 sm:pt-3.5 flex items-baseline justify-between text-[11px] sm:text-[13px] font-mono uppercase px-0.5 sm:px-1">
                <span className="font-bold text-white">EDITORIAL</span>
                <span className="text-white/60">STUDY</span>
              </div>
            </div>

            {[
              { href: '/product/radiicato-heavyweight-ribbed-knit-skull-cap', src: '/images/products/radiicato-skull-cap-black.jpg', name: 'ONYX BLACK' },
              { href: '/product/radiicato-skull-cap-slate-grey', src: '/images/products/radiicato-skull-cap-grey.jpg', name: 'SLATE GREY' },
              { href: '/product/radiicato-skull-cap-midnight-camo', src: '/images/products/radiicato-skull-cap-camo.jpg', name: 'NIGHT CAMO' },
            ].map((cap) => (
              <div key={cap.name} className="glass-card rounded-xl sm:rounded-2xl p-2.5 sm:p-3 flex flex-col group">
                <Link
                  href={cap.href}
                  className="relative aspect-[3/4] w-full bg-[#0a0a0a] rounded-lg sm:rounded-xl border border-white/10 group-hover:border-white/30 transition-colors duration-300 overflow-hidden"
                >
                  <Image
                    src={cap.src}
                    alt={`Radiicato Skull Cap ${cap.name}`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, 25vw"
                  />
                </Link>
                <div className="pt-2.5 sm:pt-3.5 flex items-baseline justify-between text-[11px] sm:text-[13px] font-mono uppercase px-0.5 sm:px-1">
                  <span className="font-bold text-white truncate">{cap.name}</span>
                  <span className="text-white/70 shrink-0 ml-1">{formatKES(500)}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Action Button */}
          <div className="text-center">
            <Link
              href="/collections/skull-caps"
              className="inline-flex items-center justify-center gap-3 glass-button w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 text-[12px] sm:text-[13px] font-semibold uppercase tracking-[0.14em] rounded-xl text-center"
            >
              <span>SHOP SKULL CAPS</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>


      {/* =========================================================================
          08 — RADIICATO MANIFESTO (Glassmorphic Plaque)
          ========================================================================= */}
      <section className="w-full bg-black py-12 sm:py-28 px-4 sm:px-12 border-b border-white/10">
        <div className="max-w-[1200px] mx-auto glass-panel p-6 sm:p-14 lg:p-20 rounded-2xl sm:rounded-3xl shadow-2xl">
          <motion.div {...motionFadeIn} className="space-y-6 sm:space-y-8">
            <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.25em] uppercase text-white/50 block">
              MANIFESTO // NAIROBI
            </span>

            <h2 className="pesos-text-face text-[clamp(28px,6vw,84px)] font-bold uppercase tracking-[-0.04em] leading-[0.88] text-white">
              WE ARE WHO WE ARE.
            </h2>

            <div className="max-w-2xl space-y-4 sm:space-y-6 pt-2 sm:pt-4">
              <p className="text-[15px] sm:text-[20px] font-bold uppercase tracking-tight text-white leading-snug">
                RADIICATO IS A STATE OF MIND. AN EXPRESSION OF IDENTITY, CULTURE AND INDIVIDUALITY.
              </p>
              <p className="text-[13px] sm:text-[15px] text-white/70 font-normal leading-relaxed">
                Founded in Nairobi, Radiicato rejects fast-fashion dilution in favor of heavyweight 280 GSM combed organic cotton, hand-finished 3D metallic badges, and subversive street graphics made for those who walk their own path.
              </p>
              <div className="pt-2">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 text-[12px] sm:text-[13px] font-mono tracking-[0.18em] uppercase font-bold text-white hover:opacity-60 transition-opacity border-b border-white pb-1"
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
          ========================================================================= */}
      <section className="w-full bg-black py-12 sm:py-24 px-4 sm:px-10 lg:px-14 border-b border-white/10">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex items-baseline justify-between mb-6 sm:mb-12 pb-4 sm:pb-5 border-b border-white/15">
            <h3 className="pesos-text-face text-lg sm:text-3xl font-bold uppercase tracking-[-0.04em] text-white">
              THE WORLD OF RADIICATO
            </h3>
            <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.2em] uppercase text-white/50">
              EDITORIAL CAMPAIGN · NAIROBI
            </span>
          </div>

          {/* Masonry / Grid with Glass borders */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-6">
            {/* Left Dominant Tall Column (7 cols) */}
            <div
              onClick={() => handleOpenLookbook(0)}
              className="md:col-span-7 relative aspect-[4/5] sm:aspect-[16/11] md:aspect-[4/5] glass-card rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer group p-1.5 sm:p-2"
            >
              <div className="relative w-full h-full rounded-lg sm:rounded-xl overflow-hidden">
                <Image
                  src="/images/broken-record.jpg"
                  alt="Broken Record Atelier Rooftop Session"
                  fill
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"
                  sizes="(max-width: 768px) 100vw, 60vw"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4 sm:p-6">
                  <span className="glass-pill px-3 py-1 text-white text-[10px] sm:text-[11px] font-mono tracking-widest uppercase">
                    LOOK 01 · VIEW FULLSCREEN ↗
                  </span>
                </div>
              </div>
            </div>

            {/* Right Stacked Column (5 cols) */}
            <div className="md:col-span-5 flex flex-col gap-3 sm:gap-6">
              {/* Top Right */}
              <div
                onClick={() => handleOpenLookbook(1)}
                className="relative aspect-[4/3] glass-card rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer group p-1.5 sm:p-2"
              >
                <div className="relative w-full h-full rounded-lg sm:rounded-xl overflow-hidden">
                  <Image
                    src="/images/we-are-who-we-are.jpg"
                    alt="We Are Who We Are Westlands Underground"
                    fill
                    className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"
                    sizes="(max-width: 768px) 100vw, 40vw"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4 sm:p-6">
                    <span className="glass-pill px-3 py-1 text-white text-[10px] sm:text-[11px] font-mono tracking-widest uppercase">
                      LOOK 02 · VIEW FULLSCREEN ↗
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Right */}
              <div
                onClick={() => handleOpenLookbook(3)}
                className="relative aspect-[4/3] glass-card rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer group p-1.5 sm:p-2"
              >
                <div className="relative w-full h-full rounded-lg sm:rounded-xl overflow-hidden">
                  <Image
                    src="/images/owner_editorial.jpg"
                    alt="Nairobi Street Culture & Movement"
                    fill
                    className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"
                    sizes="(max-width: 768px) 100vw, 40vw"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4 sm:p-6">
                    <span className="glass-pill px-3 py-1 text-white text-[10px] sm:text-[11px] font-mono tracking-widest uppercase">
                      LOOK 03 · VIEW FULLSCREEN ↗
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* =========================================================================
          10 — SHOP ALL (Glassmorphic Portal)
          ========================================================================= */}
      <section className="w-full bg-black py-12 sm:py-28 px-4 sm:px-12 border-b border-white/10 text-center">
        <div className="max-w-2xl mx-auto glass-panel p-6 sm:p-16 rounded-2xl sm:rounded-3xl space-y-5 sm:space-y-7 shadow-2xl">
          <h2 className="pesos-text-face text-[clamp(26px,5.5vw,68px)] font-bold uppercase tracking-[-0.04em] text-white">
            SHOP RADIICATO
          </h2>
          <div>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-3 glass-button w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 text-[13px] sm:text-[14px] font-semibold uppercase tracking-[0.14em] rounded-xl text-center"
            >
              <span>VIEW ALL PRODUCTS</span>
              <ArrowRight size={15} />
            </Link>
          </div>

          <div className="pt-4 sm:pt-6 flex flex-wrap items-center justify-center gap-2.5 sm:gap-6 text-[11px] sm:text-[12px] font-mono tracking-[0.18em] uppercase text-white/60">
            <Link href="/collections/broken-record" className="glass-pill px-3 sm:px-3.5 py-1 text-white/80 hover:text-white transition-colors">
              BROKEN RECORD
            </Link>
            <Link href="/collections/we-are-who-we-are" className="glass-pill px-3 sm:px-3.5 py-1 text-white/80 hover:text-white transition-colors">
              WE ARE WHO WE ARE
            </Link>
            <Link href="/collections/skull-caps" className="glass-pill px-3 sm:px-3.5 py-1 text-white/80 hover:text-white transition-colors">
              SKULL CAPS
            </Link>
          </div>
        </div>
      </section>


      {/* =========================================================================
          11 — INSTAGRAM / SOCIAL
          ========================================================================= */}
      <section className="w-full bg-black py-12 sm:py-20 px-4 sm:px-10 lg:px-14 border-b border-white/10">
        <div className="max-w-[1600px] mx-auto">
          <div className="text-center mb-6 sm:mb-10">
            <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.22em] uppercase text-white/50 block mb-1">
              FOLLOW THE WORLD
            </span>
            <a
              href="https://instagram.com/radiicato"
              target="_blank"
              rel="noopener noreferrer"
              className="text-base sm:text-xl font-mono font-bold tracking-[0.16em] uppercase text-white hover:opacity-60 transition-opacity"
            >
              @RADIICATO
            </a>
          </div>

          {/* Clean 6-photo Glass Grid — 3 cols on mobile, 6 on desktop */}
          <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
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
                className="glass-card rounded-lg sm:rounded-xl p-1 sm:p-1.5 overflow-hidden block group"
              >
                <div className="relative aspect-square w-full rounded-md sm:rounded-lg overflow-hidden">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 33vw, 16vw"
                  />
                  <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
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
