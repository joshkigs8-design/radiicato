'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <main className="pt-28 sm:pt-36 pb-32 px-5 sm:px-8 lg:px-12 bg-white min-h-screen">
      <div className="max-w-[1400px] mx-auto">
        <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#71717A] mb-3">BRAND MANIFESTO / AFRICAN IDENTITY</p>
        <h1 className="text-display-md font-black uppercase mb-8">ABOUT RADIICATO</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 pb-20 border-b border-[#E4E4E7]">
          <div className="space-y-6 text-sm text-[#71717A] leading-relaxed">
            <h2 className="text-xl font-black uppercase tracking-tight text-[#0A0A0A]">
              RADIICATO IS MORE THAN CLOTHING.<br />IT&apos;S IDENTITY.
            </h2>
            <p>
              Born from the streets and inspired by African culture, Radiicato is a streetwear brand created for those who choose to stand apart.
            </p>
            <p>
              We believe what you wear should say something about who you are — your roots, your mindset, your journey, and the people you belong to.
            </p>
            <p>
              Radiicato blends modern street culture with African identity to create pieces that feel familiar yet different. Every collection carries a story, built around belonging, identity, and individuality.
            </p>
            <p>
              We&apos;re not here to follow every trend. We&apos;re here to create our own language.
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
            <h3 className="text-[11px] font-mono font-semibold tracking-wider uppercase text-[#0A0A0A]">01 / WEAR YOUR STORY</h3>
            <p className="text-sm text-[#71717A]">
              Your roots, your mindset, your journey, and the people you belong to.
            </p>
          </div>
          <div className="space-y-3">
            <h3 className="text-[11px] font-mono font-semibold tracking-wider uppercase text-[#0A0A0A]">02 / KNOW YOUR ROOTS</h3>
            <p className="text-sm text-[#71717A]">
              Modern street culture shaped by African identity and built around belonging.
            </p>
          </div>
          <div className="space-y-3">
            <h3 className="text-[11px] font-mono font-semibold tracking-wider uppercase text-[#0A0A0A]">03 / BE DIFFERENT</h3>
            <p className="text-sm text-[#71717A]">
              We&apos;re not here to follow every trend. We&apos;re here to create our own language.
            </p>
          </div>
        </div>

        <div className="pt-20 text-center space-y-6">
          <p className="text-sm font-mono font-bold uppercase tracking-[0.18em] text-[#0A0A0A]">
            RADIICATO — FOR THOSE WHO KNOW
          </p>
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
