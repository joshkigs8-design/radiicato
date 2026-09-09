'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X, Check, ShoppingBag } from 'lucide-react';
import { Product, ProductVariant } from '@/types';
import { useStore } from '@/lib/use-store';
import { formatKES } from '@/lib/utils';

interface QuickAddModalProps {
  product: Product | null;
  onClose: () => void;
  onAddedToCart?: () => void;
}

export function QuickAddModal({ product, onClose, onAddedToCart }: QuickAddModalProps) {
  const { addToCart } = useStore();
  const [selectedVariantId, setSelectedVariantId] = useState<string>('');
  const [added, setAdded] = useState(false);

  if (!product) return null;

  // Default to first variant with available stock, or first variant
  const availableVariants = product.variants;
  const activeVariant =
    availableVariants.find((v) => v.id === selectedVariantId) ||
    availableVariants.find((v) => v.stockQuantity > 0) ||
    availableVariants[0];

  const primaryImage = product.images.find((i) => i.isPrimary) || product.images[0];

  const handleAddToCart = () => {
    if (!activeVariant || activeVariant.stockQuantity <= 0) return;

    addToCart({
      productId: product.id,
      variantId: activeVariant.id,
      name: product.name,
      slug: product.slug,
      image: primaryImage.url,
      price: product.salePrice || product.price,
      colorName: activeVariant.colorName,
      colorHex: activeVariant.colorHex,
      size: activeVariant.size,
      quantity: 1,
      maxStock: activeVariant.stockQuantity,
    });

    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
      if (onAddedToCart) onAddedToCart();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white border border-[#E5E5E5] max-w-md w-full p-6 text-[#0A0A0A] relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#71717A] hover:text-black p-1"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <div className="flex gap-4">
          <div className="relative w-20 h-24 bg-[#F4F4F5] overflow-hidden flex-shrink-0 border border-[#E5E5E5]">
            {primaryImage && (
              <Image
                src={primaryImage.url}
                alt={product.name}
                fill
                className="object-cover"
                sizes="80px"
              />
            )}
          </div>
          <div className="flex-1">
            <span className="text-[10px] font-mono text-[#71717A] uppercase">{product.sku}</span>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#0A0A0A]">{product.name}</h3>
            <p className="text-sm font-mono mt-1 text-[#0A0A0A] font-bold">
              {formatKES(product.salePrice || product.price)}
            </p>
          </div>
        </div>

        {/* Variant Size Matrix */}
        <div className="mt-6 space-y-3">
          <div className="flex justify-between text-xs tracking-wider uppercase text-[#71717A]">
            <span>Select Size</span>
            {activeVariant && (
              <span className="text-[11px] font-mono">
                {activeVariant.stockQuantity === 0 ? (
                  <span className="text-red-600 font-bold">SOLD OUT</span>
                ) : activeVariant.stockQuantity <= activeVariant.lowStockThreshold ? (
                  <span className="text-amber-600 font-bold">
                    LOW STOCK ({activeVariant.stockQuantity} LEFT)
                  </span>
                ) : (
                  <span className="text-[#4D5936] font-bold">IN STOCK</span>
                )}
              </span>
            )}
          </div>

          <div className="grid grid-cols-4 gap-2">
            {availableVariants.map((variant) => {
              const isSelected = variant.id === (activeVariant?.id || '');
              const isOut = variant.stockQuantity <= 0;

              return (
                <button
                  key={variant.id}
                  disabled={isOut}
                  onClick={() => setSelectedVariantId(variant.id)}
                  className={`py-2 text-xs font-mono font-medium border transition-all ${
                    isSelected
                      ? 'bg-black text-white border-black shadow-xs'
                      : isOut
                      ? 'border-[#E5E5E5] text-[#A1A1AA] line-through cursor-not-allowed bg-[#FAFAFA]'
                      : 'border-[#D4D4D8] text-black hover:border-black bg-white'
                  }`}
                >
                  {variant.size}
                </button>
              );
            })}
          </div>
        </div>

        {/* Add CTA */}
        <div className="mt-6">
          <button
            onClick={handleAddToCart}
            disabled={!activeVariant || activeVariant.stockQuantity <= 0 || added}
            className={`w-full py-3.5 px-4 text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2 transition-all shadow-sm ${
              added
                ? 'bg-[#4D5936] text-white'
                : !activeVariant || activeVariant.stockQuantity <= 0
                ? 'bg-[#F4F4F5] text-[#A1A1AA] cursor-not-allowed border border-[#E5E5E5]'
                : 'bg-[#0A0A0A] text-white hover:bg-[#27272A]'
            }`}
          >
            {added ? (
              <>
                <Check size={16} />
                <span>ADDED TO BAG</span>
              </>
            ) : !activeVariant || activeVariant.stockQuantity <= 0 ? (
              <span>SELECT AN AVAILABLE SIZE</span>
            ) : (
              <>
                <ShoppingBag size={15} />
                <span>ADD TO BAG • {activeVariant.size}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

