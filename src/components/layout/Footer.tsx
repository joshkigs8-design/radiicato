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
    <footer className="relative z-10 mt-auto flex min-h-screen w-full flex-col border-t border-white/15 glass-panel-heavy font-sans text-white">
      <div className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col px-6 pb-10 pt-[calc(var(--navbar-height)+2rem)] md:pb-14 md:pt-[calc(var(--navbar-height)+3rem)]">

        {/* Top: Massive "Let's work together." & "© 26" watermark */}
        <div className="flex items-start justify-between gap-6">
          <h2 className="pesos-text-face text-[clamp(36px,6.4vw,96px)] font-bold leading-[0.86] tracking-[-0.04em]">
            Let&apos;s work<span className="block">together.</span>
          </h2>
          <span
            aria-label="Copyright 2026"
            className="shrink-0 text-[clamp(44px,10vw,150px)] font-bold leading-[0.8] tracking-[-0.05em] select-none text-white/40"
          >
            ©<span>26</span>
          </span>
        </div>

        {/* Flex spacer to push content */}
        <div className="flex-1" />

        {/* Middle Prompt */}
        <p className="mt-16 text-[clamp(17px,2vw,30px)] font-bold leading-tight tracking-[-0.03em] text-white/90">
          Drop us a line to talk about a piece, an order or a collaboration.
        </p>

        {/* Big Action Box: "Let's talk" with Glassmorphic styling */}
        <a
          href={`mailto:${settings.contactEmail || 'info@radiicato.co.ke'}`}
          className="group mt-6 flex w-full items-center justify-between gap-6 glass-card rounded-2xl px-6 py-6 md:px-10 md:py-8 transition-all duration-300 hover:border-white focus-visible:outline-none"
        >
          <span className="text-[clamp(22px,3.2vw,44px)] font-bold leading-none tracking-[-0.03em] transition-colors duration-200 group-hover:text-white">
            Let&apos;s talk
          </span>
          <ArrowUpRight
            className="h-[clamp(24px,3vw,40px)] w-[clamp(24px,3vw,40px)] shrink-0 transition-all duration-200 group-hover:-translate-y-1 group-hover:translate-x-1 text-white/80 group-hover:text-white"
            aria-hidden
          />
        </a>

        {/* Bottom Navigation Grid */}
        <div className="mt-10 flex flex-col gap-6 border-t border-white/15 pt-6 text-[13px] tracking-[0.02em] md:flex-row md:items-start md:justify-between md:gap-10">
          {/* Main Links */}
          <nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-2">
            <Link href="/shop" className="text-white/60 transition-colors hover:text-white focus-visible:text-white">
              Shop
            </Link>
            <Link href="/contact" className="text-white/60 transition-colors hover:text-white focus-visible:text-white">
              Contact
            </Link>
            <Link href="/returns" className="text-white/60 transition-colors hover:text-white focus-visible:text-white">
              Return Policy
            </Link>
            <Link href="/terms" className="text-white/60 transition-colors hover:text-white focus-visible:text-white">
              Terms &amp; Conditions
            </Link>
            <Link href="/privacy" className="text-white/60 transition-colors hover:text-white focus-visible:text-white">
              Privacy Policy
            </Link>
          </nav>

          {/* Social */}
          <nav aria-label="Social" className="flex flex-wrap gap-x-5 gap-y-2 md:justify-center">
            <a
              href={settings.socialInstagram || 'https://instagram.com/radiicato'}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 transition-colors hover:text-white focus-visible:text-white"
            >
              Instagram <span className="ml-1.5 text-white/35">Main</span>
            </a>
            <a
              href={settings.socialTiktok || 'https://tiktok.com/@radiicato'}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 transition-colors hover:text-white focus-visible:text-white"
            >
              TikTok
            </a>
          </nav>

          {/* Identity & Copyright */}
          <div className="flex flex-col gap-2 text-white/60 md:items-end md:text-right">
            <a
              href={`mailto:${settings.contactEmail || 'info@radiicato.co.ke'}`}
              className="text-white/60 transition-colors hover:text-white focus-visible:text-white"
            >
              {settings.contactEmail || 'info@radiicato.co.ke'}
            </a>
            <a href="tel:+254712904883" className="text-white/60 transition-colors hover:text-white focus-visible:text-white">
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
