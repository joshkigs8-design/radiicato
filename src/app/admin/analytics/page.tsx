'use client';

import React, { useState } from 'react';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { 
  TrendingUp, Users, ShoppingCart, DollarSign, Percent, 
  ArrowUpRight, ArrowDownRight, RefreshCw, Layers 
} from 'lucide-react';
import { useStore } from '@/lib/use-store';
import { formatKES } from '@/lib/utils';

const REVENUE_DATA = [
  { month: 'Mar', sales: 180000, orders: 42 },
  { month: 'Apr', sales: 240000, orders: 56 },
  { month: 'May', sales: 310000, orders: 71 },
  { month: 'Jun', sales: 290000, orders: 65 },
  { month: 'Jul', sales: 420000, orders: 94 },
  { month: 'Aug', sales: 510000, orders: 118 },
  { month: 'Sep', sales: 675000, orders: 145 },
];

const TOP_PRODUCTS = [
  { name: 'Radiicato Signature Tee', units: 142, revenue: 539600 },
  { name: 'Radiicato Core Hoodie', units: 88, revenue: 660000 },
  { name: 'Underground Rebel Tee', units: 76, revenue: 288800 },
  { name: 'Tactical Sweatpant', units: 54, revenue: 334800 },
  { name: 'Metallic Emblem Cap', units: 62, revenue: 155000 },
];

export default function AdminAnalyticsPage() {
  const [period, setPeriod] = useState('90d');

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto pb-16">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-[#E5E7EB] pb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">Financial Intelligence & Performance</h1>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Key conversion metrics, repeat customer rates, basket abandonment, and drop revenue.
          </p>
        </div>

        <div className="flex bg-[#F3F4F6] p-1 rounded-md border border-[#E5E7EB] text-xs font-mono">
          {['30d', '90d', 'year'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1 rounded transition-colors uppercase ${
                period === p ? 'bg-white text-[#111827] shadow-sm font-bold' : 'text-[#6B7280]'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white border border-[#E5E7EB] rounded-lg shadow-sm space-y-1">
          <span className="text-xs font-semibold text-[#6B7280] uppercase">Online Conversion Rate</span>
          <div className="text-2xl font-black font-mono text-[#111827]">3.42%</div>
          <p className="text-[11px] text-[#10B981] flex items-center gap-1 font-mono">
            <ArrowUpRight size={12} /> +0.8% industry benchmark
          </p>
        </div>

        <div className="p-5 bg-white border border-[#E5E7EB] rounded-lg shadow-sm space-y-1">
          <span className="text-xs font-semibold text-[#6B7280] uppercase">Repeat Customer Rate</span>
          <div className="text-2xl font-black font-mono text-[#4D5936]">38.6%</div>
          <p className="text-[11px] text-[#6B7280]">1 in 3 shoppers purchase next drop</p>
        </div>

        <div className="p-5 bg-white border border-[#E5E7EB] rounded-lg shadow-sm space-y-1">
          <span className="text-xs font-semibold text-[#6B7280] uppercase">Cart Abandonment</span>
          <div className="text-2xl font-black font-mono text-[#D97706]">54.2%</div>
          <p className="text-[11px] text-[#10B981] flex items-center gap-1 font-mono">
            <ArrowDownRight size={12} /> -6.1% with M-PESA STK push
          </p>
        </div>

        <div className="p-5 bg-white border border-[#E5E7EB] rounded-lg shadow-sm space-y-1">
          <span className="text-xs font-semibold text-[#6B7280] uppercase">Avg Basket Value</span>
          <div className="text-2xl font-black font-mono text-[#111827]">{formatKES(7450)}</div>
          <p className="text-[11px] text-[#6B7280]">2.4 garments per order</p>
        </div>
      </div>

      {/* Revenue & Orders Growth Chart */}
      <div className="p-6 bg-white border border-[#E5E7EB] rounded-lg shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-[#111827]">Monthly Gross Merchandise Value (GMV)</h3>
        <div className="h-80 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={REVENUE_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="month" stroke="#9CA3AF" fontSize={11} />
              <YAxis stroke="#9CA3AF" fontSize={11} tickFormatter={(v) => `KES ${v / 1000}k`} />
              <Tooltip
                formatter={(v: number) => [formatKES(v), 'Revenue']}
                contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', color: '#fff', borderRadius: '6px' }}
              />
              <Bar dataKey="sales" fill="#4D5936" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Products Breakdown */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg shadow-sm overflow-hidden">
        <div className="p-5 border-b border-[#E5E7EB]">
          <h3 className="text-sm font-bold text-[#111827]">Best-Selling Archival Pieces</h3>
          <p className="text-xs text-[#6B7280]">Ranked by total revenue generated</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F9FAFB] text-[#6B7280] font-mono border-b border-[#E5E7EB]">
              <tr>
                <th className="py-3 px-4">GARMENT</th>
                <th className="py-3 px-4">UNITS DISPATCHED</th>
                <th className="py-3 px-4 text-right">GROSS REVENUE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB] text-[#111827]">
              {TOP_PRODUCTS.map((prod, i) => (
                <tr key={i} className="hover:bg-[#F9FAFB]">
                  <td className="py-3 px-4 font-bold">{prod.name}</td>
                  <td className="py-3 px-4 font-mono">{prod.units} pieces</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-[#059669]">
                    {formatKES(prod.revenue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

