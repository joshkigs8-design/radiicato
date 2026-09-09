'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Upload, Trash2, Copy, Check, Search, Filter } from 'lucide-react';
import { MediaItem } from '@/types';
import { ImageUploadDropzone } from '@/components/admin/ImageUploadDropzone';
import { StorageBucket } from '@/lib/supabase';

const INITIAL_MEDIA: MediaItem[] = [
  {
    id: 'med-1',
    fileName: 'radiicato_signature_tee_front.jpg',
    url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1200',
    fileSize: 420000,
    mimeType: 'image/jpeg',
    uploadedAt: '2026-03-01T10:00:00Z',
  },
  {
    id: 'med-2',
    fileName: 'underground_rebel_tee_back.jpg',
    url: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=1200',
    fileSize: 512000,
    mimeType: 'image/jpeg',
    uploadedAt: '2026-03-02T11:30:00Z',
  },
  {
    id: 'med-3',
    fileName: 'heavyweight_core_hoodie_nairobi.jpg',
    url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1200',
    fileSize: 680000,
    mimeType: 'image/jpeg',
    uploadedAt: '2026-03-03T14:15:00Z',
  },
  {
    id: 'med-4',
    fileName: 'editorial_lookbook_campaign_01.jpg',
    url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1400',
    fileSize: 890000,
    mimeType: 'image/jpeg',
    uploadedAt: '2026-03-04T09:00:00Z',
  },
  {
    id: 'med-5',
    fileName: 'tactical_sweatpants_cargo_detail.jpg',
    url: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=1200',
    fileSize: 340000,
    mimeType: 'image/jpeg',
    uploadedAt: '2026-03-05T12:00:00Z',
  },
  {
    id: 'med-6',
    fileName: 'metallic_silver_plate_trucker_cap.jpg',
    url: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=1200',
    fileSize: 290000,
    mimeType: 'image/jpeg',
    uploadedAt: '2026-03-06T15:40:00Z',
  },
];

export default function AdminMediaPage() {
  const [mediaList, setMediaList] = useState<MediaItem[]>(INITIAL_MEDIA);
  const [selectedBucket, setSelectedBucket] = useState<StorageBucket>('collections');
  const [search, setSearch] = useState('');
  const [uploadUrl, setUploadUrl] = useState('');
  const [uploadFileName, setUploadFileName] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadUrl.trim()) return;

    const newItem: MediaItem = {
      id: `med-${Date.now()}`,
      fileName: uploadFileName.trim() || `radiicato_asset_${Date.now()}.jpg`,
      url: uploadUrl.trim(),
      fileSize: 450000,
      mimeType: 'image/jpeg',
      uploadedAt: new Date().toISOString(),
    };

    setMediaList([newItem, ...mediaList]);
    setUploadUrl('');
    setUploadFileName('');
  };

  const handleCopy = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = (id: string) => {
    setMediaList(mediaList.filter((m) => m.id !== id));
  };

  const filtered = mediaList.filter((m) =>
    m.fileName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-16">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-[#E5E7EB] pb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">Media Library & CDN Assets</h1>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Central repository for lookbook imagery, product photography, and high-res campaign assets.
          </p>
        </div>
      </div>

      {/* Upload Box with Dropzone & Supabase Storage */}
      <div className="p-6 bg-white border border-[#E5E7EB] rounded-lg shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#111827]">
              Upload Photography & Drop Assets
            </h3>
            <p className="text-xs text-[#6B7280] mt-0.5">
              Upload collection lookbooks, product flat-lays, and banners directly to Supabase Storage.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[#6B7280] uppercase">Target Bucket:</span>
            <select
              value={selectedBucket}
              onChange={(e) => setSelectedBucket(e.target.value as any)}
              className="bg-[#F9FAFB] border border-[#E5E7EB] px-3 py-1.5 rounded text-xs font-mono uppercase text-black focus:outline-none focus:border-[#4D5936]"
            >
              <option value="collections">collections (Banners / Covers)</option>
              <option value="products">products (Front / Back / Details)</option>
              <option value="lookbook">lookbook (Campaign Spreads)</option>
              <option value="media">media (General Brand Assets)</option>
            </select>
          </div>
        </div>

        <ImageUploadDropzone
          bucket={selectedBucket}
          label={`Upload To ${selectedBucket.toUpperCase()} Bucket`}
          helperText="Select or drag & drop high-resolution collection or product photography (up to 20MB)"
          onUploadSuccess={(url, path, file) => {
            const newItem: MediaItem = {
              id: `med-${Date.now()}`,
              fileName: file.name,
              url,
              fileSize: file.size,
              mimeType: file.type,
              uploadedAt: new Date().toISOString(),
            };
            setMediaList([newItem, ...mediaList]);
          }}
        />

        <div className="pt-2 border-t border-[#F3F4F6]">
          <details className="text-xs text-[#6B7280] cursor-pointer">
            <summary className="font-semibold hover:text-black">Or manually register external image URL</summary>
            <form onSubmit={handleUpload} className="flex flex-col sm:flex-row gap-3 pt-3">
              <input
                type="url"
                required
                placeholder="Direct Image URL (JPG, PNG, WEBP, AVIF)..."
                value={uploadUrl}
                onChange={(e) => setUploadUrl(e.target.value)}
                className="flex-1 bg-[#F9FAFB] border border-[#E5E7EB] p-2 rounded text-xs text-[#111827] focus:outline-none focus:border-[#4D5936]"
              />
              <input
                type="text"
                placeholder="Descriptive filename (e.g. drop_hoodie_back.jpg)"
                value={uploadFileName}
                onChange={(e) => setUploadFileName(e.target.value)}
                className="w-64 bg-[#F9FAFB] border border-[#E5E7EB] p-2 rounded text-xs text-[#111827] focus:outline-none focus:border-[#4D5936]"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#4D5936] hover:bg-[#343D2D] text-white rounded text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5"
              >
                <Upload size={14} /> Add URL
              </button>
            </form>
          </details>
        </div>
      </div>

      {/* Search */}
      <div className="flex justify-between items-center">
        <div className="relative w-80">
          <Search size={15} className="text-[#9CA3AF] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search media by filename..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-md pl-9 pr-3 py-1.5 text-xs text-[#111827] focus:outline-none focus:border-[#4D5936]"
          />
        </div>
        <span className="text-xs font-mono text-[#6B7280]">{filtered.length} Media Files</span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-[#E5E7EB] rounded-lg overflow-hidden shadow-sm flex flex-col justify-between"
          >
            <div className="relative aspect-square bg-[#111] overflow-hidden">
              <Image src={item.url} alt={item.fileName} fill className="object-cover" sizes="200px" />
            </div>

            <div className="p-3 space-y-1">
              <p className="text-[11px] font-semibold text-[#111827] truncate font-mono">{item.fileName}</p>
              <p className="text-[10px] text-[#6B7280] font-mono">
                {(item.fileSize / 1024).toFixed(0)} KB • JPG
              </p>
            </div>

            <div className="p-2 bg-[#F9FAFB] border-t border-[#E5E7EB] flex justify-between items-center">
              <button
                onClick={() => handleCopy(item.id, item.url)}
                className="text-[10px] font-bold text-[#4D5936] hover:underline flex items-center gap-1"
                title="Copy URL"
              >
                {copiedId === item.id ? <Check size={11} className="text-green-600" /> : <Copy size={11} />}
                <span>{copiedId === item.id ? 'Copied' : 'Copy URL'}</span>
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="text-red-500 hover:text-red-700 p-1"
                title="Delete"
              >
                <Trash2 size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

