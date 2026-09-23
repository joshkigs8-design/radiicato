'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, ShoppingBag, Search } from 'lucide-react';
import { useStore } from '@/lib/use-store';

interface NavbarProps {
  onOpenCart: () => void;
  onOpenSearch: () => void;
}

export function Navbar({ onOpenCart, onOpenSearch }: NavbarProps) {
  const pathname = usePathname();
  const { cartSummary } = useStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Handle scroll opacity
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isAdmin = pathname?.startsWith('/admin');
  if (isAdmin) return null;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      <div
        className={`px-5 sm:px-8 lg:px-12 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md border-b border-[#E4E4E7] py-3.5 shadow-xs'
            : 'bg-transparent py-5 sm:py-6'
        }`}
      >
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          
          {/* DESKTOP VIEW */}
          <div className="hidden md:flex items-center justify-between w-full">
            {/* Brand Logo / Wordmark */}
            <Link 
              href="/" 
              className="group flex items-center gap-3 transition-opacity hover:opacity-70"
            >
              <span className="text-xl lg:text-2xl font-black tracking-[-0.05em] uppercase text-[#0A0A0A]">
                RADIICATO
              </span>
            </Link>

            {/* Navigation Links: SHOP | COLLECTIONS | ABOUT | CONTACT | BAG */}
            <nav className="flex items-center space-x-4 lg:space-x-6 text-[11px] font-mono tracking-[0.18em] uppercase text-[#0A0A0A]">
              <Link 
                href="/shop" 
                className={`transition-opacity hover:opacity-50 ${pathname === '/shop' ? 'font-bold' : ''}`}
              >
                SHOP
              </Link>
              <span className="text-[#D4D4D8]">|</span>
              <Link 
                href="/collections" 
                className={`transition-opacity hover:opacity-50 ${pathname?.startsWith('/collections') ? 'font-bold' : ''}`}
              >
                COLLECTIONS
              </Link>
              <span className="text-[#D4D4D8]">|</span>
              <Link 
                href="/about" 
                className={`transition-opacity hover:opacity-50 ${pathname === '/about' ? 'font-bold' : ''}`}
              >
                ABOUT
              </Link>
              <span className="text-[#D4D4D8]">|</span>
              <Link 
                href="/contact" 
                className={`transition-opacity hover:opacity-50 ${pathname === '/contact' ? 'font-bold' : ''}`}
              >
                CONTACT
              </Link>
              <span className="text-[#D4D4D8]">|</span>
              <button
                onClick={onOpenCart}
                className="transition-opacity hover:opacity-50 flex items-center gap-1.5 font-bold uppercase cursor-pointer"
                aria-label="Open shopping bag"
              >
                <span>BAG</span>
                <span className="font-mono text-[10px]">({cartSummary.itemsCount})</span>
              </button>
            </nav>
          </div>

          {/* MOBILE VIEW: ☰  RADIICATO  BAG */}
          <div className="flex md:hidden items-center justify-between w-full">
            {/* Left Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1 text-[#0A0A0A] hover:opacity-60 transition-opacity"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            {/* Center Brand */}
            <Link 
              href="/" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-black tracking-[-0.04em] uppercase text-[#0A0A0A]"
            >
              RADIICATO
            </Link>

            {/* Right Bag */}
            <button
              onClick={onOpenCart}
              className="text-[11px] font-mono font-bold tracking-[0.14em] uppercase text-[#0A0A0A] hover:opacity-60 transition-opacity flex items-center gap-1"
              aria-label="Open bag"
            >
              <span>BAG</span>
              <span>({cartSummary.itemsCount})</span>
            </button>
          </div>

        </div>
      </div>

      {/* MOBILE FULL-SCREEN MENU DRAWER */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[65px] bg-white z-40 flex flex-col justify-between p-6 sm:p-8 animate-fade-in border-t border-[#E4E4E7]">
          <div className="space-y-6 pt-4">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-2xl font-black tracking-tight uppercase text-[#0A0A0A]"
            >
              HOME
            </Link>

            <Link
              href="/shop"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-2xl font-black tracking-tight uppercase text-[#0A0A0A]"
            >
              SHOP
            </Link>

            <div className="space-y-3 pt-2">
              <Link
                href="/collections"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-[11px] font-mono tracking-[0.2em] text-[#71717A] uppercase"
              >
                COLLECTIONS
              </Link>
              <div className="pl-3 space-y-2.5 border-l border-[#0A0A0A]">
                <Link
                  href="/collections/broken-record"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm font-bold uppercase tracking-wider text-[#0A0A0A]"
                >
                  BROKEN RECORD (COLLECTION 01)
                </Link>
                <Link
                  href="/collections/we-are-who-we-are"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm font-bold uppercase tracking-wider text-[#0A0A0A]"
                >
                  WE ARE WHO WE ARE (COLLECTION 02)
                </Link>
                <Link
                  href="/collections/skull-caps"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm font-bold uppercase tracking-wider text-[#0A0A0A]"
                >
                  SKULL CAPS (CAPSULE 03)
                </Link>
              </div>
            </div>

            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-2xl font-black tracking-tight uppercase text-[#0A0A0A]"
            >
              ABOUT
            </Link>

            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-2xl font-black tracking-tight uppercase text-[#0A0A0A]"
            >
              CONTACT
            </Link>
          </div>

          <div className="border-t border-[#E4E4E7] pt-6 pb-4 space-y-2 text-[10px] font-mono tracking-[0.2em] uppercase text-[#71717A]">
            <p className="font-bold text-[#0A0A0A]">NAIROBI, KENYA</p>
            <p>WE ARE WHO WE ARE.</p>
            <p>© 2026 RADIICATO</p>
          </div>
        </div>
      )}
    </header>
  );
}
