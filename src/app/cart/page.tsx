'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { useStore } from '@/lib/use-store';
import { formatKES } from '@/lib/utils';

export default function CartPage() {
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

  const freeShippingThreshold = 10000;
  const remainingForFree = Math.max(0, freeShippingThreshold - cartSummary.subtotal);
  const progressPercent = Math.min(100, (cartSummary.subtotal / freeShippingThreshold) * 100);

  const discountAmount = appliedDiscount ? appliedDiscount.amount : 0;
  const finalTotal = Math.max(0, cartSummary.subtotal - discountAmount);

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

  if (cart.length === 0) {
    return (
      <div className="pt-28 sm:pt-36 pb-32 px-4 sm:px-8 lg:px-12 max-w-[1400px] mx-auto min-h-[60vh] flex flex-col justify-center items-center bg-black text-white font-sans">
        <div className="w-16 h-16 rounded-2xl glass-card flex items-center justify-center text-white/40 mb-6">
          <Tag size={28} />
        </div>
        <h1 className="pesos-text-face text-2xl sm:text-4xl font-bold uppercase tracking-tight text-white mb-3">
          Your Bag Is Empty
        </h1>
        <p className="text-xs sm:text-sm text-white/60 max-w-xs text-center mb-8">
          Explore our foundational silhouettes, heavyweight hoodies, and limited drops.
        </p>
        <Link
          href="/shop"
          className="glass-button bg-white text-black hover:bg-white/90 px-8 py-4 text-xs font-mono font-bold tracking-[0.15em] uppercase rounded-xl transition-all shadow-xl active:scale-95"
        >
          Discover Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-24 sm:pt-32 pb-32 px-4 sm:px-8 lg:px-12 max-w-[1600px] mx-auto min-h-screen bg-black text-white font-sans">
      <div className="mb-8 sm:mb-12 border-b border-white/10 pb-6">
        <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.22em] uppercase text-white/50 block mb-1 font-bold">
          SHOPPING BAG // {cartSummary.itemsCount} ITEMS
        </span>
        <h1 className="pesos-text-face text-3xl sm:text-5xl font-bold uppercase tracking-[-0.04em] text-white">
          YOUR BAG
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-14">
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-2 space-y-6">
          {/* Free Shipping Notice */}
          <div className="py-4 border-b border-white/10">
            {remainingForFree > 0 ? (
              <p className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-white/70">
                Add <span className="text-white font-bold">{formatKES(remainingForFree)}</span> more for free express shipping.
              </p>
            ) : (
              <p className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-white font-bold flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-emerald-400" /> Free Express Delivery Unlocked Across Kenya
              </p>
            )}
            <div className="w-full bg-white/10 h-1 mt-2.5 rounded-full overflow-hidden">
              <div
                className="bg-white h-full transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="divide-y divide-white/10 border-t border-b border-white/10">
            {cart.map((item) => (
              <div key={item.id} className="py-5 sm:py-6 flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center justify-between">
                <div className="flex gap-4 sm:gap-6 items-center w-full sm:w-auto">
                  <div className="relative w-20 h-24 sm:w-24 sm:h-32 bg-[#0a0a0a] rounded-xl overflow-hidden flex-shrink-0 border border-white/10">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </div>

                  <div className="space-y-1 flex-1">
                    <Link
                      href={`/product/${item.slug}`}
                      className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white hover:text-white/70 transition-colors line-clamp-1"
                    >
                      {item.name}
                    </Link>
                    <div className="flex items-center gap-2 text-[10px] font-mono text-white/50 uppercase mt-0.5">
                      <span className="flex items-center gap-1">
                        <span
                          className="w-2.5 h-2.5 rounded-full border border-white/20 inline-block"
                          style={{ backgroundColor: item.colorHex }}
                        />
                        {item.colorName}
                      </span>
                      <span>•</span>
                      <span>
                        SIZE {item.size}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm font-mono font-bold text-white pt-1">
                      {formatKES(item.price)}
                    </p>

                    <div className="pt-1 flex gap-4 text-[10px] font-mono text-white/50">
                      <button
                        onClick={() => {
                          toggleWishlist(item.productId);
                          removeFromCart(item.id);
                        }}
                        className="hover:text-white uppercase tracking-wider transition-colors cursor-pointer"
                      >
                        Save for later
                      </button>
                    </div>
                  </div>
                </div>

                {/* Quantity Controls & Total */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4 pt-2 sm:pt-0">
                  <div className="flex items-center rounded-lg border border-white/20 bg-white/5 overflow-hidden">
                    <button
                      onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 text-white/70 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="w-8 h-8 text-xs font-mono text-center flex items-center justify-center text-white font-bold">{item.quantity}</span>
                    <button
                      onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.maxStock}
                      className="w-8 h-8 text-white/70 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors disabled:opacity-30 cursor-pointer"
                    >
                      <Plus size={12} />
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="text-sm sm:text-base font-mono font-bold text-white">
                      {formatKES(item.price * item.quantity)}
                    </p>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-[10px] font-mono text-white/40 hover:text-white mt-1.5 inline-flex items-center gap-1 uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      <Trash2 size={12} /> Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-1">
          <div className="glass-panel-heavy rounded-2xl border border-white/15 p-6 sm:p-8 space-y-6 sticky top-28 shadow-2xl">
            <h2 className="text-[11px] font-mono font-semibold tracking-[0.18em] uppercase text-white mb-4">
              ORDER SUMMARY
            </h2>

            {/* Promo Code Form */}
            <form onSubmit={handleApplyPromo} className="space-y-2">
              <label className="text-[10px] font-mono tracking-wider uppercase text-white/50 block">
                PROMOTIONAL CODE
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="E.G. FIRSTDROP"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-[11px] uppercase text-white placeholder-white/30 font-mono focus:outline-none focus:border-white transition-colors"
                />
                <button
                  type="submit"
                  className="glass-button text-white text-[11px] font-mono font-bold px-4 uppercase tracking-[0.1em] rounded-xl hover:bg-white hover:text-black transition-all cursor-pointer"
                >
                  APPLY
                </button>
              </div>
              {appliedDiscount && (
                <p className="text-[10px] font-mono text-emerald-300 uppercase tracking-wider mt-2">
                  Code {appliedDiscount.code} applied (-{formatKES(appliedDiscount.amount)})
                </p>
              )}
              {couponError && (
                <p className="text-[10px] font-mono text-rose-400 uppercase tracking-wider mt-2">{couponError}</p>
              )}
            </form>

            {/* Calculations */}
            <div className="space-y-2 pt-4 border-t border-white/10 text-white/80">
              <div className="flex justify-between text-xs sm:text-sm py-1 font-mono">
                <span className="text-white/60">Subtotal</span>
                <span className="font-bold text-white">{formatKES(cartSummary.subtotal)}</span>
              </div>
              {appliedDiscount && (
                <div className="flex justify-between text-xs sm:text-sm py-1 font-mono">
                  <span className="text-white/60">Discount ({appliedDiscount.code})</span>
                  <span className="font-bold text-emerald-400">- {formatKES(appliedDiscount.amount)}</span>
                </div>
              )}
              <div className="flex justify-between text-xs sm:text-sm py-1 font-mono">
                <span className="text-white/60">Shipping</span>
                <span className="text-xs uppercase tracking-wider text-white/70">Calculated next</span>
              </div>
              <div className="flex justify-between text-base sm:text-lg font-mono font-bold text-white border-t border-white/15 pt-4 mt-3">
                <span className="text-[11px] uppercase tracking-wider text-white/60 flex items-end">Estimated Total</span>
                <span>{formatKES(finalTotal)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <div className="pt-2">
              <Link
                href="/checkout"
                className="w-full glass-button bg-white text-black hover:bg-white/90 py-4 text-[12px] font-mono font-bold tracking-[0.15em] uppercase flex items-center justify-center gap-2 rounded-xl transition-all shadow-xl active:scale-95"
              >
                <span>PROCEED TO CHECKOUT</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
