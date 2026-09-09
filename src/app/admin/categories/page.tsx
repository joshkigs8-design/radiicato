'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Plus, Edit, Trash2, Tag, Check, X } from 'lucide-react';
import { useStore } from '@/lib/use-store';
import { Category } from '@/types';

export default function AdminCategoriesPage() {
  const { categories, products, saveCategory } = useStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setName('');
    setSlug('');
    setDescription('');
    setImageUrl('https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1200');
    setStatus('active');
    setModalOpen(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description);
    setImageUrl(cat.imageUrl);
    setStatus(cat.status);
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const payload: Category = {
      id: editingCategory?.id || `cat-${Date.now()}`,
      name: name.trim(),
      slug: slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: description.trim(),
      imageUrl: imageUrl.trim(),
      status,
      displayOrder: editingCategory?.displayOrder || categories.length + 1,
    };

    saveCategory(payload);
    setModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-[#E5E7EB] pb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">Category Management</h1>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Organize the storefront into T-Shirts, Hoodies, Bottoms, Headwear and Limited drops.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2 bg-[#4D5936] hover:bg-[#343D2D] text-white rounded-md text-xs font-bold uppercase tracking-wider shadow-sm transition-colors"
        >
          <Plus size={16} />
          <span>New Category</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categories.map((cat) => {
          const count = products.filter((p) => p.categoryId === cat.id).length;
          return (
            <div
              key={cat.id}
              className="bg-white border border-[#E5E7EB] rounded-lg shadow-sm overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[16/10] bg-[#111]">
                  <Image src={cat.imageUrl} alt={cat.name} fill className="object-cover" sizes="300px" />
                  <div className="absolute top-3 left-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        cat.status === 'active' ? 'bg-[#ECFDF5] text-[#065F46]' : 'bg-[#F3F4F6] text-[#6B7280]'
                      }`}
                    >
                      {cat.status}
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-1">
                  <span className="text-[10px] font-mono text-[#6B7280] uppercase">/{cat.slug}</span>
                  <h3 className="text-sm font-bold text-[#111827]">{cat.name}</h3>
                  <p className="text-xs text-[#6B7280] line-clamp-2">{cat.description}</p>
                  <p className="text-xs font-mono font-semibold text-[#4D5936] pt-2">
                    {count} Products Linked
                  </p>
                </div>
              </div>

              <div className="p-3 bg-[#F9FAFB] border-t border-[#E5E7EB] flex justify-end">
                <button
                  onClick={() => handleOpenEdit(cat)}
                  className="p-1.5 text-[#4B5563] hover:text-[#111827] rounded"
                  title="Edit"
                >
                  <Edit size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-[#E5E7EB] pb-3">
              <h3 className="text-sm font-bold text-[#111827] uppercase">
                {editingCategory ? 'Edit Category' : 'Create Category'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-[#6B7280]">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-[#374151]">Category Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!editingCategory && !slug) {
                      setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                    }
                  }}
                  className="w-full border border-[#D1D5DB] rounded p-2 text-[#111827]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#374151]">Slug *</label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full border border-[#D1D5DB] rounded p-2 font-mono text-[#111827]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#374151]">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border border-[#D1D5DB] rounded p-2 text-[#111827]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#374151]">Cover Image URL</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full border border-[#D1D5DB] rounded p-2 text-[#111827]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#374151]">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as 'active' | 'inactive')}
                  className="w-full border border-[#D1D5DB] rounded p-2 text-[#111827]"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="pt-3 border-t border-[#E5E7EB] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-3 py-1.5 border border-[#D1D5DB] rounded text-[#374151]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#4D5936] text-white rounded font-bold"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

