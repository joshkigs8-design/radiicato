'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  SlidersHorizontal, LayoutGrid, Rows3, X, RotateCcw 
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
    <div className="pt-24 sm:pt-32 pb-24 px-4 sm:px-8 lg:px-12 max-w-[1600px] mx-auto min-h-screen text-white font-sans">
      {/* Editorial Header */}
      <div className="pb-8 sm:pb-10 border-b border-white/10 flex flex-col md:flex-row justify-between md:items-end gap-4">
        <div>
          <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.22em] uppercase text-white/50 font-bold block mb-1">
            ALL ARCHIVES // NAIROBI
          </span>
          <h1 className="pesos-text-face text-3xl sm:text-5xl lg:text-6xl font-bold uppercase tracking-[-0.04em] text-white">
            SHOP THE DROP
          </h1>
        </div>
        <p className="text-[11px] font-mono text-white/60 uppercase">
          SHOWING {filteredProducts.length} OF {products.length} ARCHIVAL PIECES
        </p>
      </div>

      {/* Control Toolbar (Search, Filter toggles, Layout & Sort) */}
      <div className="py-4 sm:py-6 border-b border-white/10 flex flex-wrap items-center justify-between gap-3 sm:gap-4">
        {/* Mobile Filter Button */}
        <button
          onClick={() => setMobileFilterOpen(true)}
          className="lg:hidden flex items-center gap-2 px-3.5 py-2 glass-button rounded-xl text-[10px] font-mono tracking-[0.14em] uppercase text-white"
        >
          <SlidersHorizontal size={13} />
          <span>FILTER ({filteredProducts.length})</span>
          {hasActiveFilters && (
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          )}
        </button>

        {/* Search within shop */}
        <div className="flex-1 max-w-xs">
          <input
            type="text"
            placeholder="FILTER BY KEYWORD / SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/15 rounded-xl px-3.5 py-2 text-[11px] uppercase tracking-wider text-white placeholder-white/40 focus:outline-none focus:border-white transition-colors"
          />
        </div>

        {/* View Mode & Sort (Desktop) */}
        <div className="flex items-center gap-3 sm:gap-6 ml-auto">
          {/* Sort Selector */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-white/50 uppercase tracking-[0.15em] hidden sm:inline">SORT BY:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#0a0a0a] border border-white/20 rounded-lg px-3 py-1.5 text-[11px] font-mono uppercase text-white focus:outline-none focus:border-white cursor-pointer"
            >
              <option value="featured" className="bg-black text-white">FEATURED</option>
              <option value="newest" className="bg-black text-white">NEW ARRIVALS</option>
              <option value="bestseller" className="bg-black text-white">BEST SELLERS</option>
              <option value="price-low" className="bg-black text-white">PRICE: LOW TO HIGH</option>
              <option value="price-high" className="bg-black text-white">PRICE: HIGH TO LOW</option>
            </select>
          </div>

          {/* Grid Toggle (Desktop) */}
          <div className="hidden sm:flex items-center gap-1.5">
            <button
              onClick={() => setViewMode('grid-4')}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'grid-4' ? 'bg-white text-black' : 'glass-button text-white/70 hover:text-white'
              }`}
              title="4-column grid"
            >
              <LayoutGrid size={15} />
            </button>
            <button
              onClick={() => setViewMode('grid-3')}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'grid-3' ? 'bg-white text-black' : 'glass-button text-white/70 hover:text-white'
              }`}
              title="3-column grid"
            >
              <LayoutGrid size={15} className="rotate-45" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'list' ? 'bg-white text-black' : 'glass-button text-white/70 hover:text-white'
              }`}
              title="Editorial list"
            >
              <Rows3 size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Layout (Desktop Sidebar Filters + Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-10 pt-8 sm:pt-10">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block lg:col-span-1 space-y-6 pr-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <span className="text-[11px] font-mono tracking-[0.16em] uppercase font-bold text-white">REFINE ARCHIVE</span>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-[10px] font-mono uppercase text-white/60 hover:text-white flex items-center gap-1 font-bold cursor-pointer"
              >
                <RotateCcw size={11} /> Reset
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="space-y-2 pb-5 border-b border-white/10">
            <h4 className="text-[10px] font-mono tracking-[0.16em] uppercase text-white/50 font-semibold">CATEGORIES</h4>
            <div className="space-y-1 text-xs">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`block w-full text-left py-1 tracking-wider uppercase transition-colors cursor-pointer ${
                  selectedCategory === 'all' ? 'text-white font-bold' : 'text-white/60 hover:text-white'
                }`}
              >
                All Silhouettes
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`block w-full text-left py-1 tracking-wider uppercase transition-colors cursor-pointer ${
                    selectedCategory === cat.slug ? 'text-white font-bold' : 'text-white/60 hover:text-white'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Collection Filter */}
          <div className="space-y-2 pb-5 border-b border-white/10">
            <h4 className="text-[10px] font-mono tracking-[0.16em] uppercase text-white/50 font-semibold">COLLECTIONS</h4>
            <div className="space-y-1 text-xs">
              <button
                onClick={() => setSelectedCollection('all')}
                className={`block w-full text-left py-1 tracking-wider uppercase transition-colors cursor-pointer ${
                  selectedCollection === 'all' ? 'text-white font-bold' : 'text-white/60 hover:text-white'
                }`}
              >
                All Collections
              </button>
              {collections.map((col) => (
                <button
                  key={col.id}
                  onClick={() => setSelectedCollection(col.slug)}
                  className={`block w-full text-left py-1 tracking-wider uppercase transition-colors cursor-pointer ${
                    selectedCollection === col.slug ? 'text-white font-bold' : 'text-white/60 hover:text-white'
                  }`}
                >
                  {col.name}
                </button>
              ))}
            </div>
          </div>

          {/* Size Filter */}
          <div className="space-y-2.5 pb-5 border-b border-white/10">
            <h4 className="text-[10px] font-mono tracking-[0.16em] uppercase text-white/50 font-semibold">SIZE MATRIX</h4>
            <div className="grid grid-cols-4 gap-1.5">
              <button
                onClick={() => setSelectedSize('all')}
                className={`rounded-lg text-[10px] font-mono px-2.5 py-1.5 transition-colors cursor-pointer ${
                  selectedSize === 'all'
                    ? 'bg-white text-black font-bold'
                    : 'glass-button text-white/70 hover:text-white'
                }`}
              >
                ALL
              </button>
              {SIZES.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`rounded-lg text-[10px] font-mono px-2.5 py-1.5 transition-colors cursor-pointer ${
                    selectedSize === size
                      ? 'bg-white text-black font-bold'
                      : 'glass-button text-white/70 hover:text-white'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Color Filter */}
          <div className="space-y-2 pb-5 border-b border-white/10">
            <h4 className="text-[10px] font-mono tracking-[0.16em] uppercase text-white/50 font-semibold">COLORWAY</h4>
            <div className="space-y-1.5">
              <button
                onClick={() => setSelectedColor('all')}
                className={`text-xs block py-1 uppercase tracking-wider cursor-pointer ${
                  selectedColor === 'all' ? 'text-white font-bold' : 'text-white/60 hover:text-white'
                }`}
              >
                All Colors
              </button>
              {availableColors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setSelectedColor(c.name)}
                  className={`flex items-center gap-2.5 text-xs py-1 uppercase tracking-wider transition-colors cursor-pointer ${
                    selectedColor === c.name ? 'text-white font-bold' : 'text-white/60 hover:text-white'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full border border-white/20 inline-block"
                    style={{ backgroundColor: c.hex }}
                  />
                  <span>{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-2 pb-5 border-b border-white/10">
            <div className="flex justify-between text-[10px] font-mono tracking-widest uppercase text-white/60">
              <span>MAX PRICE</span>
              <span className="text-white font-bold">{formatKES(maxPrice)}</span>
            </div>
            <input
              type="range"
              min={0}
              max={10000}
              step={500}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-white bg-white/20 h-1 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* In Stock Only Toggle */}
          <div className="pt-1">
            <label className="flex items-center gap-2.5 cursor-pointer text-[10px] font-mono tracking-widest uppercase text-white/70 hover:text-white">
              <input
                type="checkbox"
                checked={availabilityOnly}
                onChange={(e) => setAvailabilityOnly(e.target.checked)}
                className="w-3.5 h-3.5 accent-white rounded"
              />
              <span>In-Stock Pieces Only</span>
            </label>
          </div>
        </aside>

        {/* Product Grid Area */}
        <main className="lg:col-span-3">
          {filteredProducts.length === 0 ? (
            <div className="py-20 text-center space-y-4 glass-card rounded-2xl p-8 sm:p-12">
              <p className="text-[12px] font-mono font-bold tracking-[0.16em] uppercase text-white">
                NO PIECES FOUND
              </p>
              <p className="text-xs text-white/60 max-w-sm mx-auto">
                No garments match your currently applied filters. Clear filters or adjust your price range.
              </p>
              <button
                onClick={resetFilters}
                className="mt-4 glass-button text-white px-6 py-2.5 text-[11px] font-mono font-bold tracking-[0.14em] uppercase rounded-xl hover:bg-white hover:text-black transition-all cursor-pointer"
              >
                RESET FILTERS
              </button>
            </div>
          ) : viewMode === 'list' ? (
            <div className="space-y-3 sm:space-y-4">
              {filteredProducts.map((p) => (
                <div
                  key={p.id}
                  className="glass-card rounded-xl sm:rounded-2xl flex flex-col sm:flex-row gap-4 sm:gap-6 p-3 sm:p-4 group transition-colors"
                >
                  <Link href={`/product/${p.slug}`} className="relative h-44 sm:h-36 w-full sm:w-28 shrink-0 overflow-hidden bg-[#0a0a0a] rounded-lg border border-white/10">
                    {p.images[0] && (
                      <Image src={p.images.find((image) => image.isPrimary)?.url || p.images[0].url} alt={p.name} fill sizes="128px" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                    )}
                  </Link>
                  <div className="flex-1 space-y-1.5 py-1">
                    <span className="text-[10px] font-mono text-white/50 uppercase tracking-wider">{p.sku}</span>
                    <Link href={`/product/${p.slug}`}><h3 className="text-base font-bold uppercase tracking-wider text-white group-hover:opacity-70 transition-opacity">{p.name}</h3></Link>
                    <p className="text-xs text-white/70 line-clamp-2 max-w-xl font-light">
                      {p.shortDescription}
                    </p>
                    <p className="text-[10px] font-mono tracking-wider text-white/50 uppercase pt-1">
                      {p.material} • {p.fit}
                    </p>
                  </div>
                  <div className="sm:self-center sm:text-right shrink-0 pt-2 sm:pt-0">
                    <p className="text-sm font-mono font-bold text-white">{formatKES(p.salePrice || p.price)}</p>
                    <Link href={`/product/${p.slug}`} className="mt-2 inline-block glass-pill px-3 py-1 text-[10px] font-mono font-bold tracking-[0.14em] uppercase text-white hover:border-white transition-colors">
                      View piece →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              className={`grid gap-3 sm:gap-6 ${
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
            className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity"
          />
          <div className="relative w-full max-w-xs bg-[#0a0a0a]/95 backdrop-blur-2xl border-r border-white/15 p-6 overflow-y-auto text-white space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-white/10">
              <span className="text-[11px] font-mono tracking-[0.16em] font-bold uppercase text-white">FILTER CATALOG</span>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 text-white/60 hover:text-white rounded-full"
              >
                <X size={16} />
              </button>
            </div>

            {/* Mobile Categories */}
            <div className="space-y-2.5 pb-5 border-b border-white/10">
              <h4 className="text-[10px] font-mono tracking-[0.15em] font-bold uppercase text-white/50">Categories</h4>
              <div className="space-y-1.5 text-xs uppercase tracking-wider">
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setMobileFilterOpen(false);
                  }}
                  className={`block w-full text-left py-1 ${
                    selectedCategory === 'all' ? 'text-white font-bold' : 'text-white/60 hover:text-white'
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
                      selectedCategory === cat.slug ? 'text-white font-bold' : 'text-white/60 hover:text-white'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Collections */}
            <div className="space-y-2.5 pb-5 border-b border-white/10">
              <h4 className="text-[10px] font-mono tracking-[0.15em] font-bold uppercase text-white/50">Collections</h4>
              <div className="space-y-1.5 text-xs uppercase tracking-wider">
                <button
                  onClick={() => {
                    setSelectedCollection('all');
                    setMobileFilterOpen(false);
                  }}
                  className={`block w-full text-left py-1 ${
                    selectedCollection === 'all' ? 'text-white font-bold' : 'text-white/60 hover:text-white'
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
                      selectedCollection === col.slug ? 'text-white font-bold' : 'text-white/60 hover:text-white'
                    }`}
                  >
                    {col.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Apply */}
            <div className="pt-2">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-3.5 glass-button bg-white text-black text-[11px] font-mono font-bold tracking-[0.15em] uppercase rounded-xl hover:bg-white/90 transition-all shadow-xl"
              >
                APPLY & VIEW RESULTS
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
      <div className="pt-36 pb-32 px-6 text-center text-[10px] font-mono text-white/50 tracking-widest uppercase">
        LOADING ARCHIVE...
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}
