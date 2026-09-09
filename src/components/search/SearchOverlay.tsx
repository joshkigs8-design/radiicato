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

const TRENDING_SEARCHES = ['OVERSIZED TEE', 'HEAVYWEIGHT HOODIE', 'METALLIC', 'CARGO PANTS', 'THE CORE'];

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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-white/98 backdrop-blur-2xl text-[#0A0A0A]">
      <div className="max-w-4xl mx-auto px-6 py-8 min-h-screen flex flex-col">
        {/* Top bar with close button */}
        <div className="flex justify-between items-center pb-6 border-b border-[#E5E5E5]">
          <span className="text-xs font-mono tracking-widest uppercase text-[#71717A] font-semibold">
            RADIICATO GLOBAL ARCHIVE SEARCH
          </span>
          <button
            onClick={onClose}
            className="text-[#71717A] hover:text-black p-2 transition-colors"
            aria-label="Close search overlay"
          >
            <X size={24} />
          </button>
        </div>

        {/* Big Search Input */}
        <div className="py-10">
          <div className="relative flex items-center">
            <Search size={28} className="text-[#71717A] absolute left-0" />
            <input
              ref={inputRef}
              type="text"
              placeholder="SEARCH SILHOUETTES, SKUS, FABRICS..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent pl-12 pr-4 text-2xl sm:text-3xl font-light tracking-wider text-[#0A0A0A] placeholder-[#A1A1AA] focus:outline-none border-b border-[#D4D4D8] focus:border-black pb-4 uppercase font-display"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="text-xs uppercase tracking-wider text-[#71717A] hover:text-black font-bold"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Trending Tags */}
          {!query && (
            <div className="mt-8 space-y-3">
              <p className="text-xs uppercase tracking-widest text-[#71717A] font-bold">Trending Searches</p>
              <div className="flex flex-wrap gap-2">
                {TRENDING_SEARCHES.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="text-xs px-3 py-1.5 bg-[#F4F4F5] hover:bg-[#E4E4E7] text-[#18181B] hover:text-black border border-[#E4E4E7] font-medium transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="flex-1">
          {query.trim() && (
            <div>
              <div className="flex justify-between items-center pb-4 text-xs uppercase tracking-wider text-[#71717A] font-semibold border-b border-[#E5E5E5]">
                <span>{filteredProducts.length} Results Found</span>
                <Link
                  href={`/shop?search=${encodeURIComponent(query)}`}
                  onClick={onClose}
                  className="text-black hover:underline flex items-center gap-1 font-bold"
                >
                  View in Shop <ArrowRight size={12} />
                </Link>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="py-16 text-center text-[#71717A] space-y-2">
                  <p className="text-sm font-semibold">No items matching &ldquo;{query}&rdquo;</p>
                  <p className="text-xs">Try searching for &ldquo;tee&rdquo;, &ldquo;hoodie&rdquo;, or &ldquo;black&rdquo;</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pt-6">
                  {filteredProducts.map((product) => {
                    const primaryImg = product.images.find((i) => i.isPrimary) || product.images[0];
                    return (
                      <Link
                        key={product.id}
                        href={`/product/${product.slug}`}
                        onClick={onClose}
                        className="group flex gap-4 p-3 bg-[#FAFAF9] border border-[#E5E5E5] hover:border-black transition-all shadow-xs"
                      >
                        <div className="relative w-20 h-24 bg-[#F4F4F5] overflow-hidden flex-shrink-0 border border-[#E5E5E5]">
                          {primaryImg && (
                            <Image
                              src={primaryImg.url}
                              alt={product.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                              sizes="80px"
                            />
                          )}
                        </div>
                        <div className="flex-1 flex flex-col justify-center">
                          <span className="text-[10px] font-mono text-[#71717A] uppercase">{product.sku}</span>
                          <h4 className="text-xs font-bold text-[#0A0A0A] group-hover:text-[#4D5936] line-clamp-1 mt-0.5">
                            {product.name}
                          </h4>
                          <p className="text-xs font-mono font-bold text-[#0A0A0A] mt-1">
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

