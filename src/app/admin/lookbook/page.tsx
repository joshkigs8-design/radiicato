'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Camera, Plus, Trash2, Edit, X } from 'lucide-react';
import { useStore } from '@/lib/use-store';
import { LookbookItem } from '@/types';

export default function AdminLookbookPage() {
  const { lookbook, collections } = useStore();
  const [items, setItems] = useState<LookbookItem[]>(lookbook);
  const [modalOpen, setModalOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [colSlug, setColSlug] = useState('the-core');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !imageUrl.trim()) return;

    const newItem: LookbookItem = {
      id: `lb-${Date.now()}`,
      title: title.trim().toUpperCase(),
      description: desc.trim(),
      imageUrl: imageUrl.trim(),
      collectionSlug: colSlug,
      displayOrder: items.length + 1,
    };

    setItems([...items, newItem]);
    setModalOpen(false);
    setTitle('');
    setDesc('');
    setImageUrl('');
  };

  const handleRemove = (id: string) => {
    setItems(items.filter((it) => it.id !== id));
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-[#E5E7EB] pb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">Editorial Lookbook Archive</h1>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Curate high-fashion campaign photography shown in the fullscreen exhibition gallery.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#4D5936] hover:bg-[#343D2D] text-white rounded-md text-xs font-bold uppercase tracking-wider shadow-sm transition-colors"
        >
          <Plus size={16} />
          <span>New Campaign Shot</span>
        </button>
      </div>

      {/* Lookbook Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((item, idx) => (
          <div key={item.id} className="bg-white border border-[#E5E7EB] rounded-lg overflow-hidden shadow-sm flex flex-col justify-between">
            <div>
              <div className="relative aspect-[3/4] bg-[#111] overflow-hidden">
                <Image src={item.imageUrl} alt={item.title} fill className="object-cover" sizes="300px" />
                <div className="absolute top-2 left-2 bg-black/70 text-white text-[10px] font-mono px-2 py-0.5 rounded">
                  EXHIBIT 0{idx + 1}
                </div>
              </div>
              <div className="p-4 space-y-1">
                <h3 className="text-xs font-bold text-[#111827] uppercase">{item.title}</h3>
                <p className="text-xs text-[#6B7280] line-clamp-2">{item.description}</p>
                <p className="text-[10px] font-mono text-[#4D5936] pt-1 uppercase">
                  Linked to: /{item.collectionSlug}
                </p>
              </div>
            </div>

            <div className="p-3 bg-[#F9FAFB] border-t border-[#E5E7EB] flex justify-end">
              <button
                onClick={() => handleRemove(item.id)}
                className="p-1 text-red-500 hover:text-red-700"
                title="Remove image"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-[#E5E7EB] pb-3">
              <h3 className="text-sm font-bold text-[#111827] uppercase">Add Lookbook Campaign Image</h3>
              <button onClick={() => setModalOpen(false)} className="text-[#6B7280]">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAdd} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-[#374151]">Campaign Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. NAIROBI NOCTURNE"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border border-[#D1D5DB] rounded p-2 text-[#111827]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#374151]">Editorial Caption</label>
                <textarea
                  rows={2}
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Atmosphere, composition, lighting notes..."
                  className="w-full border border-[#D1D5DB] rounded p-2 text-[#111827]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#374151]">High-Res Image URL *</label>
                <input
                  type="url"
                  required
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full border border-[#D1D5DB] rounded p-2 text-[#111827]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#374151]">Target Collection</label>
                <select
                  value={colSlug}
                  onChange={(e) => setColSlug(e.target.value)}
                  className="w-full border border-[#D1D5DB] rounded p-2 text-[#111827]"
                >
                  {collections.map((c) => (
                    <option key={c.id} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
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
                  Add to Lookbook
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

