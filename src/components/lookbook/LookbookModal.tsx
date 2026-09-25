'use client';

import React, { useEffect, useCallback } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
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

  if (!isOpen || !currentItem) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-2xl animate-fade-in font-sans">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50 p-2 glass-pill rounded-full text-white/80 hover:text-white transition-colors cursor-pointer"
        aria-label="Close lookbook"
      >
        <X size={22} />
      </button>

      {/* Nav Chevrons */}
      <button
        onClick={handlePrev}
        className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-50 p-2.5 sm:p-3 glass-pill rounded-full text-white hover:bg-white/20 transition-all cursor-pointer"
        aria-label="Previous image"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-50 p-2.5 sm:p-3 glass-pill rounded-full text-white hover:bg-white/20 transition-all cursor-pointer"
        aria-label="Next image"
      >
        <ChevronRight size={24} />
      </button>

      {/* Main Exhibition Container */}
      <div className="max-w-6xl w-full mx-auto px-4 sm:px-12 py-6 sm:py-10 flex flex-col items-center justify-center h-full max-h-screen relative">
        {/* Big Editorial Image */}
        <div className="relative w-full h-[60vh] sm:h-[72vh] flex justify-center items-center rounded-2xl overflow-hidden">
          <Image
            src={currentItem.imageUrl}
            alt={currentItem.title}
            fill
            className="object-contain"
            priority
            sizes="100vw"
          />
        </div>

        {/* Caption Card */}
        <div className="mt-4 sm:mt-6 w-full max-w-md mx-auto text-center px-4">
          <div className="glass-card rounded-xl p-3 sm:p-4 border-white/10 space-y-1">
            <span className="text-[9px] sm:text-[10px] font-mono tracking-widest uppercase text-white/60 block">
              LOOK {selectedIndex + 1} OF {items.length} · NAIROBI
            </span>
            <h2 className="text-sm sm:text-base font-bold text-white uppercase tracking-wider">
              {currentItem.title}
            </h2>
            {currentItem.description && (
              <p className="text-xs text-white/70 line-clamp-2">
                {currentItem.description}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
