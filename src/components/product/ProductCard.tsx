'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Plus } from 'lucide-react';
import { Product } from '@/types';
import { useStore } from '@/lib/use-store';
import { formatKES } from '@/lib/utils';
import { QuickAddModal } from './QuickAddModal';

interface ProductCardProps {
  product: Product;
  onOpenCart?: () => void;
}

export function ProductCard({ product, onOpenCart }: ProductCardProps) {
  const { isInWishlist, toggleWishlist } = useStore();
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const inWish = isInWishlist(product.id);

  // Determine images
  const primaryImg = product.images.find((i) => i.isPrimary) || product.images[0];
  const hoverImg = product.images.find((i) => i.isHover) || product.images[1] || primaryImg;

  // Stock calculation
  const totalStock = product.variants.reduce((acc, v) => acc + v.stockQuantity, 0);
  const isSoldOut = totalStock === 0 || product.status === 'sold_out';

  // Extract distinct colors
  const distinctColors = Array.from(
    new Map(product.variants.map((v) => [v.colorHex, v])).values()
  );

  return (
    <>
      <div
        className="glass-card rounded-xl sm:rounded-2xl p-2.5 sm:p-3.5 flex flex-col group transition-all duration-300"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Container */}
        <div className="relative aspect-[3/4] w-full bg-[#0a0a0a] rounded-lg sm:rounded-xl border border-white/10 group-hover:border-white/30 transition-colors duration-300 overflow-hidden">
          {/* Primary & Hover Image Crossfade */}
          <Link href={`/product/${product.slug}`} className="absolute inset-0 block">
            {primaryImg && (
              <Image
                src={primaryImg.url}
                alt={product.name}
                fill
                className={`object-cover object-center transition-all duration-700 ease-out ${
                  hoverImg && isHovered ? 'opacity-0 scale-[1.03]' : 'opacity-100 scale-100'
                }`}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            )}
            {hoverImg && (
              <Image
                src={hoverImg.url}
                alt={`${product.name} alternate view`}
                fill
                className={`object-cover object-center transition-all duration-700 ease-out ${
                  isHovered ? 'opacity-100 scale-[1.03]' : 'opacity-0 scale-100'
                }`}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            )}
          </Link>

          {/* Badges */}
          <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 flex flex-col gap-1.5 pointer-events-none z-10">
            {isSoldOut ? (
              <span className="glass-pill bg-black/80 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[8px] sm:text-[9px] font-mono tracking-widest uppercase text-white/90">
                SOLD OUT
              </span>
            ) : product.isLimitedDrop ? (
              <span className="glass-pill bg-black/80 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[8px] sm:text-[9px] font-mono tracking-widest uppercase text-white/90">
                LIMITED DROP ({product.dropPieceCount || 50} PCS)
              </span>
            ) : product.salePrice ? (
              <span className="glass-pill bg-black/80 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[8px] sm:text-[9px] font-mono tracking-widest uppercase text-white/90">
                SALE
              </span>
            ) : product.isFeatured ? (
              <span className="glass-pill bg-black/80 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[8px] sm:text-[9px] font-mono tracking-widest uppercase text-white/90">
                CORE DROP
              </span>
            ) : null}
          </div>

          {/* Wishlist Button (Top Right) */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            className={`absolute top-2.5 right-2.5 sm:top-3 sm:right-3 z-10 p-1.5 sm:p-2 rounded-full transition-all duration-300 ${
              inWish
                ? 'bg-white text-black'
                : 'glass-pill text-white hover:bg-white/20'
            }`}
            aria-label="Toggle wishlist"
          >
            <Heart size={13} className={inWish ? 'fill-black' : ''} />
          </button>

          {/* Quick Add Overlay on Hover (Desktop) */}
          {!isSoldOut && (
            <div className="absolute inset-x-0 bottom-0 p-2.5 sm:p-3 bg-gradient-to-t from-black/85 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:flex justify-center z-10">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setQuickAddOpen(true);
                }}
                className="w-full glass-button text-white hover:bg-white hover:text-black py-2 px-3 text-[10px] font-mono font-bold tracking-[0.14em] uppercase flex items-center justify-center gap-1.5 rounded-lg transition-all"
              >
                <Plus size={13} />
                <span>QUICK ADD</span>
              </button>
            </div>
          )}
        </div>

        {/* Product Details info */}
        <div className="pt-2.5 sm:pt-3.5 pb-1 space-y-1 sm:space-y-1.5">
          {/* Swatches */}
          <div className="flex items-center gap-1.5">
            {distinctColors.map((color) => (
              <span
                key={color.id}
                title={color.colorName}
                className="w-2.5 h-2.5 rounded-full border border-white/20 inline-block shadow-xs"
                style={{ backgroundColor: color.colorHex }}
              />
            ))}
            <span className="text-[9px] sm:text-[10px] font-mono text-white/50 ml-1 uppercase">
              {product.variants.length} SIZES
            </span>
          </div>

          {/* Title */}
          <Link href={`/product/${product.slug}`} className="block group-hover:opacity-70 transition-opacity">
            <h3 className="text-[12px] sm:text-[14px] font-sans font-bold tracking-tight uppercase text-white line-clamp-1">
              {product.name}
            </h3>
          </Link>

          {/* Price */}
          <div className="flex items-baseline gap-2 text-[11px] sm:text-[13px] font-mono font-bold text-white">
            {product.salePrice ? (
              <>
                <span>{formatKES(product.salePrice)}</span>
                <span className="text-white/40 line-through font-normal text-[10px] sm:text-[11px]">{formatKES(product.price)}</span>
              </>
            ) : (
              <span>{formatKES(product.price)}</span>
            )}
          </div>
        </div>
      </div>

      {/* Quick Add Modal */}
      {quickAddOpen && (
        <QuickAddModal
          product={product}
          onClose={() => setQuickAddOpen(false)}
          onAddedToCart={onOpenCart}
        />
      )}
    </>
  );
}
