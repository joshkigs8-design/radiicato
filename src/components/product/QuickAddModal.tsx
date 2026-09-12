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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white border border-[#E4E4E7] rounded-none max-w-md w-full p-6 text-[#0A0A0A] relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#71717A] hover:text-[#0A0A0A] p-1"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <div className="flex gap-4">
          <div className="relative w-20 h-24 bg-[#F4F4F5] overflow-hidden flex-shrink-0 border border-[#E4E4E7]">
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
                  <span className="text-[#0A0A0A] font-bold">SOLD OUT</span>
                ) : activeVariant.stockQuantity <= activeVariant.lowStockThreshold ? (
                  <span className="text-[#0A0A0A] font-bold">
                    LOW STOCK ({activeVariant.stockQuantity} LEFT)
                  </span>
                ) : (
                  <span className="text-[#0A0A0A] font-bold">IN STOCK</span>
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
                  className={`border text-[11px] font-mono tracking-wider uppercase px-4 py-2.5 transition-all ${
                    isSelected
                      ? 'bg-[#0A0A0A] text-white border-[#0A0A0A]'
                      : isOut
                      ? 'border-[#E4E4E7] text-[#A1A1AA] opacity-30 line-through cursor-not-allowed bg-[#FAFAFA]'
                      : 'border-[#E4E4E7] text-black hover:border-[#0A0A0A] bg-white'
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
            className={`w-full py-4 text-[11px] font-mono tracking-wider uppercase flex items-center justify-center gap-2 transition-all ${
              added
                ? 'bg-[#0A0A0A] text-white'
                : !activeVariant || activeVariant.stockQuantity <= 0
                ? 'bg-[#F4F4F5] text-[#A1A1AA] cursor-not-allowed border border-[#E4E4E7]'
                : 'btn-primary bg-[#0A0A0A] text-white hover:opacity-80'
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
