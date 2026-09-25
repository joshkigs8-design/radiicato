'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, X, ArrowRight } from 'lucide-react';
import { useStore } from '@/lib/use-store';
import { formatKES } from '@/lib/utils';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const TRENDING_SEARCHES = ['OVERSIZED TEE', 'HEAVYWEIGHT HOODIE', 'SKULL CAP', 'BROKEN RECORD', 'WE ARE WHO WE ARE'];

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const { products } = useStore();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredProducts = query.trim()
    ? products.filter((p) => {
        const q = query.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)) ||
          p.shortDescription.toLowerCase().includes(q)
        );
      })
    : [];

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-3xl z-50 overflow-y-auto text-white font-sans animate-fade-in">
      <div className="max-w-4xl mx-auto px-5 sm:px-6 py-8 min-h-screen flex flex-col">
        {/* Top bar with close button */}
        <div className="flex justify-between items-center pb-5 border-b border-white/10">
          <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-white/50 font-semibold">
            GLOBAL ARCHIVE SEARCH
          </span>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close search overlay"
          >
            <X size={22} />
          </button>
        </div>

        {/* Big Search Input */}
        <div className="py-8 sm:py-12">
          <div className="relative flex items-center">
            <input
              ref={inputRef}
              type="text"
              placeholder="SEARCH ARCHIVE..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="text-2xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight bg-transparent border-b-2 border-white/30 focus:border-white pb-3 w-full outline-none placeholder:text-white/20 text-white transition-colors"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-0 bottom-4 text-[10px] font-mono tracking-widest uppercase text-white/50 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Trending Tags */}
          {!query && (
            <div className="mt-8 space-y-3">
              <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-white/50">Trending Searches</p>
              <div className="flex flex-wrap gap-2">
                {TRENDING_SEARCHES.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="text-[11px] font-mono uppercase px-3 py-1.5 glass-pill text-white/80 hover:text-white hover:border-white/40 transition-colors cursor-pointer rounded-lg"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="flex-1 pb-16">
          {query.trim() && (
            <div>
              <div className="flex justify-between items-center pb-4 border-b border-white/10">
                <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-white/50">
                  {filteredProducts.length} Results
                </span>
                <Link
                  href={`/shop?search=${encodeURIComponent(query)}`}
                  onClick={onClose}
                  className="text-[11px] font-mono uppercase text-white/80 hover:text-white flex items-center gap-1 font-bold transition-colors"
                >
                  View in Shop <ArrowRight size={12} />
                </Link>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="py-16 text-center text-white/50 space-y-2">
                  <p className="text-sm font-sans">No pieces matching &ldquo;{query}&rdquo;</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6 pt-6">
                  {filteredProducts.map((product) => {
                    const primaryImg = product.images.find((i) => i.isPrimary) || product.images[0];
                    return (
                      <Link
                        key={product.id}
                        href={`/product/${product.slug}`}
                        onClick={onClose}
                        className="glass-card rounded-xl p-2.5 sm:p-3.5 flex flex-col group transition-all"
                      >
                        <div className="relative aspect-[3/4] bg-[#0a0a0a] rounded-lg overflow-hidden w-full border border-white/10">
                          {primaryImg && (
                            <Image
                              src={primaryImg.url}
                              alt={product.name}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                              sizes="(max-width: 768px) 50vw, 33vw"
                            />
                          )}
                        </div>
                        <div className="pt-2.5 flex flex-col space-y-0.5">
                          <h4 className="text-[12px] sm:text-[13px] font-bold text-white uppercase tracking-tight truncate group-hover:opacity-70 transition-opacity">
                            {product.name}
                          </h4>
                          <p className="text-[11px] sm:text-[12px] font-mono text-white/70">
                            {formatKES(product.price)}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
