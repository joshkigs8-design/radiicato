'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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
      try {
        localStorage.setItem('rad_newsletter_email', email.trim());
      } catch {}
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#0A0A0A] border-t border-[#E4E4E7] text-white pt-16 pb-12 overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-12">
        {/* Top Newsletter Strip */}
        <div className="border-b border-[#27272A] pb-14 mb-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-6 space-y-2">
            <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#71717A] font-semibold">
              EXCLUSIVE ACCESS
            </span>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight uppercase">
              STAY IN THE DROP.
            </h3>
            <p className="text-xs sm:text-sm text-[#A1A1AA] max-w-md">
              Receive secret release passwords, private lookbooks, and early access to limited edition pieces.
            </p>
          </div>

          <div className="lg:col-span-6">
            {subscribed ? (
              <div className="border border-[#27272A] p-3 text-xs text-white font-medium flex items-center gap-2">
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
                  className="flex-1 bg-transparent border border-[#27272A] px-4 py-3 text-xs tracking-wider uppercase text-white placeholder:text-[#52525B] focus:outline-none focus:border-white font-mono rounded-none"
                />
                <button
                  type="submit"
                  className="bg-white hover:opacity-80 text-[#0A0A0A] px-6 py-3 text-xs font-bold tracking-widest uppercase transition-opacity flex items-center gap-2 rounded-none"
                >
                  <span>JOIN</span>
                  <ArrowRight size={14} />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Brand Logo Banner */}
        <div className="pb-10 border-b border-[#27272A] mb-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Link href="/" className="inline-block group text-4xl sm:text-5xl font-black tracking-[-0.06em] leading-[0.88] uppercase hover:opacity-80 transition-opacity">
            RADIICATO
          </Link>
          <span className="text-[10px] font-mono tracking-[0.2em] font-semibold uppercase text-[#71717A]">
            NAIROBI ATELIER • STREETWEAR CULTURE
          </span>
        </div>

        {/* Links Navigation Matrix */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-16 border-b border-[#27272A] text-xs">
          {/* Shop */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-mono font-semibold tracking-[0.2em] uppercase text-[#71717A]">SHOP</h4>
            <ul className="space-y-2.5 text-[#A1A1AA]">
              <li>
                <Link href="/shop" className="hover:text-white transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/collections/broken-record" className="hover:text-white transition-colors">
                  Broken Record (White Tee)
                </Link>
              </li>
              <li>
                <Link href="/collections/we-are-who-we-are" className="hover:text-white transition-colors">
                  We Are Who We Are (Black Tee)
                </Link>
              </li>
              <li>
                <Link href="/collections/skull-caps" className="hover:text-white transition-colors">
                  Skull Caps (Capsule 03)
                </Link>
              </li>
            </ul>
          </div>

          {/* Drops */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-mono font-semibold tracking-[0.2em] uppercase text-[#71717A]">COLLECTIONS</h4>
            <ul className="space-y-2.5 text-[#A1A1AA]">
              <li>
                <Link href="/collections/broken-record" className="hover:text-white transition-colors">
                  Broken Record (White Collection)
                </Link>
              </li>
              <li>
                <Link href="/collections/we-are-who-we-are" className="hover:text-white transition-colors">
                  We Are Who We Are (Black Collection)
                </Link>
              </li>
              <li>
                <Link href="/collections/skull-caps" className="hover:text-white transition-colors">
                  Skull Caps (Capsule 03)
                </Link>
              </li>
              <li>
                <Link href="/collections" className="hover:text-white transition-colors">
                  View All Drops
                </Link>
              </li>
            </ul>
          </div>

          {/* Client Care */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-mono font-semibold tracking-[0.2em] uppercase text-[#71717A]">CLIENT CARE</h4>
            <ul className="space-y-2.5 text-[#A1A1AA]">
              <li>
                <Link href="/shipping" className="hover:text-white transition-colors">
                  Kenyan Shipping & Rates
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-white transition-colors">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  FAQ & Sizing Guide
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact Concierge
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-mono font-semibold tracking-[0.2em] uppercase text-[#71717A]">COMPANY</h4>
            <ul className="space-y-2.5 text-[#A1A1AA]">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  The Radiicato Story
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div className="space-y-4 col-span-2 md:col-span-1">
            <h4 className="text-[10px] font-mono font-semibold tracking-[0.2em] uppercase text-[#71717A]">CONNECT</h4>
            <ul className="space-y-2.5 text-[#A1A1AA] flex flex-wrap gap-x-2">
              <li>
                <a
                  href={settings.socialInstagram}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors font-mono tracking-widest text-[10px]"
                >
                  INSTAGRAM
                </a>
              </li>
              <li><span className="text-[#52525B]">·</span></li>
              <li>
                <a
                  href={settings.socialTiktok}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors font-mono tracking-widest text-[10px]"
                >
                  TIKTOK
                </a>
              </li>
              <li><span className="text-[#52525B]">·</span></li>
              <li>
                <a
                  href="https://wa.me/254712904883"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors font-mono tracking-widest text-[10px]"
                >
                  WHATSAPP
                </a>
              </li>
            </ul>
            <div className="pt-2 text-[10px] font-mono text-[#52525B]">
              <p>Nairobi, Kenya</p>
              <p>{settings.contactPhone}</p>
            </div>
          </div>
        </div>

        {/* Bottom copyright & attribution */}
        <div className="pt-8 flex flex-col justify-center items-center text-[10px] font-mono text-[#52525B] gap-4 text-center">
          <p>© {new Date().getFullYear()} RADIICATO APPAREL CO. ALL RIGHTS RESERVED.</p>
          <p className="flex items-center gap-2">
            <span>ENGINEERED IN NAIROBI, KENYA</span>
            <span>·</span>
            <span>INTERNATIONAL DISPATCH</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
