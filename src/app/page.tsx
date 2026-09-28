'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useStore } from '@/lib/use-store';
import { ChromeWebGLViewer } from '@/components/home/ChromeWebGLViewer';

export default function HomePage() {
  const motionFadeIn = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-60px' },
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] }
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
          02 — FULL-WIDTH TRANSITION IMAGE
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
          04 — RADIICATO MANIFESTO (Glassmorphic Plaque)
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
          07 — THE END: SHOP THE LATEST COLLECTION BUTTON
          Directs shoppers straight to the shop
          ========================================================================= */}
      <section id="shop-latest-collection" className="w-full bg-black py-20 sm:py-32 px-4 sm:px-10 border-b border-white/10 text-center">
        <div className="max-w-2xl mx-auto space-y-6 sm:space-y-8">
          <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.25em] uppercase text-white/50 block">
            EARLY 2026 COLLECTION // NAIROBI ATELIER
          </span>
          <h2 className="pesos-text-face text-[clamp(28px,5.5vw,72px)] font-bold uppercase tracking-[-0.04em] leading-[0.9] text-white">
            WE ARE WHO WE ARE
          </h2>
          <p className="text-[13px] sm:text-[15px] font-mono uppercase tracking-[0.16em] text-white/70">
            INDEPENDENT STREETWEAR ENGINEERED IN NAIROBI
          </p>
          <div className="pt-2">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-3 glass-button px-8 sm:px-12 py-4 sm:py-5 text-[13px] sm:text-[15px] font-semibold uppercase tracking-[0.16em] rounded-xl text-center hover:bg-white hover:text-black transition-all"
            >
              <span>SHOP THE LAST COLLECTION</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
