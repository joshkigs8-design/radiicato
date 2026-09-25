'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { ArrowLeft, Clock } from 'lucide-react';
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
      <div className="pt-36 pb-32 px-6 text-center max-w-lg mx-auto space-y-4 text-white font-sans">
        <h1 className="text-2xl font-bold uppercase text-white font-display">Collection Not Found</h1>
        <p className="text-xs text-white/60">This archival capsule does not exist or has been retired.</p>
        <Link 
          href="/collections" 
          className="inline-block px-6 py-3 glass-button text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-white hover:text-black transition-colors"
        >
          Back to Collections
        </Link>
      </div>
    );
  }

  // Get products for this collection
  const collectionProducts = products.filter(
    (p) => p.collectionId === collection.id || collection.productIds?.includes(p.id)
  );

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* Hero Banner */}
      <section className="relative min-h-[55vh] sm:min-h-[65vh] flex items-end pb-12 sm:pb-16 px-4 sm:px-8 lg:px-12 pt-28 sm:pt-36 overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 z-0">
          <Image
            src={collection.bannerImage || collection.coverImage}
            alt={collection.name}
            fill
            priority
            className="object-cover object-center brightness-[0.65] contrast-[1.05]"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-black/30" />
        </div>

        <div className="relative z-10 max-w-[1600px] w-full mx-auto space-y-4 sm:space-y-6">
          <Link
            href="/collections"
            className="inline-flex items-center gap-2 text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-white/70 hover:text-white transition-colors"
          >
            <ArrowLeft size={13} /> Back to All Collections
          </Link>

          <div className="max-w-3xl space-y-2 sm:space-y-3">
            <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.24em] uppercase text-white/60 block font-bold">
              CAPSULE SERIES // NAIROBI
            </span>
            <h1 className="pesos-text-face text-3xl sm:text-5xl lg:text-7xl font-bold uppercase tracking-[-0.04em] text-white">
              {collection.name}
            </h1>
            {collection.description && (
              <p className="text-xs sm:text-sm text-white/80 font-normal leading-relaxed max-w-xl">
                {collection.description}
              </p>
            )}
          </div>

          {/* Scheduled Drop Countdown Bar */}
          {collection.isScheduled && (
            <div className="p-4 sm:p-6 glass-card rounded-2xl border border-white/20 max-w-md mt-4 sm:mt-6 space-y-3 shadow-2xl">
              <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-white">
                <span className="flex items-center gap-2 font-bold">
                  <Clock size={13} /> DROP COUNTDOWN
                </span>
                <span className="text-white/60">OCTOBER 15, 2026</span>
              </div>

              <div className="grid grid-cols-4 gap-2 text-center pt-1">
                <div className="glass-pill p-2 sm:p-2.5 rounded-xl border border-white/10">
                  <div className="text-xl sm:text-2xl font-black font-mono text-white">{String(timeLeft.days).padStart(2, '0')}</div>
                  <div className="text-[8px] sm:text-[9px] font-mono text-white/60 uppercase">DAYS</div>
                </div>
                <div className="glass-pill p-2 sm:p-2.5 rounded-xl border border-white/10">
                  <div className="text-xl sm:text-2xl font-black font-mono text-white">{String(timeLeft.hours).padStart(2, '0')}</div>
                  <div className="text-[8px] sm:text-[9px] font-mono text-white/60 uppercase">HOURS</div>
                </div>
                <div className="glass-pill p-2 sm:p-2.5 rounded-xl border border-white/10">
                  <div className="text-xl sm:text-2xl font-black font-mono text-white">{String(timeLeft.minutes).padStart(2, '0')}</div>
                  <div className="text-[8px] sm:text-[9px] font-mono text-white/60 uppercase">MINS</div>
                </div>
                <div className="glass-pill p-2 sm:p-2.5 rounded-xl border border-white/10">
                  <div className="text-xl sm:text-2xl font-black font-mono text-white">{String(timeLeft.seconds).padStart(2, '0')}</div>
                  <div className="text-[8px] sm:text-[9px] font-mono text-white/60 uppercase">SECS</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Products in Collection */}
      <section className="py-12 sm:py-20 px-4 sm:px-8 lg:px-12 max-w-[1600px] mx-auto">
        <div className="flex justify-between items-baseline pb-5 sm:pb-6 border-b border-white/10 mb-8 sm:mb-12">
          <h2 className="text-[11px] sm:text-xs font-mono tracking-widest uppercase text-white/60 font-bold">
            PIECES IN THIS RELEASE ({collectionProducts.length})
          </h2>
          <span className="text-[10px] sm:text-xs font-mono text-white font-bold hidden sm:inline">ORIGINAL ARCHIVAL GARMENTS</span>
        </div>

        {collectionProducts.length === 0 ? (
          <div className="py-16 text-center text-white/60 space-y-3 glass-card rounded-2xl p-8">
            <p className="text-sm">No products currently assigned to this capsule.</p>
            <Link href="/shop" className="text-xs text-white underline uppercase tracking-wider font-semibold">
              Browse All Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
            {collectionProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
