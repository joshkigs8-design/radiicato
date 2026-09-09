'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ArrowLeft, Check, Plus, Trash2, Eye, Upload, Save, 
  Sparkles, Layers, DollarSign, Image as ImageIcon, Box, Globe, ShieldCheck 
} from 'lucide-react';
import { useStore } from '@/lib/use-store';
import { formatKES } from '@/lib/utils';
import { Product, ProductVariant, ProductImage, Size } from '@/types';
import { ImageUploadDropzone } from '@/components/admin/ImageUploadDropzone';

interface ProductWizardProps {
  initialProduct?: Product;
  isEditing?: boolean;
}

const ALL_SIZES: Size[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'ONE SIZE'];

export function ProductWizard({ initialProduct, isEditing = false }: ProductWizardProps) {
  const router = useRouter();
  const { categories, collections, saveProduct } = useStore();

  const [activeStep, setActiveStep] = useState<number>(1);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState(initialProduct?.name || '');
  const [slug, setSlug] = useState(initialProduct?.slug || '');
  const [sku, setSku] = useState(initialProduct?.sku || `RAD-${Math.floor(100 + Math.random() * 900)}`);
  const [shortDesc, setShortDesc] = useState(initialProduct?.shortDescription || '');
  const [description, setDescription] = useState(initialProduct?.description || '');
  const [categoryId, setCategoryId] = useState(initialProduct?.categoryId || (categories[0]?.id || ''));
  const [collectionId, setCollectionId] = useState(initialProduct?.collectionId || '');
  const [gender, setGender] = useState<'unisex' | 'mens' | 'womens'>(initialProduct?.gender || 'unisex');
  const [material, setMaterial] = useState(initialProduct?.material || '100% Heavyweight Combed Cotton (280 GSM)');
  const [fit, setFit] = useState(initialProduct?.fit || 'Relaxed Boxy Silhouette with dropped shoulders');
  const [care, setCare] = useState(initialProduct?.careInstructions || 'Machine wash cold delicate. Do not tumble dry.');
  const [tagsInput, setTagsInput] = useState(initialProduct?.tags.join(', ') || 'oversized, streetwear, nairobi');

  // Pricing
  const [price, setPrice] = useState<number>(initialProduct?.price || 1000);
  const [salePrice, setSalePrice] = useState<number | undefined>(initialProduct?.salePrice);
  const [costPrice, setCostPrice] = useState<number | undefined>(initialProduct?.costPrice || 450);

  // Drop & Status
  const [status, setStatus] = useState<Product['status']>(initialProduct?.status || 'active');
  const [isFeatured, setIsFeatured] = useState<boolean>(initialProduct?.isFeatured || false);
  const [isLimitedDrop, setIsLimitedDrop] = useState<boolean>(initialProduct?.isLimitedDrop || false);
  const [dropPieceCount, setDropPieceCount] = useState<number | undefined>(initialProduct?.dropPieceCount || 50);

  // Images
  const [images, setImages] = useState<ProductImage[]>(
    initialProduct?.images || [
      {
        id: 'img-1',
        productId: '',
        url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1000',
        altText: 'Garment Front View',
        isPrimary: true,
        isHover: false,
        displayOrder: 1,
      },
      {
        id: 'img-2',
        productId: '',
        url: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=1000',
        altText: 'Garment Back Graphic View',
        isPrimary: false,
        isHover: true,
        displayOrder: 2,
      },
    ]
  );
  const [newImageUrl, setNewImageUrl] = useState('');

  // Variants
  const [variants, setVariants] = useState<ProductVariant[]>(
    initialProduct?.variants || [
      { id: 'v-1', productId: '', colorName: 'Obsidian Black', colorHex: '#0A0A0A', size: 'S', sku: `${sku}-BLK-S`, stockQuantity: 8, lowStockThreshold: 3 },
      { id: 'v-2', productId: '', colorName: 'Obsidian Black', colorHex: '#0A0A0A', size: 'M', sku: `${sku}-BLK-M`, stockQuantity: 12, lowStockThreshold: 4 },
      { id: 'v-3', productId: '', colorName: 'Obsidian Black', colorHex: '#0A0A0A', size: 'L', sku: `${sku}-BLK-L`, stockQuantity: 6, lowStockThreshold: 3 },
      { id: 'v-4', productId: '', colorName: 'Obsidian Black', colorHex: '#0A0A0A', size: 'XL', sku: `${sku}-BLK-XL`, stockQuantity: 2, lowStockThreshold: 2 },
    ]
  );

  // SEO
  const [seoTitle, setSeoTitle] = useState(initialProduct?.seoTitle || '');
  const [seoDesc, setSeoDesc] = useState(initialProduct?.seoDescription || '');

  // Live Calculations
  const grossMargin = costPrice && price ? Math.round(((price - costPrice) / price) * 100) : 0;
  const totalStock = variants.reduce((acc, v) => acc + v.stockQuantity, 0);

  const steps = [
    { num: 1, label: 'Basic Info' },
    { num: 2, label: 'Images' },
    { num: 3, label: 'Variants' },
    { num: 4, label: 'Inventory' },
    { num: 5, label: 'Pricing' },
    { num: 6, label: 'Collection' },
    { num: 7, label: 'SEO' },
    { num: 8, label: 'Publish & Preview' },
  ];

  const handleAddImage = () => {
    if (!newImageUrl.trim()) return;
    setImages([
      ...images,
      {
        id: `img-${Date.now()}`,
        productId: initialProduct?.id || '',
        url: newImageUrl.trim(),
        altText: name,
        isPrimary: images.length === 0,
        isHover: images.length === 1,
        displayOrder: images.length + 1,
      },
    ]);
    setNewImageUrl('');
  };

  const handleSetPrimary = (index: number) => {
    setImages(
      images.map((img, i) => ({
        ...img,
        isPrimary: i === index,
        isHover: i === index ? false : img.isHover,
      }))
    );
  };

  const handleSetHover = (index: number) => {
    setImages(
      images.map((img, i) => ({
        ...img,
        isHover: i === index,
        isPrimary: i === index ? false : img.isPrimary,
      }))
    );
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!name.trim()) {
      alert('Product name is required.');
      return;
    }

    const generatedSlug = slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const productPayload: Product = {
      id: initialProduct?.id || `prod-${Date.now()}`,
      name: name.trim(),
      slug: generatedSlug,
      sku: sku.trim(),
      shortDescription: shortDesc.trim(),
      description: description.trim(),
      price: Number(price),
      salePrice: salePrice ? Number(salePrice) : undefined,
      costPrice: costPrice ? Number(costPrice) : undefined,
      categoryId,
      collectionId: collectionId || undefined,
      brand: 'RADIICATO',
      material,
      fit,
      careInstructions: care,
      gender,
      tags: tagsInput.split(',').map((t) => t.trim()).filter(Boolean),
      status,
      isFeatured,
      isLimitedDrop,
      dropPieceCount: isLimitedDrop ? Number(dropPieceCount) : undefined,
      images,
      variants,
      seoTitle: seoTitle || `${name} | RADIICATO Nairobi`,
      seoDescription: seoDesc || shortDesc,
      createdAt: initialProduct?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveProduct(productPayload);
    setToastMessage(`Product "${name}" saved successfully!`);
    setTimeout(() => {
      router.push('/admin/products');
    }, 1200);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-24">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#111827] text-white px-5 py-3 rounded-md shadow-xl text-xs font-bold flex items-center gap-2 border border-[#374151]">
          <Check size={16} className="text-[#10B981]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-4">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#4B5563] hover:text-[#111827]"
        >
          <ArrowLeft size={14} /> Back to Products Catalog
        </Link>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#4D5936] hover:bg-[#343D2D] text-white rounded-md text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
          >
            <Save size={14} />
            <span>Save Product</span>
          </button>
        </div>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-[#111827]">
          {isEditing ? `Edit: ${name}` : 'Create New Streetwear Product'}
        </h1>
        <p className="text-xs text-[#6B7280]">
          Follow the 8-step atelier wizard to configure textiles, sizing matrices, and drops.
        </p>
      </div>

      {/* 8-Step Navigation Tracker */}
      <div className="flex items-center gap-1 overflow-x-auto pb-2 border-b border-[#E5E7EB]">
        {steps.map((s) => {
          const isCurrent = activeStep === s.num;
          const isDone = activeStep > s.num;
          return (
            <button
              key={s.num}
              onClick={() => setActiveStep(s.num)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded text-xs font-medium whitespace-nowrap transition-colors ${
                isCurrent
                  ? 'bg-[#111827] text-white font-bold'
                  : isDone
                  ? 'bg-[#E5E7EB] text-[#374151]'
                  : 'text-[#6B7280] hover:bg-[#F3F4F6]'
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold ${
                  isCurrent ? 'bg-white text-black' : isDone ? 'bg-[#10B981] text-white' : 'bg-[#D1D5DB] text-white'
                }`}
              >
                {isDone ? <Check size={10} /> : s.num}
              </span>
              <span>{s.label}</span>
            </button>
          );
        })}
      </div>

      {/* STEP 1: Basic Information */}
      {activeStep === 1 && (
        <div className="bg-white border border-[#E5E7EB] p-6 rounded-lg shadow-sm space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#111827]">Step 1: Basic Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-bold text-[#374151]">Product Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (!isEditing && !slug) {
                    setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                  }
                }}
                placeholder="e.g. Radiicato Signature Oversized Tee"
                className="w-full bg-[#F9FAFB] border border-[#E5E7EB] p-2.5 rounded text-xs text-[#111827] focus:outline-none focus:border-[#4D5936]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#374151]">Slug / URL Key *</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g. radiicato-signature-oversized-tee"
                className="w-full bg-[#F9FAFB] border border-[#E5E7EB] p-2.5 rounded text-xs font-mono text-[#111827] focus:outline-none focus:border-[#4D5936]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#374151]">SKU Prefix *</label>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="RAD-TEE-001"
                className="w-full bg-[#F9FAFB] border border-[#E5E7EB] p-2.5 rounded text-xs font-mono text-[#111827] focus:outline-none focus:border-[#4D5936]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#374151]">Category</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full bg-[#F9FAFB] border border-[#E5E7EB] p-2.5 rounded text-xs text-[#111827] focus:outline-none focus:border-[#4D5936]"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#374151]">Gender / Cut</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as 'unisex' | 'mens' | 'womens')}
                className="w-full bg-[#F9FAFB] border border-[#E5E7EB] p-2.5 rounded text-xs text-[#111827] focus:outline-none focus:border-[#4D5936]"
              >
                <option value="unisex">Unisex (Standard)</option>
                <option value="mens">Mens Specific</option>
                <option value="womens">Womens Specific</option>
              </select>
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-bold text-[#374151]">Short Description</label>
              <input
                type="text"
                value={shortDesc}
                onChange={(e) => setShortDesc(e.target.value)}
                placeholder="Brief editorial summary shown in product card and preview..."
                className="w-full bg-[#F9FAFB] border border-[#E5E7EB] p-2.5 rounded text-xs text-[#111827] focus:outline-none focus:border-[#4D5936]"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-bold text-[#374151]">Full Editorial Description</label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="In-depth garment storytelling, textile weight, silhouette details..."
                className="w-full bg-[#F9FAFB] border border-[#E5E7EB] p-2.5 rounded text-xs text-[#111827] focus:outline-none focus:border-[#4D5936]"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-bold text-[#374151]">Tags (comma separated)</label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="oversized, heavyweight, metallic, core"
                className="w-full bg-[#F9FAFB] border border-[#E5E7EB] p-2.5 rounded text-xs text-[#111827] focus:outline-none focus:border-[#4D5936]"
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Images Management */}
      {activeStep === 2 && (
        <div className="bg-white border border-[#E5E7EB] p-6 rounded-lg shadow-sm space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#111827]">Step 2: Garment Imagery</h2>
          <p className="text-xs text-[#6B7280]">
            Set primary thumbnail, hover transition image, and multi-angle lookbook shots.
          </p>

          {/* Supabase Direct Storage Dropzone */}
          <ImageUploadDropzone
            bucket="products"
            folderPath={slug || 'products'}
            label="Upload Product Photography"
            helperText="Upload front view, back view, details, or on-model shots directly to Supabase products bucket"
            onUploadSuccess={(url, path, file) => {
              const newImg: ProductImage = {
                id: `img-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                productId: initialProduct?.id || '',
                url,
                altText: `${name || 'Radiicato Garment'} - ${file.name.replace(/\.[^/.]+$/, '')}`,
                isPrimary: images.length === 0,
                isHover: images.length === 1,
                displayOrder: images.length + 1,
              };
              setImages([...images, newImg]);
              setToastMessage('Image uploaded to Supabase Storage and added to gallery');
              setTimeout(() => setToastMessage(null), 3000);
            }}
          />

          <div className="pt-2">
            <details className="text-xs text-[#6B7280]">
              <summary className="font-medium cursor-pointer hover:text-black">Or paste external image URL</summary>
              <div className="flex gap-2 pt-2">
                <input
                  type="url"
                  placeholder="Paste Image URL (e.g. Unsplash or external CDN URL)..."
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="flex-1 bg-[#F9FAFB] border border-[#E5E7EB] p-2.5 rounded text-xs text-[#111827] focus:outline-none focus:border-[#4D5936]"
                />
                <button
                  type="button"
                  onClick={handleAddImage}
                  className="px-4 py-2 bg-[#111827] text-white rounded text-xs font-bold uppercase tracking-wider"
                >
                  Add URL
                </button>
              </div>
            </details>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
            {images.map((img, idx) => (
              <div key={img.id} className="p-2 border border-[#E5E7EB] rounded-md bg-[#F9FAFB] space-y-2">
                <div className="relative aspect-[3/4] bg-[#E5E7EB] rounded overflow-hidden">
                  <Image src={img.url} alt={img.altText} fill className="object-cover" sizes="150px" />
                  <button
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                    title="Remove"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleSetPrimary(idx)}
                    className={`flex-1 py-1 rounded text-[10px] font-bold uppercase font-mono ${
                      img.isPrimary ? 'bg-[#10B981] text-white' : 'bg-white border border-[#D1D5DB] text-[#6B7280]'
                    }`}
                  >
                    {img.isPrimary ? 'PRIMARY' : 'Set Primary'}
                  </button>
                  <button
                    onClick={() => handleSetHover(idx)}
                    className={`flex-1 py-1 rounded text-[10px] font-bold uppercase font-mono ${
                      img.isHover ? 'bg-[#6366F1] text-white' : 'bg-white border border-[#D1D5DB] text-[#6B7280]'
                    }`}
                  >
                    {img.isHover ? 'HOVER' : 'Set Hover'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 3: Variants */}
      {activeStep === 3 && (
        <div className="bg-white border border-[#E5E7EB] p-6 rounded-lg shadow-sm space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#111827]">Step 3: Color & Size Matrix</h2>
          <p className="text-xs text-[#6B7280]">
            Configure active sizes and colorways for this piece.
          </p>

          <div className="divide-y divide-[#E5E7EB]">
            {variants.map((v, i) => (
              <div key={v.id} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="w-4 h-4 rounded-full border border-gray-300" style={{ backgroundColor: v.colorHex }} />
                  <div>
                    <span className="text-xs font-bold text-[#111827]">{v.colorName}</span>
                    <span className="text-xs text-[#6B7280] font-mono ml-2">SIZE {v.size}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-[#6B7280]">{v.sku}</span>
                  <button
                    onClick={() => setVariants(variants.filter((_, idx) => idx !== i))}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add Variant Quick Tool */}
          <div className="pt-4 border-t border-[#E5E7EB] flex gap-2">
            <button
              onClick={() => {
                const newV: ProductVariant = {
                  id: `v-${Date.now()}`,
                  productId: initialProduct?.id || '',
                  colorName: 'Obsidian Black',
                  colorHex: '#0A0A0A',
                  size: 'XXL',
                  sku: `${sku}-BLK-XXL`,
                  stockQuantity: 5,
                  lowStockThreshold: 2,
                };
                setVariants([...variants, newV]);
              }}
              className="px-3 py-1.5 bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#374151] rounded text-xs font-semibold flex items-center gap-1"
            >
              <Plus size={13} /> Add XXL Size Variant
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Inventory */}
      {activeStep === 4 && (
        <div className="bg-white border border-[#E5E7EB] p-6 rounded-lg shadow-sm space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#111827]">Step 4: Real Inventory Allocation</h2>
          <p className="text-xs text-[#6B7280]">
            Set individual stock quantities and alert thresholds for each size variant. Total stock: <strong className="text-[#111827]">{totalStock} units</strong>.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#F9FAFB] text-[#6B7280] font-mono border-b border-[#E5E7EB]">
                <tr>
                  <th className="py-2.5 px-3">VARIANT</th>
                  <th className="py-2.5 px-3">SKU</th>
                  <th className="py-2.5 px-3">STOCK QUANTITY</th>
                  <th className="py-2.5 px-3">LOW STOCK THRESHOLD</th>
                  <th className="py-2.5 px-3">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {variants.map((v, idx) => (
                  <tr key={v.id}>
                    <td className="py-2.5 px-3 font-semibold">{v.colorName} / {v.size}</td>
                    <td className="py-2.5 px-3 font-mono text-[#6B7280]">{v.sku}</td>
                    <td className="py-2.5 px-3">
                      <input
                        type="number"
                        min={0}
                        value={v.stockQuantity}
                        onChange={(e) => {
                          const updated = [...variants];
                          updated[idx].stockQuantity = Number(e.target.value);
                          setVariants(updated);
                        }}
                        className="w-20 bg-[#F9FAFB] border border-[#E5E7EB] p-1.5 rounded font-mono font-bold text-center"
                      />
                    </td>
                    <td className="py-2.5 px-3">
                      <input
                        type="number"
                        min={1}
                        value={v.lowStockThreshold}
                        onChange={(e) => {
                          const updated = [...variants];
                          updated[idx].lowStockThreshold = Number(e.target.value);
                          setVariants(updated);
                        }}
                        className="w-16 bg-[#F9FAFB] border border-[#E5E7EB] p-1.5 rounded font-mono text-center"
                      />
                    </td>
                    <td className="py-2.5 px-3">
                      {v.stockQuantity === 0 ? (
                        <span className="text-red-600 font-bold font-mono">SOLD OUT</span>
                      ) : v.stockQuantity <= v.lowStockThreshold ? (
                        <span className="text-amber-600 font-bold font-mono">LOW STOCK</span>
                      ) : (
                        <span className="text-emerald-600 font-bold font-mono">HEALTHY</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* STEP 5: Pricing */}
      {activeStep === 5 && (
        <div className="bg-white border border-[#E5E7EB] p-6 rounded-lg shadow-sm space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#111827]">Step 5: Pricing & Cost Analysis</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#374151]">Regular Price (KES) *</label>
              <input
                type="number"
                min={0}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full bg-[#F9FAFB] border border-[#E5E7EB] p-2.5 rounded font-mono font-bold text-xs"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#374151]">Sale Price (KES - Optional)</label>
              <input
                type="number"
                min={0}
                value={salePrice || ''}
                onChange={(e) => setSalePrice(e.target.value ? Number(e.target.value) : undefined)}
                placeholder="Leave blank if not on sale"
                className="w-full bg-[#F9FAFB] border border-[#E5E7EB] p-2.5 rounded font-mono text-xs"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#374151]">Cost Price (KES)</label>
              <input
                type="number"
                min={0}
                value={costPrice || ''}
                onChange={(e) => setCostPrice(e.target.value ? Number(e.target.value) : undefined)}
                placeholder="Milling + CMT cost"
                className="w-full bg-[#F9FAFB] border border-[#E5E7EB] p-2.5 rounded font-mono text-xs"
              />
            </div>
          </div>

          <div className="p-4 bg-[#F3F4F6] rounded-md flex justify-between items-center text-xs">
            <span className="text-[#4B5563]">Gross Atelier Margin:</span>
            <span className="font-mono font-bold text-[#059669]">{grossMargin}% margin</span>
          </div>
        </div>
      )}

      {/* STEP 6: Collection & Drops */}
      {activeStep === 6 && (
        <div className="bg-white border border-[#E5E7EB] p-6 rounded-lg shadow-sm space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#111827]">Step 6: Collection & Limited Drop</h2>
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#374151]">Assigned Collection</label>
              <select
                value={collectionId}
                onChange={(e) => setCollectionId(e.target.value)}
                className="w-full bg-[#F9FAFB] border border-[#E5E7EB] p-2.5 rounded text-xs"
              >
                <option value="">No Collection (Standalone Release)</option>
                {collections.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.status.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isLimitedDrop}
                  onChange={(e) => setIsLimitedDrop(e.target.checked)}
                  className="w-4 h-4 accent-[#4D5936]"
                />
                <span className="text-xs font-bold text-[#111827]">Mark as Serial-Numbered Limited Drop</span>
              </label>
            </div>

            {isLimitedDrop && (
              <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md space-y-2">
                <label className="text-xs font-bold text-[#374151]">Cap Total Pieces (e.g. 50)</label>
                <input
                  type="number"
                  min={1}
                  value={dropPieceCount || 50}
                  onChange={(e) => setDropPieceCount(Number(e.target.value))}
                  className="w-32 bg-white border border-[#CBD5E1] p-2 rounded text-xs font-mono font-bold"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* STEP 7: SEO Settings */}
      {activeStep === 7 && (
        <div className="bg-white border border-[#E5E7EB] p-6 rounded-lg shadow-sm space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#111827]">Step 7: Search Engine Optimization</h2>
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#374151]">SEO Meta Title</label>
              <input
                type="text"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                placeholder={`${name} | RADIICATO Nairobi Streetwear`}
                className="w-full bg-[#F9FAFB] border border-[#E5E7EB] p-2.5 rounded text-xs"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#374151]">SEO Meta Description</label>
              <textarea
                rows={3}
                value={seoDesc}
                onChange={(e) => setSeoDesc(e.target.value)}
                placeholder="Concise summary for Google search snippets..."
                className="w-full bg-[#F9FAFB] border border-[#E5E7EB] p-2.5 rounded text-xs"
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 8: Publish & Preview */}
      {activeStep === 8 && (
        <div className="bg-white border border-[#E5E7EB] p-6 rounded-lg shadow-sm space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#111827]">Step 8: Review & Launch Status</h2>

          <div className="space-y-2">
            <label className="text-xs font-bold text-[#374151] block">Publication State</label>
            <div className="flex gap-4">
              {(['active', 'draft', 'scheduled', 'archived'] as const).map((st) => (
                <label key={st} className="flex items-center gap-2 cursor-pointer text-xs">
                  <input
                    type="radio"
                    name="product_status"
                    checked={status === st}
                    onChange={() => setStatus(st)}
                    className="accent-[#4D5936]"
                  />
                  <span className="uppercase font-mono font-semibold">{st}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="p-6 bg-[#0A0A0A] text-white rounded-lg space-y-4">
            <span className="text-[10px] font-mono text-[#8FA37A] uppercase tracking-widest block">
              STOREFRONT VISUAL CARD PREVIEW
            </span>
            <div className="flex gap-6 items-center">
              <div className="relative w-24 h-32 bg-[#1A1A1A] rounded overflow-hidden flex-shrink-0">
                {images[0] && <Image src={images[0].url} alt={name} fill className="object-cover" sizes="96px" />}
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-[#71717A] uppercase">{sku}</span>
                <h3 className="text-base font-bold uppercase tracking-wider text-white font-display">{name || 'Product Name'}</h3>
                <p className="text-sm font-mono text-[#E5E5EA]">{formatKES(salePrice || price)}</p>
                <p className="text-xs text-[#8E8E93] font-mono">{totalStock} units available across {variants.length} sizes</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleSave}
            className="w-full py-4 bg-[#4D5936] hover:bg-[#343D2D] text-white rounded-md text-xs font-bold uppercase tracking-[0.2em] transition-colors"
          >
            CONFIRM & COMMIT TO CATALOG
          </button>
        </div>
      )}

      {/* Wizard Step Pager */}
      <div className="flex justify-between items-center pt-4 border-t border-[#E5E7EB]">
        <button
          onClick={() => setActiveStep(Math.max(1, activeStep - 1))}
          disabled={activeStep === 1}
          className="px-4 py-2 border border-[#D1D5DB] rounded text-xs font-medium text-[#374151] hover:bg-[#F3F4F6] disabled:opacity-30"
        >
          &larr; Previous Step
        </button>
        <button
          onClick={() => {
            if (activeStep < 8) setActiveStep(activeStep + 1);
            else handleSave();
          }}
          className="px-6 py-2 bg-[#111827] text-white rounded text-xs font-bold uppercase tracking-wider hover:bg-black"
        >
          {activeStep === 8 ? 'Complete & Save' : 'Next Step &rarr;'}
        </button>
      </div>
    </div>
  );
}

