'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles, Layers } from 'lucide-react';
import { useStore } from '@/lib/use-store';

export default function CollectionsPage() {
  const { collections } = useStore();
  const primaryCollection = collections[0] || {
    id: 'col-early-2026',
    name: 'EARLY 2026 COLLECTION',
    slug: 'early-2026',
    description: 'The debut unified collection engineered in Nairobi. Uniting the Broken Record White Capsule, the We Are Who We Are Black Capsule, and the Signature Form-Fitting Skull Caps.',
    bannerImage: '/images/broken-record.jpg',
    coverImage: '/images/owner_editorial.jpg',
  };

  return (
    <div className="pt-28 sm:pt-36 pb-32 px-5 sm:px-8 lg:px-12 max-w-[1400px] mx-auto min-h-screen bg-white text-[#0A0A0A]">
      {/* Editorial Header */}
      <div className="pb-8 border-b border-[#E4E4E7] flex flex-col md:flex-row justify-between md:items-end gap-4 mb-8">
        <div>
          <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-[#71717A] font-bold block mb-2">
            OFFICIAL RELEASE // ATELIER DROPS
          </span>
          <h1 className="pesos-text-face text-4xl sm:text-6xl font-black uppercase tracking-tight">
            COLLECTIONS
          </h1>
        </div>
        <p className="text-[11px] font-mono text-[#71717A] uppercase">
          1 OFFICIAL COLLECTION · 3 INTEGRATED CAPSULES
        </p>
      </div>

      {/* Hero Single Collection Showcase */}
      <div className="space-y-12">
        <div className="border border-[#E4E4E7] rounded-2xl overflow-hidden bg-[#FAFAFA] p-4 sm:p-6 lg:p-8">
          <Link
            href={`/collections/${primaryCollection.slug}`}
            className="block group relative w-full overflow-hidden rounded-xl border border-[#E4E4E7]"
          >
            <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] bg-[#18181B] img-zoom-container">
              <Image
                src={primaryCollection.coverImage || primaryCollection.bannerImage}
                alt={primaryCollection.name}
                fill
                priority
                unoptimized
                className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-90"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10" />

              {/* Overlay Content */}
              <div className="absolute inset-0 p-6 sm:p-10 lg:p-14 flex flex-col justify-end text-white">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-zinc-300">
                    DEBUT DROP · NOW LIVE
                  </span>
                </div>
                <h2 className="pesos-text-face text-3xl sm:text-5xl lg:text-7xl font-black uppercase tracking-tight leading-none mb-3">
                  {primaryCollection.name}
                </h2>
                <p className="text-xs sm:text-sm text-zinc-300 font-light max-w-xl leading-relaxed mb-6">
                  {primaryCollection.description}
                </p>
                <div>
                  <span className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black text-xs font-mono font-bold uppercase tracking-wider rounded-lg group-hover:bg-zinc-200 transition-colors">
                    <span>EXPLORE ALL 3 CAPSULES</span>
                    <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            </div>
          </Link>

          {/* 3 Capsule Breakdown Inside the Single Collection */}
          <div className="mt-6 pt-6 border-t border-[#E4E4E7]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#71717A] font-bold">
                CAPSULES INSIDE THIS COLLECTION (3)
              </span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#71717A]">
                9 PIECES TOTAL
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Capsule 1 */}
              <Link
                href={`/collections/${primaryCollection.slug}?capsule=broken-record`}
                className="p-4 border border-[#E4E4E7] bg-white rounded-xl hover:border-black transition-all group"
              >
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden mb-3 bg-[#18181B]">
                  <Image
                    src="/images/broken-record.jpg"
                    alt="Broken Record Capsule"
                    fill
                    unoptimized
                    className="object-cover object-[center_20%] group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                  />
                </div>
                <span className="text-[9px] font-mono uppercase tracking-widest text-[#71717A] block">
                  CAPSULE 01 · 3 PIECES
                </span>
                <h3 className="text-sm font-black uppercase text-[#0A0A0A] mt-0.5">
                  BROKEN RECORD
                </h3>
                <p className="text-[11px] text-[#71717A] mt-1 font-mono">
                  Heavyweight Combed Cotton & MF DOOM Vinyl Homage
                </p>
              </Link>

              {/* Capsule 2 */}
              <Link
                href={`/collections/${primaryCollection.slug}?capsule=we-are-who-we-are`}
                className="p-4 border border-[#E4E4E7] bg-white rounded-xl hover:border-black transition-all group"
              >
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden mb-3 bg-[#18181B]">
                  <Image
                    src="/images/we-are-who-we-are.jpg"
                    alt="We Are Who We Are Capsule"
                    fill
                    unoptimized
                    className="object-cover object-[center_20%] group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                  />
                </div>
                <span className="text-[9px] font-mono uppercase tracking-widest text-[#71717A] block">
                  CAPSULE 02 · 3 PIECES
                </span>
                <h3 className="text-sm font-black uppercase text-[#0A0A0A] mt-0.5">
                  WE ARE WHO WE ARE
                </h3>
                <p className="text-[11px] text-[#71717A] mt-1 font-mono">
                  Nairobi Street Culture & Hand-Lettered Identity
                </p>
              </Link>

              {/* Capsule 3 */}
              <Link
                href={`/collections/${primaryCollection.slug}?capsule=skull-caps`}
                className="p-4 border border-[#E4E4E7] bg-white rounded-xl hover:border-black transition-all group"
              >
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden mb-3 bg-[#18181B]">
                  <Image
                    src="/images/skull-cap-model.jpg"
                    alt="Skull Caps Capsule"
                    fill
                    unoptimized
                    className="object-cover object-[center_15%] group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                  />
                </div>
                <span className="text-[9px] font-mono uppercase tracking-widest text-[#71717A] block">
                  CAPSULE 03 · 3 PIECES
                </span>
                <h3 className="text-sm font-black uppercase text-[#0A0A0A] mt-0.5">
                  SIGNATURE SKULL CAPS
                </h3>
                <p className="text-[11px] text-[#71717A] mt-1 font-mono">
                  Form-Fitting Contoured Knit in Black, Grey & Camo
                </p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

