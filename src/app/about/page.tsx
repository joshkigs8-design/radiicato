'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <main className="pt-28 sm:pt-36 pb-32 px-5 sm:px-8 lg:px-12 bg-white min-h-screen">
      <div className="max-w-[1400px] mx-auto">
        <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#71717A] mb-3">BRAND MANIFESTO / GLOBAL ROOTS</p>
        <h1 className="text-display-md font-black uppercase mb-8">STREETWEAR FOR THE WORLD</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 pb-20 border-b border-[#E4E4E7]">
          <div className="space-y-6 text-sm text-[#71717A] leading-relaxed">
            <p>
              PESOS Worldwide is a global streetwear label built around movement, culture, and identity. We design for people who move through cities, scenes, and communities with attitude and intent.
            </p>
            <p>
              In a landscape saturated by disposable fashion, PESOS Worldwide exists to create pieces with presence: confident silhouettes, clean utility, and the kind of graphic language that feels immediate and genuine.
            </p>
            <p>
              Every drop is made to reflect the energy of the culture it comes from, blending hard-wearing materials, premium construction, and a visual language shaped by music, sport, and everyday rebellion.
            </p>
            <p>
              We don't follow trends from a single place—we build a worldwide point of view that travels with its wearer anywhere on earth.
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
            <h3 className="text-[11px] font-mono font-semibold tracking-wider uppercase text-[#0A0A0A]">01 / THE VISION</h3>
            <p className="text-sm text-[#71717A]">
              Built from a culture-first perspective. We reject generic fashion in favor of silhouettes that feel specific, confident, and unmistakably alive.
            </p>
          </div>
          <div className="space-y-3">
            <h3 className="text-[11px] font-mono font-semibold tracking-wider uppercase text-[#0A0A0A]">02 / CRAFT</h3>
            <p className="text-sm text-[#71717A]">
              Premium heavyweight fabrics, controlled drape, and disciplined construction designed to hold shape and presence through everyday wear.
            </p>
          </div>
          <div className="space-y-3">
            <h3 className="text-[11px] font-mono font-semibold tracking-wider uppercase text-[#0A0A0A]">03 / VISUAL LANGUAGE</h3>
            <p className="text-sm text-[#71717A]">
              Bold graphics, metallic accents, and cultural references that speak on a global scale without losing their edge.
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
