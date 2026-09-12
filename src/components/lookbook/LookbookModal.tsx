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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-50 p-2 text-[#A1A1AA] hover:text-white transition-colors"
        aria-label="Close lookbook"
      >
        <X size={28} />
      </button>

      {/* Nav Chevrons */}
      <button
        onClick={handlePrev}
        className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-50 p-3 text-white hover:opacity-70 transition-opacity"
        aria-label="Previous image"
      >
        <ChevronLeft size={36} />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-50 p-3 text-white hover:opacity-70 transition-opacity"
        aria-label="Next image"
      >
        <ChevronRight size={36} />
      </button>

      {/* Main Exhibition Container */}
      <div className="max-w-7xl w-full mx-auto px-16 py-12 flex flex-col items-center justify-center h-full max-h-screen relative">
        {/* Big Editorial Image */}
        <div className="relative w-full h-full max-h-[75vh] flex justify-center items-center">
          <Image
            src={currentItem.imageUrl}
            alt={currentItem.title}
            fill
            className="object-contain"
            priority
            sizes="100vw"
          />
        </div>

        {/* Caption */}
        <div className="absolute bottom-12 left-0 right-0 text-center px-16">
          <span className="text-[10px] font-mono tracking-wider uppercase text-white/70 block mb-2">
            {selectedIndex + 1} / {items.length}
          </span>
          <h2 className="text-lg font-bold text-white uppercase tracking-widest mb-1">
            {currentItem.title}
          </h2>
          <p className="text-sm text-white/70">
            {currentItem.description}
          </p>
        </div>
      </div>
    </div>
  );
}
