'use client';

import Link from 'next/link';
import {
  ArrowUpRight,
  Boxes,
  ChevronRight,
  CircleAlert,
  Clock3,
  PackageCheck,
  Plus,
  ShoppingBag,
  Users,
} from 'lucide-react';
import { useStore } from '@/lib/use-store';
import { formatKES } from '@/lib/utils';

function Metric({ label, value, detail, icon: Icon, tone = 'lime' }: {
  label: string;
  value: string;
  detail: string;
  icon: typeof ShoppingBag;
  tone?: 'lime' | 'coral' | 'cream';
}) {
  const toneClasses = {
    lime: 'bg-[#D8E2B8] text-[#24291B]',
    coral: 'bg-[#E27B62] text-[#21110D]',
    cream: 'bg-[#E9E2D0] text-[#27231D]',
  };

  return (
    <div className="border border-white/10 bg-white/[0.045] p-5 transition-colors hover:bg-white/[0.07]">
      <div className="mb-8 flex items-start justify-between">
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/45">{label}</span>
        <span className={`flex h-8 w-8 items-center justify-center rounded-full ${toneClasses[tone]}`}><Icon size={15} /></span>
      </div>
      <p className="text-3xl font-semibold tracking-[-0.04em] text-white">{value}</p>
      <p className="mt-2 text-xs text-white/45">{detail}</p>
    </div>
  );
}

export default function AdminDashboardPage() {
  const { products, orders } = useStore();
  const totalRevenue = orders.reduce((total, order) => total + order.total, 0);
  const pendingOrders = orders.filter((order) => ['processing', 'paid'].includes(order.fulfillmentStatus));
  const lowStock = products.flatMap((product) => product.variants
    .filter((variant) => variant.stockQuantity > 0 && variant.stockQuantity <= variant.lowStockThreshold)
    .map((variant) => ({ product: product.name, variant: `${variant.colorName} / ${variant.size}`, stock: variant.stockQuantity })));

  return (
    <div className="mx-auto max-w-[1500px] space-y-8 pb-12">
      <section className="flex flex-col justify-between gap-6 border-b border-white/10 pb-8 md:flex-row md:items-end">
        <div>
          <p className="mb-3 text-[10px] font-mono uppercase tracking-[0.28em] text-[#B9D477]">Nairobi / Atelier Control</p>
          <h1 className="max-w-2xl text-4xl font-semibold tracking-[-0.06em] text-white sm:text-6xl">Good morning, {orders.length ? 'Joshua' : 'Atelier'}.</h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/45">A clear view of the store today. Keep the drop moving, the shelves honest, and every order accounted for.</p>
        </div>
        <Link href="/admin/products/new" className="inline-flex items-center justify-center gap-2 rounded bg-[#D8E2B8] px-4 py-3 text-xs font-bold uppercase tracking-[0.14em] text-[#24291B] transition-colors hover:bg-white">
          <Plus size={15} /> Add product
        </Link>
      </section>

      <section className="grid grid-cols-1 gap-px overflow-hidden border border-white/10 bg-white/10 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="Gross revenue" value={formatKES(totalRevenue)} detail="All recorded orders" icon={ShoppingBag} />
        <Metric label="Orders to fulfill" value={String(pendingOrders.length)} detail="Needs dispatch attention" icon={PackageCheck} tone="coral" />
        <Metric label="Active products" value={String(products.length)} detail="Across the live catalog" icon={Boxes} tone="cream" />
        <Metric label="Inventory alerts" value={String(lowStock.length)} detail="Variants below threshold" icon={CircleAlert} tone={lowStock.length ? 'coral' : 'lime'} />
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <div className="border border-white/10 bg-white/[0.035]">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-5 sm:px-6">
            <div><p className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40">Live queue</p><h2 className="mt-1 text-lg font-medium text-white">Recent orders</h2></div>
            <Link href="/admin/orders" className="flex items-center gap-1 text-xs font-semibold text-[#B9D477] hover:text-white">View all <ArrowUpRight size={14} /></Link>
          </div>
          <div className="divide-y divide-white/10">
            {orders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex flex-col gap-3 px-5 py-4 transition-colors hover:bg-white/[0.035] sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.07] text-white/55"><ShoppingBag size={15} /></span><div><p className="text-sm font-semibold text-white">{order.orderNumber}</p><p className="mt-0.5 text-xs text-white/40">{order.customerName} · {order.shippingAddress.county}</p></div></div>
                <div className="flex items-center justify-between gap-6 sm:justify-end"><span className="text-[10px] font-mono uppercase tracking-wider text-[#D8E2B8]">{order.fulfillmentStatus}</span><span className="text-sm font-semibold text-white">{formatKES(order.total)}</span><ChevronRight size={15} className="text-white/25" /></div>
              </div>
            ))}
            {!orders.length && <div className="px-6 py-12 text-center text-sm text-white/40">No orders have arrived yet.</div>}
          </div>
        </div>

        <div className="border border-white/10 bg-white/[0.035]">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-5 sm:px-6">
            <div><p className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40">Stock watch</p><h2 className="mt-1 text-lg font-medium text-white">Needs attention</h2></div>
            <Link href="/admin/inventory" className="text-xs font-semibold text-[#B9D477] hover:text-white">Inventory</Link>
          </div>
          <div className="divide-y divide-white/10">
            {lowStock.slice(0, 5).map((item) => (
              <div key={`${item.product}-${item.variant}`} className="flex items-center justify-between gap-3 px-5 py-4 sm:px-6"><div className="min-w-0"><p className="truncate text-sm font-medium text-white">{item.product}</p><p className="mt-1 text-xs text-white/40">{item.variant}</p></div><span className="shrink-0 rounded-full bg-[#E27B62]/15 px-2.5 py-1 text-xs font-bold text-[#E27B62]">{item.stock} left</span></div>
            ))}
            {!lowStock.length && <div className="px-6 py-12 text-center text-sm text-white/40">Inventory is in good shape.</div>}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Link href="/admin/products/new" className="group flex items-center justify-between border border-white/10 bg-[#D8E2B8] p-5 text-[#24291B] transition-transform hover:-translate-y-0.5"><span><span className="block text-[10px] font-mono uppercase tracking-[0.18em] opacity-65">Catalog</span><span className="mt-2 block font-semibold">Create a new piece</span></span><ArrowUpRight size={18} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></Link>
        <Link href="/admin/orders" className="group flex items-center justify-between border border-white/10 bg-white/[0.045] p-5 text-white transition-colors hover:bg-white/[0.08]"><span><span className="block text-[10px] font-mono uppercase tracking-[0.18em] text-white/40">Operations</span><span className="mt-2 block font-semibold">Open fulfillment queue</span></span><Clock3 size={18} className="text-white/45" /></Link>
        <Link href="/admin/customers" className="group flex items-center justify-between border border-white/10 bg-white/[0.045] p-5 text-white transition-colors hover:bg-white/[0.08]"><span><span className="block text-[10px] font-mono uppercase tracking-[0.18em] text-white/40">Community</span><span className="mt-2 block font-semibold">View customer book</span></span><Users size={18} className="text-white/45" /></Link>
      </section>
    </div>
  );
}
