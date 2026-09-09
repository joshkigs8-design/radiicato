'use client';

import React, { useState, useMemo } from 'react';
import { 
  Boxes, Search, Filter, AlertTriangle, Plus, Minus, 
  ArrowUpDown, Check, RefreshCw, X, History 
} from 'lucide-react';
import { useStore } from '@/lib/use-store';
import { InventoryRecord } from '@/types';

export default function AdminInventoryPage() {
  const { products, updateVariantStock } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'low_stock' | 'out_of_stock' | 'in_stock'>('all');

  // Adjustment Modal State
  const [adjustModalOpen, setAdjustModalOpen] = useState(false);
  const [targetVariant, setTargetVariant] = useState<{
    variantId: string;
    productName: string;
    variantTitle: string;
    currentStock: number;
    sku: string;
  } | null>(null);

  const [adjustmentAmount, setAdjustmentAmount] = useState<number>(5);
  const [adjustAction, setAdjustAction] = useState<'add' | 'remove' | 'set'>('add');
  const [adjustReason, setAdjustReason] = useState<'restock' | 'adjustment' | 'sale'>('restock');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Flatten all variants into an inventory matrix
  const inventoryRows: InventoryRecord[] = useMemo(() => {
    const rows: InventoryRecord[] = [];
    products.forEach((p) => {
      p.variants.forEach((v) => {
        let status: InventoryRecord['status'] = 'in_stock';
        if (v.stockQuantity === 0) status = 'out_of_stock';
        else if (v.stockQuantity <= v.lowStockThreshold) status = 'low_stock';

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

  const filteredRows = inventoryRows.filter((r) => {
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

  const lowStockCount = inventoryRows.filter((r) => r.status === 'low_stock').length;
  const outOfStockCount = inventoryRows.filter((r) => r.status === 'out_of_stock').length;
  const totalStockCount = inventoryRows.reduce((acc, r) => acc + r.stock, 0);

  const handleOpenAdjust = (row: InventoryRecord) => {
    setTargetVariant({
      variantId: row.variantId,
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

  const handleConfirmAdjust = (e: React.FormEvent) => {
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

    updateVariantStock(targetVariant.variantId, newStock, adjustReason);
    setToastMessage(`Stock updated for ${targetVariant.sku} (${newStock} units).`);
    setAdjustModalOpen(false);
    setTimeout(() => setToastMessage(null), 2500);
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-16">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#111827] text-white px-4 py-2.5 rounded-md shadow-xl text-xs font-bold flex items-center gap-2 border border-[#374151]">
          <Check size={16} className="text-[#10B981]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-[#E5E7EB] pb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">Inventory Matrix & Stock Levels</h1>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Real-time stock counts by size and colorway. Update atelier quantities safely.
          </p>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white border border-[#E5E7EB] rounded-lg shadow-sm">
          <span className="text-xs font-medium text-[#6B7280] uppercase">Total Garments on Hand</span>
          <div className="text-2xl font-black font-mono text-[#111827] mt-1">{totalStockCount} units</div>
        </div>

        <div className="p-4 bg-white border border-[#E5E7EB] rounded-lg shadow-sm">
          <span className="text-xs font-medium text-[#D97706] uppercase flex items-center gap-1.5">
            <AlertTriangle size={14} /> Low Stock Warnings
          </span>
          <div className="text-2xl font-black font-mono text-[#D97706] mt-1">{lowStockCount} variants</div>
        </div>

        <div className="p-4 bg-white border border-[#E5E7EB] rounded-lg shadow-sm">
          <span className="text-xs font-medium text-[#DC2626] uppercase">Completely Out of Stock</span>
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
              {st.replace('_', ' ')}
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
                <th className="py-3 px-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB] text-[#111827]">
              {filteredRows.map((row) => (
                <tr key={row.variantId} className="hover:bg-[#F9FAFB] transition-colors">
                  <td className="py-3 px-4 font-semibold">{row.productName}</td>
                  <td className="py-3 px-4 font-mono text-[#4B5563] font-bold">{row.sku}</td>
                  <td className="py-3 px-4 font-mono">
                    <span className="font-semibold">{row.color}</span> / <span className="font-bold">{row.size}</span>
                  </td>
                  <td className="py-3 px-4 text-center font-mono font-bold text-sm">
                    {row.stock}
                  </td>
                  <td className="py-3 px-4 text-center font-mono text-[#6B7280]">
                    &le; {row.lowStockThreshold}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        row.status === 'out_of_stock'
                          ? 'bg-[#FEF2F2] text-[#991B1B] border border-[#FEE2E2]'
                          : row.status === 'low_stock'
                          ? 'bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]'
                          : 'bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]'
                      }`}
                    >
                      {row.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleOpenAdjust(row)}
                      className="px-3 py-1 bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#111827] rounded text-xs font-semibold"
                    >
                      Adjust Stock
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock Adjustment Modal */}
      {adjustModalOpen && targetVariant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-[#E5E7EB] pb-3">
              <div>
                <h3 className="text-sm font-bold text-[#111827] uppercase">Stock Adjustment</h3>
                <p className="text-xs font-mono text-[#6B7280]">{targetVariant.sku}</p>
              </div>
              <button onClick={() => setAdjustModalOpen(false)} className="text-[#6B7280]">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleConfirmAdjust} className="space-y-4 text-xs">
              <div className="p-3 bg-[#F9FAFB] rounded border border-[#E5E7EB] space-y-1">
                <p className="font-bold text-[#111827]">{targetVariant.productName}</p>
                <p className="font-mono text-[#6B7280]">Variant: {targetVariant.variantTitle}</p>
                <p className="font-mono text-[#111827] font-bold">Current Stock: {targetVariant.currentStock} units</p>
              </div>

              {/* Action */}
              <div className="space-y-1">
                <label className="font-bold text-[#374151]">Action Type</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setAdjustAction('add')}
                    className={`py-2 rounded font-bold uppercase transition-colors ${
                      adjustAction === 'add' ? 'bg-[#059669] text-white' : 'bg-[#F3F4F6] text-[#4B5563]'
                    }`}
                  >
                    + Add
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjustAction('remove')}
                    className={`py-2 rounded font-bold uppercase transition-colors ${
                      adjustAction === 'remove' ? 'bg-[#DC2626] text-white' : 'bg-[#F3F4F6] text-[#4B5563]'
                    }`}
                  >
                    - Remove
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjustAction('set')}
                    className={`py-2 rounded font-bold uppercase transition-colors ${
                      adjustAction === 'set' ? 'bg-[#111827] text-white' : 'bg-[#F3F4F6] text-[#4B5563]'
                    }`}
                  >
                    = Set Exact
                  </button>
                </div>
              </div>

              {/* Amount */}
              <div className="space-y-1">
                <label className="font-bold text-[#374151]">
                  {adjustAction === 'set' ? 'New Exact Quantity' : 'Units to Adjust'}
                </label>
                <input
                  type="number"
                  min={0}
                  required
                  value={adjustmentAmount}
                  onChange={(e) => setAdjustmentAmount(Number(e.target.value))}
                  className="w-full border border-[#D1D5DB] rounded p-2 text-sm font-mono font-bold"
                />
              </div>

              {/* Reason */}
              <div className="space-y-1">
                <label className="font-bold text-[#374151]">Reason for Log</label>
                <select
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value as any)}
                  className="w-full border border-[#D1D5DB] rounded p-2 text-xs"
                >
                  <option value="restock">New Stock Arrived / Restocked</option>
                  <option value="adjustment">Manual Count Adjustment / Correction</option>
                  <option value="sale">VIP / Atelier Offline Sale</option>
                </select>
              </div>

              <div className="pt-3 border-t border-[#E5E7EB] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAdjustModalOpen(false)}
                  className="px-3 py-1.5 border border-[#D1D5DB] rounded text-[#374151]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 bg-[#4D5936] hover:bg-[#343D2D] text-white rounded font-bold uppercase tracking-wider"
                >
                  Commit Stock Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

