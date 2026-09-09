'use client';

import React, { useState } from 'react';
import { Users, Search, ShoppingBag, DollarSign, Ban, Check, MoreHorizontal } from 'lucide-react';
import { useStore } from '@/lib/use-store';
import { formatKES, formatDate } from '@/lib/utils';
import { Customer } from '@/types';

export default function AdminCustomersPage() {
  const { orders } = useStore();
  const [searchQuery, setSearchQuery] = useState('');

  // Extract unique customers dynamically from real orders (zero mockup data)
  const customersList = React.useMemo(() => {
    const map = new Map<string, {
      id: string;
      name: string;
      email: string;
      phone: string;
      ordersCount: number;
      totalSpent: number;
      lastOrderDate: string;
      registeredAt: string;
      isActive: boolean;
      notes: string;
    }>();

    orders.forEach((o) => {
      const emailKey = (o.email || '').toLowerCase().trim();
      if (!emailKey) return;
      const existing = map.get(emailKey);
      if (existing) {
        existing.ordersCount += 1;
        existing.totalSpent += o.total;
        if (new Date(o.createdAt) > new Date(existing.lastOrderDate)) {
          existing.lastOrderDate = o.createdAt.split('T')[0];
        }
      } else {
        map.set(emailKey, {
          id: `cust-${map.size + 1}`,
          name: o.customerName,
          email: o.email,
          phone: o.phone,
          ordersCount: 1,
          totalSpent: o.total,
          lastOrderDate: o.createdAt.split('T')[0],
          registeredAt: o.createdAt.split('T')[0],
          isActive: true,
          notes: `${o.shippingAddress?.town || 'Nairobi'}, ${o.shippingAddress?.county || 'Kenya'} Client`,
        });
      }
    });

    return Array.from(map.values());
  }, [orders]);

  const filtered = customersList.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery)
  );

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-[#E5E7EB] pb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">Customer Directory & CRM</h1>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Customer lifetime values (LTV), order frequency, and VIP clientele profiles.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 bg-white border border-[#E5E7EB] rounded-lg shadow-sm flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search size={15} className="text-[#9CA3AF] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search customers by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-md pl-9 pr-3 py-1.5 text-xs text-[#111827] focus:outline-none focus:border-[#4D5936]"
          />
        </div>
        <span className="text-xs font-mono text-[#6B7280]">{filtered.length} Registered Customers</span>
      </div>

      {/* Customers Table */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F9FAFB] text-[#6B7280] font-mono border-b border-[#E5E7EB]">
              <tr>
                <th className="py-3 px-4">CLIENT NAME</th>
                <th className="py-3 px-4">CONTACT</th>
                <th className="py-3 px-4">ORDERS</th>
                <th className="py-3 px-4">TOTAL LTV</th>
                <th className="py-3 px-4">LAST ORDER</th>
                <th className="py-3 px-4">MEMBER SINCE</th>
                <th className="py-3 px-4">STATUS</th>
                <th className="py-3 px-4">ATELIER NOTES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB] text-[#111827]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-[#6B7280]">
                    <Users size={28} className="mx-auto text-[#9CA3AF] mb-2" />
                    <p className="font-bold text-xs text-[#111827]">No Customer Records Located</p>
                    <p className="text-[11px] text-[#6B7280] mt-0.5">
                      New customer profiles and spend histories will appear here automatically as real orders are placed.
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-[#F9FAFB] transition-colors">
                    <td className="py-3 px-4 font-bold text-[#111827]">{c.name}</td>
                    <td className="py-3 px-4">
                      <p className="font-mono text-[#4B5563]">{c.email}</p>
                      <p className="font-mono text-[10px] text-[#6B7280]">{c.phone}</p>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-[#111827]">
                      {c.ordersCount} orders
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-[#059669]">
                      {formatKES(c.totalSpent)}
                    </td>
                    <td className="py-3 px-4 font-mono text-[#6B7280]">{c.lastOrderDate}</td>
                    <td className="py-3 px-4 font-mono text-[#6B7280]">{c.registeredAt}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 bg-[#ECFDF5] text-[#065F46] rounded text-[10px] font-mono font-bold uppercase">
                        ACTIVE VIP
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#6B7280] italic max-w-xs truncate">
                      {c.notes}
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

