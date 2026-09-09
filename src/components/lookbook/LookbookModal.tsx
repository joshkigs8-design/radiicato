'use client';

import React, { useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { LookbookItem } from '@/types';

interface LookbookModalProps {
  items: LookbookItem[];
  selectedIndex: number;
  isOpen?: boolean;
  onClose: () => void;
  onSelectIndex: (index: number) => void;
}

export function LookbookModal({ items, selectedIndex, isOpen = true, onClose, onSelectIndex }: LookbookModalProps) {
  const currentItem = items[selectedIndex];

  if (!isOpen || !currentItem) return null;

  const handleNext = useCallback(() => {
    onSelectIndex((selectedIndex + 1) % items.length);
  }, [selectedIndex, items.length, onSelectIndex]);

  const handlePrev = useCallback(() => {
    onSelectIndex((selectedIndex - 1 + items.length) % items.length);
  }, [selectedIndex, items.length, onSelectIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, handleNext, handlePrev]);

  if (!currentItem) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-2xl">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-50 p-2 text-[#8E8E93] hover:text-white transition-colors"
        aria-label="Close lookbook"
      >
        <X size={28} />
      </button>

      {/* Nav Chevrons */}
      <button
        onClick={handlePrev}
        className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-50 p-3 text-white/50 hover:text-white bg-black/40 hover:bg-black/80 rounded-full transition-all"
        aria-label="Previous image"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-50 p-3 text-white/50 hover:text-white bg-black/40 hover:bg-black/80 rounded-full transition-all"
        aria-label="Next image"
      >
        <ChevronRight size={24} />
      </button>

      {/* Main Exhibition Container */}
      <div className="max-w-6xl w-full mx-auto px-6 py-12 flex flex-col lg:flex-row gap-8 items-center h-full max-h-[90vh]">
        {/* Big Editorial Image */}
        <div className="relative flex-1 w-full h-[60vh] lg:h-[80vh] bg-[#111] overflow-hidden border border-[#222]">
          <Image
            src={currentItem.imageUrl}
            alt={currentItem.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1024px) 100vw, 70vw"
          />
        </div>

        {/* Story Sidebar */}
        <div className="w-full lg:w-80 flex flex-col justify-between text-white space-y-6">
          <div className="space-y-3">
            <span className="text-[10px] font-mono tracking-widest text-[#536344] uppercase">
              LOOKBOOK EXHIBIT {selectedIndex + 1} / {items.length}
            </span>
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider font-display">
              {currentItem.title}
            </h2>
            <p className="text-xs text-[#A1A1AA] leading-relaxed">
              {currentItem.description}
            </p>
          </div>

          {currentItem.collectionSlug && (
            <div className="pt-4 border-t border-[#1F1F1F]">
              <Link
                href={`/collections/${currentItem.collectionSlug}`}
                onClick={onClose}
                className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase bg-white text-black px-5 py-3 hover:bg-[#E5E5EA] transition-colors"
              >
                <span>EXPLORE COLLECTION</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
