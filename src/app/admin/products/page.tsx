'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Plus, Search, Filter, MoreHorizontal, Edit, Copy, 
  Trash2, Eye, Archive, CheckCircle2, XCircle, AlertCircle 
} from 'lucide-react';
import { useStore } from '@/lib/use-store';
import { formatKES } from '@/lib/utils';
import { Product } from '@/types';

export default function AdminProductsPage() {
  const { products, categories, collections, saveProduct, deleteProduct } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [notification, setNotification] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 2500);
  };

  const handleDuplicate = (product: Product) => {
    const duplicated: Product = {
      ...product,
      id: `prod-${Date.now()}`,
      name: `${product.name} (Copy)`,
      slug: `${product.slug}-copy-${Date.now().toString().slice(-4)}`,
      sku: `${product.sku}-CPY`,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveProduct(duplicated);
    showToast(`Duplicated "${product.name}" as draft.`);
  };

  const handleTogglePublish = (product: Product) => {
    const newStatus = product.status === 'active' ? 'draft' : 'active';
    saveProduct({ ...product, status: newStatus });
    showToast(`Product is now ${newStatus.toUpperCase()}.`);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to permanently delete "${name}"?`)) {
      deleteProduct(id);
      showToast(`Deleted "${name}".`);
    }
  };

  const filteredProducts = products.filter((p) => {
    if (selectedCategory !== 'all' && p.categoryId !== selectedCategory) return false;
    if (selectedStatus !== 'all' && p.status !== selectedStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-16">
      {/* Toast */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#111827] text-white px-4 py-2.5 rounded-md shadow-lg text-xs font-medium flex items-center gap-2 border border-[#374151]">
          <CheckCircle2 size={15} className="text-[#10B981]" />
          <span>{notification}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-[#E5E7EB] pb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">Products Catalog</h1>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Manage archival garments, sizing variants, inventory thresholds, and drop statuses.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 px-4 py-2 bg-[#4D5936] hover:bg-[#343D2D] text-white rounded-md text-xs font-bold uppercase tracking-wider shadow-sm transition-colors"
        >
          <Plus size={16} />
          <span>Create New Product</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white border border-[#E5E7EB] rounded-lg shadow-sm">
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <div className="relative w-full">
            <Search size={15} className="text-[#9CA3AF] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by product name or SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-md pl-9 pr-3 py-1.5 text-xs text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:border-[#4D5936]"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-md px-3 py-1.5 text-xs text-[#111827] focus:outline-none focus:border-[#4D5936]"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-md px-3 py-1.5 text-xs text-[#111827] focus:outline-none focus:border-[#4D5936]"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
            <option value="archived">Archived</option>
            <option value="sold_out">Sold Out</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F9FAFB] text-[#6B7280] font-mono border-b border-[#E5E7EB]">
              <tr>
                <th className="py-3 px-4">GARMENT</th>
                <th className="py-3 px-4">SKU</th>
                <th className="py-3 px-4">CATEGORY</th>
                <th className="py-3 px-4">TOTAL STOCK</th>
                <th className="py-3 px-4">PRICE</th>
                <th className="py-3 px-4">STATUS</th>
                <th className="py-3 px-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB] text-[#111827]">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#6B7280]">
                    No products found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const primaryImg = product.images.find((i) => i.isPrimary) || product.images[0];
                  const totalStock = product.variants.reduce((acc, v) => acc + v.stockQuantity, 0);
                  const cat = categories.find((c) => c.id === product.categoryId);

                  return (
                    <tr key={product.id} className="hover:bg-[#F9FAFB] transition-colors">
                      {/* Garment details */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-14 bg-[#141414] rounded overflow-hidden flex-shrink-0 border border-[#E5E7EB]">
                            {primaryImg && (
                              <Image
                                src={primaryImg.url}
                                alt={product.name}
                                fill
                                className="object-cover"
                                sizes="48px"
                              />
                            )}
                          </div>
                          <div>
                            <Link
                              href={`/admin/products/${product.id}/edit`}
                              className="font-bold text-[#111827] hover:underline block"
                            >
                              {product.name}
                            </Link>
                            <p className="text-[10px] text-[#6B7280] font-mono">
                              {product.variants.length} Variants • {product.gender}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* SKU */}
                      <td className="py-3 px-4 font-mono font-bold text-[#4B5563]">
                        {product.sku}
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4 text-[#4B5563]">
                        {cat?.name || 'Unassigned'}
                      </td>

                      {/* Total Stock */}
                      <td className="py-3 px-4 font-mono">
                        <span
                          className={`font-bold ${
                            totalStock === 0
                              ? 'text-[#DC2626]'
                              : totalStock <= 5
                              ? 'text-[#D97706]'
                              : 'text-[#059669]'
                          }`}
                        >
                          {totalStock} units
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-3 px-4 font-mono font-bold">
                        {formatKES(product.salePrice || product.price)}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <span
                          className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase font-mono ${
                            product.status === 'active'
                              ? 'bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]'
                              : product.status === 'draft'
                              ? 'bg-[#F3F4F6] text-[#4B5563] border border-[#E5E7EB]'
                              : 'bg-[#FEF2F2] text-[#991B1B] border border-[#FEE2E2]'
                          }`}
                        >
                          {product.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/product/${product.slug}`}
                            target="_blank"
                            className="p-1.5 text-[#6B7280] hover:text-[#111827] hover:bg-[#F3F4F6] rounded"
                            title="Preview on Storefront"
                          >
                            <Eye size={14} />
                          </Link>

                          <Link
                            href={`/admin/products/${product.id}/edit`}
                            className="p-1.5 text-[#6B7280] hover:text-[#111827] hover:bg-[#F3F4F6] rounded"
                            title="Edit Product"
                          >
                            <Edit size={14} />
                          </Link>

                          <button
                            onClick={() => handleDuplicate(product)}
                            className="p-1.5 text-[#6B7280] hover:text-[#111827] hover:bg-[#F3F4F6] rounded"
                            title="Duplicate Product"
                          >
                            <Copy size={14} />
                          </button>

                          <button
                            onClick={() => handleTogglePublish(product)}
                            className="p-1.5 text-[#6B7280] hover:text-[#111827] hover:bg-[#F3F4F6] rounded"
                            title={product.status === 'active' ? 'Unpublish to Draft' : 'Publish to Live'}
                          >
                            {product.status === 'active' ? <Archive size={14} /> : <CheckCircle2 size={14} />}
                          </button>

                          <button
                            onClick={() => handleDelete(product.id, product.name)}
                            className="p-1.5 text-[#EF4444] hover:bg-[#FEF2F2] rounded"
                            title="Delete Product"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

