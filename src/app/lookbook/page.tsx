'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Eye, Sparkles } from 'lucide-react';
import { useStore } from '@/lib/use-store';
import { LookbookModal } from '@/components/lookbook/LookbookModal';

export default function LookbookPage() {
  const { lookbook } = useStore();
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenLookbook = (index: number) => {
    setSelectedIdx(index);
    setIsModalOpen(true);
  };

  return (
    <main className="pt-28 sm:pt-36 pb-32 px-5 sm:px-8 lg:px-12 bg-white min-h-screen">
      <div className="max-w-[1400px] mx-auto">
        {/* Editorial Header */}
        <div className="pb-12 border-b border-[#E4E4E7] mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#71717A] mb-3">
              EDITORIAL ARCHIVE // NAIROBI ROOTS
            </p>
            <h1 className="text-display-md font-black uppercase tracking-tight text-[#0A0A0A]">
              NAIROBI LOOKBOOK
            </h1>
            <p className="text-sm text-[#71717A] max-w-xl mt-4 leading-relaxed">
              Visual dispatches from Kilimani rooftop sessions, Westlands underground sound studios, and Nairobi streets. Unapologetic silhouettes, 280 GSM heavyweight drape, and metallic liquid chrome details.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/shop"
              className="btn-primary inline-flex"
            >
              SHOP RELEASES
            </Link>
          </div>
        </div>

        {/* Lookbook Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {lookbook.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => handleOpenLookbook(idx)}
              className="group cursor-pointer flex flex-col gap-4 bg-white border border-[#E4E4E7] p-4 hover:border-[#0A0A0A] transition-colors"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-[#F4F4F5] border border-[#E4E4E7] img-zoom-container">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-white/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="bg-[#0A0A0A] text-white px-4 py-2 text-[11px] font-mono tracking-widest uppercase font-bold flex items-center gap-2">
                    <Eye size={14} /> VIEW EXHIBIT
                  </span>
                </div>
                <div className="absolute top-3 left-3 bg-[#0A0A0A] text-white px-2 py-0.5 text-[9px] font-mono tracking-widest uppercase">
                  EXHIBIT 0{idx + 1}
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#0A0A0A] uppercase tracking-wide">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#71717A] mt-2 line-clamp-3 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {item.collectionSlug && (
                  <div className="mt-4 pt-3 border-t border-[#E4E4E7] flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[#71717A] uppercase">
                      CAPSULE
                    </span>
                    <span className="text-[10px] font-mono font-bold text-[#0A0A0A] uppercase">
                      {item.collectionSlug}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Editorial Quote */}
        <div className="mt-20 border border-[#E4E4E7] bg-[#F4F4F5] p-8 sm:p-16 text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-1.5 text-[10px] font-mono tracking-widest uppercase text-[#0A0A0A] font-bold">
            <Sparkles size={12} />
            <span>NAIROBI ATELIER ARCHIVE</span>
          </div>
          <blockquote className="text-xl sm:text-2xl font-black uppercase tracking-tight text-[#0A0A0A] leading-tight">
            "WE REJECT FAST-FASHION DILUTION. CUT FOR NAIROBI CREATIVES WHO REFUSE TO CONFORM."
          </blockquote>
          <p className="text-[10px] text-[#71717A] font-mono uppercase tracking-[0.2em]">
            Studio 04 // Parklands Road // Nairobi, Kenya
          </p>
        </div>

        {/* Fullscreen Lookbook Modal */}
        <LookbookModal
          items={lookbook}
          selectedIndex={selectedIdx}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSelectIndex={setSelectedIdx}
        />
      </div>
    </main>
  );
}
