'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ChevronRight, X } from 'lucide-react';
import { useStore } from '@/lib/use-store';
import { formatKES, formatDateTime } from '@/lib/utils';
import { Order } from '@/types';

export default function CustomerOrdersPage() {
  const { orders } = useStore();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  return (
    <main className="pt-28 sm:pt-36 pb-32 px-5 sm:px-8 lg:px-12 bg-white min-h-screen">
      <div className="max-w-[1400px] mx-auto">
        <div className="pb-8 border-b border-[#E4E4E7] mb-10 flex items-center justify-between">
          <Link
            href="/account"
            className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-[#71717A] hover:text-[#0A0A0A] transition-colors"
          >
            <ArrowLeft size={14} /> Back to Account
          </Link>
          <span className="text-[10px] font-mono text-[#71717A] uppercase tracking-[0.2em]">
            SHOWING {orders.length} REGISTERED ORDERS
          </span>
        </div>

        <div className="space-y-8">
          <h1 className="text-display-sm font-black uppercase tracking-tight text-[#0A0A0A]">
            ORDER HISTORY & DISPATCH ARCHIVES
          </h1>

          {orders.length === 0 ? (
            <div className="py-20 text-center text-sm text-[#71717A] bg-[#F4F4F5] border border-[#E4E4E7]">
              No previous orders found.
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="p-6 bg-white border border-[#E4E4E7] hover:border-[#0A0A0A] transition-colors space-y-4"
                >
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-[#E4E4E7] pb-4">
                    <div className="space-y-1">
                      <span className="text-[#0A0A0A] font-bold text-sm uppercase">{order.orderNumber}</span>
                      <span className="text-[#71717A] block text-xs font-mono">{formatDateTime(order.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-[#0A0A0A]">
                        STATUS: {order.fulfillmentStatus}
                      </span>
                      <span className="text-sm font-bold text-[#0A0A0A] font-mono">{formatKES(order.total)}</span>
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-[#71717A] hover:text-[#0A0A0A] transition-colors flex items-center gap-1 text-[10px] font-mono uppercase"
                      >
                        VIEW <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <div className="relative w-16 h-20 bg-[#F4F4F5] overflow-hidden flex-shrink-0 border border-[#E4E4E7]">
                          {item.imageUrl && (
                            <Image
                              src={item.imageUrl}
                              alt={item.productName}
                              fill
                              className="object-cover"
                              sizes="64px"
                            />
                          )}
                        </div>
                        <div className="text-xs">
                          <p className="font-bold text-[#0A0A0A] uppercase line-clamp-1">{item.productName}</p>
                          <p className="text-[10px] font-mono text-[#71717A] mt-1">
                            {item.variantTitle}
                          </p>
                          <p className="text-[10px] font-mono text-[#71717A]">
                            QTY {item.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {order.trackingNumber && (
                    <div className="pt-4 border-t border-[#E4E4E7] flex justify-between items-center text-[10px] font-mono uppercase">
                      <span className="text-[#0A0A0A] font-bold">CARRIER TRACKING: {order.trackingNumber}</span>
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
            <div className="bg-white border border-[#E4E4E7] max-w-xl w-full p-6 text-[#0A0A0A] relative space-y-6 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center border-b border-[#E4E4E7] pb-4">
                <div>
                  <span className="text-[10px] font-mono text-[#71717A] uppercase tracking-[0.2em]">ORDER BREAKDOWN</span>
                  <h3 className="text-base font-bold uppercase tracking-wider text-[#0A0A0A] mt-1">{selectedOrder.orderNumber}</h3>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-1 text-[#71717A] hover:text-[#0A0A0A] transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Timeline */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#71717A]">Fulfillment Timeline</h4>
                <div className="space-y-4 border-l border-[#E4E4E7] pl-4 ml-2">
                  {selectedOrder.timeline.map((event, i) => (
                    <div key={i} className="relative">
                      <span className="absolute -left-[21px] top-1 w-2 h-2 bg-[#0A0A0A]" />
                      <p className="text-xs font-bold text-[#0A0A0A] uppercase tracking-wide">{event.title}</p>
                      <p className="text-xs text-[#71717A] mt-1">{event.description}</p>
                      <span className="text-[10px] font-mono text-[#A1A1AA] mt-1 block">{formatDateTime(event.timestamp)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery address */}
              <div className="p-4 bg-[#F4F4F5] border border-[#E4E4E7] text-xs font-mono space-y-1">
                <p className="text-[#0A0A0A] font-bold uppercase">{selectedOrder.shippingAddress.fullName}</p>
                <p className="text-[#71717A] uppercase">
                  {selectedOrder.shippingAddress.streetAddress}, {selectedOrder.shippingAddress.town}, {selectedOrder.shippingAddress.county}
                </p>
                <p className="text-[#71717A]">{selectedOrder.shippingAddress.phone}</p>
              </div>

              {/* Items */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#71717A]">Items</h4>
                <div className="divide-y divide-[#E4E4E7] border-t border-b border-[#E4E4E7]">
                  {selectedOrder.items.map((it) => (
                    <div key={it.id} className="py-3 flex justify-between items-center text-xs">
                      <div>
                        <p className="font-bold text-[#0A0A0A] uppercase">{it.productName}</p>
                        <p className="text-[10px] font-mono text-[#71717A] mt-1 uppercase">{it.variantTitle} × {it.quantity}</p>
                      </div>
                      <span className="font-mono text-[#0A0A0A] font-bold">{formatKES(it.total)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="pt-2 flex justify-between items-center text-sm font-bold font-mono">
                <span className="uppercase text-[#0A0A0A]">TOTAL PAID</span>
                <span className="text-base text-[#0A0A0A]">{formatKES(selectedOrder.total)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
