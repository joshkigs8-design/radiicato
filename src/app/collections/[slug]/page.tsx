'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useSearchParams } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useStore } from '@/lib/use-store';
import { ProductCard } from '@/components/product/ProductCard';
import { isLegacySkullCapProduct } from '@/lib/utils';
import { Product } from '@/types';

type EditKey = 'all' | 'broken-record' | 'we-are-who-we-are' | 'skull-caps';

interface EditGroup {
  id: EditKey;
  number: string;
  name: string;
  tagline: string;
  description: string;
  bannerImage: string;
  filterFn: (p: Product) => boolean;
}

const EDITS: EditGroup[] = [
  {
    id: 'broken-record',
    number: '01',
    name: 'BROKEN RECORD',
    tagline: 'HEAVYWEIGHT COMBED COTTON · 3D CHROME BADGE · SHATTERED VINYL REVERSE',
    description: 'Cut from heavyweight 280 GSM combed organic cotton in an architectural relaxed streetwear silhouette. The reverse commands attention with an intricate shattered MF DOOM vinyl record graphic honoring underground sound culture.',
    bannerImage: '/images/broken-record.jpg',
    filterFn: (p: Product) => p.slug.includes('broken-record') || p.id.includes('broken-record'),
  },
  {
    id: 'we-are-who-we-are',
    number: '02',
    name: 'WE ARE WHO WE ARE',
    tagline: 'NAIROBI STREET CULTURE · HAND-LETTERED TYPOGRAPHY · UNCOMPROMISING DRAPE',
    description: 'Raw Nairobi street culture and uncompromising streetwear silhouette. Cut from heavyweight deep onyx fleece and organic cotton, designed locally for creatives who refuse to blend in.',
    bannerImage: '/images/products/we-are-who-we-are-front.jpg',
    filterFn: (p: Product) => p.slug.includes('we-are-who-we-are') || p.id.includes('we-are-who-we-are'),
  },
  {
    id: 'skull-caps',
    number: '03',
    name: 'SIGNATURE SKULL CAPS',
    tagline: 'CONTOURED RIBBED KNIT · LIQUID CHROME SCRIPT INSIGNIA · THREE COLORWAYS',
    description: 'Engineered for the cold Nairobi sets. Cut from heavyweight stretch ribbing that hugs the head securely without slippage. Available in Onyx Black, Slate Grey, and Midnight Camo.',
    bannerImage: '/images/skull-cap-model.jpg',
    filterFn: (p: Product) => p.slug.includes('skull-cap') || p.id.includes('skull-cap'),
  },
];

