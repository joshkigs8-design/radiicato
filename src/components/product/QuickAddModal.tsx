'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X, Check, ShoppingBag } from 'lucide-react';
import { Product } from '@/types';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in font-sans">
      <div className="glass-panel-heavy rounded-2xl max-w-md w-full p-6 text-white relative shadow-2xl border border-white/20">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <div className="flex gap-4">
          <div className="relative w-20 h-24 bg-[#121212] rounded-xl overflow-hidden flex-shrink-0 border border-white/10">
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
            <span className="text-[10px] font-mono text-white/50 uppercase">{product.sku}</span>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white line-clamp-1">{product.name}</h3>
            <p className="text-sm font-mono mt-1 text-white font-bold">
              {formatKES(product.salePrice || product.price)}
            </p>
          </div>
        </div>

        {/* Variant Size Matrix */}
        <div className="mt-6 space-y-3">
          <div className="flex justify-between text-xs tracking-wider uppercase text-white/60">
            <span>Select Size</span>
            {activeVariant && (
              <span className="text-[11px] font-mono">
                {activeVariant.stockQuantity === 0 ? (
                  <span className="text-rose-400 font-bold">SOLD OUT</span>
                ) : activeVariant.stockQuantity <= activeVariant.lowStockThreshold ? (
                  <span className="text-amber-300 font-bold">
                    LOW STOCK ({activeVariant.stockQuantity} LEFT)
                  </span>
                ) : (
                  <span className="text-emerald-400 font-bold">IN STOCK</span>
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
                  className={`rounded-lg text-[11px] font-mono tracking-wider uppercase px-3 py-2 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white text-black font-bold shadow-md'
                      : isOut
                      ? 'border border-white/10 text-white/30 line-through cursor-not-allowed bg-white/5'
                      : 'border border-white/20 text-white/80 hover:border-white hover:text-white bg-white/5'
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
            className={`w-full py-3.5 text-[11px] font-mono font-bold tracking-wider uppercase flex items-center justify-center gap-2 rounded-xl transition-all ${
              added
                ? 'bg-emerald-500 text-black'
                : !activeVariant || activeVariant.stockQuantity <= 0
                ? 'bg-white/10 text-white/30 cursor-not-allowed border border-white/10'
                : 'glass-button bg-white text-black hover:bg-white/90 shadow-xl'
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
