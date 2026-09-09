'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  ShoppingCart, Search, Filter, Eye, Printer, Truck, 
  CheckCircle2, X, AlertCircle, Clock, FileText, Send 
} from 'lucide-react';
import { useStore } from '@/lib/use-store';
import { formatKES, formatDateTime } from '@/lib/utils';
import { Order, OrderStatus } from '@/types';

export default function AdminOrdersPage() {
  const { orders, updateOrderStatus, updateOrderTracking } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Status Change State inside Drawer
  const [newTracking, setNewTracking] = useState('');
  const [internalNote, setInternalNote] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const filteredOrders = orders.filter((o) => {
    if (statusFilter !== 'all' && o.fulfillmentStatus !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.email.toLowerCase().includes(q) ||
        o.phone.includes(q)
      );
    }
    return true;
  });

  const handleUpdateStatus = (orderId: string, status: OrderStatus) => {
    updateOrderStatus(orderId, status, `Fulfillment status updated to ${status.toUpperCase()} by admin.`);
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, fulfillmentStatus: status });
    }
    showToast(`Order status updated to ${status.toUpperCase()}`);
  };

  const handleAddTracking = (orderId: string) => {
    if (!newTracking.trim()) return;
    updateOrderTracking(orderId, newTracking.trim());
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, trackingNumber: newTracking.trim(), fulfillmentStatus: 'shipped' });
    }
    showToast(`Assigned tracking number: ${newTracking.trim()}`);
    setNewTracking('');
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-16">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#111827] text-white px-4 py-2.5 rounded-md shadow-xl text-xs font-bold flex items-center gap-2 border border-[#374151]">
          <CheckCircle2 size={16} className="text-[#10B981]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-[#E5E7EB] pb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">Order Fulfillment & Dispatches</h1>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Process checkout transactions, assign Fargo Courier tracking numbers, and view customer timelines.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white border border-[#E5E7EB] rounded-lg shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search size={15} className="text-[#9CA3AF] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Order ID (RAD-2026-...), customer name, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-md pl-9 pr-3 py-1.5 text-xs text-[#111827] focus:outline-none focus:border-[#4D5936]"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-md px-3 py-1.5 text-xs text-[#111827] focus:outline-none focus:border-[#4D5936]"
          >
            <option value="all">All Statuses ({orders.length})</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="processing">Processing</option>
            <option value="packed">Packed</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F9FAFB] text-[#6B7280] font-mono border-b border-[#E5E7EB]">
              <tr>
                <th className="py-3 px-4">ORDER ID</th>
                <th className="py-3 px-4">CUSTOMER</th>
                <th className="py-3 px-4">DATE</th>
                <th className="py-3 px-4">ITEMS</th>
                <th className="py-3 px-4">PAYMENT</th>
                <th className="py-3 px-4">STATUS</th>
                <th className="py-3 px-4 text-right">TOTAL</th>
                <th className="py-3 px-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB] text-[#111827]">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[#6B7280]">
                    No orders located for this filter.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#F9FAFB] transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#111827]">
                      {order.orderNumber}
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-semibold">{order.customerName}</p>
                      <p className="text-[10px] text-[#6B7280] font-mono">{order.phone}</p>
                    </td>
                    <td className="py-3 px-4 font-mono text-[#6B7280]">
                      {formatDateTime(order.createdAt)}
                    </td>
                    <td className="py-3 px-4 font-mono text-[#6B7280]">
                      {order.items.reduce((acc, it) => acc + it.quantity, 0)} pieces
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 bg-[#ECFDF5] text-[#065F46] rounded text-[10px] font-mono font-bold uppercase">
                        {order.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold uppercase ${
                          order.fulfillmentStatus === 'delivered'
                            ? 'bg-[#ECFDF5] text-[#065F46]'
                            : order.fulfillmentStatus === 'shipped'
                            ? 'bg-[#EFF6FF] text-[#1D4ED8]'
                            : order.fulfillmentStatus === 'processing'
                            ? 'bg-[#FEF3C7] text-[#92400E]'
                            : 'bg-[#F3F4F6] text-[#4B5563]'
                        }`}
                      >
                        {order.fulfillmentStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold">
                      {formatKES(order.total)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="px-3 py-1 bg-[#111827] text-white hover:bg-black rounded text-xs font-semibold"
                      >
                        Manage &rarr;
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Drawer */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-xl bg-white h-full shadow-2xl overflow-y-auto p-8 space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex justify-between items-center border-b border-[#E5E7EB] pb-4">
                <div>
                  <span className="text-[10px] font-mono text-[#6B7280] uppercase">DISPATCH MANAGEMENT</span>
                  <h2 className="text-lg font-bold text-[#111827]">{selectedOrder.orderNumber}</h2>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-1 text-[#6B7280] hover:text-[#111827]"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Status Update Quick Bar */}
              <div className="p-4 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg space-y-3">
                <label className="text-xs font-bold text-[#374151] block uppercase tracking-wider">
                  Update Fulfillment Status
                </label>
                <div className="flex flex-wrap gap-2">
                  {(['paid', 'processing', 'packed', 'shipped', 'delivered', 'cancelled'] as OrderStatus[]).map((st) => (
                    <button
                      key={st}
                      onClick={() => handleUpdateStatus(selectedOrder.id, st)}
                      className={`px-3 py-1.5 rounded text-xs font-mono uppercase transition-colors ${
                        selectedOrder.fulfillmentStatus === st
                          ? 'bg-[#4D5936] text-white font-bold'
                          : 'bg-white border border-[#D1D5DB] text-[#4B5563] hover:bg-[#F3F4F6]'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Add Tracking Number */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#374151] uppercase tracking-wider block">
                  Assign Courier Tracking Number
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. FGO-NRB-981249"
                    value={newTracking}
                    onChange={(e) => setNewTracking(e.target.value)}
                    className="flex-1 bg-[#F9FAFB] border border-[#E5E7EB] p-2 rounded text-xs font-mono text-[#111827]"
                  />
                  <button
                    onClick={() => handleAddTracking(selectedOrder.id)}
                    className="px-4 py-2 bg-[#111827] text-white rounded text-xs font-bold uppercase tracking-wider"
                  >
                    Assign
                  </button>
                </div>
                {selectedOrder.trackingNumber && (
                  <p className="text-xs font-mono text-[#059669]">
                    Current Tracking: {selectedOrder.trackingNumber} (Fargo Courier)
                  </p>
                )}
              </div>

              {/* Customer & Address Details */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-[#F9FAFB] rounded-lg text-xs">
                <div>
                  <h4 className="font-bold text-[#374151] uppercase tracking-wider mb-1">Customer</h4>
                  <p className="font-semibold text-[#111827]">{selectedOrder.customerName}</p>
                  <p className="text-[#6B7280] font-mono">{selectedOrder.email}</p>
                  <p className="text-[#6B7280] font-mono">{selectedOrder.phone}</p>
                </div>
                <div>
                  <h4 className="font-bold text-[#374151] uppercase tracking-wider mb-1">Delivery Destination</h4>
                  <p className="text-[#111827]">{selectedOrder.shippingAddress.streetAddress}</p>
                  <p className="text-[#6B7280] font-mono">{selectedOrder.shippingAddress.town}, {selectedOrder.shippingAddress.county}</p>
                  {selectedOrder.shippingAddress.deliveryInstructions && (
                    <p className="text-[11px] text-[#9CA3AF] italic mt-1">
                      Note: {selectedOrder.shippingAddress.deliveryInstructions}
                    </p>
                  )}
                </div>
              </div>

              {/* Payment Details */}
              <div className="p-4 bg-[#F9FAFB] rounded-lg text-xs space-y-1 font-mono">
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Payment Method:</span>
                  <span className="font-bold uppercase text-[#111827]">{selectedOrder.paymentMethod}</span>
                </div>
                {selectedOrder.paymentDetails?.mpesaReceiptNumber && (
                  <div className="flex justify-between">
                    <span className="text-[#6B7280]">M-PESA Receipt:</span>
                    <span className="font-bold text-[#059669]">{selectedOrder.paymentDetails.mpesaReceiptNumber}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Transaction Reference:</span>
                  <span className="text-[#111827]">{selectedOrder.paymentDetails?.reference || 'N/A'}</span>
                </div>
              </div>

              {/* Reserved Items */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-[#374151] uppercase tracking-wider">Ordered Garments</h4>
                <div className="divide-y divide-[#E5E7EB] border-y border-[#E5E7EB]">
                  {selectedOrder.items.map((it) => (
                    <div key={it.id} className="py-3 flex justify-between items-center text-xs">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-12 bg-[#111] rounded overflow-hidden flex-shrink-0">
                          {it.imageUrl && <Image src={it.imageUrl} alt={it.productName} fill className="object-cover" sizes="40px" />}
                        </div>
                        <div>
                          <p className="font-semibold text-[#111827]">{it.productName}</p>
                          <p className="text-[10px] font-mono text-[#6B7280]">{it.variantTitle} × {it.quantity}</p>
                        </div>
                      </div>
                      <span className="font-mono font-bold text-[#111827]">{formatKES(it.total)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial Totals */}
              <div className="space-y-1.5 text-xs font-mono border-t border-[#E5E7EB] pt-3">
                <div className="flex justify-between text-[#6B7280]">
                  <span>Subtotal:</span>
                  <span>{formatKES(selectedOrder.subtotal)}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-[#059669]">
                    <span>Discount ({selectedOrder.discountCode}):</span>
                    <span>-{formatKES(selectedOrder.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#6B7280]">
                  <span>Shipping Fee:</span>
                  <span>{formatKES(selectedOrder.shippingFee)}</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-[#111827] pt-2 border-t border-[#E5E7EB]">
                  <span>Total Paid:</span>
                  <span>{formatKES(selectedOrder.total)}</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-[#E5E7EB] flex justify-between">
              <button
                onClick={() => {
                  window.open(`/order-success?orderNumber=${selectedOrder.orderNumber}`, '_blank');
                }}
                className="px-4 py-2 border border-[#D1D5DB] rounded text-xs font-semibold text-[#374151] hover:bg-[#F3F4F6] flex items-center gap-1.5"
              >
                <Printer size={14} /> Print Invoice
              </button>
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-6 py-2 bg-[#111827] text-white rounded text-xs font-bold uppercase tracking-wider"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