function CollectionView() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params.slug as string;
  const initialEdit: EditKey = (searchParams.get('capsule') as EditKey) || 'all';

  const { getCollectionBySlug, products } = useStore();
  const [activeEdit, setActiveEdit] = useState<EditKey>(initialEdit);

  useEffect(() => {
    const qCapsule = searchParams.get('capsule') as EditKey;
    if (qCapsule && ['all', 'broken-record', 'we-are-who-we-are', 'skull-caps'].includes(qCapsule)) {
      setActiveEdit(qCapsule);
    }
  }, [searchParams]);

  const collection = getCollectionBySlug(slug) || {
    id: 'col-early-2026',
    name: 'EARLY 2026 COLLECTION',
    slug: 'early-2026',
    description: 'The debut unified collection engineered in Nairobi. Uniting the Broken Record White Capsule, the We Are Who We Are Black Capsule, and the Signature Form-Fitting Skull Caps.',
    bannerImage: '/images/broken-record.jpg',
    coverImage: '/images/owner_editorial.jpg',
  };

  // Valid storefront products (excluding legacy duplicate skull cap cards)
  const allProducts = products.filter((p) => !isLegacySkullCapProduct(p));

  // Partition into the three edits
  const brokenRecordProducts = allProducts.filter(EDITS[0].filterFn);
  const weAreProducts = allProducts.filter(EDITS[1].filterFn);
  const skullCapProducts = allProducts.filter(EDITS[2].filterFn);

  if (activeEdit === 'all') {
    return (
      <div className="min-h-screen bg-[#090909] text-white px-4 pb-20 pt-28 sm:px-8 sm:pt-36 lg:px-12">
        <main className="mx-auto max-w-[1400px]">
          <header className="mb-10 max-w-3xl sm:mb-14">
            <Link
              href="/shop"
              className="mb-8 inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-white/55 transition-colors hover:text-white sm:mb-12"
            >
              <ArrowLeft size={14} /> Back to Shop
            </Link>
            <span className="mb-3 block text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-white/50">
              RADIICATO // DEBUT LAUNCH
            </span>
            <h1 className="pesos-text-face text-[clamp(38px,7vw,88px)] font-black leading-[0.9] text-white">
              EARLY 2026 COLLECTION
            </h1>
            <p className="mt-5 max-w-2xl text-xs font-mono uppercase leading-relaxed tracking-[0.14em] text-white/60 sm:text-sm">
              THREE CURATED EDITS ENGINEERED IN NAIROBI. CHOOSE THE WORLD YOU WANT TO ENTER.
            </p>
          </header>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {EDITS.map((edit) => (
              <Link
                key={edit.id}
                href={`/collections/${slug}?capsule=${edit.id}`}
                className="group relative isolate min-h-[520px] overflow-hidden rounded-[2px] border border-white/20 bg-white/[0.04] shadow-[0_18px_50px_rgba(0,0,0,0.35)] transition-colors duration-500 hover:border-white/40 focus-visible:border-white sm:min-h-[600px]"
              >
                <Image
                  src={edit.bannerImage}
                  alt={edit.name}
                  fill
                  className="-z-20 object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  sizes="(max-width: 767px) 100vw, 33vw"
                />
                <div className="absolute inset-0 -z-10 bg-black/35 transition-colors duration-500 group-hover:bg-black/25" />
                <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black via-black/35 to-black/10" />

                <div className="absolute inset-x-4 bottom-4 border border-white/20 bg-black/35 p-5 backdrop-blur-xl transition-transform duration-500 group-hover:-translate-y-1 sm:inset-x-5 sm:bottom-5 sm:p-6">
                  <span className="mb-4 block text-[10px] font-mono uppercase tracking-[0.25em] text-white/60">
                    EDIT {edit.number}
                  </span>
                  <h2 className="pesos-text-face max-w-[12ch] text-3xl font-black leading-[0.9] text-white sm:text-4xl">
                    {edit.id === 'skull-caps' ? 'SKULL CAPS' : edit.name}
                  </h2>
                  <span className="mt-8 flex items-center justify-between border-t border-white/20 pt-4 text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-white/75">
                    View edit
                    <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-[#0A0A0A]">
      {/* Hero Banner */}
      <section className="relative min-h-[50vh] sm:min-h-[60vh] flex items-end pb-12 sm:pb-16 px-4 sm:px-8 lg:px-12 pt-28 sm:pt-36 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={collection.bannerImage || collection.coverImage || '/images/broken-record.jpg'}
            alt="EARLY 2026 COLLECTION"
            fill
            priority
            className="object-cover object-center brightness-[0.55]"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-transparent" />
        </div>

        <div className="relative z-10 max-w-[1400px] w-full mx-auto space-y-4 sm:space-y-6">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-[10px] sm:text-xs font-mono uppercase tracking-[0.2em] text-zinc-300 hover:text-white transition-colors"
          >
            <ArrowLeft size={14} /> Back to Shop
          </Link>

          <div className="max-w-3xl space-y-3 sm:space-y-4">
            <span className="text-[10px] sm:text-xs font-mono tracking-[0.3em] uppercase text-zinc-300 block font-bold">
              RADIICATO // DEBUT LAUNCH
            </span>
            <h1 className="pesos-text-face text-[clamp(32px,6vw,76px)] font-black uppercase text-white leading-tight">
              EARLY 2026 COLLECTION
            </h1>
            <p className="text-xs sm:text-sm text-zinc-300 font-mono uppercase tracking-[0.14em] leading-relaxed max-w-2xl">
              THREE CURATED EDITS ENGINEERED IN NAIROBI. BROKEN RECORD, WE ARE WHO WE ARE, AND SIGNATURE SKULL CAPS.
            </p>
          </div>
        </div>
      </section>

      {/* Curation Filter Bar */}
      <div className="sticky top-[var(--navbar-height)] z-30 bg-white/95 backdrop-blur-md border-b border-[#E4E4E7] py-4 px-4 sm:px-8 lg:px-12">
        <div className="max-w-[1400px] mx-auto flex flex-wrap items-center justify-between gap-3">
          <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#71717A] font-bold">
            CURATED EDITS
          </span>

          <div className="flex flex-wrap gap-2">
            {EDITS.map((edit) => (
              <button
                key={edit.id}
                onClick={() => setActiveEdit(edit.id)}
                className={`px-4 py-2 rounded-lg text-xs font-mono uppercase tracking-wider transition-all ${
                  activeEdit === edit.id
                    ? 'bg-[#0A0A0A] text-white font-bold shadow-sm'
                    : 'bg-[#F4F4F5] text-[#71717A] hover:bg-[#E4E4E7] hover:text-[#0A0A0A]'
                }`}
              >
                {edit.number} {edit.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="py-12 sm:py-20 px-4 sm:px-8 lg:px-12 max-w-[1400px] mx-auto space-y-20 sm:space-y-28">
        {/* EDIT 01: BROKEN RECORD */}
        {activeEdit === 'broken-record' && (
          <section id="edit-broken-record" className="space-y-8">
            {/* Edit Editorial Header */}
            <div className="border-b border-[#E4E4E7] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-[#71717A] font-bold block">
                  EDIT 01 // 3 PIECES
                </span>
                <h2 className="pesos-text-face text-3xl sm:text-4xl font-black uppercase text-[#0A0A0A]">
                  BROKEN RECORD
                </h2>
                <p className="text-xs font-mono uppercase tracking-[0.14em] text-[#71717A] max-w-2xl">
                  {EDITS[0].tagline}
                </p>
              </div>
              <p className="text-xs text-[#71717A] max-w-md font-mono hidden lg:block leading-relaxed">
                {EDITS[0].description}
              </p>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {brokenRecordProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}

        {/* EDIT 02: WE ARE WHO WE ARE */}
        {activeEdit === 'we-are-who-we-are' && (
          <section id="edit-we-are-who-we-are" className="space-y-8">
            {/* Edit Editorial Header */}
            <div className="border-b border-[#E4E4E7] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-[#71717A] font-bold block">
                  EDIT 02 // 3 PIECES
                </span>
                <h2 className="pesos-text-face text-3xl sm:text-4xl font-black uppercase text-[#0A0A0A]">
                  WE ARE WHO WE ARE
                </h2>
                <p className="text-xs font-mono uppercase tracking-[0.14em] text-[#71717A] max-w-2xl">
                  {EDITS[1].tagline}
                </p>
              </div>
              <p className="text-xs text-[#71717A] max-w-md font-mono hidden lg:block leading-relaxed">
                {EDITS[1].description}
              </p>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {weAreProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}

        {/* EDIT 03: SIGNATURE SKULL CAPS */}
        {activeEdit === 'skull-caps' && (
          <section id="edit-skull-caps" className="space-y-8">
            {/* Edit Editorial Header */}
            <div className="border-b border-[#E4E4E7] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-[#71717A] font-bold block">
                  EDIT 03 // 3 COLOURWAYS
                </span>
                <h2 className="pesos-text-face text-3xl sm:text-4xl font-black uppercase text-[#0A0A0A]">
                  SIGNATURE SKULL CAPS
                </h2>
                <p className="text-xs font-mono uppercase tracking-[0.14em] text-[#71717A] max-w-2xl">
                  {EDITS[2].tagline}
                </p>
              </div>
              <p className="text-xs text-[#71717A] max-w-md font-mono hidden lg:block leading-relaxed">
                {EDITS[2].description}
              </p>
            </div>

            {/* Product Grid: 1 Skull Cap Product Card with 3 Colorway Swatches */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-md sm:max-w-none">
              {skullCapProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}

        {/* Return to All Filter Button if filtered */}
        <div className="text-center pt-8 border-t border-[#E4E4E7]">
          <button
            onClick={() => setActiveEdit('all')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#0A0A0A] text-white text-xs font-mono uppercase tracking-widest rounded-lg hover:bg-[#27272A] transition-colors"
          >
            <ArrowLeft size={14} /> View All Edits In Collection
          </button>
        </div>
      </main>
    </div>
  );
}

export default function SingleCollectionPage() {
  return (
    <Suspense
      fallback={
        <div className="pt-36 pb-32 px-6 text-center text-[10px] font-mono text-[#71717A] tracking-widest uppercase">
          LOADING COLLECTION...
        </div>
      }
    >
      <CollectionView />
    </Suspense>
  );
}
