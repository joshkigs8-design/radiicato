'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useStore } from '@/lib/use-store';

export default function CollectionsPage() {
  const { collections } = useStore();

  return (
    <div className="pt-28 sm:pt-36 pb-32 px-5 sm:px-8 lg:px-12 max-w-[1400px] mx-auto min-h-screen bg-white">
      {/* Editorial Header */}
      <div className="pb-12 mb-12">
        <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#71717A] block mb-4">
          ALL CAPSULES
        </span>
        <h1 className="text-display-md font-black uppercase">
          COLLECTIONS & DROPS
        </h1>
      </div>

      {/* Collection Cards Grid */}
      <div className="space-y-6 sm:space-y-8">
        {collections.map((col) => {
          return (
            <Link
              key={col.id}
              href={`/collections/${col.slug}`}
              className="block group relative w-full overflow-hidden border border-[#E4E4E7]"
            >
              <div className="relative w-full aspect-[16/9] sm:aspect-[2/1] bg-[#F4F4F5] img-zoom-container">
                <Image
                  src={col.bannerImage || col.coverImage}
                  alt={col.name}
                  fill
                  className="object-cover"
                  sizes="100vw"
                />
                {/* Gradient overlay from bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Collection name overlay */}
                <div className="absolute bottom-6 left-6 sm:bottom-10 sm:left-10 text-white">
                  <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight">
                    {col.name}
                  </h2>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
