'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { ShoppingBag } from 'lucide-react';
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

  // Handle scroll effect — transparent → solid
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isAdmin = pathname?.startsWith('/admin');
  if (isAdmin) return null;

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/shop' },
    { name: 'Archive', href: '/collections' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname?.startsWith(href);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 z-40 flex h-[var(--navbar-height)] w-full items-center px-6 transition-all duration-300 ${
          isScrolled
            ? 'glass-panel-heavy'
            : 'bg-black/35 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.3)]'
        }`}
      >
        <nav className="mx-auto flex w-full max-w-[1600px] items-center justify-between">

          {/* Left — 3D Logo */}
          <Link href="/" className="flex items-center" onClick={() => setMobileMenuOpen(false)}>
            <Image
              src="/images/radiicato-3d-chrome.png"
              alt="RADIICATO"
              width={180}
              height={70}
              priority
              className="h-10 sm:h-12 w-auto object-contain transition-transform duration-300 hover:scale-105"
            />
          </Link>

          {/* Desktop Nav Links — PESOS exact layout */}
          <div className="pesos-nav__links flex items-center gap-8 font-sans transition-colors duration-300 text-white">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[17px] font-medium uppercase tracking-[0.08em] transition-opacity hover:opacity-50 ${
                  isActive(link.href) ? 'text-white' : 'text-white/80'
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* Currency Selector (Glass Pill) */}
            <select
              aria-label="Display currency"
              className="cursor-pointer glass-pill px-3 py-1 text-[13px] font-medium tracking-[0.06em] text-white focus:outline-none"
            >
              <option value="KES" className="text-black" selected>KES</option>
              <option value="USD" className="text-black">USD</option>
              <option value="EUR" className="text-black">EUR</option>
              <option value="GBP" className="text-black">GBP</option>
              <option value="UGX" className="text-black">UGX</option>
              <option value="TZS" className="text-black">TZS</option>
            </select>

            {/* Shopping Bag */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center transition-opacity hover:opacity-50 cursor-pointer p-1.5 rounded-full hover:bg-white/10"
              aria-label="Cart"
            >
              <ShoppingBag className="h-5 w-5" aria-hidden />
              {cartSummary.itemsCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center rounded-full bg-white text-black text-[10px] font-bold">
                  {cartSummary.itemsCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Menu Toggle — PESOS animated hamburger */}
          <div className="pesos-mobile-menu">
            {/* Mobile cart icon */}
            <button
              onClick={onOpenCart}
              className="mr-4 relative flex items-center transition-opacity hover:opacity-50"
              aria-label="Cart"
            >
              <ShoppingBag className="h-5 w-5 text-white" />
              {cartSummary.itemsCount > 0 && (
                <span className="absolute -top-1.5 -right-2 h-4 w-4 flex items-center justify-center rounded-full bg-white text-black text-[10px] font-bold">
                  {cartSummary.itemsCount}
                </span>
              )}
            </button>

            <button
              type="button"
              className="pesos-mobile-menu__toggle"
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span />
              <span />
            </button>
          </div>

        </nav>
      </header>

      {/* Mobile Drawer — Fullscreen glass backdrop blur */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-[var(--navbar-height)] glass-panel-heavy z-50 flex flex-col justify-between p-7 animate-fade-in text-white md:hidden">
          <div className="space-y-6 pt-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-3xl font-bold uppercase tracking-tight text-white hover:opacity-60 transition-opacity"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="border-t border-white/15 pt-6 pb-4 space-y-3">
            {/* Currency selector mobile */}
            <select
              aria-label="Display currency"
              className="cursor-pointer rounded-full border bg-transparent px-3 py-1.5 text-[14px] font-medium tracking-[0.06em] border-white/30 text-white w-auto"
            >
              <option value="KES" className="text-black" selected>KES</option>
              <option value="USD" className="text-black">USD</option>
              <option value="EUR" className="text-black">EUR</option>
              <option value="GBP" className="text-black">GBP</option>
            </select>

            <div className="text-[12px] font-mono tracking-[0.16em] uppercase text-white/60 space-y-2 pt-2">
              <p className="text-white font-bold">NAIROBI, KENYA</p>
              <p>WE ARE WHO WE ARE.</p>
              <p>© 2026 RADIICATO</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
