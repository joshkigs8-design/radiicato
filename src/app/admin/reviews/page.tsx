'use client';

import React, { useState } from 'react';
import { Star, Check, X, ShieldCheck, Trash2, MessageSquare } from 'lucide-react';
import { useStore } from '@/lib/use-store';

export default function AdminReviewsPage() {
  const { reviews, updateReviewStatus } = useStore();
  const [filter, setFilter] = useState<'all' | 'approved' | 'pending' | 'rejected'>('all');

  const filtered = reviews.filter((r) => filter === 'all' || r.status === filter);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-16">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-[#E5E7EB] pb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">Review Moderation & Feedback</h1>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Approve, reject, or verify customer testimonials and garment fit feedback.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {(['all', 'approved', 'pending', 'rejected'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-3 py-1.5 rounded-md text-xs font-mono uppercase transition-colors ${
                filter === st ? 'bg-[#111827] text-white font-bold' : 'bg-white border border-[#D1D5DB] text-[#4B5563]'
              }`}
            >
              {st} ({reviews.filter((r) => st === 'all' || r.status === st).length})
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white border border-[#E5E7EB] rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F9FAFB] text-[#6B7280] font-mono border-b border-[#E5E7EB]">
              <tr>
                <th className="py-3 px-4">PRODUCT</th>
                <th className="py-3 px-4">CUSTOMER</th>
                <th className="py-3 px-4">RATING</th>
                <th className="py-3 px-4">HEADLINE & COMMENT</th>
                <th className="py-3 px-4">DATE</th>
                <th className="py-3 px-4">STATUS</th>
                <th className="py-3 px-4 text-right">MODERATION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB] text-[#111827]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs text-[#6B7280]">
                    <MessageSquare size={24} className="mx-auto text-[#9CA3AF] mb-2" />
                    <p className="font-semibold text-[#111827]">No customer reviews found</p>
                    <p className="text-[11px] text-[#9CA3AF] mt-1">
                      New customer submissions from product pages will appear here for moderation.
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map((rev) => (
                  <tr key={rev.id} className="hover:bg-[#F9FAFB] transition-colors">
                    <td className="py-3 px-4 font-bold">{rev.productName}</td>
                    <td className="py-3 px-4">
                      <p className="font-semibold">{rev.customerName}</p>
                      <p className="text-[10px] text-[#6B7280] font-mono">{rev.customerEmail}</p>
                      {rev.isVerifiedPurchase && (
                        <span className="text-[9px] font-mono text-[#059669] flex items-center gap-1 mt-0.5">
                          <ShieldCheck size={11} /> VERIFIED BUYER
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex text-amber-500">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} size={12} className="fill-amber-400" />
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4 max-w-sm">
                      <p className="font-bold text-[#111827]">&ldquo;{rev.title}&rdquo;</p>
                      <p className="text-xs text-[#4B5563] mt-0.5">{rev.comment}</p>
                    </td>
                    <td className="py-3 px-4 font-mono text-[#6B7280]">
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                          rev.status === 'approved'
                            ? 'bg-[#ECFDF5] text-[#065F46]'
                            : rev.status === 'pending'
                            ? 'bg-[#FEF3C7] text-[#92400E]'
                            : 'bg-[#FEF2F2] text-[#991B1B]'
                        }`}
                      >
                        {rev.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {rev.status !== 'approved' && (
                          <button
                            onClick={() => updateReviewStatus(rev.id, 'approved')}
                            className="px-2.5 py-1 bg-[#059669] hover:bg-[#047857] text-white rounded text-[10px] font-bold uppercase"
                          >
                            Approve
                          </button>
                        )}
                        {rev.status !== 'rejected' && (
                          <button
                            onClick={() => updateReviewStatus(rev.id, 'rejected')}
                            className="px-2.5 py-1 bg-[#DC2626] hover:bg-[#B91C1C] text-white rounded text-[10px] font-bold uppercase"
                          >
                            Reject
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

