'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp, ShoppingCart, DollarSign, Package, AlertTriangle,
  Users, CheckCircle2, ArrowUpRight, ArrowDownRight, Filter,
  Plus, ExternalLink, Calendar
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';
import { useStore } from '@/lib/use-store';
import { formatKES } from '@/lib/utils';
import { fadeInUp, staggerContainer } from '@/lib/motion-variants';

// Demo Revenue & Orders Analytics over time
const REVENUE_DATA_30D = [
  { date: 'Aug 11', revenue: 45000, orders: 8 },
  { date: 'Aug 15', revenue: 62000, orders: 12 },
  { date: 'Aug 19', revenue: 54000, orders: 10 },
  { date: 'Aug 23', revenue: 89000, orders: 17 },
  { date: 'Aug 27', revenue: 78000, orders: 14 },
  { date: 'Aug 31', revenue: 110000, orders: 21 },
  { date: 'Sep 04', revenue: 95000, orders: 19 },
  { date: 'Sep 08', revenue: 142000, orders: 28 },
];

const CATEGORY_SALES = [
  { name: 'T-Shirts (280 GSM)', value: 45, color: '#4D5936' },
  { name: 'Hoodies (460 GSM)', value: 32, color: '#2D3526' },
  { name: 'Pants & Bottoms', value: 15, color: '#6B7280' },
  { name: 'Caps & Accessories', value: 8, color: '#9CA3AF' },
];

// Helper for count-up animation
function CountUp({ value, format }: { value: number, format?: (v: number) => string }) {
  const [displayValue, setDisplayValue] = useState(0);

  React.useEffect(() => {
    let start = 0;
    const end = value;
    const duration = 1500;
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setDisplayValue(end);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value]);

  return <span>{format ? format(displayValue) : displayValue}</span>;
}

