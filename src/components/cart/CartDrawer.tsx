'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Plus, Minus, Trash2, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { useStore } from '@/lib/use-store';
import { formatKES } from '@/lib/utils';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { 
    cart, 
    cartSummary, 
    updateCartQuantity, 
    removeFromCart, 
    toggleWishlist,
    validateCoupon 
  } = useStore();

  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<{ amount: number; code: string } | null>(null);
  const [couponError, setCouponError] = useState('');

  if (!isOpen) return null;

  const freeShippingThreshold = 10000;
  const remainingForFree = Math.max(0, freeShippingThreshold - cartSummary.subtotal);
  const progressPercent = Math.min(100, (cartSummary.subtotal / freeShippingThreshold) * 100);

  const discountVal = appliedDiscount ? appliedDiscount.amount : 0;
  const finalTotal = Math.max(0, cartSummary.subtotal - discountVal);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (!promoCode.trim()) return;

    const res = validateCoupon(promoCode.trim(), cartSummary.subtotal);
    if (res.valid) {
      setAppliedDiscount({ amount: res.discountAmount, code: promoCode.trim().toUpperCase() });
      setPromoCode('');
    } else {
      setCouponError(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-[#E5E5E5] text-[#0A0A0A] flex flex-col shadow-2xl">
          {/* Header */}
          <div className="px-6 py-5 border-b border-[#E5E5E5] flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <h2 className="text-sm font-bold tracking-widest uppercase text-[#0A0A0A]">Shopping Bag</h2>
              <span className="text-xs font-mono text-[#71717A]">({cartSummary.itemsCount})</span>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-[#71717A] hover:text-black transition-colors"
              aria-label="Close cart"
            >
              <X size={20} />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="px-6 py-3 bg-[#F4F6F0] border-b border-[#DCE4D3]">
            {remainingForFree > 0 ? (
              <p className="text-[11px] text-[#52525B]">
                Add <span className="text-black font-bold">{formatKES(remainingForFree)}</span> more for{' '}
                <span className="text-[#4D5936] font-bold">Free Express Shipping</span> in Nairobi.
              </p>
            ) : (
              <p className="text-[11px] text-[#4D5936] font-bold flex items-center gap-1.5">
                <ShieldCheck size={14} /> You have unlocked FREE Express Delivery!
              </p>
            )}
            <div className="w-full bg-[#E2E8DC] h-1.5 mt-2 rounded-full overflow-hidden">
              <div
                className="bg-[#4D5936] h-full transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Item List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full border border-[#E5E5E5] flex items-center justify-center text-[#71717A]">
                  <Tag size={24} />
                </div>
                <p className="text-sm font-bold tracking-wider uppercase text-[#0A0A0A]">Your bag is currently empty</p>
                <p className="text-xs text-[#71717A] max-w-xs">
                  Discover heavyweight drops and underground silhouettes.
                </p>
                <button
                  onClick={onClose}
                  className="mt-4 inline-block bg-[#0A0A0A] text-white px-6 py-2.5 text-xs font-bold tracking-widest uppercase hover:bg-[#27272A] transition-colors"
                >
                  <Link href="/shop" onClick={onClose}>Explore The Collection</Link>
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="flex gap-4 border-b border-[#E5E5E5] pb-5">
                  {/* Thumbnail */}
                  <div className="relative w-20 h-24 bg-[#F4F4F5] flex-shrink-0 overflow-hidden border border-[#E5E5E5]">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <Link
                          href={`/product/${item.slug}`}
                          onClick={onClose}
                          className="text-xs font-bold text-[#0A0A0A] hover:text-[#4D5936] line-clamp-1"
                        >
                          {item.name}
                        </Link>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-[#71717A] hover:text-red-600 p-0.5 ml-2 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      {/* Variant Specs */}
                      <div className="mt-1 flex items-center gap-2 text-[11px] text-[#71717A]">
                        <span className="flex items-center gap-1">
                          <span
                            className="w-2.5 h-2.5 rounded-full border border-[#D4D4D8] inline-block"
                            style={{ backgroundColor: item.colorHex }}
                          />
                          {item.colorName}
                        </span>
                        <span>•</span>
                        <span className="font-mono bg-[#F4F4F5] border border-[#E5E5E5] px-1.5 py-0.5 rounded text-[10px] text-black font-semibold">
                          {item.size}
                        </span>
                      </div>

                      <p className="mt-2 text-xs font-mono font-bold text-[#0A0A0A]">
                        {formatKES(item.price)}
                      </p>
                    </div>

                    {/* Quantity Controls & Wishlist save */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center border border-[#D4D4D8] bg-white">
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-1 text-[#52525B] hover:text-black transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="px-2 text-xs font-mono font-bold">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.maxStock}
                          className="px-2 py-1 text-[#52525B] hover:text-black transition-colors disabled:opacity-30"
                          aria-label="Increase quantity"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <button
                        onClick={() => {
                          toggleWishlist(item.productId);
                          removeFromCart(item.id);
                        }}
                        className="text-[10px] tracking-wider uppercase text-[#71717A] hover:text-black transition-colors font-medium"
                      >
                        Save for later
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Area */}
          {cart.length > 0 && (
            <div className="p-6 bg-[#FAFAF9] border-t border-[#E5E5E5] space-y-4">
              {/* Promo Code Form */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input
                  type="text"
                  placeholder="PROMO CODE"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 bg-white border border-[#D4D4D8] text-xs uppercase px-3 py-2 text-black placeholder-[#A1A1AA] focus:outline-none focus:border-black font-mono shadow-xs"
                />
                <button
                  type="submit"
                  className="bg-[#0A0A0A] hover:bg-[#27272A] text-white text-xs font-bold px-4 py-2 uppercase tracking-wider transition-colors shadow-xs"
                >
                  Apply
                </button>
              </form>

              {appliedDiscount && (
                <div className="flex justify-between items-center text-xs text-[#4D5936] font-mono bg-[#F4F6F0] px-3 py-1.5 border border-[#DCE4D3]">
                  <span>Code ({appliedDiscount.code}) Applied</span>
                  <span>-{formatKES(appliedDiscount.amount)}</span>
                </div>
              )}

              {couponError && (
                <p className="text-[11px] text-red-600 font-medium">{couponError}</p>
              )}

              {/* Subtotal & Total */}
              <div className="space-y-1.5 pt-2 text-xs">
                <div className="flex justify-between text-[#52525B]">
                  <span>Subtotal</span>
                  <span className="font-mono text-black font-bold">{formatKES(cartSummary.subtotal)}</span>
                </div>
                {appliedDiscount && (
                  <div className="flex justify-between text-[#4D5936]">
                    <span>Discount</span>
                    <span className="font-mono font-bold">-{formatKES(appliedDiscount.amount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#52525B]">
                  <span>Estimated Shipping</span>
                  <span className="font-mono text-black">Calculated at checkout</span>
                </div>
                <div className="flex justify-between text-sm font-bold pt-2 border-t border-[#E5E5E5] text-[#0A0A0A]">
                  <span className="tracking-wider uppercase">Estimated Total</span>
                  <span className="font-mono text-base">{formatKES(finalTotal)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-2">
                <Link
                  href="/checkout"
                  onClick={onClose}
                  className="w-full bg-[#0A0A0A] text-white hover:bg-[#27272A] transition-all py-3.5 px-4 text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2 group shadow-sm"
                >
                  <span>Checkout Frictionless</span>
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/cart"
                  onClick={onClose}
                  className="w-full block text-center py-2 text-[11px] font-bold tracking-wider uppercase text-[#71717A] hover:text-black transition-colors"
                >
                  View Full Cart & Sizing Review
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

