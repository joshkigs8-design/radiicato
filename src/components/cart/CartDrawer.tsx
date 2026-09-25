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
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Dark frosted backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300"
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full">
        <div className="w-full max-w-md bg-[#0a0a0a]/95 backdrop-blur-2xl border-l border-white/15 flex flex-col text-white shadow-[0_0_60px_rgba(0,0,0,0.85)]">
          {/* Header */}
          <div className="px-5 sm:px-6 py-4 border-b border-white/10 flex items-center justify-between">
            <h2 className="text-[11px] font-mono font-semibold tracking-[0.18em] uppercase text-white">
              Shopping Bag <span className="text-white/50">({cartSummary.itemsCount})</span>
            </h2>
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white transition-colors p-1.5 rounded-full hover:bg-white/10 cursor-pointer"
              aria-label="Close cart"
            >
              <X size={17} />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="px-5 sm:px-6 py-3 bg-white/[0.03] border-b border-white/10">
            {remainingForFree > 0 ? (
              <p className="text-[10px] font-mono uppercase tracking-wider text-white/70">
                Add <span className="text-white font-bold">{formatKES(remainingForFree)}</span> more for free express shipping.
              </p>
            ) : (
              <p className="text-[10px] font-mono uppercase tracking-wider text-white font-bold flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-white" /> Free Express Delivery Unlocked
              </p>
            )}
            <div className="w-full bg-white/10 h-1 mt-2 rounded-full overflow-hidden">
              <div
                className="bg-white h-full transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Item List */}
          <div className="flex-1 overflow-y-auto">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16 px-6 space-y-4">
                <div className="w-16 h-16 rounded-2xl glass-card flex items-center justify-center text-white/40">
                  <Tag size={24} />
                </div>
                <p className="text-sm font-sans text-white/60">Your bag is currently empty.</p>
                <Link
                  href="/shop"
                  onClick={onClose}
                  className="mt-4 inline-block glass-button text-white px-6 py-3 text-[11px] font-mono uppercase tracking-widest rounded-xl hover:bg-white hover:text-black transition-all"
                >
                  Explore Drop
                </Link>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="flex gap-4 border-b border-white/10 py-5 px-5 sm:px-6">
                  {/* Thumbnail */}
                  <div className="relative w-20 h-24 bg-[#121212] rounded-lg border border-white/10 flex-shrink-0 overflow-hidden">
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
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/product/${item.slug}`}
                          onClick={onClose}
                          className="text-xs font-bold uppercase tracking-wider text-white hover:text-white/70 line-clamp-1"
                        >
                          {item.name}
                        </Link>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-white/40 hover:text-white transition-colors p-0.5"
                          title="Remove item"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      {/* Variant Specs */}
                      <div className="mt-1 flex items-center gap-2 text-[10px] font-mono text-white/60 uppercase">
                        <span className="flex items-center gap-1">
                          <span
                            className="w-2.5 h-2.5 rounded-full border border-white/20 inline-block"
                            style={{ backgroundColor: item.colorHex }}
                          />
                          {item.colorName}
                        </span>
                        <span>•</span>
                        <span>{item.size}</span>
                      </div>

                      <p className="mt-2 text-xs font-mono font-bold text-white">
                        {formatKES(item.price)}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center rounded-lg border border-white/20 bg-white/5 overflow-hidden">
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 text-xs text-white/70 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-8 h-7 text-xs font-mono text-center flex items-center justify-center text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.maxStock}
                          className="w-7 h-7 text-xs text-white/70 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors disabled:opacity-30"
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
                        className="text-[10px] font-mono tracking-wider uppercase text-white/50 hover:text-white transition-colors"
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
            <div className="p-5 sm:p-6 bg-black/60 backdrop-blur-xl border-t border-white/15 space-y-4">
              {/* Promo Code Form */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input
                  type="text"
                  placeholder="PROMO CODE"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 bg-white/5 border border-white/15 rounded-lg text-[11px] uppercase px-3 py-2 text-white placeholder-white/40 focus:outline-none focus:border-white font-mono transition-colors"
                />
                <button
                  type="submit"
                  className="glass-button text-white text-[11px] font-mono font-bold px-4 py-2 uppercase tracking-[0.1em] rounded-lg hover:bg-white hover:text-black transition-all"
                >
                  Apply
                </button>
              </form>

              {appliedDiscount && (
                <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-wider text-white bg-white/10 px-3 py-2 rounded-lg border border-white/20">
                  <span>Code ({appliedDiscount.code}) Applied</span>
                  <span className="font-bold">-{formatKES(appliedDiscount.amount)}</span>
                </div>
              )}

              {couponError && (
               <p className="text-[10px] font-mono text-rose-400 uppercase tracking-wider">{couponError}</p>
              )}

              {/* Subtotal & Total */}
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-white/60 uppercase tracking-wider">Subtotal</span>
                  <span className="text-white font-bold">{formatKES(cartSummary.subtotal)}</span>
                </div>
                {appliedDiscount && (
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-white/60 uppercase tracking-wider">Discount</span>
                    <span className="text-white font-bold">-{formatKES(appliedDiscount.amount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-white/60 uppercase tracking-wider">Estimated Shipping</span>
                  <span className="text-white/80">Calculated at checkout</span>
                </div>
                <div className="flex justify-between pt-3 mt-1 border-t border-white/15 text-white">
                  <span className="text-[10px] font-mono text-white/60 uppercase tracking-wider flex items-end">Estimated Total</span>
                  <span className="text-base font-mono font-bold">{formatKES(finalTotal)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-2 pb-[env(safe-area-inset-bottom,0px)]">
                <Link
                  href="/checkout"
                  onClick={onClose}
                  className="w-full glass-button bg-white text-black hover:bg-white/90 py-3.5 sm:py-4 text-[12px] font-mono font-bold tracking-[0.15em] uppercase flex items-center justify-center gap-2 rounded-xl transition-all shadow-xl active:scale-95"
                >
                  <span>Checkout</span>
                  <ArrowRight size={14} />
                </Link>
                <Link
                  href="/cart"
                  onClick={onClose}
                  className="w-full block text-center py-2 text-[10px] font-mono font-bold tracking-wider uppercase text-white/50 hover:text-white transition-colors"
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
