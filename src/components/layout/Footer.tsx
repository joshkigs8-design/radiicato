'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ArrowRight, Check } from 'lucide-react';
import { useStore } from '@/lib/use-store';

export function Footer() {
  const pathname = usePathname();
  const { settings } = useStore();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const isAdmin = pathname.startsWith('/admin');
  if (isAdmin) return null;

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#FBFBFA] border-t border-[#E5E5E5] text-[#52525B] pt-16 pb-12 overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-12">
        {/* Top Newsletter Strip */}
        <div className="border-b border-[#E5E5E5] pb-14 mb-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-6 space-y-2">
            <span className="text-[10px] font-mono tracking-widest uppercase text-[#4D5936] font-bold">
              EXCLUSIVE ACCESS
            </span>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-[#0A0A0A] uppercase font-display">
              STAY IN THE DROP.
            </h3>
            <p className="text-xs sm:text-sm text-[#71717A] max-w-md">
              Receive secret release passwords, private lookbooks, and early access to limited edition pieces.
            </p>
          </div>

          <div className="lg:col-span-6">
            {subscribed ? (
              <div className="bg-[#F4F6F0] border border-[#D1D9C5] p-3 text-xs text-[#4D5936] font-medium flex items-center gap-2">
                <Check size={16} />
                <span>You are on the private drop list. Welcome to Radiicato.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  required
                  placeholder="ENTER YOUR EMAIL FOR EARLY ACCESS"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-white border border-[#D4D4D8] px-4 py-3 text-xs tracking-wider uppercase text-black placeholder-[#A1A1AA] focus:outline-none focus:border-black font-mono shadow-sm"
                />
                <button
                  type="submit"
                  className="bg-[#0A0A0A] hover:bg-[#27272A] text-white px-6 py-3 text-xs font-bold tracking-widest uppercase transition-colors flex items-center gap-2 shadow-sm"
                >
                  <span>JOIN</span>
                  <ArrowRight size={14} />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Brand Logo Banner */}
        <div className="pb-10 border-b border-[#E5E5E5] mb-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Link href="/" className="inline-block group">
            <Image
              src="/logo.png"
              alt="RADIICATO"
              width={180}
              height={72}
              className="h-12 sm:h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </Link>
          <span className="text-xs font-mono tracking-widest uppercase text-[#71717A]">
            NAIROBI ATELIER • STREETWEAR CULTURE
          </span>
        </div>

        {/* Links Navigation Matrix */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-16 border-b border-[#E5E5E5] text-xs">
          {/* Shop */}
          <div className="space-y-4">
            <h4 className="text-[#0A0A0A] font-bold tracking-widest uppercase text-[11px]">SHOP</h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/shop" className="hover:text-black transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/collections/broken-record" className="hover:text-black transition-colors">
                  Broken Record (White Tee)
                </Link>
              </li>
              <li>
                <Link href="/collections/we-are-who-we-are" className="hover:text-black transition-colors">
                  We Are Who We Are (Black Tee)
                </Link>
              </li>
              <li>
                <Link href="/collections/skull-caps" className="hover:text-black transition-colors">
                  Skull Caps (Coming Soon)
                </Link>
              </li>
            </ul>
          </div>

          {/* Drops */}
          <div className="space-y-4">
            <h4 className="text-[#0A0A0A] font-bold tracking-widest uppercase text-[11px]">COLLECTIONS</h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/collections/broken-record" className="hover:text-black transition-colors">
                  Broken Record (White Collection)
                </Link>
              </li>
              <li>
                <Link href="/collections/we-are-who-we-are" className="hover:text-black transition-colors">
                  We Are Who We Are (Black Collection)
                </Link>
              </li>
              <li>
                <Link href="/collections/skull-caps" className="hover:text-black transition-colors">
                  Skull Caps (Drop 03 Teaser)
                </Link>
              </li>
              <li>
                <Link href="/collections" className="hover:text-black transition-colors">
                  View All Drops
                </Link>
              </li>
            </ul>
          </div>

          {/* Client Care */}
          <div className="space-y-4">
            <h4 className="text-[#0A0A0A] font-bold tracking-widest uppercase text-[11px]">CLIENT CARE</h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/shipping" className="hover:text-black transition-colors">
                  Kenyan Shipping & Rates
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-black transition-colors">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-black transition-colors">
                  FAQ & Sizing Guide
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-black transition-colors">
                  Contact Concierge
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h4 className="text-[#0A0A0A] font-bold tracking-widest uppercase text-[11px]">COMPANY</h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/about" className="hover:text-black transition-colors">
                  The Radiicato Story
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-black transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-black transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div className="space-y-4 col-span-2 md:col-span-1">
            <h4 className="text-[#0A0A0A] font-bold tracking-widest uppercase text-[11px]">CONNECT</h4>
            <ul className="space-y-2.5">
              <li>
                <a
                  href={settings.socialInstagram}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-black transition-colors"
                >
                  Instagram (@radiicato)
                </a>
              </li>
              <li>
                <a
                  href={settings.socialTiktok}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-black transition-colors"
                >
                  TikTok
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/254712904883"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-black transition-colors"
                >
                  WhatsApp VIP Line
                </a>
              </li>
            </ul>
            <div className="pt-2 text-[11px] text-[#71717A]">
              <p>Nairobi, Kenya</p>
              <p className="font-mono text-[#52525B]">{settings.contactPhone}</p>
            </div>
          </div>
        </div>

        {/* Monolithic Brand Watermark */}
        <div className="py-12 border-b border-[#E5E5E5] select-none text-center">
          <span className="text-[13vw] font-black tracking-[0.2em] text-[#EBEBED] leading-none block font-display hover:text-[#DFDFE2] transition-colors">
            RADIICATO
          </span>
        </div>

        {/* Bottom copyright & attribution */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center text-[11px] text-[#71717A] gap-4">
          <p>© {new Date().getFullYear()} RADIICATO APPAREL CO. ALL RIGHTS RESERVED.</p>
          <p className="flex items-center gap-2">
            <span>ENGINEERED IN NAIROBI, KENYA</span>
            <span>•</span>
            <span className="text-[#52525B]">INTERNATIONAL DISPATCH</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

