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
      <div className="pt-28 sm:pt-36 pb-32 px-5 sm:px-8 lg:px-12 max-w-[1400px] mx-auto min-h-[60vh] flex flex-col justify-center items-center bg-white text-[#0A0A0A]">
        <div className="w-16 h-16 border border-[#E4E4E7] flex items-center justify-center text-[#E4E4E7] mb-6">
          <Tag size={28} />
        </div>
        <h1 className="text-display-sm font-black uppercase tracking-tight text-[#0A0A0A] mb-4">Your Bag Is Empty</h1>
        <p className="text-sm text-[#71717A] max-w-xs text-center mb-8">
          Explore our foundational silhouettes, heavyweight hoodies, and limited drops.
        </p>
        <Link
          href="/shop"
          className="inline-block border border-[#0A0A0A] text-[#0A0A0A] px-8 py-4 text-[11px] font-mono font-bold tracking-[0.15em] uppercase hover:bg-[#0A0A0A] hover:text-white transition-colors"
        >
          Discover Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-28 sm:pt-36 pb-32 px-5 sm:px-8 lg:px-12 max-w-[1400px] mx-auto min-h-screen bg-white text-[#0A0A0A]">
      <div className="mb-8">
        <h1 className="text-display-sm font-black uppercase tracking-tight text-[#0A0A0A]">
          YOUR BAG
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-2 space-y-6">
          {/* Free Shipping Notice */}
          <div className="py-4 border-b border-[#E4E4E7]">
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

          {/* Items Table */}
          <div className="border-t border-[#E4E4E7]">
            {cart.map((item) => (
              <div key={item.id} className="py-6 border-b border-[#E4E4E7] flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
                <div className="flex gap-6 items-center w-full sm:w-auto">
                  <div className="relative w-24 h-32 bg-[#F4F4F5] overflow-hidden flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </div>

                  <div className="space-y-1">
                    <Link
                      href={`/product/${item.slug}`}
                      className="text-sm font-bold uppercase tracking-wider text-[#0A0A0A] hover:text-[#71717A] transition-colors"
                    >
                      {item.name}
                    </Link>
                    <div className="flex items-center gap-2 text-[10px] font-mono text-[#71717A] uppercase mt-1">
                      <span className="flex items-center gap-1">
                        <span
                          className="w-2.5 h-2.5 border border-[#E4E4E7] inline-block"
                          style={{ backgroundColor: item.colorHex }}
                        />
                        {item.colorName}
                      </span>
                      <span>•</span>
                      <span>
                        SIZE {item.size}
                      </span>
                    </div>
                    <p className="text-xs font-mono text-[#0A0A0A] pt-2">
                      {formatKES(item.price)}
                    </p>

                    <div className="pt-2 flex gap-4 text-[10px] font-mono text-[#71717A]">
                      <button
                        onClick={() => {
                          toggleWishlist(item.productId);
                          removeFromCart(item.id);
                        }}
                        className="hover:text-[#0A0A0A] uppercase tracking-wider transition-colors"
                      >
                        Save for later
                      </button>
                    </div>
                  </div>
                </div>

                {/* Quantity Controls & Total */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4">
                  <div className="flex items-center border border-[#E4E4E7]">
                    <button
                      onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 text-[#71717A] hover:text-[#0A0A0A] flex items-center justify-center transition-colors"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="w-8 h-8 text-xs font-mono text-center flex items-center justify-center text-[#0A0A0A]">{item.quantity}</span>
                    <button
                      onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.maxStock}
                      className="w-8 h-8 text-[#71717A] hover:text-[#0A0A0A] flex items-center justify-center transition-colors disabled:opacity-30"
                    >
                      <Plus size={12} />
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-mono font-bold text-[#0A0A0A]">
                      {formatKES(item.price * item.quantity)}
                    </p>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-[10px] font-mono text-[#A1A1AA] hover:text-[#0A0A0A] mt-2 inline-flex items-center gap-1 uppercase tracking-wider transition-colors"
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
          <div className="p-8 border border-[#E4E4E7] space-y-6 sticky top-32">
            <h2 className="text-[11px] font-mono font-semibold tracking-[0.15em] uppercase text-[#0A0A0A] mb-6">
              ORDER SUMMARY
            </h2>

            {/* Promo Code Form */}
            <form onSubmit={handleApplyPromo} className="space-y-2">
              <label className="text-[10px] font-mono tracking-wider uppercase text-[#71717A] block">
                PROMOTIONAL CODE
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="E.G. FIRSTDROP"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 bg-white border border-[#E4E4E7] px-3 py-2 text-[11px] uppercase text-[#0A0A0A] placeholder-[#A1A1AA] font-mono focus:outline-none focus:border-[#0A0A0A] transition-colors"
                />
                <button
                  type="submit"
                  className="bg-[#0A0A0A] text-white text-[11px] font-mono font-bold px-4 uppercase tracking-[0.1em] hover:opacity-80 transition-opacity"
                >
                  APPLY
                </button>
              </div>
              {appliedDiscount && (
                <p className="text-[10px] font-mono text-[#0A0A0A] uppercase tracking-wider mt-2">
                  Code {appliedDiscount.code} applied (-{formatKES(appliedDiscount.amount)})
                </p>
              )}
              {couponError && (
                <p className="text-[10px] font-mono text-red-600 uppercase tracking-wider mt-2">{couponError}</p>
              )}
            </form>

            {/* Calculations */}
            <div className="space-y-2 pt-6">
              <div className="flex justify-between text-sm py-2">
                <span className="text-[#71717A]">Subtotal</span>
                <span className="font-mono text-[#0A0A0A]">{formatKES(cartSummary.subtotal)}</span>
              </div>
              {appliedDiscount && (
                <div className="flex justify-between text-sm py-2">
                  <span className="text-[#71717A]">Discount ({appliedDiscount.code})</span>
                  <span className="font-mono text-[#0A0A0A]">- {formatKES(appliedDiscount.amount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm py-2">
                <span className="text-[#71717A]">Shipping</span>
                <span className="text-[#0A0A0A] text-xs font-mono uppercase tracking-wider">Calculated next</span>
              </div>
              <div className="flex justify-between text-lg font-mono font-bold text-[#0A0A0A] border-t border-[#0A0A0A] pt-4 mt-4">
                <span className="text-[11px] uppercase tracking-wider flex items-end">Estimated Total</span>
                <span>{formatKES(finalTotal)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <div className="pt-4">
              <Link
                href="/checkout"
                className="w-full bg-[#0A0A0A] text-white py-4 text-[11px] font-mono font-bold tracking-[0.15em] uppercase flex items-center justify-center gap-2 hover:opacity-80 transition-opacity"
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

