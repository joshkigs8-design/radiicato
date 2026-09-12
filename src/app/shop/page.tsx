'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
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
    <div className="pt-28 sm:pt-36 pb-32 px-5 sm:px-8 lg:px-12 max-w-[1400px] mx-auto min-h-screen text-[#0A0A0A]">
      {/* Editorial Header */}
      <div className="pb-10 border-b border-[#E4E4E7] flex flex-col md:flex-row justify-between md:items-end gap-6">
        <div>
          <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#71717A] font-bold">
            ALL PRODUCTS
          </span>
          <h1 className="text-display-md font-black uppercase mt-2">
            SHOP THE DROP
          </h1>
        </div>
        <p className="text-[11px] font-mono text-[#71717A] uppercase">
          SHOWING {filteredProducts.length} OF {products.length} ARCHIVAL PIECES
        </p>
      </div>

      {/* Control Toolbar (Search, Filter toggles, Layout & Sort) */}
      <div className="py-6 border-b border-[#E4E4E7] flex flex-wrap items-center justify-between gap-4">
        {/* Mobile Filter Button */}
        <button
          onClick={() => setMobileFilterOpen(true)}
          className="lg:hidden flex items-center gap-2 px-4 py-2 border border-[#E4E4E7] bg-white text-[10px] font-mono tracking-[0.15em] uppercase text-[#0A0A0A] hover:border-[#0A0A0A]"
        >
          <SlidersHorizontal size={14} />
          <span>FILTER CATALOG</span>
          {hasActiveFilters && (
            <span className="w-1.5 h-1.5 bg-[#0A0A0A]"></span>
          )}
        </button>

        {/* Search within shop */}
        <div className="flex-1 max-w-xs">
          <input
            type="text"
            placeholder="FILTER BY KEYWORD / SKU"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-b border-[#E4E4E7] py-3 text-[11px] uppercase tracking-wider text-[#0A0A0A] placeholder-[#A1A1AA] focus:outline-none focus:border-[#0A0A0A] transition-colors"
          />
        </div>

        {/* View Mode & Sort (Desktop) */}
        <div className="flex items-center gap-6 ml-auto">
          {/* Sort Selector */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-[#71717A] uppercase tracking-[0.15em] hidden sm:inline">SORT BY:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent border-b border-[#E4E4E7] py-2 text-[11px] font-mono uppercase text-[#0A0A0A] focus:outline-none focus:border-[#0A0A0A] appearance-none pr-6 cursor-pointer"
              style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%230A0A0A%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.2em center', backgroundSize: '0.6em auto' }}
            >
              <option value="featured">FEATURED</option>
              <option value="newest">NEW ARRIVALS</option>
              <option value="bestseller">BEST SELLERS</option>
              <option value="price-low">PRICE: LOW TO HIGH</option>
              <option value="price-high">PRICE: HIGH TO LOW</option>
            </select>
          </div>

          {/* Grid Toggle (Desktop) */}
          <div className="hidden sm:flex items-center gap-1">
            <button
              onClick={() => setViewMode('grid-4')}
              className={`border border-[#E4E4E7] p-1.5 transition-colors ${
                viewMode === 'grid-4' ? 'bg-[#0A0A0A] text-white border-[#0A0A0A]' : 'text-[#71717A] hover:border-[#0A0A0A] hover:text-[#0A0A0A]'
              }`}
              title="4-column grid"
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setViewMode('grid-3')}
              className={`border border-[#E4E4E7] p-1.5 transition-colors ${
                viewMode === 'grid-3' ? 'bg-[#0A0A0A] text-white border-[#0A0A0A]' : 'text-[#71717A] hover:border-[#0A0A0A] hover:text-[#0A0A0A]'
              }`}
              title="3-column grid"
            >
              <LayoutGrid size={18} className="rotate-45" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`border border-[#E4E4E7] p-1.5 transition-colors ${
                viewMode === 'list' ? 'bg-[#0A0A0A] text-white border-[#0A0A0A]' : 'text-[#71717A] hover:border-[#0A0A0A] hover:text-[#0A0A0A]'
              }`}
              title="Editorial list"
            >
              <Rows3 size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Layout (Desktop Sidebar Filters + Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pt-10">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block lg:col-span-1 space-y-8 pr-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#E4E4E7]">
            <span className="text-[11px] font-mono tracking-[0.15em] uppercase font-bold text-[#0A0A0A]">REFINE CATALOG</span>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-[10px] font-mono uppercase text-[#71717A] hover:text-[#0A0A0A] flex items-center gap-1 font-bold"
              >
                <RotateCcw size={11} /> Reset
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="space-y-3 pb-6 border-b border-[#E4E4E7]">
            <h4 className="text-[10px] font-mono tracking-[0.15em] uppercase text-[#0A0A0A] font-semibold">CATEGORIES</h4>
            <div className="space-y-1 text-xs">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`block w-full text-left py-1 tracking-wider uppercase transition-colors ${
                  selectedCategory === 'all' ? 'text-[#0A0A0A] font-bold' : 'text-[#71717A] hover:text-[#0A0A0A]'
                }`}
              >
                All Silhouettes
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`block w-full text-left py-1 tracking-wider uppercase transition-colors ${
                    selectedCategory === cat.slug ? 'text-[#0A0A0A] font-bold' : 'text-[#71717A] hover:text-[#0A0A0A]'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Collection Filter */}
          <div className="space-y-3 pb-6 border-b border-[#E4E4E7]">
            <h4 className="text-[10px] font-mono tracking-[0.15em] uppercase text-[#0A0A0A] font-semibold">COLLECTIONS</h4>
            <div className="space-y-1 text-xs">
              <button
                onClick={() => setSelectedCollection('all')}
                className={`block w-full text-left py-1 tracking-wider uppercase transition-colors ${
                  selectedCollection === 'all' ? 'text-[#0A0A0A] font-bold' : 'text-[#71717A] hover:text-[#0A0A0A]'
                }`}
              >
                All Collections
              </button>
              {collections.map((col) => (
                <button
                  key={col.id}
                  onClick={() => setSelectedCollection(col.slug)}
                  className={`block w-full text-left py-1 tracking-wider uppercase transition-colors ${
                    selectedCollection === col.slug ? 'text-[#0A0A0A] font-bold' : 'text-[#71717A] hover:text-[#0A0A0A]'
                  }`}
                >
                  {col.name}
                </button>
              ))}
            </div>
          </div>

          {/* Size Filter */}
          <div className="space-y-3 pb-6 border-b border-[#E4E4E7]">
            <h4 className="text-[10px] font-mono tracking-[0.15em] uppercase text-[#0A0A0A] font-semibold">SIZE MATRIX</h4>
            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={() => setSelectedSize('all')}
                className={`border text-[10px] font-mono px-3 py-1.5 transition-colors ${
                  selectedSize === 'all'
                    ? 'bg-[#0A0A0A] text-white border-[#0A0A0A]'
                    : 'border-[#E4E4E7] text-[#71717A] hover:border-[#0A0A0A] hover:text-[#0A0A0A]'
                }`}
              >
                ALL
              </button>
              {SIZES.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`border text-[10px] font-mono px-3 py-1.5 transition-colors ${
                    selectedSize === size
                      ? 'bg-[#0A0A0A] text-white border-[#0A0A0A]'
                      : 'border-[#E4E4E7] text-[#71717A] hover:border-[#0A0A0A] hover:text-[#0A0A0A]'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Color Filter */}
          <div className="space-y-3 pb-6 border-b border-[#E4E4E7]">
            <h4 className="text-[10px] font-mono tracking-[0.15em] uppercase text-[#0A0A0A] font-semibold">COLORWAY</h4>
            <div className="space-y-2">
              <button
                onClick={() => setSelectedColor('all')}
                className={`text-xs block py-1 uppercase tracking-wider ${
                  selectedColor === 'all' ? 'text-[#0A0A0A] font-bold' : 'text-[#71717A] hover:text-[#0A0A0A]'
                }`}
              >
                All Colors
              </button>
              {availableColors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setSelectedColor(c.name)}
                  className={`flex items-center gap-3 text-xs py-1 uppercase tracking-wider transition-colors ${
                    selectedColor === c.name ? 'text-[#0A0A0A] font-bold' : 'text-[#71717A] hover:text-[#0A0A0A]'
                  }`}
                >
                  <span
                    className="w-3 h-3 border border-[#E4E4E7] inline-block"
                    style={{ backgroundColor: c.hex }}
                  />
                  <span>{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-3 pb-6 border-b border-[#E4E4E7]">
            <div className="flex justify-between text-[10px] font-mono tracking-widest uppercase text-[#71717A]">
              <span>MAX PRICE</span>
              <span className="text-[#0A0A0A] font-bold">{formatKES(maxPrice)}</span>
            </div>
            <input
              type="range"
              min={0}
              max={10000}
              step={500}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#0A0A0A] bg-[#E4E4E7] h-0.5 appearance-none cursor-pointer"
            />
          </div>

          {/* In Stock Only Toggle */}
          <div className="pt-2">
            <label className="flex items-center gap-3 cursor-pointer text-[10px] font-mono tracking-widest uppercase text-[#71717A] hover:text-[#0A0A0A]">
              <input
                type="checkbox"
                checked={availabilityOnly}
                onChange={(e) => setAvailabilityOnly(e.target.checked)}
                className="w-4 h-4 accent-[#0A0A0A] border-[#E4E4E7]"
              />
              <span>In-Stock Pieces Only</span>
            </label>
          </div>
        </aside>

        {/* Product Grid Area */}
        <main className="lg:col-span-3">
          {filteredProducts.length === 0 ? (
            <div className="py-24 text-center space-y-4 border border-[#E4E4E7] p-12">
              <p className="text-[11px] font-mono font-bold tracking-[0.15em] uppercase text-[#0A0A0A]">
                NO PIECES FOUND
              </p>
              <p className="text-xs text-[#71717A] max-w-sm mx-auto">
                No items match your currently applied filters. Clear filters or adjust your price range.
              </p>
              <button
                onClick={resetFilters}
                className="mt-6 border border-[#0A0A0A] text-[#0A0A0A] px-6 py-3 text-[11px] font-mono font-bold tracking-[0.15em] uppercase hover:bg-[#0A0A0A] hover:text-white transition-colors"
              >
                RESET FILTERS
              </button>
            </div>
          ) : viewMode === 'list' ? (
            <div className="space-y-4">
              {filteredProducts.map((p) => (
                <div
                  key={p.id}
                  className="group flex flex-col sm:flex-row gap-6 p-4 border border-[#E4E4E7] transition-colors hover:border-[#0A0A0A]"
                >
                  <Link href={`/product/${p.slug}`} className="relative h-48 sm:h-40 w-full sm:w-32 shrink-0 overflow-hidden bg-[#F4F4F5]">
                    {p.images[0] && (
                      <Image src={p.images.find((image) => image.isPrimary)?.url || p.images[0].url} alt={p.name} fill sizes="128px" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                    )}
                  </Link>
                  <div className="flex-1 space-y-2 py-2">
                    <span className="text-[10px] font-mono text-[#71717A] uppercase tracking-wider">{p.sku}</span>
                    <Link href={`/product/${p.slug}`}><h3 className="text-lg font-bold uppercase tracking-wider text-[#0A0A0A] group-hover:text-[#71717A] transition-colors">{p.name}</h3></Link>
                    <p className="text-sm text-[#71717A] line-clamp-2 max-w-xl font-light">
                      {p.shortDescription}
                    </p>
                    <p className="text-[10px] font-mono tracking-wider text-[#A1A1AA] uppercase">
                      {p.material} • {p.fit}
                    </p>
                  </div>
                  <div className="sm:self-center sm:text-right shrink-0">
                    <p className="text-sm font-mono font-bold text-[#0A0A0A]">{formatKES(p.salePrice || p.price)}</p>
                    <Link href={`/product/${p.slug}`} className="mt-3 inline-block border-b border-[#0A0A0A] pb-0.5 text-[10px] font-mono font-bold tracking-[0.15em] uppercase text-[#0A0A0A] hover:text-[#71717A] hover:border-[#71717A] transition-colors">View piece</Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              className={`grid gap-4 sm:gap-6 ${
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
            className="fixed inset-0 bg-black/30 transition-opacity"
          />
          <div className="relative w-full max-w-xs bg-white border-r border-[#E4E4E7] p-6 overflow-y-auto text-[#0A0A0A] space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-[#E4E4E7]">
              <span className="text-[11px] font-mono tracking-[0.15em] font-bold uppercase text-[#0A0A0A]">FILTER CATALOG</span>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 text-[#71717A] hover:text-[#0A0A0A]"
              >
                <X size={16} />
              </button>
            </div>

            {/* Mobile Categories */}
            <div className="space-y-3 pb-6 border-b border-[#E4E4E7]">
              <h4 className="text-[10px] font-mono tracking-[0.15em] font-bold uppercase text-[#0A0A0A]">Categories</h4>
              <div className="space-y-2 text-xs uppercase tracking-wider">
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setMobileFilterOpen(false);
                  }}
                  className={`block w-full text-left ${
                    selectedCategory === 'all' ? 'text-[#0A0A0A] font-bold' : 'text-[#71717A]'
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
                    className={`block w-full text-left ${
                      selectedCategory === cat.slug ? 'text-[#0A0A0A] font-bold' : 'text-[#71717A]'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Collections */}
            <div className="space-y-3 pb-6 border-b border-[#E4E4E7]">
              <h4 className="text-[10px] font-mono tracking-[0.15em] font-bold uppercase text-[#0A0A0A]">Collections</h4>
              <div className="space-y-2 text-xs uppercase tracking-wider">
                <button
                  onClick={() => {
                    setSelectedCollection('all');
                    setMobileFilterOpen(false);
                  }}
                  className={`block w-full text-left ${
                    selectedCollection === 'all' ? 'text-[#0A0A0A] font-bold' : 'text-[#71717A]'
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
                    className={`block w-full text-left ${
                      selectedCollection === col.slug ? 'text-[#0A0A0A] font-bold' : 'text-[#71717A]'
                    }`}
                  >
                    {col.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Reset */}
            <div className="pt-4">
              <button
                onClick={() => {
                  resetFilters();
                  setMobileFilterOpen(false);
                }}
                className="w-full py-4 bg-[#0A0A0A] text-white text-[11px] font-mono font-bold tracking-[0.15em] uppercase hover:opacity-80 transition-opacity"
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
      <div className="pt-36 pb-32 px-6 text-center text-[10px] font-mono text-[#71717A] tracking-widest uppercase">
        LOADING ARCHIVE...
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}