export default function AdminDashboardPage() {
  const { products, orders, categories, collections } = useStore();
  const [dateRange, setDateRange] = useState<'today' | '7d' | '30d' | '90d' | 'year'>('30d');

  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);
  const pendingOrders = orders.filter((o) => o.fulfillmentStatus === 'processing' || o.fulfillmentStatus === 'paid').length;
  const avgOrderValue = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;

  const lowStockItems = useMemo(() => {
    const list: { product: string; variant: string; sku: string; stock: number }[] = [];
    products.forEach((p) => {
      p.variants.forEach((v) => {
        if (v.stockQuantity > 0 && v.stockQuantity <= v.lowStockThreshold) {
          list.push({
            product: p.name,
            variant: `${v.colorName} / ${v.size}`,
            sku: v.sku,
            stock: v.stockQuantity,
          });
        }
      });
    });
    return list;
  }, [products]);

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={fadeInUp}
      className="space-y-8 max-w-[1600px] mx-auto pb-16"
    >
      {/* Top Header & Date Filter Strip */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-[#E5E7EB] pb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">Atelier Overview & Analytics</h1>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Real-time performance metrics, order fulfillments, and atelier inventory status.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-[#F3F4F6] p-1 rounded-md border border-[#E5E7EB] text-xs font-mono">
            {(['today', '7d', '30d', '90d', 'year'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setDateRange(r)}
                className={`px-3 py-1 rounded transition-all uppercase ${
                  dateRange === r
                    ? 'bg-white text-[#111827] shadow-sm font-bold'
                    : 'text-[#6B7280] hover:text-[#111827]'
                }`}
              >
                {r === 'today' ? 'Today' : r === '7d' ? '7 Days' : r === '30d' ? '30 Days' : r === '90d' ? '90 Days' : 'This Year'}
              </button>
            ))}
          </div>

          <Link
            href="/admin/products/new"
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#4D5936] hover:bg-[#343D2D] text-white rounded-md text-xs font-semibold shadow-sm transition-colors"
          >
            <Plus size={14} />
            <span>New Drop Piece</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <motion.div
        variants={staggerContainer}
        className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4"
      >
        {[
          { label: 'Total Sales', val: totalRevenue, icon: DollarSign, color: '#4D5936', format: formatKES, trend: '+24.8% vs last month' },
          { label: 'Orders Count', val: orders.length, icon: ShoppingCart, color: '#4D5936', trend: '+18.2% conversion' },
          { label: 'To Fulfill', val: pendingOrders, icon: Package, color: '#F59E0B', trend: 'Dispatches pending courier' },
          { label: 'Avg Order Value', val: avgOrderValue, icon: TrendingUp, color: '#4D5936', format: formatKES, trend: 'Across 3 items per basket' },
          { label: 'Low Stock Alerts', val: lowStockItems.length, icon: AlertTriangle, color: '#EF4444', trend: 'Review stock matrix →' },
        ].map((kpi, i) => (
          <motion.div
            key={i}
            variants={fadeInUp}
            whileHover={{ y: -4, boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }}
            className="p-4 bg-white border border-[#E5E7EB] rounded-lg shadow-sm space-y-1 transition-all"
          >
            <div className="flex justify-between items-center text-[#6B7280]">
              <span className="text-xs font-medium uppercase tracking-wider">{kpi.label}</span>
              <kpi.icon size={16} style={{ color: kpi.color }} />
            </div>
            <div className="text-xl font-bold font-mono text-[#111827]">
              <CountUp value={kpi.val} format={kpi.format} />
            </div>
            <div className="flex items-center gap-1 text-[11px] text-[#10B981] font-mono">
              {kpi.label === 'Low Stock Alerts' ? null : <ArrowUpRight size={12} />}
              <span className={kpi.label === 'Low Stock Alerts' ? 'text-[#6B7280]' : ''}>{kpi.trend}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 p-6 bg-white border border-[#E5E7EB] rounded-lg shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-[#111827]">Revenue & Trajectory</h3>
              <p className="text-xs text-[#6B7280]">Daily gross merchandise volume across M-PESA & Card</p>
            </div>
            <span className="text-xs font-mono font-bold text-[#4D5936] bg-[#F4F6F2] px-2.5 py-1 rounded">
              KES 675,000 PERIOD TOTAL
            </span>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REVENUE_DATA_30D}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4D5936" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#4D5936" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis dataKey="date" stroke="#9CA3AF" fontSize={11} />
                <YAxis stroke="#9CA3AF" fontSize={11} tickFormatter={(v) => `KES ${v / 1000}k`} />
                <Tooltip
                  formatter={(value: number) => [formatKES(value), 'Revenue']}
                  contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', color: '#fff', borderRadius: '6px' }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#4D5936"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#revenueGrad)"
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-4 p-6 bg-white border border-[#E5E7EB] rounded-lg shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-bold text-[#111827]">Sales by Category</h3>
            <p className="text-xs text-[#6B7280]">Share of overall order volume</p>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={CATEGORY_SALES}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                  animationBegin={200}
                  animationDuration={1200}
                >
                  {CATEGORY_SALES.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [`${value}%`, 'Volume Share']}
                  contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', color: '#fff', borderRadius: '6px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 pt-2">
            {CATEGORY_SALES.map((cat) => (
              <div key={cat.name} className="flex justify-between items-center text-xs">
                <span className="flex items-center gap-2 text-[#4B5563]">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                  {cat.name}
                </span>
                <span className="font-mono font-bold text-[#111827]">{cat.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white border border-[#E5E7EB] rounded-lg shadow-sm overflow-hidden">
          <div className="p-5 border-b border-[#E5E7EB] flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-[#111827]">Recent Orders</h3>
              <p className="text-xs text-[#6B7280]">Latest transactions received from customer checkout</p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs font-semibold text-[#4D5936] hover:underline"
            >
              View all orders &rarr;
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F9FAFB] text-[#6B7280] font-mono border-b border-[#E5E7EB]">
                <tr>
                  <th className="py-3 px-4">ORDER ID</th>
                  <th className="py-3 px-4">CUSTOMER</th>
                  <th className="py-3 px-4">PAYMENT</th>
                  <th className="py-3 px-4">STATUS</th>
                  <th className="py-3 px-4 text-right">TOTAL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB] text-[#111827]">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-[#F9FAFB] transition-colors">
                    <td className="py-3 px-4 font-mono font-bold">{o.orderNumber}</td>
                    <td className="py-3 px-4">
                      <p className="font-semibold">{o.customerName}</p>
                      <p className="text-[10px] text-[#6B7280] font-mono">{o.shippingAddress.county}</p>
                    </td>
                    <td className="py-3 px-4 font-mono">
                      <span className="px-2 py-0.5 bg-[#ECFDF5] text-[#065F46] rounded text-[11px] font-semibold uppercase">
                        {o.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 bg-[#FEF3C7] text-[#92400E] rounded text-[11px] font-semibold uppercase">
                        {o.fulfillmentStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold">
                      {formatKES(o.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="lg:col-span-4 bg-white border border-[#E5E7EB] rounded-lg shadow-sm p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-[#E5E7EB] pb-3">
            <div>
              <h3 className="text-sm font-bold text-[#111827]">Critical Inventory</h3>
              <p className="text-xs text-[#6B7280]">Variants nearing sold out</p>
            </div>
            <Link
              href="/admin/inventory"
              className="text-xs font-semibold text-[#4D5936] hover:underline"
            >
              Adjust
            </Link>
          </div>

          <div className="space-y-3">
            {lowStockItems.length === 0 ? (
              <p className="text-xs text-[#6B7280]">All inventory levels healthy.</p>
            ) : (
              lowStockItems.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="p-3 bg-[#FEF2F2] border border-[#FEE2E2] rounded-md flex justify-between items-center text-xs"
                >
                  <div>
                    <p className="font-bold text-[#991B1B]">{item.product}</p>
                    <p className="text-[10px] text-[#7F1D1D] font-mono">{item.variant} • {item.sku}</p>
                  </div>
                  <span className="px-2 py-1 bg-[#DC2626] text-white rounded font-mono font-bold text-xs">
                    {item.stock} left
                  </span>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
