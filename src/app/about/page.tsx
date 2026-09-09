'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="pt-28 sm:pt-36 pb-32 px-6 sm:px-12 max-w-[1400px] mx-auto min-h-screen bg-white">
      {/* Editorial Manifesto Header */}
      <div className="max-w-4xl space-y-6 pb-16 border-b border-[#E4E4E7]">
        <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#4D5936] font-bold">
          BRAND MANIFESTO / NAIROBI ROOTS
        </span>
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-[#0A0A0A] font-display leading-[0.95]">
          WEAR THE DIFFERENCE.
        </h1>
        <p className="text-lg sm:text-xl text-[#71717A] font-light leading-relaxed">
          Radiicato is an independent streetwear atelier established in Nairobi, Kenya. We exist at the intersection of non-conformist rebellion, architectural silhouettes, and heavyweight textile craftsmanship.
        </p>
      </div>

      {/* Narrative Section 1 with Real Founder Image */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 py-20 items-center border-b border-[#E4E4E7]">
        <div className="lg:col-span-6 relative aspect-[3/4] sm:aspect-[4/5] bg-[#0A0A0A] overflow-hidden border border-[#E4E4E7] shadow-lg group">
          <Image
            src="/owner.jpg"
            alt="Radiicato Founder & Creative Director on Nairobi Rooftop"
            fill
            className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <span className="text-[10px] font-mono tracking-widest uppercase bg-[#4D5936] px-2 py-0.5 font-bold">
              FOUNDER & CREATIVE DIRECTOR
            </span>
            <p className="text-xs font-mono text-zinc-300 mt-1">NAIROBI HQ // SKYLINE ATELIER</p>
          </div>
        </div>
        <div className="lg:col-span-6 space-y-6 lg:pl-6">
          <span className="text-xs font-mono text-[#4D5936] uppercase font-bold">01 / THE VISION &amp; FOUNDER</span>
          <h2 className="text-2xl sm:text-4xl font-black uppercase text-[#0A0A0A] font-display">
            BUILT FROM RAW PASSION ON NAIROBI ROOFTOPS
          </h2>
          <div className="space-y-4 text-sm text-[#71717A] leading-relaxed font-light">
            <p>
              In an era dominated by fleeting algorithms and flimsy disposable garments, Radiicato was founded by a visionary creative in Nairobi who refused to conform to generic fast-fashion templates.
            </p>
            <p>
              Standing atop Nairobi&apos;s skyline, every Radiicato garment is born out of genuine underground culture: drop shoulders, structured double-layered collars, heavyweight 280 GSM combed organic cotton, and hand-finished 3D liquid chrome hardware.
            </p>
            <p>
              We don&apos;t chase international trends—we define them right here from Kenya, proving that raw African streetwear holds undeniable presence anywhere on earth.
            </p>
          </div>
        </div>
      </div>

      {/* Narrative Section 2: Nairobi Roots */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 py-20 items-center border-b border-[#E4E4E7]">
        <div className="lg:col-span-6 lg:order-2 relative aspect-[4/5] bg-[#F4F4F5] overflow-hidden border border-[#E4E4E7]">
          <Image
            src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=1200"
            alt="Nairobi Street Culture"
            fill
            className="object-cover filter contrast-105"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
        <div className="lg:col-span-6 lg:order-1 space-y-6 lg:pr-6">
          <span className="text-xs font-mono text-[#71717A] uppercase font-bold">02 / ORIGIN</span>
          <h2 className="text-2xl sm:text-4xl font-black uppercase text-[#0A0A0A] font-display">
            BRED IN THE UNDERGROUND OF NAIROBI
          </h2>
          <div className="space-y-4 text-sm text-[#71717A] leading-relaxed font-light">
            <p>
              Nairobi is one of the world’s most dynamic creative hubs—a city alive with sound system culture, underground visual arts, and rebellious individuality. Radiicato channels this raw energy into every graphic screen-print and metallic hardware detail.
            </p>
            <p>
              From our studio in Parklands, we oversee every phase of production: custom yarn milling, garment dye baths, hand-distressing, and precision screen-printing.
            </p>
          </div>
        </div>
      </div>

      {/* CTAs */}
      <div className="pt-20 text-center space-y-6">
        <h3 className="text-2xl sm:text-3xl font-black uppercase text-[#0A0A0A] font-display">
          DISCOVER THE CURRENT ARCHIVE
        </h3>
        <div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-3 bg-[#0A0A0A] text-white px-8 py-4 text-xs font-bold tracking-[0.2em] uppercase hover:bg-[#27272A] transition-colors shadow-md"
          >
            <span>SHOP THE COLLECTION</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
