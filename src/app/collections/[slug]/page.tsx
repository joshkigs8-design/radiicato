'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, notFound } from 'next/navigation';
import { ArrowLeft, Clock, ShieldCheck, Sparkles } from 'lucide-react';
import { useStore } from '@/lib/use-store';
import { ProductCard } from '@/components/product/ProductCard';

export default function SingleCollectionPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { getCollectionBySlug, products } = useStore();

  const collection = getCollectionBySlug(slug);

  // Drop countdown state
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 3,
    hours: 12,
    minutes: 45,
    seconds: 30,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!collection) {
    return (
      <div className="pt-36 pb-32 px-6 text-center max-w-lg mx-auto space-y-4">
        <h1 className="text-2xl font-bold uppercase text-[#0A0A0A] font-display">Collection Not Found</h1>
        <p className="text-xs text-[#71717A]">This archival capsule does not exist or has been retired.</p>
        <Link 
          href="/collections" 
          className="inline-block px-6 py-3 bg-[#0A0A0A] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#27272A] transition-colors"
        >
          Back to Collections
        </Link>
      </div>
    );
  }

  // Get products for this collection
  const collectionProducts = products.filter(
    (p) => p.collectionId === collection.id || collection.productIds.includes(p.id)
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner */}
      <section className="relative min-h-[60vh] flex items-end pb-16 px-5 sm:px-8 lg:px-12 pt-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={collection.bannerImage || collection.coverImage}
            alt={collection.name}
            fill
            priority
            className="object-cover object-center brightness-[0.7]"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </div>

        <div className="relative z-10 max-w-[1400px] w-full mx-auto space-y-6">
          <Link
            href="/collections"
            className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-zinc-300 hover:text-white transition-colors"
          >
            <ArrowLeft size={14} /> Back to All Collections
          </Link>

          <div className="max-w-3xl space-y-4">
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-white/60 block font-bold">
              CAPSULE SERIES
            </span>
            <h1 className="text-display-lg font-black uppercase text-white">
              {collection.name}
            </h1>
            <p className="text-sm text-white/80 font-light leading-relaxed max-w-xl">
              {collection.description}
            </p>
          </div>

          {/* Scheduled Drop Countdown Bar */}
          {collection.isScheduled && (
            <div className="p-6 bg-black/80 border border-white/10 max-w-md mt-6 space-y-3 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-widest text-white flex items-center gap-2 font-bold">
                  <Clock size={14} /> UPCOMING DROP COUNTDOWN
                </span>
                <span className="text-[10px] font-mono text-zinc-300">OCTOBER 15, 2026</span>
              </div>

              <div className="grid grid-cols-4 gap-2 text-center pt-2">
                <div className="bg-white/10 p-2.5 border border-white/10">
                  <div className="text-2xl font-black font-mono text-white">{String(timeLeft.days).padStart(2, '0')}</div>
                  <div className="text-[9px] font-mono text-zinc-300 uppercase">DAYS</div>
                </div>
                <div className="bg-white/10 p-2.5 border border-white/10">
                  <div className="text-2xl font-black font-mono text-white">{String(timeLeft.hours).padStart(2, '0')}</div>
                  <div className="text-[9px] font-mono text-zinc-300 uppercase">HOURS</div>
                </div>
                <div className="bg-white/10 p-2.5 border border-white/10">
                  <div className="text-2xl font-black font-mono text-white">{String(timeLeft.minutes).padStart(2, '0')}</div>
                  <div className="text-[9px] font-mono text-zinc-300 uppercase">MINS</div>
                </div>
                <div className="bg-white/10 p-2.5 border border-white/10">
                  <div className="text-2xl font-black font-mono text-white">{String(timeLeft.seconds).padStart(2, '0')}</div>
                  <div className="text-[9px] font-mono text-zinc-300 uppercase">SECS</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Products in Collection */}
      <section className="py-20 px-5 sm:px-8 lg:px-12 max-w-[1400px] mx-auto">
        <div className="flex justify-between items-center pb-8 border-b border-[#E4E4E7] mb-12">
          <h2 className="text-xs font-mono tracking-widest uppercase text-[#71717A] font-bold">
            PIECES IN THIS RELEASE ({collectionProducts.length})
          </h2>
          <span className="text-xs font-mono text-[#0A0A0A] font-bold">ORIGINAL ARCHIVAL GARMENTS</span>
        </div>

        {collectionProducts.length === 0 ? (
          <div className="py-20 text-center text-[#71717A] space-y-3">
            <p className="text-sm">No products currently assigned to this capsule.</p>
            <Link href="/shop" className="text-xs text-[#0A0A0A] underline uppercase tracking-wider font-semibold">
              Browse All Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {collectionProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
