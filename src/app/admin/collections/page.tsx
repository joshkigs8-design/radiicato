'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Plus, Search, Edit, Trash2, Clock, CheckCircle2, 
  Archive, Eye, Calendar, FolderTree, X 
} from 'lucide-react';
import { useStore } from '@/lib/use-store';
import { Collection } from '@/types';
import { ImageUploadDropzone } from '@/components/admin/ImageUploadDropzone';

export default function AdminCollectionsPage() {
  const { collections, products, saveCollection, deleteCollection } = useStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCol, setEditingCol] = useState<Collection | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [bannerImage, setBannerImage] = useState('');
  const [status, setStatus] = useState<Collection['status']>('live');
  const [isScheduled, setIsScheduled] = useState(false);
  const [launchDate, setLaunchDate] = useState('2026-10-15T19:00:00Z');
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  const handleOpenCreate = () => {
    setEditingCol(null);
    setName('');
    setSlug('');
    setDescription('');
    setCoverImage('https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1400');
    setBannerImage('https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1800');
    setStatus('live');
    setIsScheduled(false);
    setSelectedProductIds([]);
    setModalOpen(true);
  };

  const handleOpenEdit = (col: Collection) => {
    setEditingCol(col);
    setName(col.name);
    setSlug(col.slug);
    setDescription(col.description);
    setCoverImage(col.coverImage);
    setBannerImage(col.bannerImage);
    setStatus(col.status);
    setIsScheduled(col.isScheduled);
    setLaunchDate(col.launchDate || '2026-10-15T19:00:00Z');
    setSelectedProductIds(col.productIds || []);
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const payload: Collection = {
      id: editingCol?.id || `col-${Date.now()}`,
      name: name.trim(),
      slug: slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: description.trim(),
      coverImage: coverImage.trim(),
      bannerImage: bannerImage.trim() || coverImage.trim(),
      status,
      isScheduled,
      launchDate: isScheduled ? launchDate : undefined,
      displayOrder: editingCol?.displayOrder || collections.length + 1,
      productIds: selectedProductIds,
      createdAt: editingCol?.createdAt || new Date().toISOString(),
    };

    saveCollection(payload);
    setModalOpen(false);
  };

  const toggleProductSelect = (id: string) => {
    if (selectedProductIds.includes(id)) {
      setSelectedProductIds(selectedProductIds.filter((pId) => pId !== id));
    } else {
      setSelectedProductIds([...selectedProductIds, id]);
    }
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-[#E5E7EB] pb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">Collections & Scheduled Drops</h1>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Curate capsules, scheduled drops with countdown timers, and brand lookbook assignments.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2 bg-[#4D5936] hover:bg-[#343D2D] text-white rounded-md text-xs font-bold uppercase tracking-wider shadow-sm transition-colors"
        >
          <Plus size={16} />
          <span>New Collection Capsule</span>
        </button>
      </div>

      {/* Collections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {collections.map((col) => {
          const colProds = products.filter(
            (p) => p.collectionId === col.id || col.productIds?.includes(p.id)
          );

          return (
            <div
              key={col.id}
              className="bg-white border border-[#E5E7EB] rounded-lg shadow-sm overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[16/9] bg-[#111] overflow-hidden">
                  <Image
                    src={col.bannerImage || col.coverImage}
                    alt={col.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute top-3 left-3">
                    <span
                      className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold uppercase ${
                        col.status === 'live'
                          ? 'bg-[#ECFDF5] text-[#065F46]'
                          : col.status === 'scheduled'
                          ? 'bg-[#FEF3C7] text-[#92400E]'
                          : 'bg-[#F3F4F6] text-[#4B5563]'
                      }`}
                    >
                      {col.status}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <span className="text-[10px] font-mono text-[#6B7280] uppercase">
                    SLUG: /{col.slug}
                  </span>
                  <h3 className="text-base font-bold text-[#111827]">{col.name}</h3>
                  <p className="text-xs text-[#6B7280] line-clamp-2">{col.description}</p>
                  <p className="text-xs font-mono font-semibold text-[#4D5936] pt-2">
                    {colProds.length} Products Assigned
                  </p>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="px-5 py-3 bg-[#F9FAFB] border-t border-[#E5E7EB] flex justify-between items-center text-xs">
                <Link
                  href={`/collections/${col.slug}`}
                  target="_blank"
                  className="text-[#4D5936] font-semibold hover:underline flex items-center gap-1"
                >
                  <Eye size={13} /> View Live
                </Link>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(col)}
                    className="p-1 text-[#6B7280] hover:text-[#111827]"
                    title="Edit"
                  >
                    <Edit size={15} />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Delete collection "${col.name}"?`)) {
                        deleteCollection(col.id);
                      }
                    }}
                    className="p-1 text-red-500 hover:text-red-700"
                    title="Delete"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create / Edit Modal Wizard */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full p-6 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-[#E5E7EB] pb-3">
              <h3 className="text-sm font-bold text-[#111827] uppercase">
                {editingCol ? 'Edit Collection Capsule' : 'Create New Collection Capsule'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-[#6B7280] hover:text-[#111827]"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1 sm:col-span-2">
                  <label className="font-bold text-[#374151]">Collection Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (!editingCol && !slug) {
                        setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                      }
                    }}
                    placeholder="e.g. RADIICATO CORE"
                    className="w-full border border-[#D1D5DB] rounded p-2 text-xs text-[#111827]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#374151]">Slug *</label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full border border-[#D1D5DB] rounded p-2 text-xs font-mono text-[#111827]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#374151]">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as Collection['status'])}
                    className="w-full border border-[#D1D5DB] rounded p-2 text-xs text-[#111827]"
                  >
                    <option value="live">Live</option>
                    <option value="scheduled">Scheduled Drop</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="font-bold text-[#374151]">Editorial Description</label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full border border-[#D1D5DB] rounded p-2 text-xs text-[#111827]"
                  />
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <ImageUploadDropzone
                    bucket="collections"
                    folderPath={slug || 'general'}
                    label="Collection Banner & Cover Photography"
                    helperText="Upload campaign cover or banner photo directly to Supabase collections bucket"
                    onUploadSuccess={(url) => {
                      setBannerImage(url);
                      if (!coverImage) setCoverImage(url);
                    }}
                  />
                  <div className="pt-1">
                    <label className="text-[11px] font-mono text-[#6B7280]">Image URL Reference</label>
                    <input
                      type="url"
                      value={bannerImage}
                      onChange={(e) => {
                        setBannerImage(e.target.value);
                        if (!coverImage) setCoverImage(e.target.value);
                      }}
                      placeholder="https://..."
                      className="w-full border border-[#D1D5DB] rounded p-2 text-xs font-mono text-[#111827]"
                    />
                  </div>
                </div>
              </div>

              {/* Scheduled Drop Settings */}
              <div className="pt-2 border-t border-[#E5E7EB] space-y-3">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-[#111827]">
                  <input
                    type="checkbox"
                    checked={isScheduled}
                    onChange={(e) => setIsScheduled(e.target.checked)}
                    className="w-4 h-4 accent-[#4D5936]"
                  />
                  <span>Enable Scheduled Drop with Live Countdown Timer</span>
                </label>

                {isScheduled && (
                  <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded space-y-1">
                    <label className="font-semibold text-[#475569]">Launch Timestamp (ISO 8601)</label>
                    <input
                      type="text"
                      value={launchDate}
                      onChange={(e) => setLaunchDate(e.target.value)}
                      placeholder="2026-10-15T19:00:00Z"
                      className="w-full border border-[#CBD5E1] rounded p-1.5 font-mono text-xs"
                    />
                  </div>
                )}
              </div>

              {/* Product Selection */}
              <div className="pt-2 border-t border-[#E5E7EB] space-y-2">
                <label className="font-bold text-[#374151] block">Assign Products to Capsule</label>
                <div className="max-h-40 overflow-y-auto divide-y divide-[#E5E7EB] border border-[#E5E7EB] rounded p-2">
                  {products.map((p) => {
                    const isChecked = selectedProductIds.includes(p.id);
                    return (
                      <label key={p.id} className="flex items-center gap-2 py-1.5 cursor-pointer hover:bg-[#F9FAFB]">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleProductSelect(p.id)}
                          className="accent-[#4D5936]"
                        />
                        <span className="font-medium text-[#111827]">{p.name}</span>
                        <span className="font-mono text-[#6B7280] text-[10px]">({p.sku})</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-[#E5E7EB] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-[#D1D5DB] rounded text-xs text-[#374151]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#4D5936] hover:bg-[#343D2D] text-white rounded text-xs font-bold uppercase tracking-wider"
                >
                  Save Collection Capsule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

