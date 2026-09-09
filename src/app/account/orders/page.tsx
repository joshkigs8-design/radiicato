'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Package, Clock, ShieldCheck, ChevronRight, X } from 'lucide-react';
import { useStore } from '@/lib/use-store';
import { formatKES, formatDateTime } from '@/lib/utils';
import { Order } from '@/types';

export default function CustomerOrdersPage() {
  const { orders } = useStore();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  return (
    <div className="pt-28 sm:pt-36 pb-32 px-6 sm:px-12 max-w-[1400px] mx-auto min-h-screen bg-white">
      <div className="pb-8 border-b border-[#E4E4E7] mb-10 flex items-center justify-between">
        <Link
          href="/account"
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#71717A] hover:text-[#0A0A0A] font-semibold transition-colors"
        >
          <ArrowLeft size={14} /> Back to Account
        </Link>
        <span className="text-xs font-mono text-[#71717A]">
          SHOWING {orders.length} REGISTERED ORDERS
        </span>
      </div>

      <div className="space-y-6">
        <h1 className="text-3xl font-black uppercase tracking-tight text-[#0A0A0A] font-display">
          ORDER HISTORY & DISPATCH ARCHIVES
        </h1>

        {orders.length === 0 ? (
          <div className="py-20 text-center text-xs text-[#71717A] bg-[#FAFAF9] border border-[#E4E4E7]">
            No previous orders found.
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="p-6 bg-[#FAFAF9] border border-[#E4E4E7] hover:border-[#D4D4D8] transition-all space-y-4 shadow-sm"
              >
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-[#E4E4E7] pb-4 text-xs font-mono">
                  <div className="space-y-0.5">
                    <span className="text-[#0A0A0A] font-bold text-sm">{order.orderNumber}</span>
                    <span className="text-[#71717A] block">{formatDateTime(order.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={`text-xs uppercase font-bold px-2.5 py-1 rounded ${
                        order.fulfillmentStatus === 'delivered'
                          ? 'bg-[#4D5936]/10 text-[#4D5936] border border-[#4D5936]/20'
                          : order.fulfillmentStatus === 'shipped'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {order.fulfillmentStatus}
                    </span>
                    <span className="text-sm font-bold text-[#0A0A0A]">{formatKES(order.total)}</span>
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="p-1 text-[#71717A] hover:text-[#0A0A0A] transition-colors"
                      title="View order details"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="relative w-12 h-16 bg-[#F4F4F5] overflow-hidden flex-shrink-0 border border-[#E4E4E7]">
                        {item.imageUrl && (
                          <Image
                            src={item.imageUrl}
                            alt={item.productName}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        )}
                      </div>
                      <div className="text-xs">
                        <p className="font-semibold text-[#0A0A0A] uppercase line-clamp-1">{item.productName}</p>
                        <p className="text-[10px] font-mono text-[#71717A]">
                          {item.variantTitle} • QTY {item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {order.trackingNumber && (
                  <div className="pt-2 border-t border-[#E4E4E7] flex justify-between items-center text-xs font-mono">
                    <span className="text-[#4D5936] font-bold">CARRIER TRACKING: {order.trackingNumber}</span>
                    <span className="text-[#71717A]">FARGO COURIER KENYA</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white border border-[#E4E4E7] shadow-2xl max-w-xl w-full p-6 text-[#0A0A0A] relative space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-[#E4E4E7] pb-4">
              <div>
                <span className="text-[10px] font-mono text-[#71717A] uppercase font-bold">ORDER BREAKDOWN</span>
                <h3 className="text-base font-bold uppercase tracking-wider text-[#0A0A0A]">{selectedOrder.orderNumber}</h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 text-[#71717A] hover:text-[#0A0A0A] transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Timeline */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#71717A]">Fulfillment Timeline</h4>
              <div className="space-y-3 border-l-2 border-[#E4E4E7] pl-4 ml-2">
                {selectedOrder.timeline.map((event, i) => (
                  <div key={i} className="relative">
                    <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-[#4D5936] border-2 border-white" />
                    <p className="text-xs font-semibold text-[#0A0A0A] uppercase">{event.title}</p>
                    <p className="text-[11px] text-[#71717A]">{event.description}</p>
                    <span className="text-[10px] font-mono text-[#A1A1AA]">{formatDateTime(event.timestamp)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery address */}
            <div className="p-4 bg-[#FAFAF9] border border-[#E4E4E7] text-xs font-mono space-y-1">
              <p className="text-[#0A0A0A] font-bold">{selectedOrder.shippingAddress.fullName}</p>
              <p className="text-[#71717A]">
                {selectedOrder.shippingAddress.streetAddress}, {selectedOrder.shippingAddress.town}, {selectedOrder.shippingAddress.county}
              </p>
              <p className="text-[#71717A]">{selectedOrder.shippingAddress.phone}</p>
            </div>

            {/* Items */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#71717A]">Items</h4>
              <div className="divide-y divide-[#E4E4E7]">
                {selectedOrder.items.map((it) => (
                  <div key={it.id} className="py-2.5 flex justify-between items-center text-xs">
                    <div>
                      <p className="font-semibold text-[#0A0A0A] uppercase">{it.productName}</p>
                      <p className="text-[10px] font-mono text-[#71717A]">{it.variantTitle} × {it.quantity}</p>
                    </div>
                    <span className="font-mono text-[#0A0A0A] font-semibold">{formatKES(it.total)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="pt-3 border-t border-[#E4E4E7] flex justify-between items-center text-sm font-bold font-mono">
              <span className="uppercase text-[#71717A]">TOTAL PAID</span>
              <span className="text-base text-[#0A0A0A]">{formatKES(selectedOrder.total)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
