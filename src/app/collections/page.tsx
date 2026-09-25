'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { useStore } from '@/lib/use-store';

export default function CollectionsPage() {
  const { collections } = useStore();

  return (
    <div className="pt-24 sm:pt-32 pb-24 px-4 sm:px-8 lg:px-12 max-w-[1600px] mx-auto min-h-screen text-white font-sans">
      {/* Editorial Header */}
      <div className="pb-8 sm:pb-12 mb-8 sm:mb-12 border-b border-white/10">
        <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.24em] uppercase text-white/50 block mb-2 font-bold">
          ARCHIVES & CAPSULES // NAIROBI
        </span>
        <h1 className="pesos-text-face text-3xl sm:text-5xl lg:text-6xl font-bold uppercase tracking-[-0.04em] text-white">
          COLLECTIONS & DROPS
        </h1>
      </div>

      {/* Collection Cards Grid */}
      <div className="space-y-6 sm:space-y-10">
        {collections.map((col) => {
          return (
            <Link
              key={col.id}
              href={`/collections/${col.slug}`}
              className="block group relative w-full overflow-hidden glass-card rounded-2xl sm:rounded-3xl border border-white/15 shadow-2xl transition-all duration-500 hover:border-white/35"
            >
              <div className="relative w-full aspect-[4/3] sm:aspect-[2/1] lg:aspect-[21/9] bg-[#0d0d0d] overflow-hidden">
                <Image
                  src={col.bannerImage || col.coverImage}
                  alt={col.name}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  sizes="100vw"
                />
                {/* Gradient overlay from bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-5 sm:p-10 lg:p-14" />
                
                {/* Collection name overlay */}
                <div className="absolute bottom-5 left-5 right-5 sm:bottom-10 sm:left-10 sm:right-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white">
                  <div>
                    <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.22em] uppercase text-white/70 block mb-1">
                      CAPSULE ARCHIVE
                    </span>
                    <h2 className="pesos-text-face text-2xl sm:text-4xl lg:text-5xl font-black uppercase tracking-[-0.03em] leading-tight">
                      {col.name}
                    </h2>
                    {col.description && (
                      <p className="text-xs sm:text-sm text-white/70 mt-1 max-w-lg line-clamp-2 font-normal">
                        {col.description}
                      </p>
                    )}
                  </div>
                  <div className="inline-flex items-center gap-2 glass-button px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl text-[11px] sm:text-[12px] font-mono uppercase tracking-widest font-semibold shrink-0 group-hover:bg-white group-hover:text-black transition-colors w-fit">
                    <span>EXPLORE DROP</span>
                    <ArrowRight size={13} />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
