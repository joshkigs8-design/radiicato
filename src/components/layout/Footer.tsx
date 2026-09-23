'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '@/lib/use-store';

export function Footer() {
  const pathname = usePathname();
  const { settings } = useStore();

  const isAdmin = pathname.startsWith('/admin');
  if (isAdmin) return null;

  return (
    <footer className="bg-[#0A0A0A] text-white pt-20 pb-16 px-6 sm:px-8 lg:px-12 border-t border-[#18181B]">
      <div className="max-w-[1600px] mx-auto flex flex-col justify-between min-h-[400px]">
        
        {/* Top: Massive Editorial Brand Statement */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-16 border-b border-[#27272A]">
          <div>
            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-[-0.06em] leading-[0.88] uppercase">
              RADIICATO
            </h2>
            <p className="mt-3 text-[11px] font-mono tracking-[0.2em] uppercase text-[#71717A]">
              WE ARE WHO WE ARE.
            </p>
          </div>
          <div className="text-[11px] font-mono tracking-[0.2em] uppercase text-[#71717A] md:text-right">
            <span>NAIROBI, KENYA</span>
          </div>
        </div>

        {/* Middle: Minimal Navigation Columns */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-10 py-16 text-[11px] font-mono tracking-[0.18em] uppercase">
          {/* Main Links */}
          <div className="flex flex-col space-y-3.5">
            <Link href="/shop" className="text-white hover:opacity-50 transition-opacity">
              SHOP
            </Link>
            <Link href="/collections" className="text-white hover:opacity-50 transition-opacity">
              COLLECTIONS
            </Link>
            <Link href="/about" className="text-white hover:opacity-50 transition-opacity">
              ABOUT
            </Link>
            <Link href="/contact" className="text-white hover:opacity-50 transition-opacity">
              CONTACT
            </Link>
          </div>

          {/* Social */}
          <div className="flex flex-col space-y-3.5">
            <a 
              href={settings.socialInstagram || 'https://instagram.com/radiicato'} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white hover:opacity-50 transition-opacity"
            >
              INSTAGRAM
            </a>
            <a 
              href={settings.socialTiktok || 'https://tiktok.com/@radiicato'} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white hover:opacity-50 transition-opacity"
            >
              TIKTOK
            </a>
          </div>

          {/* Client Care & Legal */}
          <div className="flex flex-col space-y-3.5">
            <Link href="/shipping" className="text-[#A1A1AA] hover:text-white transition-colors">
              SHIPPING
            </Link>
            <Link href="/returns" className="text-[#A1A1AA] hover:text-white transition-colors">
              RETURNS
            </Link>
            <Link href="/privacy" className="text-[#A1A1AA] hover:text-white transition-colors">
              PRIVACY
            </Link>
          </div>

          {/* Nairobi Identity Note */}
          <div className="flex flex-col space-y-2 text-[#71717A]">
            <p className="text-white font-bold">STUDIO & ATELIER</p>
            <p>PARKLANDS ROAD</p>
            <p>NAIROBI, KENYA</p>
          </div>
        </div>

        {/* Bottom Bar: Copyright */}
        <div className="pt-8 border-t border-[#27272A] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[10px] font-mono tracking-[0.2em] uppercase text-[#71717A]">
          <p>© 2026 RADIICATO</p>
          <p>ENGINEERED IN NAIROBI · WORN EVERYWHERE</p>
        </div>

      </div>
    </footer>
  );
}
