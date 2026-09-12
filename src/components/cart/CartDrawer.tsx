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
        className="absolute inset-0 bg-black/30 transition-opacity duration-300"
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full">
        <div className="w-full max-w-md bg-white border-l border-[#E4E4E7] flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 border-b border-[#E4E4E7] flex items-center justify-between">
            <h2 className="text-[11px] font-mono font-semibold tracking-[0.15em] uppercase text-[#0A0A0A]">
              Shopping Bag <span className="text-[#71717A]">({cartSummary.itemsCount})</span>
            </h2>
            <button
              onClick={onClose}
              className="text-[#71717A] hover:text-[#0A0A0A] transition-colors"
              aria-label="Close cart"
            >
              <X size={16} />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="px-6 py-3 bg-[#FAFAFA] border-b border-[#E4E4E7]">
            {remainingForFree > 0 ? (
              <p className="text-[10px] font-mono uppercase tracking-wider text-[#71717A]">
                Add <span className="text-[#0A0A0A] font-bold">{formatKES(remainingForFree)}</span> more for free express shipping.
              </p>
            ) : (
              <p className="text-[10px] font-mono uppercase tracking-wider text-[#0A0A0A] font-bold flex items-center gap-1.5">
                <ShieldCheck size={14} /> Free Express Delivery Unlocked
              </p>
            )}
            <div className="w-full bg-[#F4F4F5] h-0.5 mt-2 overflow-hidden">
              <div
                className="bg-[#0A0A0A] h-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Item List */}
          <div className="flex-1 overflow-y-auto">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16 px-6 space-y-4">
                <div className="w-16 h-16 border border-[#E4E4E7] flex items-center justify-center text-[#E4E4E7]">
                  <Tag size={24} />
                </div>
                <p className="text-sm text-[#71717A]">Your bag is currently empty.</p>
                <button
                  onClick={onClose}
                  className="mt-4 inline-block border border-[#0A0A0A] text-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white transition-colors px-6 py-3 text-[11px] font-mono uppercase tracking-wider"
                >
                  <Link href="/shop" onClick={onClose}>Explore Collection</Link>
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="flex gap-4 border-b border-[#E4E4E7] py-5 px-6">
                  {/* Thumbnail */}
                  <div className="relative w-20 h-24 bg-[#F4F4F5] flex-shrink-0 overflow-hidden">
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
                          className="text-xs font-bold uppercase tracking-wider text-[#0A0A0A] hover:text-[#71717A] line-clamp-1"
                        >
                          {item.name}
                        </Link>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-[10px] font-mono text-[#A1A1AA] hover:text-[#0A0A0A] uppercase tracking-wider transition-colors"
                          title="Remove item"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      {/* Variant Specs */}
                      <div className="mt-1 flex items-center gap-2 text-[10px] font-mono text-[#71717A] uppercase">
                        <span className="flex items-center gap-1">
                          <span
                            className="w-2.5 h-2.5 border border-[#E4E4E7] inline-block"
                            style={{ backgroundColor: item.colorHex }}
                          />
                          {item.colorName}
                        </span>
                        <span>•</span>
                        <span>{item.size}</span>
                      </div>

                      <p className="mt-2 text-xs font-mono text-[#0A0A0A]">
                        {formatKES(item.price)}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center border border-[#E4E4E7]">
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 text-xs text-[#71717A] hover:text-[#0A0A0A] flex items-center justify-center transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-8 h-8 text-xs font-mono text-center flex items-center justify-center text-[#0A0A0A]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.maxStock}
                          className="w-8 h-8 text-xs text-[#71717A] hover:text-[#0A0A0A] flex items-center justify-center transition-colors disabled:opacity-30"
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
                        className="text-[10px] font-mono tracking-wider uppercase text-[#71717A] hover:text-[#0A0A0A] transition-colors"
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
            <div className="p-6 bg-[#FAFAFA] border-t border-[#E4E4E7] space-y-4">
              {/* Promo Code Form */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input
                  type="text"
                  placeholder="PROMO CODE"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 bg-white border border-[#E4E4E7] text-[11px] uppercase px-3 py-2 text-[#0A0A0A] placeholder-[#A1A1AA] focus:outline-none focus:border-[#0A0A0A] font-mono transition-colors"
                />
                <button
                  type="submit"
                  className="bg-[#0A0A0A] text-white text-[11px] font-mono font-bold px-4 py-2 uppercase tracking-[0.1em] hover:opacity-80 transition-opacity"
                >
                  Apply
                </button>
              </form>

              {appliedDiscount && (
                <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-wider text-[#0A0A0A] bg-[#F4F4F5] px-3 py-2 border border-[#E4E4E7]">
                  <span>Code ({appliedDiscount.code}) Applied</span>
                  <span>-{formatKES(appliedDiscount.amount)}</span>
                </div>
              )}

              {couponError && (
               <p className="text-[10px] font-mono text-red-600 uppercase tracking-wider">{couponError}</p>
              )}

              {/* Subtotal & Total */}
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-[#71717A] uppercase tracking-wider">Subtotal</span>
                  <span className="text-[#0A0A0A] font-bold">{formatKES(cartSummary.subtotal)}</span>
                </div>
                {appliedDiscount && (
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-[#71717A] uppercase tracking-wider">Discount</span>
                    <span className="text-[#0A0A0A] font-bold">-{formatKES(appliedDiscount.amount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-[#71717A] uppercase tracking-wider">Estimated Shipping</span>
                  <span className="text-[#0A0A0A]">Calculated at checkout</span>
                </div>
                <div className="flex justify-between pt-4 mt-2 border-t border-[#0A0A0A] text-[#0A0A0A]">
                  <span className="text-[10px] font-mono text-[#71717A] uppercase tracking-wider flex items-end">Estimated Total</span>
                  <span className="text-sm font-mono font-bold">{formatKES(finalTotal)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-4">
                <Link
                  href="/checkout"
                  onClick={onClose}
                  className="w-full bg-[#0A0A0A] text-white py-4 text-[11px] font-mono font-bold tracking-[0.15em] uppercase flex items-center justify-center gap-2 hover:opacity-80 transition-opacity"
                >
                  <span>Checkout</span>
                  <ArrowRight size={14} />
                </Link>
                <Link
                  href="/cart"
                  onClick={onClose}
                  className="w-full block text-center py-2 text-[10px] font-mono font-bold tracking-wider uppercase text-[#71717A] hover:text-[#0A0A0A] transition-colors"
                >
                  View Full Cart
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


