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
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      <div className="max-w-4xl mx-auto px-6 py-8 min-h-screen flex flex-col">
        {/* Top bar with close button */}
        <div className="flex justify-between items-center pb-6 border-b border-[#E4E4E7]">
          <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#71717A] font-semibold">
            GLOBAL ARCHIVE SEARCH
          </span>
          <button
            onClick={onClose}
            className="text-[#71717A] hover:text-[#0A0A0A] p-2 transition-colors"
            aria-label="Close search overlay"
          >
            <X size={24} />
          </button>
        </div>

        {/* Big Search Input */}
        <div className="py-10">
          <div className="relative flex items-center">
            <input
              ref={inputRef}
              type="text"
              placeholder="SEARCH..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="text-2xl sm:text-4xl font-black uppercase tracking-tight bg-transparent border-b-2 border-[#0A0A0A] pb-2 w-full outline-none placeholder:text-[#E4E4E7] text-[#0A0A0A]"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-0 bottom-3 text-[10px] font-mono tracking-widest uppercase text-[#71717A] hover:text-[#0A0A0A]"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Trending Tags */}
          {!query && (
            <div className="mt-8 space-y-3">
              <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#71717A]">Trending Searches</p>
              <div className="flex flex-wrap gap-2">
                {TRENDING_SEARCHES.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="text-[11px] font-mono uppercase px-3 py-1.5 bg-[#F4F4F5] text-[#0A0A0A] border border-[#E4E4E7] hover:border-[#0A0A0A] transition-colors"
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
              <div className="flex justify-between items-center pb-4 border-b border-[#E4E4E7]">
                <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#71717A]">
                  {filteredProducts.length} Results
                </span>
                <Link
                  href={`/shop?search=${encodeURIComponent(query)}`}
                  onClick={onClose}
                  className="text-[11px] font-mono uppercase text-[#0A0A0A] hover:underline flex items-center gap-1 font-bold"
                >
                  View in Shop <ArrowRight size={12} />
                </Link>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="py-16 text-center text-[#71717A] space-y-2">
                  <p className="text-sm">No items matching &ldquo;{query}&rdquo;</p>
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
                        className="group flex flex-col gap-3 p-4 bg-white border border-[#E4E4E7] hover:border-[#0A0A0A] transition-colors"
                      >
                        <div className="relative aspect-[3/4] bg-[#F4F4F5] overflow-hidden w-full border border-[#E4E4E7]">
                          {primaryImg && (
                            <Image
                              src={primaryImg.url}
                              alt={product.name}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw, 33vw"
                            />
                          )}
                        </div>
                        <div className="flex flex-col">
                          <h4 className="text-sm font-bold text-[#0A0A0A] uppercase tracking-wide truncate">
                            {product.name}
                          </h4>
                          <p className="text-sm text-[#71717A]">
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

