'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, ShoppingBag } from 'lucide-react';
import { useStore } from '@/lib/use-store';
import { LookbookModal } from '@/components/lookbook/LookbookModal';
import { formatKES } from '@/lib/utils';
import { Product, Size } from '@/types';

/* ═══════════════════════════════════════════════════════════════════
   Chrome Particle Canvas — PESOS Worldwide Inspired
   Renders drifting metallic chrome particles on the hero background
   ═══════════════════════════════════════════════════════════════════ */
function ChromeHeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = 0;
    let height = 0;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    resize();
    window.addEventListener('resize', resize);

    // Create chrome-style particles
    interface Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      pulse: number;
      pulseSpeed: number;
    }

    const particles: Particle[] = [];
    const PARTICLE_COUNT = 80;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2.5 + 0.5,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3 - 0.15,
        opacity: Math.random() * 0.4 + 0.1,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.02 + 0.005,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.pulse += p.pulseSpeed;

        // Wrap around edges
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        const currentOpacity = p.opacity * (0.5 + 0.5 * Math.sin(p.pulse));

        // Chrome metallic gradient dot
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${currentOpacity})`);
        gradient.addColorStop(0.5, `rgba(200, 200, 210, ${currentOpacity * 0.6})`);
        gradient.addColorStop(1, `rgba(150, 150, 170, 0)`);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      // Draw subtle connection lines between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.03 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-[1]"
      aria-hidden="true"
      style={{ pointerEvents: 'none' }}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════════
   HomePage Component — PESOS Worldwide Redesign
   ═══════════════════════════════════════════════════════════════════ */
export default function HomePage() {
  const { products, collections, lookbook, addToCart } = useStore();
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

  /* ─── Product Card Component ─── */
  const ProductCard = ({ product, fallbackImg }: { product: Product; fallbackImg: string }) => {
    const primaryImg = product.images[0]?.url || fallbackImg;
    const hoverImg = product.images[1]?.url || product.images[0]?.url;
    const isHovered = hoveredProductId === product.id;

    return (
      <div
        className="group flex flex-col"
        onMouseEnter={() => setHoveredProductId(product.id)}
        onMouseLeave={() => setHoveredProductId(null)}
      >
        {/* Clean Dark Frame */}
        <Link
          href={`/product/${product.slug}`}
          className="relative aspect-[3/4] w-full bg-[#0d0d0d] border border-white/15 group-hover:border-white/50 transition-colors duration-300 overflow-hidden block"
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

        {/* Metadata underneath */}
        <div className="pt-4 flex flex-col space-y-1.5">
          <div className="flex items-baseline justify-between">
            <Link
              href={`/product/${product.slug}`}
              className="text-[14px] sm:text-[15px] font-bold uppercase tracking-tight text-white hover:opacity-60 transition-opacity"
            >
              {product.name}
            </Link>
            <span className="text-[13px] font-mono font-medium text-white/80 ml-3 shrink-0">
              {formatKES(product.price)}
            </span>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] font-mono tracking-wider uppercase text-white/50">
              280 GSM · ORGANIC COTTON
            </span>
            <button
              onClick={() => handleQuickAdd(product)}
              className="text-[11px] font-mono uppercase tracking-[0.14em] font-semibold text-white/90 hover:text-white transition-colors cursor-pointer border border-white/20 bg-white/5 px-2.5 py-1 rounded-[2px] hover:bg-white hover:text-black"
            >
              {quickAddedId === product.id ? 'ADDED ✓' : '+ ADD TO BAG'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-black text-white min-h-screen selection:bg-white selection:text-black font-sans">

      {/* =========================================================================
          01 — FULL-SCREEN IMMERSIVE HERO (PESOS Chrome Viewer Style)
          Fullscreen dark canvas with animated chrome particles,
          centered 3D logo, and frosted glass CTA at bottom.
          ========================================================================= */}
      <section className="pesos-below-navbar-fixed relative w-full overflow-hidden bg-black">
        {/* Chrome Particle Canvas Background */}
        <ChromeHeroCanvas />

        {/* Deep radial gradient atmosphere */}
        <div className="absolute inset-0 z-[2] bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,rgba(30,30,40,0.3),transparent)]" />

        {/* Background editorial image with heavy darkness */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/products/broken-record-front.jpg"
            alt="RADIICATO Streetwear"
            fill
            priority
            className="object-cover object-center brightness-[0.25] contrast-[1.2] scale-110"
            sizes="100vw"
          />
        </div>

        {/* Center Content: 3D Logo + Brand Name */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-var(--navbar-height))] px-6">
          {/* 3D Chrome Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8"
          >
            <Image
              src="/images/radiicato-3d-logo.jpg"
              alt="RADIICATO 3D Chrome Logo"
              width={280}
              height={280}
              className="w-[180px] h-[180px] sm:w-[240px] sm:h-[240px] lg:w-[320px] lg:h-[320px] object-contain drop-shadow-[0_20px_60px_rgba(255,255,255,0.15)] rounded-2xl"
              priority
            />
          </motion.div>

          {/* Brand Name */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="text-[clamp(2rem,8vw,5rem)] font-bold tracking-[-0.05em] leading-[0.84] uppercase text-white text-center"
          >
            RADIICATO
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mt-4 text-[12px] sm:text-[14px] uppercase tracking-[0.18em] text-white/60 font-medium"
          >
            INDEPENDENT STREETWEAR · NAIROBI
          </motion.p>
        </div>

        {/* Bottom Frosted CTA — PESOS Exact Style */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-center px-6 pb-[max(2.5rem,env(safe-area-inset-bottom))] sm:pb-[max(1.5rem,env(safe-area-inset-bottom))]">
          <Link
            href="/shop"
            className="group pointer-events-auto rounded-[2px] border border-white/40 bg-white/10 px-5 py-4 text-center font-sans text-[14px] font-semibold uppercase leading-[1.3] tracking-[0.14em] backdrop-blur-md transition-colors hover:border-white hover:bg-white focus-visible:outline focus-visible:outline-1 focus-visible:outline-white max-[359px]:px-3 max-[359px]:text-[13px] max-[359px]:tracking-[0.1em] sm:px-8"
          >
            <span className="text-white transition-colors group-hover:text-black">
              Shop latest collection
            </span>
          </Link>
        </div>
      </section>


      {/* =========================================================================
          02 — BROKEN RECORD (Collection 01 Introduction)
          Large editorial photograph dominating the section.
          Brutalist PESOS typography: COLLECTION 01 / BROKEN RECORD
          ========================================================================= */}
      <section id="broken-record" className="relative w-full bg-black py-20 sm:py-28 px-6 sm:px-10 lg:px-14 border-b border-white/15">
        <div className="max-w-[1600px] mx-auto">
          <div className="relative w-full aspect-[4/5] sm:aspect-[16/10] lg:aspect-[21/11] overflow-hidden bg-[#0d0d0d] border border-white/20">
            <Image
              src="/images/broken-record.jpg"
              alt="Broken Record Collection 01"
              fill
              className="object-cover object-center brightness-90 contrast-105"
              sizes="100vw"
            />
            {/* Dark editorial gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent flex flex-col justify-end p-7 sm:p-12 lg:p-16">
              <motion.div {...motionFadeIn} className="max-w-xl text-white">
                <span className="text-[11px] sm:text-[12px] font-mono tracking-[0.22em] uppercase text-white/60 block mb-2">
                  COLLECTION 01
                </span>
                <h2 className="text-[clamp(32px,6vw,72px)] font-bold uppercase tracking-[-0.04em] leading-[0.88] mb-4 text-white">
                  BROKEN RECORD
                </h2>
                <p className="text-[15px] sm:text-[17px] text-white/80 font-normal mb-8 leading-snug">
                  A repetition worth breaking.
                </p>
                <div>
                  <Link
                    href="/collections/broken-record"
                    className="inline-flex items-center gap-3 rounded-[2px] border border-white/40 bg-white/10 px-6 py-4 text-[13px] sm:text-[14px] font-semibold uppercase tracking-[0.14em] backdrop-blur-md transition-colors hover:border-white hover:bg-white hover:text-black"
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
          PESOS style dark catalogue grid:
          3 products, rectangular framing, border-white/15, hover image swap.
          ========================================================================= */}
      <section className="w-full bg-black py-20 px-6 sm:px-10 lg:px-14 border-b border-white/15">
        <div className="max-w-[1600px] mx-auto">
          {/* Header */}
          <div className="flex items-baseline justify-between mb-10 pb-5 border-b border-white/15">
            <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-[-0.03em] text-white">
              BROKEN RECORD
            </h3>
            <Link
              href="/collections/broken-record"
              className="text-[12px] font-mono tracking-[0.16em] uppercase text-white/60 hover:text-white transition-colors"
            >
              SHOP CAPSULE →
            </Link>
          </div>

          {/* Product Strip: 3 Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {brokenRecordProducts.map((product) => (
              <ProductCard key={product.id} product={product} fallbackImg="/images/products/broken-record-front.jpg" />
            ))}
          </div>
        </div>
      </section>


      {/* =========================================================================
          04 — FULL-WIDTH TRANSITION IMAGE
          Nairobi Street Culture & Movement
          RADIICATO / MADE HERE. WORN EVERYWHERE.
          ========================================================================= */}
      <section className="relative w-full h-[75vh] sm:h-[90vh] bg-black overflow-hidden flex items-end p-8 sm:p-14 lg:p-20 border-b border-white/15">
        <Image
          src="/images/owner_editorial.jpg"
          alt="Radiicato Nairobi Street Atelier"
          fill
          className="object-cover object-center brightness-[0.78] contrast-[1.1]"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

        <motion.div {...motionFadeIn} className="relative z-10 text-white max-w-xl">
          <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-white/60 block mb-2">
            RADIICATO
          </span>
          <h2 className="text-[clamp(30px,5vw,64px)] font-bold uppercase tracking-[-0.04em] leading-[0.9]">
            MADE HERE.<br />WORN EVERYWHERE.
          </h2>
          <p className="mt-4 text-[14px] sm:text-[16px] text-white/80 font-normal leading-relaxed">
            Engineered in Nairobi for those who refuse to blend in. Independent underground luxury.
          </p>
        </motion.div>
      </section>


      {/* =========================================================================
          05 — WE ARE WHO WE ARE (Collection 02 Hero)
          Obsidian atmosphere: COLLECTION 02 / WE ARE WHO WE ARE
          NO EXPLANATION NECESSARY.
          ========================================================================= */}
      <section id="we-are-who-we-are" className="relative w-full bg-black py-20 sm:py-28 px-6 sm:px-10 lg:px-14 border-b border-white/15">
        <div className="max-w-[1600px] mx-auto">
          <div className="relative w-full aspect-[4/5] sm:aspect-[16/10] lg:aspect-[21/11] overflow-hidden bg-[#0d0d0d] border border-white/20">
            <Image
              src="/images/we-are-who-we-are.jpg"
              alt="We Are Who We Are Collection 02"
              fill
              className="object-cover object-center brightness-[0.85] contrast-110"
              sizes="100vw"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent flex flex-col justify-end p-7 sm:p-12 lg:p-16">
              <motion.div {...motionFadeIn} className="max-w-xl text-white">
                <span className="text-[11px] sm:text-[12px] font-mono tracking-[0.22em] uppercase text-white/60 block mb-2">
                  COLLECTION 02
                </span>
                <h2 className="text-[clamp(32px,6vw,72px)] font-bold uppercase tracking-[-0.04em] leading-[0.88] mb-4 text-white">
                  WE ARE WHO WE ARE
                </h2>
                <p className="text-[13px] sm:text-[14px] font-mono tracking-[0.16em] uppercase text-white/60 mb-8">
                  NO EXPLANATION NECESSARY.
                </p>
                <div>
                  <Link
                    href="/collections/we-are-who-we-are"
                    className="inline-flex items-center gap-3 rounded-[2px] border border-white/40 bg-white/10 px-6 py-4 text-[13px] sm:text-[14px] font-semibold uppercase tracking-[0.14em] backdrop-blur-md transition-colors hover:border-white hover:bg-white hover:text-black"
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
          Selected showcase pieces in dark rectangular catalogue framing.
          ========================================================================= */}
      <section className="w-full bg-black py-20 px-6 sm:px-10 lg:px-14 border-b border-white/15">
        <div className="max-w-[1600px] mx-auto">
          {/* Header */}
          <div className="flex items-baseline justify-between mb-10 pb-5 border-b border-white/15">
            <div>
              <span className="text-[11px] font-mono tracking-[0.22em] uppercase text-white/50 block mb-1">
                THE EDIT
              </span>
              <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-[-0.03em] text-white">
                WE ARE WHO WE ARE
              </h3>
            </div>
            <Link
              href="/collections/we-are-who-we-are"
              className="text-[12px] font-mono tracking-[0.16em] uppercase text-white/60 hover:text-white transition-colors"
            >
              VIEW ALL →
            </Link>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {weAreWhoWeAreProducts.map((product) => (
              <ProductCard key={product.id} product={product} fallbackImg="/images/products/we-are-who-we-are-front.jpg" />
            ))}
          </div>

          <div className="mt-14 text-center">
            <Link
              href="/collections/we-are-who-we-are"
              className="inline-flex items-center gap-2 text-[13px] font-mono tracking-[0.18em] uppercase text-white/80 hover:text-white transition-colors border-b border-white/30 pb-1"
            >
              <span>VIEW ALL COLLECTION 02 PIECES</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>


      {/* =========================================================================
          07 — SKULL CAPS (Intimate Accessory Chapter)
          Tactile 3-colorway accessory presentation.
          SKULL CAPS / Onyx Black, Slate Grey, Night Camo. KES 500.
          ========================================================================= */}
      <section id="skull-caps" className="w-full bg-black py-24 px-6 sm:px-10 lg:px-14 border-b border-white/15">
        <div className="max-w-[1400px] mx-auto">
          {/* Header */}
          <div className="text-center mb-14">
            <span className="text-[11px] font-mono tracking-[0.24em] uppercase text-white/50 block mb-2">
              ACCESSORY CHAPTER 03
            </span>
            <h3 className="text-[clamp(28px,5vw,52px)] font-bold uppercase tracking-[-0.04em] text-white">
              SKULL CAPS
            </h3>
            <p className="mt-2 text-[13px] font-mono tracking-[0.16em] text-white/60 uppercase">
              HEAVYWEIGHT KNIT · CONTOURED NAIROBI FIT · KES 500
            </p>
          </div>

          {/* 3 Colorways in PESOS Dark Frames */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8 mb-12">
            {[
              { href: '/product/radiicato-heavyweight-ribbed-knit-skull-cap', src: '/images/products/radiicato-skull-cap-black.jpg', name: 'ONYX BLACK' },
              { href: '/product/radiicato-skull-cap-slate-grey', src: '/images/products/radiicato-skull-cap-grey.jpg', name: 'SLATE GREY' },
              { href: '/product/radiicato-skull-cap-midnight-camo', src: '/images/products/radiicato-skull-cap-camo.jpg', name: 'NIGHT CAMO' },
            ].map((cap) => (
              <div key={cap.name} className="flex flex-col group">
                <Link
                  href={cap.href}
                  className="relative aspect-[3/4] w-full bg-[#0d0d0d] border border-white/15 group-hover:border-white/50 transition-colors duration-300 overflow-hidden"
                >
                  <Image
                    src={cap.src}
                    alt={`Radiicato Skull Cap ${cap.name}`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, 33vw"
                  />
                </Link>
                <div className="pt-3 flex items-baseline justify-between text-[13px] font-mono uppercase">
                  <span className="font-bold text-white">{cap.name}</span>
                  <span className="text-white/70">{formatKES(500)}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Action Button */}
          <div className="text-center">
            <Link
              href="/collections/skull-caps"
              className="inline-flex items-center gap-3 rounded-[2px] border border-white/40 bg-white/10 px-8 py-4 text-[13px] font-semibold uppercase tracking-[0.14em] backdrop-blur-md transition-colors hover:border-white hover:bg-white hover:text-black"
            >
              <span>SHOP SKULL CAPS</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>


      {/* =========================================================================
          08 — RADIICATO MANIFESTO
          PESOS style brutalist statement box:
          WE ARE WHO WE ARE.
          RADIICATO IS A STATE OF MIND.
          ========================================================================= */}
      <section className="w-full bg-black py-24 sm:py-32 px-6 sm:px-12 border-b border-white/15">
        <div className="max-w-[1200px] mx-auto border border-white/20 bg-white/[0.02] p-8 sm:p-14 lg:p-20 rounded-[2px]">
          <motion.div {...motionFadeIn} className="space-y-8">
            <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-white/50 block">
              MANIFESTO // NAIROBI
            </span>

            <h2 className="pesos-text-face text-[clamp(36px,6vw,84px)] font-bold uppercase tracking-[-0.04em] leading-[0.88] text-white">
              WE ARE WHO WE ARE.
            </h2>

            <div className="max-w-2xl space-y-6 pt-4">
              <p className="text-[17px] sm:text-[20px] font-bold uppercase tracking-tight text-white leading-snug">
                RADIICATO IS A STATE OF MIND. AN EXPRESSION OF IDENTITY, CULTURE AND INDIVIDUALITY.
              </p>
              <p className="text-[14px] sm:text-[15px] text-white/70 font-normal leading-relaxed">
                Founded in Nairobi, Radiicato rejects fast-fashion dilution in favor of heavyweight 280 GSM combed organic cotton, hand-finished 3D metallic badges, and subversive street graphics made for those who walk their own path.
              </p>
              <div className="pt-2">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 text-[13px] font-mono tracking-[0.18em] uppercase font-bold text-white hover:opacity-60 transition-opacity border-b border-white pb-1"
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
          THE WORLD OF RADIICATO
          Masonry/grid of photography.
          Clicking opens Lookbook lightbox.
          ========================================================================= */}
      <section className="w-full bg-black py-24 px-6 sm:px-10 lg:px-14 border-b border-white/15">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex items-baseline justify-between mb-12 pb-5 border-b border-white/15">
            <h3 className="text-xl sm:text-3xl font-bold uppercase tracking-[-0.04em] text-white">
              THE WORLD OF RADIICATO
            </h3>
            <span className="text-[11px] font-mono tracking-[0.2em] uppercase text-white/50">
              EDITORIAL CAMPAIGN · NAIROBI
            </span>
          </div>

          {/* Masonry / Grid with PESOS borders */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6">
            {/* Left Dominant Tall Column (7 cols) */}
            <div
              onClick={() => handleOpenLookbook(0)}
              className="md:col-span-7 relative aspect-[4/5] sm:aspect-[16/11] md:aspect-[4/5] bg-[#0d0d0d] border border-white/20 overflow-hidden cursor-pointer group"
            >
              <Image
                src="/images/broken-record.jpg"
                alt="Broken Record Atelier Rooftop Session"
                fill
                className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"
                sizes="(max-width: 768px) 100vw, 60vw"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <span className="text-white text-[12px] font-mono tracking-widest uppercase">
                  LOOK 01 · VIEW FULLSCREEN ↗
                </span>
              </div>
            </div>

            {/* Right Stacked Column (5 cols) */}
            <div className="md:col-span-5 flex flex-col gap-5 sm:gap-6">
              {/* Top Right */}
              <div
                onClick={() => handleOpenLookbook(1)}
                className="relative aspect-[4/3] bg-[#0d0d0d] border border-white/20 overflow-hidden cursor-pointer group"
              >
                <Image
                  src="/images/we-are-who-we-are.jpg"
                  alt="We Are Who We Are Westlands Underground"
                  fill
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"
                  sizes="(max-width: 768px) 100vw, 40vw"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <span className="text-white text-[12px] font-mono tracking-widest uppercase">
                    LOOK 02 · VIEW FULLSCREEN ↗
                  </span>
                </div>
              </div>

              {/* Bottom Right */}
              <div
                onClick={() => handleOpenLookbook(3)}
                className="relative aspect-[4/3] bg-[#0d0d0d] border border-white/20 overflow-hidden cursor-pointer group"
              >
                <Image
                  src="/images/owner_editorial.jpg"
                  alt="Nairobi Street Culture & Movement"
                  fill
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"
                  sizes="(max-width: 768px) 100vw, 40vw"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <span className="text-white text-[12px] font-mono tracking-widest uppercase">
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
          PESOS style shopping portal
          SHOP RADIICATO / VIEW ALL PRODUCTS →
          ========================================================================= */}
      <section className="w-full bg-black py-24 sm:py-32 px-6 sm:px-12 border-b border-white/15 text-center">
        <div className="max-w-2xl mx-auto space-y-7">
          <h2 className="text-[clamp(32px,5.5vw,68px)] font-bold uppercase tracking-[-0.04em] text-white">
            SHOP RADIICATO
          </h2>
          <div>
            <Link
              href="/shop"
              className="inline-flex items-center gap-3 rounded-[2px] border border-white/40 bg-white/10 px-8 py-4 text-[14px] font-semibold uppercase tracking-[0.14em] backdrop-blur-md transition-colors hover:border-white hover:bg-white hover:text-black"
            >
              <span>VIEW ALL PRODUCTS</span>
              <ArrowRight size={15} />
            </Link>
          </div>

          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-[12px] font-mono tracking-[0.18em] uppercase text-white/60">
            <Link href="/collections/broken-record" className="hover:text-white transition-colors">
              BROKEN RECORD
            </Link>
            <span className="text-white/30">·</span>
            <Link href="/collections/we-are-who-we-are" className="hover:text-white transition-colors">
              WE ARE WHO WE ARE
            </Link>
            <span className="text-white/30">·</span>
            <Link href="/collections/skull-caps" className="hover:text-white transition-colors">
              SKULL CAPS
            </Link>
          </div>
        </div>
      </section>


      {/* =========================================================================
          11 — INSTAGRAM / SOCIAL
          FOLLOW THE WORLD / @RADIICATO
          6 photographs with fine translucent border
          ========================================================================= */}
      <section className="w-full bg-black py-20 px-6 sm:px-10 lg:px-14 border-b border-white/15">
        <div className="max-w-[1600px] mx-auto">
          <div className="text-center mb-10">
            <span className="text-[11px] font-mono tracking-[0.22em] uppercase text-white/50 block mb-1">
              FOLLOW THE WORLD
            </span>
            <a
              href="https://instagram.com/radiicato"
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg sm:text-xl font-mono font-bold tracking-[0.16em] uppercase text-white hover:opacity-60 transition-opacity"
            >
              @RADIICATO
            </a>
          </div>

          {/* Clean 6-photo Dark Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
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
                className="relative aspect-square w-full bg-[#0d0d0d] border border-white/15 overflow-hidden block group"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                />
                <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity" />
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
