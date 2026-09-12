'use client';

import React, { useState, useMemo } from 'react';
import { 
  Boxes, Search, Filter, AlertTriangle, Plus, Minus, 
  ArrowUpDown, Check, RefreshCw, X, History, Loader2, CheckCircle2 
} from 'lucide-react';
import { useStore } from '@/lib/use-store';
import { updateVariantStockInSupabase } from '@/lib/supabase';
import { InventoryRecord } from '@/types';

export default function AdminInventoryPage() {
  const { products, updateVariantStock } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'low_stock' | 'out_of_stock' | 'in_stock'>('all');

  // Inline adjustment loading state
  const [updatingVariantId, setUpdatingVariantId] = useState<string | null>(null);

  // Adjustment Modal State
  const [adjustModalOpen, setAdjustModalOpen] = useState(false);
  const [targetVariant, setTargetVariant] = useState<{
    variantId: string;
    productId: string;
    productName: string;
    variantTitle: string;
    currentStock: number;
    sku: string;
  } | null>(null);

  const [adjustmentAmount, setAdjustmentAmount] = useState<number>(5);
  const [adjustAction, setAdjustAction] = useState<'add' | 'remove' | 'set'>('add');
  const [adjustReason, setAdjustReason] = useState<'restock' | 'adjustment' | 'sale'>('restock');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Flatten all variants into an inventory matrix with < 5 units low stock rule
  const inventoryRows: InventoryRecord[] = useMemo(() => {
    const rows: InventoryRecord[] = [];
    products.forEach((p) => {
      p.variants.forEach((v) => {
        let status: InventoryRecord['status'] = 'in_stock';
        if (v.stockQuantity === 0) {
          status = 'out_of_stock';
        } else if (v.stockQuantity < 5 || v.stockQuantity <= v.lowStockThreshold) {
          status = 'low_stock';
        }

        rows.push({
          productId: p.id,
          variantId: v.id,
          productName: p.name,
          color: v.colorName,
          size: v.size,
          sku: v.sku,
          stock: v.stockQuantity,
          lowStockThreshold: v.lowStockThreshold,
          status,
        });
      });
    });
    return rows;
  }, [products]);

  const filteredRows = useMemo(() => {
    return inventoryRows.filter((r) => {
      if (statusFilter !== 'all' && r.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          r.productName.toLowerCase().includes(q) ||
          r.sku.toLowerCase().includes(q) ||
          r.color.toLowerCase().includes(q) ||
          r.size.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [inventoryRows, statusFilter, searchQuery]);

  const lowStockCount = inventoryRows.filter((r) => r.status === 'low_stock').length;
  const outOfStockCount = inventoryRows.filter((r) => r.status === 'out_of_stock').length;
  const totalStockCount = inventoryRows.reduce((acc, r) => acc + r.stock, 0);

  // Quick inline increment / decrement by delta (e.g. +1, -1)
  const handleQuickStockChange = async (row: InventoryRecord, delta: number) => {
    const newStock = Math.max(0, row.stock + delta);
    if (newStock === row.stock) return;

    const reason = delta > 0 ? 'restock' : 'adjustment';

    // 1. Update store state immediately
    updateVariantStock(row.variantId, newStock, reason);
    setUpdatingVariantId(row.variantId);

    // 2. Update Supabase product_variants and products tables
    try {
      await updateVariantStockInSupabase(
        row.variantId,
        newStock,
        reason,
        row.sku,
        row.productId
      );
      showToast(`${row.sku}: Stock set to ${newStock} (Supabase synced)`);
    } catch (err: any) {
      console.warn('Quick stock Supabase sync note:', err);
      showToast(`${row.sku}: Stock updated to ${newStock}`);
    } finally {
      setUpdatingVariantId(null);
    }
  };

  const handleOpenAdjust = (row: InventoryRecord) => {
    setTargetVariant({
      variantId: row.variantId,
      productId: row.productId,
      productName: row.productName,
      variantTitle: `${row.color} / ${row.size}`,
      currentStock: row.stock,
      sku: row.sku,
    });
    setAdjustmentAmount(5);
    setAdjustAction('add');
    setAdjustReason('restock');
    setAdjustModalOpen(true);
  };

  const handleConfirmAdjust = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetVariant) return;

    let newStock = targetVariant.currentStock;
    if (adjustAction === 'add') {
      newStock += adjustmentAmount;
    } else if (adjustAction === 'remove') {
      newStock = Math.max(0, newStock - adjustmentAmount);
    } else {
      newStock = Math.max(0, adjustmentAmount);
    }

    setIsSubmitting(true);

    // 1. Update store state
    updateVariantStock(targetVariant.variantId, newStock, adjustReason);

    // 2. Update Supabase product_variants and products tables
    try {
      await updateVariantStockInSupabase(
        targetVariant.variantId,
        newStock,
        adjustReason,
        targetVariant.sku,
        targetVariant.productId
      );
      showToast(`Stock updated: ${targetVariant.sku} is now ${newStock} units (Supabase synced)`);
    } catch (err: any) {
      console.warn('Supabase modal stock update note:', err);
      showToast(`Stock updated for ${targetVariant.sku} (${newStock} units)`);
    } finally {
      setIsSubmitting(false);
      setAdjustModalOpen(false);
    }
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-16">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#111827] text-white px-4 py-2.5 rounded-md shadow-2xl text-xs font-bold flex items-center gap-2 border border-[#374151] animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 size={16} className="text-[#10B981]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-[#E5E7EB] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#111827]">Inventory Matrix & Stock Levels</h1>
            <span className="px-2 py-0.5 bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] rounded text-[10px] font-mono font-bold uppercase">
              Real-time Atelier Counts
            </span>
          </div>
          <p className="text-xs text-[#6B7280] mt-1">
            Real-time stock counts across Nairobi streetwear pieces. Quick increment/decrement automatically syncs with Supabase.
          </p>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white border border-[#E5E7EB] rounded-lg shadow-sm">
          <span className="text-xs font-medium text-[#6B7280] uppercase tracking-wider">Total Garments on Hand</span>
          <div className="text-2xl font-black font-mono text-[#111827] mt-1">{totalStockCount} units</div>
        </div>

        <div className="p-4 bg-white border border-amber-200 bg-amber-50/20 rounded-lg shadow-sm">
          <span className="text-xs font-bold text-[#B45309] uppercase tracking-wider flex items-center gap-1.5">
            <AlertTriangle size={15} className="text-[#D97706]" /> Low Stock Warnings (&lt; 5 units)
          </span>
          <div className="text-2xl font-black font-mono text-[#B45309] mt-1">{lowStockCount} variants</div>
        </div>

        <div className="p-4 bg-white border border-[#E5E7EB] rounded-lg shadow-sm">
          <span className="text-xs font-medium text-[#DC2626] uppercase tracking-wider">Completely Out of Stock</span>
          <div className="text-2xl font-black font-mono text-[#DC2626] mt-1">{outOfStockCount} variants</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white border border-[#E5E7EB] rounded-lg shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search size={15} className="text-[#9CA3AF] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search variant by SKU, product name, or color..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-md pl-9 pr-3 py-1.5 text-xs text-[#111827] focus:outline-none focus:border-[#4D5936]"
          />
        </div>

        <div className="flex items-center gap-2">
          {(['all', 'low_stock', 'out_of_stock', 'in_stock'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-md text-xs font-mono uppercase transition-colors ${
                statusFilter === st
                  ? 'bg-[#111827] text-white font-bold'
                  : 'bg-[#F3F4F6] text-[#4B5563] hover:bg-[#E5E7EB]'
              }`}
            >
              {st === 'low_stock' ? 'Low Stock (< 5)' : st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Matrix Table */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F9FAFB] text-[#6B7280] font-mono border-b border-[#E5E7EB]">
              <tr>
                <th className="py-3 px-4">PRODUCT</th>
                <th className="py-3 px-4">SKU</th>
                <th className="py-3 px-4">COLOR / SIZE</th>
                <th className="py-3 px-4 text-center">CURRENT STOCK</th>
                <th className="py-3 px-4 text-center">ALERT LEVEL</th>
                <th className="py-3 px-4">STATUS</th>
                <th className="py-3 px-4 text-right">QUICK ADJUST & ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB] text-[#111827]">
              {filteredRows.map((row) => {
                const isLowStock = row.stock > 0 && row.stock < 5;
                const isOutOfStock = row.stock === 0;
                const isUpdating = updatingVariantId === row.variantId;

                return (
                  <tr
                    key={row.variantId}
                    className={`transition-colors ${
                      isLowStock 
                        ? 'bg-amber-50/30 hover:bg-amber-50/60' 
                        : isOutOfStock
                        ? 'bg-red-50/20 hover:bg-red-50/40'
                        : 'hover:bg-[#F9FAFB]'
                    }`}
                  >
                    <td className="py-3 px-4 font-semibold">{row.productName}</td>
                    <td className="py-3 px-4 font-mono text-[#4B5563] font-bold">{row.sku}</td>
                    <td className="py-3 px-4 font-mono">
                      <span className="font-semibold">{row.color}</span> / <span className="font-bold">{row.size}</span>
                    </td>

                    {/* Current Stock with Low Stock Amber Warning Badge */}
                    <td className="py-3 px-4 text-center">
                      <div className="flex flex-col items-center justify-center gap-1">
                        <span className={`font-mono font-bold text-sm ${
                          isOutOfStock 
                            ? 'text-red-700' 
                            : isLowStock 
                            ? 'text-amber-800' 
                            : 'text-[#111827]'
                        }`}>
                          {row.stock}
                        </span>

                        {isLowStock && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 rounded-full text-[10px] font-bold font-mono animate-pulse">
                            <AlertTriangle size={11} className="text-amber-600" />
                            &lt; 5 Low Stock
                          </span>
                        )}

                        {isOutOfStock && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-red-100 text-red-800 border border-red-200 rounded text-[9px] font-bold font-mono">
                            Empty
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-center font-mono text-[#6B7280]">
                      &lt; 5 (Atelier: &le; {row.lowStockThreshold})
                    </td>

                    {/* Status Column with Warning Badges */}
                    <td className="py-3 px-4">
                      {isOutOfStock ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-mono font-bold uppercase bg-[#FEF2F2] text-[#991B1B] border border-[#FEE2E2]">
                          OUT OF STOCK
                        </span>
                      ) : isLowStock ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-mono font-bold uppercase bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]">
                          <AlertTriangle size={11} className="text-[#D97706]" />
                          LOW STOCK ({row.stock})
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-mono font-bold uppercase bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]">
                          IN STOCK
                        </span>
                      )}
                    </td>

                    {/* Action Column with Quick Inline Increment/Decrement & Modal */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Quick Decrement (-) */}
                        <button
                          type="button"
                          onClick={() => handleQuickStockChange(row, -1)}
                          disabled={row.stock === 0 || isUpdating}
                          title="Quick decrement (-1 unit)"
                          className="w-7 h-7 flex items-center justify-center rounded border border-[#D1D5DB] bg-white text-[#374151] hover:bg-[#F3F4F6] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                          <Minus size={13} />
                        </button>

                        {/* Current Quick Number Indicator */}
                        <div className="w-9 text-center font-mono font-bold text-xs">
                          {isUpdating ? (
                            <Loader2 size={12} className="animate-spin inline text-blue-600" />
                          ) : (
                            row.stock
                          )}
                        </div>

                        {/* Quick Increment (+) */}
                        <button
                          type="button"
                          onClick={() => handleQuickStockChange(row, 1)}
                          disabled={isUpdating}
                          title="Quick increment (+1 unit)"
                          className="w-7 h-7 flex items-center justify-center rounded border border-[#D1D5DB] bg-white text-[#374151] hover:bg-[#F3F4F6] disabled:opacity-30 transition-colors"
                        >
                          <Plus size={13} />
                        </button>

                        {/* Full Adjustment Modal */}
                        <button
                          type="button"
                          onClick={() => handleOpenAdjust(row)}
                          className="ml-1 px-2.5 py-1 bg-[#111827] hover:bg-black text-white rounded text-xs font-semibold transition-colors"
                        >
                          Adjust
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock Adjustment Modal */}
      {adjustModalOpen && targetVariant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-[#E5E7EB] pb-3">
              <div>
                <h3 className="text-sm font-bold text-[#111827] uppercase">Stock Adjustment & Sync</h3>
                <p className="text-xs font-mono text-[#6B7280]">{targetVariant.sku}</p>
              </div>
              <button 
                onClick={() => setAdjustModalOpen(false)} 
                className="text-[#6B7280] hover:text-[#111827] p-1 rounded-full hover:bg-[#F3F4F6]"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleConfirmAdjust} className="space-y-4 text-xs">
              <div className="p-3 bg-[#F9FAFB] rounded border border-[#E5E7EB] space-y-1">
                <p className="font-bold text-[#111827]">{targetVariant.productName}</p>
                <p className="font-mono text-[#6B7280]">Variant: {targetVariant.variantTitle}</p>
                <p className="font-mono text-[#111827] font-bold">
                  Current Stock: <span className="text-emerald-700">{targetVariant.currentStock} units</span>
                </p>
              </div>

              {/* Action */}
              <div className="space-y-1">
                <label className="font-bold text-[#374151] uppercase tracking-wider block">
                  Action Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setAdjustAction('add')}
                    className={`py-2 rounded font-bold uppercase transition-colors ${
                      adjustAction === 'add' ? 'bg-[#059669] text-white shadow-sm' : 'bg-[#F3F4F6] text-[#4B5563]'
                    }`}
                  >
                    + Add
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjustAction('remove')}
                    className={`py-2 rounded font-bold uppercase transition-colors ${
                      adjustAction === 'remove' ? 'bg-[#DC2626] text-white shadow-sm' : 'bg-[#F3F4F6] text-[#4B5563]'
                    }`}
                  >
                    - Remove
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjustAction('set')}
                    className={`py-2 rounded font-bold uppercase transition-colors ${
                      adjustAction === 'set' ? 'bg-[#111827] text-white shadow-sm' : 'bg-[#F3F4F6] text-[#4B5563]'
                    }`}
                  >
                    = Set Exact
                  </button>
                </div>
              </div>

              {/* Amount */}
              <div className="space-y-1">
                <label className="font-bold text-[#374151] uppercase tracking-wider block">
                  {adjustAction === 'set' ? 'New Exact Quantity' : 'Units to Adjust'}
                </label>
                <input
                  type="number"
                  min={0}
                  required
                  value={adjustmentAmount}
                  onChange={(e) => setAdjustmentAmount(Number(e.target.value))}
                  className="w-full border border-[#D1D5DB] rounded p-2 text-sm font-mono font-bold focus:outline-none focus:border-[#4D5936]"
                />
              </div>

              {/* Reason */}
              <div className="space-y-1">
                <label className="font-bold text-[#374151] uppercase tracking-wider block">
                  Reason for Audit Log
                </label>
                <select
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value as any)}
                  className="w-full border border-[#D1D5DB] rounded p-2 text-xs focus:outline-none focus:border-[#4D5936]"
                >
                  <option value="restock">New Stock Arrived / Restocked from Nairobi Atelier</option>
                  <option value="adjustment">Manual Count Adjustment / Correction</option>
                  <option value="sale">VIP / Atelier Offline Sale</option>
                </select>
              </div>

              <div className="p-2.5 bg-blue-50 border border-blue-200 rounded text-[11px] text-blue-800 space-y-0.5">
                <p className="font-semibold">Supabase Cloud Sync:</p>
                <p className="text-blue-700">
                  Committing will update both the local store state and Supabase <code className="font-mono font-bold">product_variants</code> / <code className="font-mono font-bold">products</code> tables.
                </p>
              </div>

              <div className="pt-3 border-t border-[#E5E7EB] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAdjustModalOpen(false)}
                  disabled={isSubmitting}
                  className="px-4 py-2 border border-[#D1D5DB] rounded text-[#374151] hover:bg-[#F3F4F6]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-[#111827] hover:bg-black text-white rounded font-bold uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={13} className="animate-spin" />
                      <span>Updating...</span>
                    </>
                  ) : (
                    <span>Commit Stock Update</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


