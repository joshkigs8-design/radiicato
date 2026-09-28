'use client';

import React, { useState } from 'react';
import { Percent, Plus, Tag, Check, X, Calendar } from 'lucide-react';
import { useStore } from '@/lib/use-store';
import { formatKES } from '@/lib/utils';
import { Coupon } from '@/types';

export default function AdminDiscountsPage() {
  const { coupons, saveCoupon } = useStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Form State
  const [code, setCode] = useState('');
  const [type, setType] = useState<'percentage' | 'fixed'>('percentage');
  const [value, setValue] = useState(15);
  const [minOrder, setMinOrder] = useState(4000);
  const [maxDiscount, setMaxDiscount] = useState<number | undefined>(2000);
  const [usageLimit, setUsageLimit] = useState(200);

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    const newCoupon: Coupon = {
      id: crypto.randomUUID(),
      code: code.trim().toUpperCase(),
      discountType: type,
      value: Number(value),
      minOrder: Number(minOrder),
      maxDiscount: maxDiscount ? Number(maxDiscount) : undefined,
      startDate: new Date().toISOString(),
      usageLimit: Number(usageLimit),
      timesUsed: 0,
      isActive: true,
    };

    const result = await saveCoupon(newCoupon);
    if (!result.success) {
      setSaveError(('error' in result && result.error) || 'Unable to save this discount.');
      return;
    }

    setSaveError(null);
    setModalOpen(false);
    setCode('');
  };

  const toggleActive = async (coupon: Coupon) => {
    const result = await saveCoupon({ ...coupon, isActive: !coupon.isActive });
    if (!result.success) setSaveError(('error' in result && result.error) || 'Unable to update this discount.');
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-[#E5E7EB] pb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">Promotional Discounts & Codes</h1>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Configure percentage drops, VIP coupons, minimum spend requirements, and usage limits.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#4D5936] hover:bg-[#343D2D] text-white rounded-md text-xs font-bold uppercase tracking-wider shadow-sm transition-colors"
        >
          <Plus size={16} />
          <span>New Promo Code</span>
        </button>
      </div>

      {/* Coupons List Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {saveError && (
          <div className="col-span-full rounded-md border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
            {saveError}
          </div>
        )}
        {coupons.map((coupon) => (
          <div
            key={coupon.id}
            className="p-5 bg-white border border-[#E5E7EB] rounded-lg shadow-sm space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="px-3 py-1 bg-[#111827] text-white font-mono font-bold text-xs rounded tracking-widest uppercase">
                  {coupon.code}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                    coupon.isActive ? 'bg-[#ECFDF5] text-[#065F46]' : 'bg-[#FEF2F2] text-[#991B1B]'
                  }`}
                >
                  {coupon.isActive ? 'ACTIVE' : 'DISABLED'}
                </span>
              </div>

              <div>
                <p className="text-xl font-bold font-mono text-[#111827]">
                  {coupon.discountType === 'percentage' ? `${coupon.value}% OFF` : `KES ${coupon.value} OFF`}
                </p>
                <p className="text-xs text-[#6B7280] mt-0.5">
                  Min spend: {formatKES(coupon.minOrder)}
                  {coupon.maxDiscount && ` • Max cap: ${formatKES(coupon.maxDiscount)}`}
                </p>
              </div>

              <div className="text-xs font-mono text-[#6B7280]">
                Usage: <strong className="text-[#111827]">{coupon.timesUsed}</strong> / {coupon.usageLimit || '∞'} redemptions
              </div>
            </div>

            <div className="pt-3 border-t border-[#E5E7EB] flex justify-between items-center text-xs">
              <button
                onClick={() => toggleActive(coupon)}
                className="text-[#4D5936] font-bold hover:underline"
              >
                {coupon.isActive ? 'Deactivate' : 'Activate'}
              </button>
              <span className="text-[10px] font-mono text-[#9CA3AF]">
                Added {new Date(coupon.startDate).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
        {!coupons.length && (
          <div className="col-span-full border border-dashed border-[#D1D5DB] bg-white p-12 text-center">
            <Tag size={24} className="mx-auto text-[#9CA3AF]" />
            <p className="mt-3 text-sm font-semibold text-[#374151]">No discounts yet</p>
            <p className="mt-1 text-xs text-[#6B7280]">Create a promotion when you are ready to offer one.</p>
          </div>
        )}
      </div>

      {/* Modal Form */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-[#E5E7EB] pb-3">
              <h3 className="text-sm font-bold text-[#111827] uppercase">Create Promotional Coupon</h3>
              <button onClick={() => setModalOpen(false)} className="text-[#6B7280]">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-[#374151]">Coupon Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. VIP25"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full border border-[#D1D5DB] rounded p-2 font-mono uppercase text-[#111827]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#374151]">Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full border border-[#D1D5DB] rounded p-2 text-[#111827]"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (KES)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-[#374151]">Value *</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={value}
                    onChange={(e) => setValue(Number(e.target.value))}
                    className="w-full border border-[#D1D5DB] rounded p-2 font-mono font-bold text-[#111827]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#374151]">Min Spend (KES)</label>
                  <input
                    type="number"
                    min={0}
                    value={minOrder}
                    onChange={(e) => setMinOrder(Number(e.target.value))}
                    className="w-full border border-[#D1D5DB] rounded p-2 font-mono text-[#111827]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-[#374151]">Max Cap (KES)</label>
                  <input
                    type="number"
                    min={0}
                    value={maxDiscount || ''}
                    onChange={(e) => setMaxDiscount(e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full border border-[#D1D5DB] rounded p-2 font-mono text-[#111827]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#374151]">Usage Redemption Limit</label>
                <input
                  type="number"
                  min={1}
                  value={usageLimit}
                  onChange={(e) => setUsageLimit(Number(e.target.value))}
                  className="w-full border border-[#D1D5DB] rounded p-2 font-mono text-[#111827]"
                />
              </div>

              <div className="pt-3 border-t border-[#E5E7EB] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-3 py-1.5 border border-[#D1D5DB] rounded text-[#374151]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#4D5936] text-white rounded font-bold"
                >
                  Create Code
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

