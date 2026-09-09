'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Clock, Sparkles } from 'lucide-react';
import { useStore } from '@/lib/use-store';

export default function CollectionsPage() {
  const { collections, products } = useStore();

  return (
    <div className="pt-28 sm:pt-36 pb-32 px-6 sm:px-12 max-w-[1600px] mx-auto min-h-screen bg-white">
      {/* Editorial Header */}
      <div className="pb-12 border-b border-[#E4E4E7] mb-16">
        <span className="text-[10px] font-mono tracking-widest uppercase text-[#4D5936] font-bold">
          RADIICATO ARCHIVES & CAPSULES
        </span>
        <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-[#0A0A0A] font-display mt-1">
          COLLECTIONS & DROPS
        </h1>
        <p className="text-sm text-[#71717A] max-w-xl mt-3 font-light">
          Each Radiicato release represents an intentional study in bespoke silhouettes, heavyweight milled textiles, and rebellious underground aesthetics.
        </p>
      </div>

      {/* Collection Cards Grid */}
      <div className="space-y-16">
        {collections.map((col, index) => {
          const colProducts = products.filter((p) => p.collectionId === col.id);
          const isEven = index % 2 === 0;

          return (
            <div
              key={col.id}
              className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center p-6 sm:p-8 bg-[#FAFAF9] border border-[#E4E4E7] hover:border-[#D4D4D8] transition-all group`}
            >
              {/* Image side */}
              <div
                className={`lg:col-span-7 relative aspect-[16/10] bg-[#F4F4F5] overflow-hidden border border-[#E4E4E7] ${
                  !isEven ? 'lg:order-2' : ''
                }`}
              >
                <Image
                  src={col.bannerImage || col.coverImage}
                  alt={col.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-95"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                <div className="absolute top-4 left-4 flex gap-2">
                  {col.status === 'scheduled' ? (
                    <span className="bg-white/95 backdrop-blur-md text-amber-800 border border-amber-200 text-[10px] font-mono tracking-widest uppercase px-3 py-1 flex items-center gap-1.5 font-bold shadow-sm">
                      <Clock size={12} /> SCHEDULED DROP
                    </span>
                  ) : (
                    <span className="bg-white/95 backdrop-blur-md text-[#4D5936] border border-stone-200 text-[10px] font-mono tracking-widest uppercase px-3 py-1 font-bold shadow-sm">
                      ACTIVE ARCHIVE
                    </span>
                  )}
                </div>

                <div className="absolute bottom-4 left-4 text-[10px] font-mono tracking-widest uppercase text-white font-medium drop-shadow-sm">
                  RELEASE {String(index + 1).padStart(2, '0')} • {colProducts.length} ARCHIVAL PIECES
                </div>
              </div>

              {/* Narrative Side */}
              <div className={`lg:col-span-5 space-y-6 ${!isEven ? 'lg:order-1' : ''}`}>
                <div className="space-y-2">
                  <span className="text-[10px] font-mono tracking-widest uppercase text-[#4D5936] font-bold">
                    SERIES IDENTIFIER #{col.id.toUpperCase()}
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-[#0A0A0A] font-display">
                    {col.name}
                  </h2>
                </div>

                <p className="text-sm text-[#71717A] leading-relaxed font-light">
                  {col.description}
                </p>

                <div className="pt-2">
                  <Link
                    href={`/collections/${col.slug}`}
                    className="inline-flex items-center gap-3 bg-[#0A0A0A] text-white hover:bg-[#27272A] transition-all px-7 py-3.5 text-xs font-bold tracking-[0.2em] uppercase group shadow-sm"
                  >
                    <span>{col.status === 'scheduled' ? 'VIEW DROP DETAILS' : 'ENTER COLLECTION'}</span>
                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
