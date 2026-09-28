'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Clock, Sparkles } from 'lucide-react';

function ShopEditorialLanding() {
  // Live Drop Time & Countdown
  const [dropTime, setDropTime] = useState({ hours: 4, minutes: 28, seconds: 15 });
  const [currentTimeStr, setCurrentTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTimeStr(now.toLocaleTimeString('en-GB', { timeZone: 'Africa/Nairobi' }));
    };
    updateTime();
    const interval = setInterval(() => {
      updateTime();
      setDropTime((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 4, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="pt-24 sm:pt-32 pb-28 px-4 sm:px-8 lg:px-12 max-w-[1500px] mx-auto min-h-screen text-[#0A0A0A]">
      {/* Top Editorial Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-[#E4E4E7] text-[10px] sm:text-[11px] font-mono tracking-[0.2em] uppercase text-[#71717A]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>NAIROBI ATELIER TIME: {currentTimeStr || '12:00:00'} EAT</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={13} className="text-[#0A0A0A]" />
          <span>
            DROP LIVE · CLOSES IN {String(dropTime.hours).padStart(2, '0')}:
            {String(dropTime.minutes).padStart(2, '0')}:
            {String(dropTime.seconds).padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Hero Visual / Editorial Collection Introduction */}
      <div className="relative w-full rounded-2xl overflow-hidden border border-[#E4E4E7] bg-black text-white shadow-xl">
        {/* Large Editorial Imagery */}
        <div className="relative w-full aspect-[16/10] sm:aspect-[21/9] lg:aspect-[2.4/1] min-h-[460px] sm:min-h-[540px]">
          <Image
            src="/images/broken-record.jpg"
            alt="Radiicato Early 2026 Collection Editorial"
            fill
            priority
            className="object-cover object-center opacity-85 brightness-[0.75] transition-transform duration-1000 hover:scale-[1.02]"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/20" />

          {/* Centered Editorial Overlay */}
          <div className="absolute inset-0 p-6 sm:p-12 lg:p-16 flex flex-col justify-end items-center text-center max-w-4xl mx-auto space-y-5 sm:space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[10px] sm:text-xs font-mono tracking-[0.25em] uppercase text-zinc-300">
              <Sparkles size={12} className="text-white" />
              <span>DEBUT RELEASE // NAIROBI ATELIER</span>
            </div>

            <h1 className="pesos-text-face text-[clamp(32px,6.5vw,84px)] font-black uppercase tracking-[-0.03em] leading-[0.9] text-white">
              EARLY 2026 COLLECTION
            </h1>

            <p className="text-xs sm:text-sm md:text-base font-mono uppercase tracking-[0.14em] text-zinc-300 max-w-2xl leading-relaxed">
              INDEPENDENT LUXURY STREETWEAR ENGINEERED IN NAIROBI. THE INAUGURAL STATEMENT UNITING BROKEN RECORD, WE ARE WHO WE ARE, AND SIGNATURE SKULL CAPS.
            </p>

            {/* Prominent SHOP NOW Button */}
            <div className="pt-3 sm:pt-4">
              <Link
                href="/collections/early-2026"
                className="inline-flex items-center justify-center gap-3 px-10 sm:px-14 py-4 sm:py-5 bg-white text-black hover:bg-zinc-200 text-xs sm:text-sm font-mono font-bold uppercase tracking-[0.22em] rounded-xl transition-all shadow-2xl hover:scale-[1.02]"
              >
                <span>SHOP NOW</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Curated Edits Vignette Inside Early 2026 Collection */}
      <div className="mt-12 sm:mt-16 pt-8 border-t border-[#E4E4E7]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#71717A] font-bold block mb-1">
              INSIDE THE COLLECTION
            </span>
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-[#0A0A0A]">
              3 CURATED EDITS · 1 UNIFIED DROP
            </h2>
          </div>
          <Link
            href="/collections/early-2026"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#0A0A0A] hover:opacity-60 transition-opacity font-bold"
          >
            <span>ENTER COLLECTION</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Edit 01 */}
          <Link
            href="/collections/early-2026?capsule=broken-record"
            className="group block p-4 sm:p-5 rounded-2xl border border-[#E4E4E7] bg-[#FAFAFA] hover:border-[#0A0A0A] transition-all"
          >
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-4 bg-[#F4F4F5]">
              <Image
                src="/images/products/broken-record-front.jpg"
                alt="Broken Record Edit"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            <span className="text-[10px] font-mono tracking-widest uppercase text-[#71717A] block">
              EDIT 01 // 3 PIECES
            </span>
            <h3 className="text-base font-black uppercase text-[#0A0A0A] mt-1 group-hover:text-black">
              BROKEN RECORD
            </h3>
            <p className="text-xs text-[#71717A] mt-1.5 font-mono line-clamp-2">
              Heavyweight 280 GSM combed cotton with 3D chrome medallion and shattered MF DOOM vinyl tracklist reverse.
            </p>
          </Link>

          {/* Edit 02 */}
          <Link
            href="/collections/early-2026?capsule=we-are-who-we-are"
            className="group block p-4 sm:p-5 rounded-2xl border border-[#E4E4E7] bg-[#FAFAFA] hover:border-[#0A0A0A] transition-all"
          >
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-4 bg-[#F4F4F5]">
              <Image
                src="/images/products/we-are-who-we-are-front.jpg"
                alt="We Are Who We Are Edit"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            <span className="text-[10px] font-mono tracking-widest uppercase text-[#71717A] block">
              EDIT 02 // 3 PIECES
            </span>
            <h3 className="text-base font-black uppercase text-[#0A0A0A] mt-1 group-hover:text-black">
              WE ARE WHO WE ARE
            </h3>
            <p className="text-xs text-[#71717A] mt-1.5 font-mono line-clamp-2">
              Raw Nairobi street culture and expressive lettering cut for creatives who refuse to conform.
            </p>
          </Link>

          {/* Edit 03 */}
          <Link
            href="/collections/early-2026?capsule=skull-caps"
            className="group block p-4 sm:p-5 rounded-2xl border border-[#E4E4E7] bg-[#FAFAFA] hover:border-[#0A0A0A] transition-all"
          >
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-4 bg-[#F4F4F5]">
              <Image
                src="/images/products/radiicato-skull-cap-black.jpg"
                alt="Skull Caps Edit"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            <span className="text-[10px] font-mono tracking-widest uppercase text-[#71717A] block">
              EDIT 03 // 3 COLOURWAYS
            </span>
            <h3 className="text-base font-black uppercase text-[#0A0A0A] mt-1 group-hover:text-black">
              SIGNATURE SKULL CAPS
            </h3>
            <p className="text-xs text-[#71717A] mt-1.5 font-mono line-clamp-2">
              Form-fitting contoured knit in Onyx Black, Slate Grey, and Midnight Camo with liquid chrome insignia.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="pt-36 pb-32 px-6 text-center text-[10px] font-mono text-[#71717A] tracking-widest uppercase">
          LOADING DROP...
        </div>
      }
    >
      <ShopEditorialLanding />
    </Suspense>
  );
}
