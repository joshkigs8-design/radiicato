'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <main className="pt-28 sm:pt-36 pb-32 px-5 sm:px-8 lg:px-12 bg-white min-h-screen">
      <div className="max-w-[1400px] mx-auto">
        <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#71717A] mb-3">BRAND MANIFESTO / NAIROBI ROOTS</p>
        <h1 className="text-display-md font-black uppercase mb-8">ENGINEERED IN NAIROBI</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 pb-20 border-b border-[#E4E4E7]">
          <div className="space-y-6 text-sm text-[#71717A] leading-relaxed">
            <p>
              Radiicato is an independent streetwear atelier established in Nairobi, Kenya. We exist at the intersection of non-conformist rebellion, architectural silhouettes, and heavyweight textile craftsmanship.
            </p>
            <p>
              In an era dominated by fleeting algorithms and flimsy disposable garments, Radiicato was founded by a visionary creative in Nairobi who refused to conform to generic fast-fashion templates.
            </p>
            <p>
              Standing atop Nairobi's skyline, every Radiicato garment is born out of genuine underground culture: drop shoulders, structured double-layered collars, heavyweight 280 GSM combed organic cotton, and hand-finished 3D liquid chrome hardware.
            </p>
            <p>
              We don't chase international trends—we define them right here from Kenya, proving that raw African streetwear holds undeniable presence anywhere on earth.
            </p>
          </div>
          <div className="relative aspect-[3/4] bg-[#F4F4F5] border border-[#E4E4E7]">
            <Image
              src="/images/products/broken-record-full.jpg"
              alt="Radiicato Founder & Creative Director on Nairobi Rooftop"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-20 border-b border-[#E4E4E7]">
          <div className="space-y-3">
            <h3 className="text-[11px] font-mono font-semibold tracking-wider uppercase text-[#0A0A0A]">01 / THE VISION & FOUNDER</h3>
            <p className="text-sm text-[#71717A]">
              Built from raw passion on Nairobi rooftops. We refuse fast-fashion dilution. Cut for creatives who refuse to conform.
            </p>
          </div>
          <div className="space-y-3">
            <h3 className="text-[11px] font-mono font-semibold tracking-wider uppercase text-[#0A0A0A]">02 / HEAVYWEIGHT CRAFT</h3>
            <p className="text-sm text-[#71717A]">
              280 GSM combed organic cotton. Drop shoulders. Structured double-layered collars. Unapologetic silhouettes engineered for longevity.
            </p>
          </div>
          <div className="space-y-3">
            <h3 className="text-[11px] font-mono font-semibold tracking-wider uppercase text-[#0A0A0A]">03 / LIQUID CHROME</h3>
            <p className="text-sm text-[#71717A]">
              Hand-finished 3D hardware. Every garment is an architectural statement designed to disrupt the global streetwear landscape.
            </p>
          </div>
        </div>

        <div className="pt-20 text-center">
          <Link
            href="/shop"
            className="btn-primary"
          >
            SHOP COLLECTION
          </Link>
        </div>
      </div>
    </main>
  );
}
