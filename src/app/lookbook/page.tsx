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
    <div className="pt-28 sm:pt-36 pb-32 px-6 sm:px-12 max-w-[1600px] mx-auto min-h-screen bg-white">
      {/* Editorial Header */}
      <div className="pb-12 border-b border-[#E4E4E7] mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#4D5936] font-bold block">
            EDITORIAL ARCHIVE // NAIROBI ROOTS
          </span>
          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-[#0A0A0A] font-display mt-2">
            NAIROBI LOOKBOOK
          </h1>
          <p className="text-sm text-[#71717A] max-w-xl mt-3 font-light leading-relaxed">
            Visual dispatches from Kilimani rooftop sessions, Westlands underground sound studios, and Nairobi streets. Unapologetic silhouettes, 280 GSM heavyweight drape, and metallic liquid chrome details.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-[#0A0A0A] text-white px-5 py-2.5 text-xs font-bold tracking-widest uppercase hover:bg-[#27272A] transition-colors shadow-sm"
          >
            <span>SHOP RELEASES</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Lookbook Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {lookbook.map((item, idx) => (
          <div
            key={item.id}
            onClick={() => handleOpenLookbook(idx)}
            className="group relative bg-[#FAFAF9] border border-[#E5E5E5] overflow-hidden cursor-pointer shadow-sm hover:border-black transition-all flex flex-col"
          >
            <div className="relative aspect-[3/4] overflow-hidden bg-[#F4F4F5]">
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="bg-white/90 text-black px-4 py-2 text-[11px] font-mono tracking-widest uppercase font-bold flex items-center gap-2 backdrop-blur-sm">
                  <Eye size={14} /> VIEW EXHIBIT
                </span>
              </div>
              <div className="absolute top-3 left-3 bg-black/80 text-white px-2 py-0.5 text-[9px] font-mono tracking-widest uppercase backdrop-blur-sm">
                EXHIBIT 0{idx + 1}
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-xs sm:text-sm font-black text-[#0A0A0A] uppercase tracking-wide group-hover:text-[#4D5936] transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-[#71717A] mt-2 font-light line-clamp-3 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {item.collectionSlug && (
                <div className="mt-4 pt-3 border-t border-[#F4F4F5] flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#71717A] uppercase">
                    CAPSULE
                  </span>
                  <span className="text-[10px] font-mono font-bold text-[#4D5936] uppercase">
                    {item.collectionSlug}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Editorial Quote */}
      <div className="mt-20 border border-[#E5E5E5] bg-[#F8F8F9] p-8 sm:p-12 text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 text-[10px] font-mono tracking-widest uppercase text-[#4D5936] font-bold">
          <Sparkles size={12} />
          <span>NAIROBI ATELIER ARCHIVE</span>
        </div>
        <blockquote className="text-xl sm:text-2xl font-black uppercase tracking-tight text-[#0A0A0A] font-display">
          &ldquo;WE REJECT FAST-FASHION DILUTION. CUT FOR NAIROBI CREATIVES WHO REFUSE TO CONFORM.&rdquo;
        </blockquote>
        <p className="text-xs text-[#71717A] font-mono uppercase">
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
  );
}
