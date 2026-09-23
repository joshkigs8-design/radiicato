'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ShoppingBag } from 'lucide-react';
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

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isAdmin = pathname?.startsWith('/admin');
  if (isAdmin) return null;

  return (
    <header className="fixed top-0 left-0 z-40 flex h-[72px] sm:h-[80px] w-full items-center px-6 sm:px-10 transition-colors duration-300 bg-black/65 backdrop-blur-xl border-b border-white/20 shadow-[0_1px_0_rgba(255,255,255,0.18)] text-white">
      <nav className="mx-auto flex w-full max-w-[1600px] items-center justify-between">
        
        {/* Left: Brand Logo / Wordmark */}
        <Link 
          href="/" 
          className="text-xl sm:text-2xl font-bold tracking-[-0.04em] uppercase text-white hover:opacity-70 transition-opacity"
        >
          RADIICATO
        </Link>

        {/* Desktop Nav Links (PESOS exact layout & styling) */}
        <div className="hidden md:flex items-center gap-7 lg:gap-8 font-sans transition-colors duration-300 text-white">
          <Link 
            href="/" 
            className={`text-[15px] lg:text-[16px] font-medium uppercase tracking-[0.08em] transition-opacity hover:opacity-50 ${pathname === '/' ? 'text-white' : 'text-white/80'}`}
          >
            Home
          </Link>
          <Link 
            href="/shop" 
            className={`text-[15px] lg:text-[16px] font-medium uppercase tracking-[0.08em] transition-opacity hover:opacity-50 ${pathname === '/shop' ? 'text-white' : 'text-white/80'}`}
          >
            Shop
          </Link>
          <Link 
            href="/collections" 
            className={`text-[15px] lg:text-[16px] font-medium uppercase tracking-[0.08em] transition-opacity hover:opacity-50 ${pathname?.startsWith('/collections') ? 'text-white' : 'text-white/80'}`}
          >
            Collections
          </Link>
          <Link 
            href="/about" 
            className={`text-[15px] lg:text-[16px] font-medium uppercase tracking-[0.08em] transition-opacity hover:opacity-50 ${pathname === '/about' ? 'text-white' : 'text-white/80'}`}
          >
            About
          </Link>
          <Link 
            href="/contact" 
            className={`text-[15px] lg:text-[16px] font-medium uppercase tracking-[0.08em] transition-opacity hover:opacity-50 ${pathname === '/contact' ? 'text-white' : 'text-white/80'}`}
          >
            Contact
          </Link>

          {/* Currency Pill */}
          <div className="rounded-full border border-white/30 bg-transparent px-2.5 py-1 text-[13px] font-mono tracking-[0.06em] text-white">
            KES
          </div>

          {/* Shopping Bag Button */}
          <button
            onClick={onOpenCart}
            className="relative flex items-center gap-1.5 transition-opacity hover:opacity-50 cursor-pointer"
            aria-label="Open Cart"
          >
            <ShoppingBag size={20} className="text-white" />
            {cartSummary.itemsCount > 0 && (
              <span className="font-mono text-[12px] font-bold text-white">
                ({cartSummary.itemsCount})
              </span>
            )}
          </button>
        </div>

        {/* Mobile Nav Right: Bag + Toggle */}
        <div className="flex md:hidden items-center gap-4">
          <button
            onClick={onOpenCart}
            className="flex items-center gap-1 text-[12px] font-mono uppercase text-white"
            aria-label="Open cart"
          >
            <ShoppingBag size={18} />
            <span>({cartSummary.itemsCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1 text-white hover:opacity-60 transition-opacity"
            aria-label="Open menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

      </nav>

      {/* Mobile Drawer (Fullscreen dark backdrop blur) */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[72px] sm:top-[80px] bg-black/95 backdrop-blur-2xl z-50 flex flex-col justify-between p-7 border-t border-white/20 animate-fade-in text-white">
          <div className="space-y-6 pt-4">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-3xl font-bold uppercase tracking-tight text-white hover:opacity-60 transition-opacity"
            >
              Home
            </Link>
            <Link
              href="/shop"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-3xl font-bold uppercase tracking-tight text-white hover:opacity-60 transition-opacity"
            >
              Shop
            </Link>
            <Link
              href="/collections"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-3xl font-bold uppercase tracking-tight text-white hover:opacity-60 transition-opacity"
            >
              Collections
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-3xl font-bold uppercase tracking-tight text-white hover:opacity-60 transition-opacity"
            >
              About
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-3xl font-bold uppercase tracking-tight text-white hover:opacity-60 transition-opacity"
            >
              Contact
            </Link>
          </div>

          <div className="border-t border-white/15 pt-6 pb-4 space-y-2 text-[12px] font-mono tracking-[0.16em] uppercase text-white/60">
            <p className="text-white font-bold">NAIROBI, KENYA</p>
            <p>WE ARE WHO WE ARE.</p>
            <p>© 2026 RADIICATO</p>
          </div>
        </div>
      )}
    </header>
  );
}
