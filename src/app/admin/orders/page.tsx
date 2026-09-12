'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { 
  ShoppingCart, Search, Filter, Eye, Printer, Truck, 
  CheckCircle2, X, AlertCircle, Clock, FileText, Send,
  Download, Copy, Calendar, Check, ExternalLink, PackageCheck
} from 'lucide-react';
import { useStore } from '@/lib/use-store';
import { formatKES, formatDateTime } from '@/lib/utils';
import { Order, OrderStatus } from '@/types';

const COURIER_OPTIONS = [
  'Fargo Courier',
  'G4S Kenya',
  'Speedaf',
  'Wells Fargo',
  'Nairobi Rider / Direct Dispatch',
];

const STATUS_TABS: { id: string; label: string; filterStatus?: OrderStatus | 'all' }[] = [
  { id: 'all', label: 'All', filterStatus: 'all' },
  { id: 'pending', label: 'Pending Verification', filterStatus: 'pending' },
  { id: 'paid', label: 'Paid', filterStatus: 'paid' },
  { id: 'processing', label: 'Processing', filterStatus: 'processing' },
  { id: 'shipped', label: 'Dispatched', filterStatus: 'shipped' },
  { id: 'delivered', label: 'Delivered', filterStatus: 'delivered' },
  { id: 'cancelled', label: 'Cancelled', filterStatus: 'cancelled' },
];

