'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <main className="pt-24 sm:pt-32 pb-24 px-4 sm:px-8 lg:px-12 bg-black text-white min-h-screen font-sans">
      <div className="max-w-[1600px] mx-auto">
        <p className="text-[10px] sm:text-[11px] font-mono tracking-[0.22em] uppercase text-white/50 mb-2 font-bold">
          BRAND MANIFESTO // NAIROBI ROOTS
        </p>
        <h1 className="pesos-text-face text-3xl sm:text-5xl lg:text-7xl font-bold uppercase tracking-[-0.04em] mb-8 sm:mb-12 text-white">
          ENGINEERED IN NAIROBI
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14 pb-14 sm:pb-20 border-b border-white/10 items-center">
          <div className="space-y-5 text-sm sm:text-base text-white/80 leading-relaxed font-normal">
            <p>
              Radiicato is an independent streetwear atelier established in Nairobi, Kenya. We exist at the intersection of non-conformist rebellion, architectural silhouettes, and heavyweight textile craftsmanship.
            </p>
            <p>
              In an era dominated by fleeting algorithms and flimsy disposable garments, Radiicato was founded by a visionary creative in Nairobi who refused to conform to generic fast-fashion templates.
            </p>
            <p>
              Standing atop Nairobi&apos;s skyline, every Radiicato garment is born out of genuine underground culture: drop shoulders, structured double-layered collars, heavyweight 280 GSM combed organic cotton, and hand-finished 3D liquid chrome hardware.
            </p>
            <p>
              We don&apos;t chase international trends—we define them right here from Kenya, proving that raw African streetwear holds undeniable presence anywhere on earth.
            </p>
          </div>
          <div className="relative aspect-[3/4] bg-[#0a0a0a] rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
            <Image
              src="/images/products/broken-record-full.jpg"
              alt="Radiicato Atelier on Nairobi Rooftop"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 py-12 sm:py-16 border-b border-white/10">
          <div className="glass-card rounded-2xl p-6 sm:p-8 space-y-3 border-white/10">
            <h3 className="text-[11px] sm:text-xs font-mono font-bold tracking-wider uppercase text-white">01 / THE VISION &amp; FOUNDER</h3>
            <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
              Built from raw passion on Nairobi rooftops. We refuse fast-fashion dilution. Cut for creatives who refuse to conform.
            </p>
          </div>
          <div className="glass-card rounded-2xl p-6 sm:p-8 space-y-3 border-white/10">
            <h3 className="text-[11px] sm:text-xs font-mono font-bold tracking-wider uppercase text-white">02 / HEAVYWEIGHT CRAFT</h3>
            <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
              280 GSM combed organic cotton. Drop shoulders. Structured double-layered collars. Unapologetic silhouettes engineered for longevity.
            </p>
          </div>
          <div className="glass-card rounded-2xl p-6 sm:p-8 space-y-3 border-white/10">
            <h3 className="text-[11px] sm:text-xs font-mono font-bold tracking-wider uppercase text-white">03 / LIQUID CHROME</h3>
            <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
              Hand-finished 3D hardware. Every garment is an architectural statement designed to disrupt the global streetwear landscape.
            </p>
          </div>
        </div>

        <div className="pt-12 sm:pt-16 text-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-3 glass-button bg-white text-black hover:bg-white/90 px-8 py-4 text-xs sm:text-sm font-mono font-bold uppercase tracking-[0.14em] rounded-xl transition-all shadow-xl active:scale-95"
          >
            <span>SHOP COLLECTION</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </main>
  );
}
