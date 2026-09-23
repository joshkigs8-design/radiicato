'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowUpRight } from 'lucide-react';
import { useStore } from '@/lib/use-store';

export function Footer() {
  const pathname = usePathname();
  const { settings } = useStore();

  const isAdmin = pathname.startsWith('/admin');
  if (isAdmin) return null;

  return (
    <footer className="relative z-10 mt-auto flex w-full flex-col border-t border-white/20 bg-black/60 font-sans text-white backdrop-blur-2xl">
      <div className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col px-6 py-16 sm:py-24">
        
        {/* Top: Massive "Let's work together." & "© 26" watermark */}
        <div className="flex items-start justify-between gap-6 pb-12">
          <h2 className="text-[clamp(36px,6.4vw,96px)] font-bold leading-[0.86] tracking-[-0.04em] uppercase text-white">
            Let&apos;s work<span className="block">together.</span>
          </h2>
          <span 
            aria-label="Copyright 2026" 
            className="shrink-0 text-[clamp(44px,10vw,150px)] font-bold leading-[0.8] tracking-[-0.05em] text-white/90 select-none"
          >
            ©26
          </span>
        </div>

        {/* Middle Prompt */}
        <p className="mt-8 text-[clamp(17px,2vw,30px)] font-bold leading-tight tracking-[-0.03em] text-white/90">
          Drop us a line to talk about a piece, an order or a collaboration.
        </p>

        {/* Big Action Box: "Let's talk" with hover fill transition */}
        <a 
          href={`mailto:${settings.contactEmail || 'info@radiicato.co.ke'}`}
          className="group mt-6 flex w-full items-center justify-between gap-6 border border-white/25 bg-white/10 px-6 py-6 backdrop-blur-md transition-colors duration-200 hover:border-white hover:bg-white focus-visible:border-white focus-visible:bg-white focus-visible:outline-none md:px-10 md:py-8 rounded-[2px]"
        >
          <span className="text-[clamp(22px,3.2vw,44px)] font-bold leading-none tracking-[-0.03em] text-white transition-colors duration-200 group-hover:text-black">
            Let&apos;s talk
          </span>
          <ArrowUpRight 
            className="h-[clamp(24px,3vw,40px)] w-[clamp(24px,3vw,40px)] shrink-0 text-white transition-all duration-200 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-black" 
          />
        </a>

        {/* Bottom Navigation Grid */}
        <div className="mt-14 flex flex-col gap-8 border-t border-white/15 pt-8 text-[13px] tracking-[0.02em] md:flex-row md:items-start md:justify-between md:gap-10">
          {/* Main Links */}
          <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2.5">
            <Link href="/shop" className="text-white/60 transition-colors hover:text-white">
              Shop
            </Link>
            <Link href="/collections" className="text-white/60 transition-colors hover:text-white">
              Collections
            </Link>
            <Link href="/about" className="text-white/60 transition-colors hover:text-white">
              About
            </Link>
            <Link href="/contact" className="text-white/60 transition-colors hover:text-white">
              Contact
            </Link>
            <Link href="/returns" className="text-white/60 transition-colors hover:text-white">
              Return Policy
            </Link>
            <Link href="/terms" className="text-white/60 transition-colors hover:text-white">
              Terms & Conditions
            </Link>
            <Link href="/privacy" className="text-white/60 transition-colors hover:text-white">
              Privacy Policy
            </Link>
          </nav>

          {/* Social */}
          <nav aria-label="Social" className="flex flex-wrap gap-x-5 gap-y-2 md:justify-center">
            <a 
              href={settings.socialInstagram || 'https://instagram.com/radiicato'} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-white/60 transition-colors hover:text-white"
            >
              Instagram <span className="ml-1 text-white/35">Main</span>
            </a>
            <a 
              href={settings.socialTiktok || 'https://tiktok.com/@radiicato'} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-white/60 transition-colors hover:text-white"
            >
              TikTok
            </a>
          </nav>

          {/* Identity & Copyright */}
          <div className="flex flex-col gap-1.5 text-white/60 md:items-end md:text-right">
            <a href={`mailto:${settings.contactEmail || 'info@radiicato.co.ke'}`} className="text-white/60 transition-colors hover:text-white">
              {settings.contactEmail || 'info@radiicato.co.ke'}
            </a>
            <a href="tel:+254712904883" className="text-white/60 transition-colors hover:text-white">
              +254 712 904 883
            </a>
            <span>Nairobi, Kenya</span>
            <span className="text-white/35">
              RADIICATO: all rights reserved © 2026
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
