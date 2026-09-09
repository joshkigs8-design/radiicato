'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  SlidersHorizontal, LayoutGrid, Rows3, X, ChevronDown, Check, RotateCcw 
} from 'lucide-react';
import { useStore } from '@/lib/use-store';
import { ProductCard } from '@/components/product/ProductCard';
import { Size } from '@/types';
import { formatKES } from '@/lib/utils';

const SIZES: Size[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const initialCollection = searchParams.get('collection') || 'all';
  const initialSearch = searchParams.get('search') || '';

  const { products, categories, collections } = useStore();

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedCollection, setSelectedCollection] = useState<string>(initialCollection);
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [selectedColor, setSelectedColor] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(10000);
  const [availabilityOnly, setAvailabilityOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [viewMode, setViewMode] = useState<'grid-4' | 'grid-3' | 'list'>('grid-4');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Available unique colors across products
  const availableColors = useMemo(() => {
    const map = new Map<string, string>();
    products.forEach((p) => {
      p.variants.forEach((v) => {
        if (!map.has(v.colorName)) {
          map.set(v.colorName, v.colorHex);
        }
      });
    });
    return Array.from(map.entries()).map(([name, hex]) => ({ name, hex }));
  }, [products]);

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Category filter
      if (selectedCategory !== 'all') {
        const cat = categories.find((c) => c.slug === selectedCategory);
        if (cat && product.categoryId !== cat.id) return false;
      }

      // Collection filter
      if (selectedCollection !== 'all') {
        const col = collections.find((c) => c.slug === selectedCollection);
        if (col && product.collectionId !== col.id) return false;
      }

      // Size filter
      if (selectedSize !== 'all') {
        const hasSize = product.variants.some((v) => v.size === selectedSize && v.stockQuantity > 0);
        if (!hasSize) return false;
      }

      // Color filter
      if (selectedColor !== 'all') {
        const hasColor = product.variants.some((v) => v.colorName === selectedColor);
        if (!hasColor) return false;
      }

      // Price filter
      const effectivePrice = product.salePrice || product.price;
      if (effectivePrice > maxPrice) return false;

      // Availability filter
      if (availabilityOnly) {
        const totalStock = product.variants.reduce((acc, v) => acc + v.stockQuantity, 0);
        if (totalStock <= 0) return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          product.name.toLowerCase().includes(q) ||
          product.sku.toLowerCase().includes(q) ||
          product.tags.some((t) => t.toLowerCase().includes(q));
        if (!matches) return false;
      }

      return true;
    }).sort((a, b) => {
      const priceA = a.salePrice || a.price;
      const priceB = b.salePrice || b.price;

      if (sortBy === 'price-low') return priceA - priceB;
      if (sortBy === 'price-high') return priceB - priceA;
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === 'bestseller') return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      return 0; // featured default
    });
  }, [
    products,
    categories,
    collections,
    selectedCategory,
    selectedCollection,
    selectedSize,
    selectedColor,
    maxPrice,
    availabilityOnly,
    searchQuery,
    sortBy,
  ]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedCollection('all');
    setSelectedSize('all');
    setSelectedColor('all');
    setMaxPrice(10000);
    setAvailabilityOnly(false);
    setSearchQuery('');
    setSortBy('featured');
  };

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    selectedCollection !== 'all' ||
    selectedSize !== 'all' ||
    selectedColor !== 'all' ||
    maxPrice < 10000 ||
    availabilityOnly ||
    searchQuery !== '';

  return (
    <div className="pt-28 sm:pt-36 pb-28 px-6 sm:px-12 max-w-[1600px] mx-auto min-h-screen bg-white text-[#0A0A0A]">
      {/* Editorial Header */}
      <div className="pb-10 border-b border-[#E5E5E5] flex flex-col md:flex-row justify-between md:items-end gap-6">
        <div>
          <span className="text-[10px] font-mono tracking-widest uppercase text-[#4D5936] font-bold">
            NAIROBI CATALOG / ALL RELEASES
          </span>
          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-[#0A0A0A] font-display mt-1">
            SHOP THE DROP
          </h1>
        </div>
        <p className="text-xs font-mono text-[#71717A] uppercase">
          SHOWING {filteredProducts.length} OF {products.length} ARCHIVAL PIECES
        </p>
      </div>

      {/* Control Toolbar (Search, Filter toggles, Layout & Sort) */}
      <div className="py-6 border-b border-[#E5E5E5] flex flex-wrap items-center justify-between gap-4">
        {/* Mobile Filter Button */}
        <button
          onClick={() => setMobileFilterOpen(true)}
          className="lg:hidden flex items-center gap-2 px-4 py-2 border border-[#D4D4D8] bg-white text-xs font-bold tracking-widest uppercase text-black hover:border-black shadow-xs"
        >
          <SlidersHorizontal size={14} />
          <span>FILTER CATALOG</span>
          {hasActiveFilters && (
            <span className="w-2 h-2 rounded-full bg-[#4D5936]"></span>
          )}
        </button>

        {/* Search within shop */}
        <div className="flex-1 max-w-xs">
          <input
            type="text"
            placeholder="FILTER BY KEYWORD / SKU"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-[#D4D4D8] px-3 py-2 text-xs uppercase tracking-wider text-black placeholder-[#A1A1AA] focus:outline-none focus:border-black font-mono shadow-xs"
          />
        </div>

        {/* View Mode & Sort (Desktop) */}
        <div className="flex items-center gap-4 ml-auto">
          {/* Sort Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[#71717A] uppercase hidden sm:inline">SORT BY:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-[#D4D4D8] text-xs font-mono uppercase text-black px-3 py-2 focus:outline-none focus:border-black shadow-xs"
            >
              <option value="featured">FEATURED ARCHIVE</option>
              <option value="newest">NEW ARRIVALS</option>
              <option value="bestseller">BEST SELLERS</option>
              <option value="price-low">PRICE: LOW TO HIGH</option>
              <option value="price-high">PRICE: HIGH TO LOW</option>
            </select>
          </div>

          {/* Grid Toggle (Desktop) */}
          <div className="hidden sm:flex items-center border border-[#D4D4D8] bg-white shadow-xs">
            <button
              onClick={() => setViewMode('grid-4')}
              className={`p-2 transition-colors ${
                viewMode === 'grid-4' ? 'bg-black text-white' : 'text-[#71717A] hover:text-black'
              }`}
              title="4-column grid"
            >
              <LayoutGrid size={15} />
            </button>
            <button
              onClick={() => setViewMode('grid-3')}
              className={`p-2 transition-colors ${
                viewMode === 'grid-3' ? 'bg-black text-white' : 'text-[#71717A] hover:text-black'
              }`}
              title="3-column grid"
            >
              <LayoutGrid size={17} className="rotate-45" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 transition-colors ${
                viewMode === 'list' ? 'bg-black text-white' : 'text-[#71717A] hover:text-black'
              }`}
              title="Editorial list"
            >
              <Rows3 size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Layout (Desktop Sidebar Filters + Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pt-10">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block lg:col-span-3 space-y-8 pr-6 border-r border-[#E5E5E5]">
          <div className="flex items-center justify-between pb-4 border-b border-[#E5E5E5]">
            <span className="text-xs font-bold tracking-widest uppercase text-[#0A0A0A]">REFINE CATALOG</span>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-[10px] font-mono uppercase text-[#71717A] hover:text-black flex items-center gap-1 font-bold"
              >
                <RotateCcw size={11} /> Reset
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold tracking-wider uppercase text-[#0A0A0A]">CATEGORIES</h4>
            <div className="space-y-1 text-xs">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`block w-full text-left py-1 tracking-wider uppercase transition-colors ${
                  selectedCategory === 'all' ? 'text-black font-bold' : 'text-[#71717A] hover:text-black'
                }`}
              >
                All Silhouettes
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`block w-full text-left py-1 tracking-wider uppercase transition-colors ${
                    selectedCategory === cat.slug ? 'text-black font-bold' : 'text-[#71717A] hover:text-black'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Collection Filter */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold tracking-wider uppercase text-[#0A0A0A]">COLLECTIONS</h4>
            <div className="space-y-1 text-xs">
              <button
                onClick={() => setSelectedCollection('all')}
                className={`block w-full text-left py-1 tracking-wider uppercase transition-colors ${
                  selectedCollection === 'all' ? 'text-black font-bold' : 'text-[#71717A] hover:text-black'
                }`}
              >
                All Collections
              </button>
              {collections.map((col) => (
                <button
                  key={col.id}
                  onClick={() => setSelectedCollection(col.slug)}
                  className={`block w-full text-left py-1 tracking-wider uppercase transition-colors ${
                    selectedCollection === col.slug ? 'text-black font-bold' : 'text-[#71717A] hover:text-black'
                  }`}
                >
                  {col.name}
                </button>
              ))}
            </div>
          </div>

          {/* Size Filter */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold tracking-wider uppercase text-[#0A0A0A]">SIZE MATRIX</h4>
            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={() => setSelectedSize('all')}
                className={`py-1.5 text-[11px] font-mono border transition-all ${
                  selectedSize === 'all'
                    ? 'bg-black text-white border-black font-bold shadow-xs'
                    : 'bg-white text-[#52525B] border-[#D4D4D8] hover:border-black'
                }`}
              >
                ALL
              </button>
              {SIZES.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`py-1.5 text-[11px] font-mono border transition-all ${
                    selectedSize === size
                      ? 'bg-black text-white border-black font-bold shadow-xs'
                      : 'bg-white text-[#52525B] border-[#D4D4D8] hover:border-black'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Color Filter */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold tracking-wider uppercase text-[#0A0A0A]">COLORWAY</h4>
            <div className="space-y-1.5">
              <button
                onClick={() => setSelectedColor('all')}
                className={`text-xs block py-1 uppercase tracking-wider ${
                  selectedColor === 'all' ? 'text-black font-bold' : 'text-[#71717A] hover:text-black'
                }`}
              >
                All Colors
              </button>
              {availableColors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setSelectedColor(c.name)}
                  className={`flex items-center gap-2.5 text-xs py-1 uppercase tracking-wider transition-colors ${
                    selectedColor === c.name ? 'text-black font-bold' : 'text-[#71717A] hover:text-black'
                  }`}
                >
                  <span
                    className="w-3 h-3 rounded-full border border-[#D4D4D8] inline-block shadow-xs"
                    style={{ backgroundColor: c.hex }}
                  />
                  <span>{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-3">
            <div className="flex justify-between text-xs font-mono uppercase text-[#71717A]">
              <span>MAX PRICE</span>
              <span className="text-black font-bold">{formatKES(maxPrice)}</span>
            </div>
            <input
              type="range"
              min={2500}
              max={10000}
              step={500}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-black bg-[#E5E5E5]"
            />
          </div>

          {/* In Stock Only Toggle */}
          <div className="pt-2">
            <label className="flex items-center gap-3 cursor-pointer text-xs text-[#52525B] hover:text-black">
              <input
                type="checkbox"
                checked={availabilityOnly}
                onChange={(e) => setAvailabilityOnly(e.target.checked)}
                className="w-4 h-4 accent-[#4D5936] rounded-none border-[#D4D4D8]"
              />
              <span>In-Stock Pieces Only</span>
            </label>
          </div>
        </aside>

        {/* Product Grid Area */}
        <main className="lg:col-span-9">
          {filteredProducts.length === 0 ? (
            <div className="py-24 text-center space-y-4 border border-[#E5E5E5] bg-[#FAFAF9] p-12 shadow-xs">
              <p className="text-base font-bold tracking-widest uppercase text-[#0A0A0A]">
                NO PIECES FOUND
              </p>
              <p className="text-xs text-[#71717A] max-w-sm mx-auto">
                No items match your currently applied filters. Clear filters or adjust your price range.
              </p>
              <button
                onClick={resetFilters}
                className="mt-4 px-6 py-3 bg-[#0A0A0A] text-white text-xs font-bold tracking-widest uppercase hover:bg-[#27272A] shadow-sm"
              >
                RESET ALL FILTERS
              </button>
            </div>
          ) : viewMode === 'list' ? (
            <div className="space-y-4">
              {filteredProducts.map((p) => (
                <div
                  key={p.id}
                  className="flex flex-col sm:flex-row gap-6 p-4 bg-[#FAFAF9] border border-[#E5E5E5] hover:border-black transition-all items-center shadow-xs"
                >
                  <div className="w-32 h-40 relative bg-[#F4F4F5] flex-shrink-0 border border-[#E5E5E5]">
                    <ProductCard product={p} />
                  </div>
                  <div className="flex-1 space-y-2 text-center sm:text-left">
                    <span className="text-[10px] font-mono text-[#71717A] uppercase">{p.sku}</span>
                    <h3 className="text-base font-bold uppercase tracking-wider text-[#0A0A0A] font-display">
                      {p.name}
                    </h3>
                    <p className="text-xs text-[#52525B] line-clamp-2 max-w-xl">
                      {p.shortDescription}
                    </p>
                    <p className="text-xs font-mono text-[#71717A]">
                      {p.material} • {p.fit}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              className={`grid gap-6 sm:gap-8 ${
                viewMode === 'grid-3'
                  ? 'grid-cols-2 md:grid-cols-3'
                  : 'grid-cols-2 md:grid-cols-3 xl:grid-cols-4'
              }`}
            >
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filters Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            onClick={() => setMobileFilterOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />
          <div className="relative w-full max-w-xs bg-white border-r border-[#E5E5E5] p-6 overflow-y-auto text-[#0A0A0A] space-y-6 shadow-2xl">
            <div className="flex justify-between items-center pb-4 border-b border-[#E5E5E5]">
              <span className="text-xs font-bold tracking-widest uppercase text-[#0A0A0A]">FILTER CATALOG</span>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 text-[#71717A] hover:text-black"
              >
                <X size={20} />
              </button>
            </div>

            {/* Mobile Categories */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase text-[#4D5936]">Categories</h4>
              <div className="space-y-1 text-xs">
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setMobileFilterOpen(false);
                  }}
                  className={`block w-full text-left py-1 ${
                    selectedCategory === 'all' ? 'text-black font-bold' : 'text-[#71717A]'
                  }`}
                >
                  All
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.slug);
                      setMobileFilterOpen(false);
                    }}
                    className={`block w-full text-left py-1 ${
                      selectedCategory === cat.slug ? 'text-black font-bold' : 'text-[#71717A]'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Collections */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase text-[#4D5936]">Collections</h4>
              <div className="space-y-1 text-xs">
                <button
                  onClick={() => {
                    setSelectedCollection('all');
                    setMobileFilterOpen(false);
                  }}
                  className={`block w-full text-left py-1 ${
                    selectedCollection === 'all' ? 'text-black font-bold' : 'text-[#71717A]'
                  }`}
                >
                  All
                </button>
                {collections.map((col) => (
                  <button
                    key={col.id}
                    onClick={() => {
                      setSelectedCollection(col.slug);
                      setMobileFilterOpen(false);
                    }}
                    className={`block w-full text-left py-1 ${
                      selectedCollection === col.slug ? 'text-black font-bold' : 'text-[#71717A]'
                    }`}
                  >
                    {col.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Reset */}
            <div className="pt-6 border-t border-[#E5E5E5]">
              <button
                onClick={() => {
                  resetFilters();
                  setMobileFilterOpen(false);
                }}
                className="w-full py-3 bg-[#0A0A0A] text-white text-xs font-bold tracking-widest uppercase hover:bg-[#27272A] shadow-sm"
              >
                APPLY & CLOSE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="pt-36 pb-32 px-6 text-center text-xs font-mono text-[#71717A] uppercase">
        LOADING ARCHIVE CATALOG...
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}
