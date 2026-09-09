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
      <div className="pt-36 pb-32 px-6 max-w-lg mx-auto text-center space-y-6 min-h-[60vh] flex flex-col justify-center items-center bg-white text-[#0A0A0A]">
        <div className="w-16 h-16 rounded-full border border-[#E5E5E5] flex items-center justify-center text-[#71717A]">
          <Tag size={28} />
        </div>
        <h1 className="text-2xl font-black uppercase tracking-wider text-[#0A0A0A] font-display">Your Bag Is Empty</h1>
        <p className="text-xs text-[#71717A] max-w-xs">
          Explore our foundational silhouettes, heavyweight hoodies, and limited drops.
        </p>
        <Link
          href="/shop"
          className="inline-block bg-[#0A0A0A] text-white px-8 py-3.5 text-xs font-bold tracking-widest uppercase hover:bg-[#27272A] transition-colors shadow-sm"
        >
          DISCOVER SHOP
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-28 sm:pt-36 pb-32 px-6 sm:px-12 max-w-[1600px] mx-auto min-h-screen bg-white text-[#0A0A0A]">
      <div className="pb-8 border-b border-[#E5E5E5] mb-12">
        <span className="text-[10px] font-mono tracking-widest uppercase text-[#4D5936] font-bold">YOUR SELECTIONS</span>
        <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-[#0A0A0A] font-display mt-1">
          SHOPPING BAG ({cartSummary.itemsCount})
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-8 space-y-6">
          {/* Free Shipping Notice */}
          <div className="p-4 bg-[#F4F6F0] border border-[#DCE4D3] space-y-2">
            {remainingForFree > 0 ? (
              <p className="text-xs text-[#52525B]">
                Add <span className="text-black font-bold">{formatKES(remainingForFree)}</span> more to unlock{' '}
                <span className="text-[#4D5936] font-bold">Free Express Shipping across Nairobi</span>.
              </p>
            ) : (
              <p className="text-xs text-[#4D5936] font-bold flex items-center gap-2">
                <ShieldCheck size={16} /> You have unlocked FREE Express Delivery!
              </p>
            )}
            <div className="w-full bg-[#E0E8D9] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#4D5936] h-full transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Items Table */}
          <div className="divide-y divide-[#E5E5E5] border-y border-[#E5E5E5]">
            {cart.map((item) => (
              <div key={item.id} className="py-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
                <div className="flex gap-4 items-center">
                  <div className="relative w-24 h-32 bg-[#F4F4F5] overflow-hidden flex-shrink-0 border border-[#E5E5E5]">
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
                      className="text-sm font-bold uppercase tracking-wider text-[#0A0A0A] hover:text-[#4D5936] font-display"
                    >
                      {item.name}
                    </Link>
                    <div className="flex items-center gap-2 text-xs text-[#71717A]">
                      <span className="flex items-center gap-1">
                        <span
                          className="w-2.5 h-2.5 rounded-full border border-[#D4D4D8] inline-block"
                          style={{ backgroundColor: item.colorHex }}
                        />
                        {item.colorName}
                      </span>
                      <span>•</span>
                      <span className="font-mono bg-[#F4F4F5] border border-[#E5E5E5] px-2 py-0.5 rounded text-[11px] text-black font-bold">
                        SIZE {item.size}
                      </span>
                    </div>
                    <p className="text-xs font-mono text-[#0A0A0A] font-bold pt-1">
                      {formatKES(item.price)} each
                    </p>

                    <div className="pt-2 flex gap-4 text-[11px] text-[#71717A]">
                      <button
                        onClick={() => {
                          toggleWishlist(item.productId);
                          removeFromCart(item.id);
                        }}
                        className="hover:text-black uppercase tracking-wider underline font-medium"
                      >
                        Move to Wishlist
                      </button>
                    </div>
                  </div>
                </div>

                {/* Quantity Controls & Total */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4">
                  <div className="flex items-center border border-[#D4D4D8] bg-white shadow-xs">
                    <button
                      onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                      className="p-2 text-[#52525B] hover:text-black transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="px-3 text-xs font-mono font-bold text-black">{item.quantity}</span>
                    <button
                      onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.maxStock}
                      className="p-2 text-[#52525B] hover:text-black transition-colors disabled:opacity-30"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-mono font-bold text-[#0A0A0A]">
                      {formatKES(item.price * item.quantity)}
                    </p>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-xs text-[#71717A] hover:text-red-600 mt-1 inline-flex items-center gap-1 font-medium"
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
        <div className="lg:col-span-4 space-y-6">
          <div className="p-8 bg-[#FAFAF9] border border-[#E5E5E5] space-y-6 shadow-xs">
            <h2 className="text-sm font-bold uppercase tracking-widest text-[#0A0A0A] border-b border-[#E5E5E5] pb-4">
              ORDER SUMMARY
            </h2>

            {/* Promo Code Form */}
            <form onSubmit={handleApplyPromo} className="space-y-2">
              <label className="text-[10px] font-mono tracking-wider uppercase text-[#71717A] block font-semibold">
                PROMOTIONAL CODE
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="E.G. FIRSTDROP"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 bg-white border border-[#D4D4D8] px-3 py-2.5 text-xs uppercase text-black placeholder-[#A1A1AA] font-mono focus:outline-none focus:border-black shadow-xs"
                />
                <button
                  type="submit"
                  className="bg-[#0A0A0A] hover:bg-[#27272A] text-white text-xs font-bold px-4 uppercase tracking-wider shadow-xs"
                >
                  APPLY
                </button>
              </div>
              {appliedDiscount && (
                <p className="text-xs text-[#4D5936] font-mono font-bold">
                  Code {appliedDiscount.code} applied (-{formatKES(appliedDiscount.amount)})
                </p>
              )}
              {couponError && (
                <p className="text-xs text-red-600 font-mono font-medium">{couponError}</p>
              )}
            </form>

            {/* Calculations */}
            <div className="space-y-3 pt-4 border-t border-[#E5E5E5] text-xs">
              <div className="flex justify-between text-[#52525B]">
                <span>Bag Subtotal</span>
                <span className="font-mono text-black font-bold">{formatKES(cartSummary.subtotal)}</span>
              </div>
              {appliedDiscount && (
                <div className="flex justify-between text-[#4D5936]">
                  <span>Discount ({appliedDiscount.code})</span>
                  <span className="font-mono font-bold">-{formatKES(appliedDiscount.amount)}</span>
                </div>
              )}
              <div className="flex justify-between text-[#52525B]">
                <span>Shipping</span>
                <span className="font-mono text-black">Calculated at next step</span>
              </div>
              <div className="flex justify-between text-base font-bold text-[#0A0A0A] pt-4 border-t border-[#E5E5E5]">
                <span className="uppercase tracking-wider">Estimated Total</span>
                <span className="font-mono text-lg">{formatKES(finalTotal)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <div className="pt-2">
              <Link
                href="/checkout"
                className="w-full bg-[#0A0A0A] text-white hover:bg-[#27272A] transition-all py-4 px-6 text-xs font-bold tracking-[0.2em] uppercase flex items-center justify-center gap-2 group shadow-sm"
              >
                <span>PROCEED TO CHECKOUT</span>
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="pt-4 text-[11px] text-[#71717A] space-y-1.5 border-t border-[#E5E5E5]">
              <p>• Secured checkout with Safaricom M-PESA & Paystack</p>
              <p>• Authentic limited run garments directly from atelier</p>
              <p>• Hassle-free 7-day exchange window</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

