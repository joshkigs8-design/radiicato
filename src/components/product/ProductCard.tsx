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
        className="group relative flex flex-col"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Container */}
        <div className="relative aspect-[3/4] w-full bg-[#F4F4F5] overflow-hidden border border-transparent group-hover:border-[#0A0A0A] transition-all duration-500">
          {/* Primary & Hover Image Crossfade */}
          <Link href={`/product/${product.slug}`} className="absolute inset-0">
            {primaryImg && (
              <Image
                src={primaryImg.url}
                alt={product.name}
                fill
                className={`object-cover object-center transition-all duration-700 ease-out ${
                  hoverImg && isHovered ? 'opacity-0 scale-[1.035]' : 'opacity-100 scale-100'
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
                  isHovered ? 'opacity-100 scale-[1.035]' : 'opacity-0 scale-100'
                }`}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            )}
          </Link>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none z-10">
            {isSoldOut ? (
              <span className="bg-[#0A0A0A] text-white text-[9px] font-mono tracking-[0.15em] uppercase px-2.5 py-1">
                SOLD OUT
              </span>
            ) : product.isLimitedDrop ? (
              <span className="bg-[#0A0A0A] text-white text-[9px] font-mono tracking-[0.15em] uppercase px-2.5 py-1">
                LIMITED DROP ({product.dropPieceCount || 50} PCS)
              </span>
            ) : product.salePrice ? (
              <span className="bg-[#0A0A0A] text-white text-[9px] font-mono tracking-[0.15em] uppercase px-2.5 py-1">
                SALE
              </span>
            ) : product.isFeatured ? (
              <span className="bg-[#0A0A0A] text-white text-[9px] font-mono tracking-[0.15em] uppercase px-2.5 py-1">
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
            className={`absolute top-3 right-3 z-10 p-2 rounded-full transition-all ${
              inWish
                ? 'bg-[#0A0A0A] text-white'
                : 'bg-white text-[#0A0A0A] border border-[#E4E4E7]'
            }`}
            aria-label="Toggle wishlist"
          >
            <Heart size={14} className={inWish ? 'fill-white' : ''} />
          </button>

          {/* Quick Add Overlay on Hover (Desktop) */}
          {!isSoldOut && (
            <div className="absolute inset-x-0 bottom-0 p-3 bg-white/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:flex justify-center z-10">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setQuickAddOpen(true);
                }}
                className="w-full bg-[#0A0A0A] text-white hover:opacity-80 py-2.5 px-3 text-[10px] font-bold tracking-[0.14em] uppercase flex items-center justify-center gap-1.5 transition-colors"
              >
                <Plus size={14} />
                <span>QUICK ADD</span>
              </button>
            </div>
          )}
        </div>

        {/* Product Details info */}
        <div className="pt-3.5 pb-2 space-y-1.5">
          {/* Swatches */}
          <div className="flex items-center gap-1.5">
            {distinctColors.map((color) => (
              <span
                key={color.id}
                title={color.colorName}
                className="w-2.5 h-2.5 rounded-full border border-[#E4E4E7] inline-block shadow-xs"
                style={{ backgroundColor: color.colorHex }}
              />
            ))}
            <span className="text-[10px] font-mono text-[#71717A] ml-1 uppercase">
              {product.variants.length} SIZES
            </span>
          </div>

          {/* Title */}
          <Link href={`/product/${product.slug}`} className="block group-hover:opacity-70 transition-opacity">
            <h3 className="text-[11px] font-mono font-semibold tracking-[0.12em] uppercase text-[#0A0A0A] line-clamp-1">
              {product.name}
            </h3>
          </Link>

          {/* Price */}
          <div className="flex items-baseline gap-2 text-[11px] font-mono font-bold text-[#0A0A0A]">
            {product.salePrice ? (
              <>
                <span>{formatKES(product.salePrice)}</span>
                <span className="text-[#71717A] line-through font-normal">{formatKES(product.price)}</span>
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