export default function AdminOrdersPage() {
  const { orders, updateOrderStatus, updateOrderTracking } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Dispatch Assignment State inside Drawer
  const [selectedCourier, setSelectedCourier] = useState<string>('Fargo Courier');
  const [newTracking, setNewTracking] = useState('');
  const [dispatchDate, setDispatchDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [copiedTracking, setCopiedTracking] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Sync drawer state when selectedOrder changes
  const handleOpenDrawer = (order: Order) => {
    setSelectedOrder(order);
    setSelectedCourier(order.carrier || 'Fargo Courier');
    setNewTracking(order.trackingNumber || '');
    setDispatchDate(order.dispatchDate || new Date().toISOString().split('T')[0]);
    setCopiedTracking(false);
  };

  // Tab counts
  const tabCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: orders.length,
      pending: 0,
      paid: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    };
    orders.forEach((o) => {
      if (o.fulfillmentStatus === 'pending') counts.pending++;
      else if (o.fulfillmentStatus === 'paid') counts.paid++;
      else if (o.fulfillmentStatus === 'processing' || o.fulfillmentStatus === 'packed') counts.processing++;
      else if (o.fulfillmentStatus === 'shipped') counts.shipped++;
      else if (o.fulfillmentStatus === 'delivered') counts.delivered++;
      else if (o.fulfillmentStatus === 'cancelled' || o.fulfillmentStatus === 'refunded') counts.cancelled++;
    });
    return counts;
  }, [orders]);

  // Filter and search
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      // Tab status filtering
      if (activeTab === 'pending' && o.fulfillmentStatus !== 'pending') return false;
      if (activeTab === 'paid' && o.fulfillmentStatus !== 'paid') return false;
      if (activeTab === 'processing' && o.fulfillmentStatus !== 'processing' && o.fulfillmentStatus !== 'packed') return false;
      if (activeTab === 'shipped' && o.fulfillmentStatus !== 'shipped') return false;
      if (activeTab === 'delivered' && o.fulfillmentStatus !== 'delivered') return false;
      if (activeTab === 'cancelled' && o.fulfillmentStatus !== 'cancelled' && o.fulfillmentStatus !== 'refunded') return false;

      // Search by M-PESA code, phone, customer name, order number, tracking
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesOrderNum = o.orderNumber.toLowerCase().includes(q);
        const matchesCust = o.customerName.toLowerCase().includes(q);
        const matchesPhone = o.phone.toLowerCase().includes(q);
        const matchesEmail = o.email.toLowerCase().includes(q);
        const matchesMpesa = Boolean(
          (o.paymentDetails?.mpesaReceiptNumber && o.paymentDetails.mpesaReceiptNumber.toLowerCase().includes(q)) ||
          (o.paymentDetails?.reference && o.paymentDetails.reference.toLowerCase().includes(q))
        );
        const matchesTracking = Boolean(o.trackingNumber && o.trackingNumber.toLowerCase().includes(q));
        const matchesCarrier = Boolean(o.carrier && o.carrier.toLowerCase().includes(q));

        return matchesOrderNum || matchesCust || matchesPhone || matchesEmail || matchesMpesa || matchesTracking || matchesCarrier;
      }
      return true;
    });
  }, [orders, activeTab, searchQuery]);

  const handleUpdateStatus = (orderId: string, status: OrderStatus) => {
    updateOrderStatus(orderId, status, `Fulfillment status marked as ${status.toUpperCase()} by admin.`);
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, fulfillmentStatus: status });
    }
    showToast(`Order status updated to ${status.toUpperCase()}`);
  };

  const handleAssignDispatch = (orderId: string) => {
    if (!newTracking.trim()) {
      showToast('Please enter a valid tracking number');
      return;
    }

    updateOrderTracking(orderId, newTracking.trim(), selectedCourier, dispatchDate);

    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({
        ...selectedOrder,
        trackingNumber: newTracking.trim(),
        carrier: selectedCourier,
        dispatchDate: dispatchDate,
        fulfillmentStatus: 'shipped',
      });
    }

    showToast(`Assigned ${selectedCourier} (${newTracking.trim()}) for ${dispatchDate}`);
  };

  const handleCopyTracking = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedTracking(true);
    setTimeout(() => setCopiedTracking(false), 2000);
    showToast('Tracking number copied to clipboard');
  };

  // Export Dispatch Manifest (CSV) for courier pickup
  const handleExportDispatchManifest = () => {
    const todayStr = new Date().toISOString().split('T')[0];

    // Select today's dispatches or all active orders requiring courier pickup
    let manifestOrders = orders.filter((o) => {
      const createdToday = o.createdAt.startsWith(todayStr);
      const dispatchedToday = o.dispatchDate === todayStr;
      const readyForPickup = o.fulfillmentStatus === 'processing' || o.fulfillmentStatus === 'paid' || o.fulfillmentStatus === 'shipped';
      return createdToday || dispatchedToday || readyForPickup;
    });

    if (manifestOrders.length === 0) {
      manifestOrders = filteredOrders.length > 0 ? filteredOrders : orders;
    }

    if (manifestOrders.length === 0) {
      showToast('No orders found to include in the dispatch manifest.');
      return;
    }

    const headers = [
      'Order Number',
      'Order Date',
      'Customer Name',
      'Phone Number',
      'Email',
      'Shipping County',
      'Town / City',
      'Delivery Address',
      'Delivery Instructions',
      'Items Ordered',
      'Item Count',
      'Subtotal (KES)',
      'Shipping Fee (KES)',
      'Total Amount (KES)',
      'Payment Provider',
      'M-PESA Receipt Number',
      'Fulfillment Status',
      'Assigned Courier Partner',
      'Tracking Number',
      'Dispatch Date'
    ];

    const rows = manifestOrders.map((o) => {
      const itemsStr = o.items.map((it) => `${it.productName} (${it.variantTitle}) x${it.quantity}`).join('; ');
      const totalPieces = o.items.reduce((sum, it) => sum + it.quantity, 0);

      return [
        o.orderNumber,
        formatDateTime(o.createdAt),
        o.customerName,
        o.phone,
        o.email,
        o.shippingAddress?.county || 'Nairobi',
        o.shippingAddress?.town || 'Nairobi',
        o.shippingAddress?.streetAddress || '',
        o.shippingAddress?.deliveryInstructions || '',
        itemsStr,
        totalPieces,
        o.subtotal,
        o.shippingFee,
        o.total,
        o.paymentMethod.toUpperCase(),
        o.paymentDetails?.mpesaReceiptNumber || 'N/A',
        o.fulfillmentStatus.toUpperCase(),
        o.carrier || 'Fargo Courier',
        o.trackingNumber || 'PENDING',
        o.dispatchDate || todayStr
      ].map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `radiicato-dispatch-manifest-${todayStr}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast(`Dispatch manifest exported (${manifestOrders.length} orders for courier pickup)`);
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-16">
      {/* Floating Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#111827] text-white px-4 py-2.5 rounded-md shadow-2xl text-xs font-bold flex items-center gap-2 border border-[#374151] animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 size={16} className="text-[#10B981]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header with Export Manifest CTA */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-[#E5E7EB] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#111827]">Order Fulfillment & Dispatches</h1>
            <span className="px-2 py-0.5 bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0] rounded text-[10px] font-mono font-bold uppercase">
              Live Operations
            </span>
          </div>
          <p className="text-xs text-[#6B7280] mt-1">
            Verify M-PESA checkout payments, assign Fargo Courier / G4S / Speedaf tracking, and export daily pickup manifests.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportDispatchManifest}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#111827] hover:bg-black text-white rounded-md text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
          >
            <Download size={14} className="text-[#10B981]" />
            <span>Export Dispatch Manifest (CSV)</span>
          </button>
        </div>
      </div>

      {/* Status Filtering Tabs */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg shadow-sm p-2 overflow-x-auto">
        <div className="flex items-center gap-1.5 min-w-max">
          {STATUS_TABS.map((tab) => {
            const count = tabCounts[tab.id] ?? 0;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-md text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#111827] text-white shadow-sm'
                    : 'text-[#4B5563] hover:text-[#111827] hover:bg-[#F3F4F6]'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-[#E5E7EB] text-[#4B5563]'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search & Operational Filter Bar */}
      <div className="p-4 bg-white border border-[#E5E7EB] rounded-lg shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 max-w-xl">
          <Search size={15} className="text-[#9CA3AF] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by M-PESA code (e.g. QKH829...), customer phone, name, or Order ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-md pl-9 pr-3 py-2 text-xs text-[#111827] focus:outline-none focus:border-[#4D5936] focus:bg-white transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-[#6B7280]">
          <span>Showing <strong className="text-[#111827]">{filteredOrders.length}</strong> of {orders.length} orders</span>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="px-2 py-1 bg-[#F3F4F6] text-[#4B5563] hover:text-[#111827] rounded text-[11px]"
            >
              Clear Search
            </button>
          )}
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
                <th className="py-3 px-4">DATE & DESTINATION</th>
                <th className="py-3 px-4">ITEMS</th>
                <th className="py-3 px-4">PAYMENT & M-PESA</th>
                <th className="py-3 px-4">COURIER / DISPATCH</th>
                <th className="py-3 px-4">STATUS</th>
                <th className="py-3 px-4 text-right">TOTAL</th>
                <th className="py-3 px-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB] text-[#111827]">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-14 text-center text-[#6B7280]">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <ShoppingCart size={32} className="text-[#D1D5DB]" />
                      <p className="font-semibold text-sm text-[#374151]">No matching orders located</p>
                      <p className="text-xs text-[#9CA3AF]">
                        Try searching with an M-PESA receipt code or changing the status filter tab.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const mpesaCode = order.paymentDetails?.mpesaReceiptNumber;

                  return (
                    <tr key={order.id} className="hover:bg-[#F9FAFB] transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#111827]">
                        {order.orderNumber}
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-[#111827]">{order.customerName}</p>
                        <p className="text-[10px] text-[#6B7280] font-mono">{order.phone}</p>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[#6B7280]">
                        <p className="text-[11px] text-[#111827]">{formatDateTime(order.createdAt)}</p>
                        <p className="text-[10px] text-[#4B5563]">
                          {order.shippingAddress?.town || 'Nairobi'}, {order.shippingAddress?.county || 'Kenya'}
                        </p>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[#6B7280]">
                        <span className="font-semibold text-[#111827]">
                          {order.items.reduce((acc, it) => acc + it.quantity, 0)} pcs
                        </span>
                        <p className="text-[10px] truncate max-w-[130px]" title={order.items.map(i => i.productName).join(', ')}>
                          {order.items[0]?.productName}
                        </p>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <span className="px-2 py-0.5 bg-[#ECFDF5] text-[#065F46] rounded text-[10px] font-mono font-bold uppercase inline-block">
                            {order.paymentMethod}
                          </span>
                          {mpesaCode ? (
                            <p className="font-mono text-[11px] font-bold text-[#047857] flex items-center gap-1">
                              <span>M-PESA:</span> {mpesaCode}
                            </p>
                          ) : (
                            <p className="text-[10px] text-[#9CA3AF] font-mono">Ref: {order.paymentDetails?.reference || 'N/A'}</p>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        {order.trackingNumber ? (
                          <div className="space-y-0.5 font-mono">
                            <div className="flex items-center gap-1 text-[11px] font-bold text-[#1D4ED8]">
                              <Truck size={12} />
                              <span>{order.carrier || 'Courier'}:</span>
                              <span>{order.trackingNumber}</span>
                            </div>
                            {order.dispatchDate && (
                              <p className="text-[10px] text-[#6B7280] flex items-center gap-1">
                                <Calendar size={10} /> Dispatched {order.dispatchDate}
                              </p>
                            )}
                          </div>
                        ) : (
                          <span className="text-[10px] font-mono text-[#9CA3AF] italic">
                            Unassigned
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-mono font-bold uppercase ${
                            order.fulfillmentStatus === 'delivered'
                              ? 'bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]'
                              : order.fulfillmentStatus === 'shipped'
                              ? 'bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE]'
                              : order.fulfillmentStatus === 'processing'
                              ? 'bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]'
                              : order.fulfillmentStatus === 'paid'
                              ? 'bg-[#F0FDF4] text-[#166534] border border-[#BBF7D0]'
                              : order.fulfillmentStatus === 'pending'
                              ? 'bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A]'
                              : 'bg-[#F3F4F6] text-[#4B5563]'
                          }`}
                        >
                          {order.fulfillmentStatus === 'shipped' ? 'DISPATCHED' : order.fulfillmentStatus}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-[#111827]">
                        {formatKES(order.total)}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleOpenDrawer(order)}
                          className="px-3 py-1.5 bg-[#111827] hover:bg-black text-white rounded text-xs font-semibold inline-flex items-center gap-1 transition-colors"
                        >
                          <span>Manage</span>
                          <span>&rarr;</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail & Dispatch Drawer */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-xl bg-white h-full shadow-2xl overflow-y-auto p-8 space-y-6 flex flex-col justify-between animate-in slide-in-from-right duration-200">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex justify-between items-center border-b border-[#E5E7EB] pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-[#6B7280] uppercase tracking-wider">
                      DISPATCH MANAGEMENT
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        selectedOrder.fulfillmentStatus === 'shipped'
                          ? 'bg-[#EFF6FF] text-[#1D4ED8]'
                          : selectedOrder.fulfillmentStatus === 'delivered'
                          ? 'bg-[#ECFDF5] text-[#065F46]'
                          : 'bg-[#FEF3C7] text-[#92400E]'
                      }`}
                    >
                      {selectedOrder.fulfillmentStatus === 'shipped' ? 'DISPATCHED' : selectedOrder.fulfillmentStatus}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-[#111827] mt-0.5">{selectedOrder.orderNumber}</h2>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-1.5 rounded-full hover:bg-[#F3F4F6] text-[#6B7280] hover:text-[#111827] transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Status Quick Bar */}
              <div className="p-4 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg space-y-3">
                <label className="text-xs font-bold text-[#374151] block uppercase tracking-wider">
                  Update Fulfillment Status
                </label>
                <div className="flex flex-wrap gap-2">
                  {(['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'] as OrderStatus[]).map((st) => (
                    <button
                      key={st}
                      onClick={() => handleUpdateStatus(selectedOrder.id, st)}
                      className={`px-3 py-1.5 rounded text-xs font-mono uppercase transition-all ${
                        selectedOrder.fulfillmentStatus === st
                          ? 'bg-[#111827] text-white font-bold shadow-sm'
                          : 'bg-white border border-[#D1D5DB] text-[#4B5563] hover:bg-[#F3F4F6]'
                      }`}
                    >
                      {st === 'pending' ? 'Pending Verif.' : st === 'shipped' ? 'Dispatched' : st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Courier Tracking Assignment */}
              <div className="p-4 bg-white border border-[#D1D5DB] rounded-lg space-y-4 shadow-sm">
                <div className="flex items-center gap-2 border-b border-[#E5E7EB] pb-2.5">
                  <Truck size={16} className="text-[#1D4ED8]" />
                  <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider">
                    Courier Tracking & Dispatch Assignment
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Courier Partner Selection */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-[#374151] uppercase tracking-wider block">
                      Courier Partner
                    </label>
                    <select
                      value={selectedCourier}
                      onChange={(e) => setSelectedCourier(e.target.value)}
                      className="w-full bg-[#F9FAFB] border border-[#D1D5DB] rounded p-2 text-xs text-[#111827] font-semibold focus:outline-none focus:border-[#1D4ED8]"
                    >
                      {COURIER_OPTIONS.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  {/* Dispatch Date */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-[#374151] uppercase tracking-wider block">
                      Dispatch Date
                    </label>
                    <input
                      type="date"
                      value={dispatchDate}
                      onChange={(e) => setDispatchDate(e.target.value)}
                      className="w-full bg-[#F9FAFB] border border-[#D1D5DB] rounded p-2 text-xs font-mono text-[#111827] focus:outline-none focus:border-[#1D4ED8]"
                    />
                  </div>
                </div>

                {/* Tracking Number Input */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-[#374151] uppercase tracking-wider block">
                    Waybill / Tracking Number
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. FGO-NRB-981249 or G4S-552109"
                      value={newTracking}
                      onChange={(e) => setNewTracking(e.target.value)}
                      className="flex-1 bg-[#F9FAFB] border border-[#D1D5DB] p-2 rounded text-xs font-mono text-[#111827] focus:outline-none focus:border-[#1D4ED8]"
                    />
                    <button
                      onClick={() => handleAssignDispatch(selectedOrder.id)}
                      className="px-4 py-2 bg-[#111827] hover:bg-black text-white rounded text-xs font-bold uppercase tracking-wider transition-colors"
                    >
                      Assign & Dispatch
                    </button>
                  </div>
                </div>

                {/* Currently Assigned Dispatch Info */}
                {selectedOrder.trackingNumber && (
                  <div className="p-3 bg-[#EFF6FF] border border-[#BFDBFE] rounded text-xs space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-[#1D4ED8] flex items-center gap-1.5">
                        <PackageCheck size={14} /> Assigned: {selectedOrder.carrier || 'Fargo Courier'}
                      </span>
                      <button
                        onClick={() => handleCopyTracking(selectedOrder.trackingNumber || '')}
                        className="text-[10px] text-[#1D4ED8] hover:underline flex items-center gap-1 font-mono"
                      >
                        {copiedTracking ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                        <span>{copiedTracking ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <p className="font-mono text-sm font-bold text-[#1E3A8A]">
                      {selectedOrder.trackingNumber}
                    </p>
                    {selectedOrder.dispatchDate && (
                      <p className="text-[11px] text-[#3B82F6] font-mono">
                        Dispatched on: {selectedOrder.dispatchDate}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Customer & Address Details */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-[#F9FAFB] rounded-lg text-xs border border-[#E5E7EB]">
                <div>
                  <h4 className="font-bold text-[#374151] uppercase tracking-wider mb-1">Customer</h4>
                  <p className="font-semibold text-[#111827]">{selectedOrder.customerName}</p>
                  <p className="text-[#6B7280] font-mono">{selectedOrder.email}</p>
                  <p className="text-[#6B7280] font-mono">{selectedOrder.phone}</p>
                </div>
                <div>
                  <h4 className="font-bold text-[#374151] uppercase tracking-wider mb-1">Delivery Destination</h4>
                  <p className="text-[#111827] font-medium">{selectedOrder.shippingAddress.streetAddress}</p>
                  <p className="text-[#6B7280] font-mono">{selectedOrder.shippingAddress.town}, {selectedOrder.shippingAddress.county}</p>
                  {selectedOrder.shippingAddress.deliveryInstructions && (
                    <p className="text-[11px] text-[#4B5563] italic mt-1 bg-white p-1.5 rounded border border-[#E5E7EB]">
                      &quot;{selectedOrder.shippingAddress.deliveryInstructions}&quot;
                    </p>
                  )}
                </div>
              </div>

              {/* Payment Details */}
              <div className="p-4 bg-[#F9FAFB] rounded-lg text-xs space-y-1.5 font-mono border border-[#E5E7EB]">
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Payment Method:</span>
                  <span className="font-bold uppercase text-[#111827]">{selectedOrder.paymentMethod}</span>
                </div>
                {selectedOrder.paymentDetails?.mpesaReceiptNumber && (
                  <div className="flex justify-between">
                    <span className="text-[#6B7280]">M-PESA Receipt Number:</span>
                    <span className="font-bold text-[#059669] text-sm">
                      {selectedOrder.paymentDetails.mpesaReceiptNumber}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Transaction Reference:</span>
                  <span className="text-[#111827]">{selectedOrder.paymentDetails?.reference || 'N/A'}</span>
                </div>
              </div>

              {/* Reserved Garments */}
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
                          <p className="text-[10px] font-mono text-[#6B7280]">{it.variantTitle} &times; {it.quantity}</p>
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
                className="px-4 py-2 border border-[#D1D5DB] rounded text-xs font-semibold text-[#374151] hover:bg-[#F3F4F6] flex items-center gap-1.5 transition-colors"
              >
                <Printer size={14} /> Print Invoice
              </button>
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-6 py-2 bg-[#111827] hover:bg-black text-white rounded text-xs font-bold uppercase tracking-wider transition-colors"
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

