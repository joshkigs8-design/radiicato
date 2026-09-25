'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { ShoppingBag, Search, X, ChevronRight, User } from 'lucide-react';
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

  // Lock body scroll when mobile sidebar is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Close sidebar on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
        className={`fixed top-0 left-0 z-40 flex h-[var(--navbar-height)] w-full items-center px-4 sm:px-6 transition-all duration-300 ${
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
              className="h-9 sm:h-12 w-auto object-contain transition-transform duration-300 hover:scale-105"
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
              defaultValue="KES"
              className="cursor-pointer glass-pill px-3 py-1 text-[13px] font-medium tracking-[0.06em] text-white focus:outline-none"
            >
              <option value="KES" className="text-black">KES</option>
              <option value="USD" className="text-black">USD</option>
              <option value="EUR" className="text-black">EUR</option>
              <option value="GBP" className="text-black">GBP</option>
              <option value="UGX" className="text-black">UGX</option>
              <option value="TZS" className="text-black">TZS</option>
            </select>

            {/* Desktop Search Button */}
            <button
              onClick={onOpenSearch}
              className="flex items-center transition-opacity hover:opacity-50 cursor-pointer p-1.5 rounded-full hover:bg-white/10"
              aria-label="Search"
            >
              <Search className="h-5 w-5" aria-hidden />
            </button>

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

          {/* Mobile Header Actions — Search, Bag, Hamburger */}
          <div className="pesos-mobile-menu gap-2 sm:gap-3">
            <button
              onClick={onOpenSearch}
              className="p-2 rounded-full hover:bg-white/10 transition-colors text-white"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>

            <button
              onClick={onOpenCart}
              className="relative p-2 rounded-full hover:bg-white/10 transition-colors text-white"
              aria-label="Cart"
            >
              <ShoppingBag className="h-5 w-5" />
              {cartSummary.itemsCount > 0 && (
                <span className="absolute top-0.5 right-0.5 h-4 w-4 flex items-center justify-center rounded-full bg-white text-black text-[10px] font-bold">
                  {cartSummary.itemsCount}
                </span>
              )}
            </button>

            <button
              type="button"
              className="pesos-mobile-menu__toggle ml-1 p-2"
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? 'Close navigation sidebar' : 'Open navigation sidebar'}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span />
              <span />
            </button>
          </div>

        </nav>
      </header>

      {/* Mobile Navigation Side Bar Drawer */}
      <div
        className={`fixed inset-0 z-50 md:hidden transition-all duration-300 ${
          mobileMenuOpen ? 'pointer-events-auto visible' : 'pointer-events-none invisible'
        }`}
        aria-hidden={!mobileMenuOpen}
      >
        {/* Dimmed Frosted Backdrop */}
        <div
          onClick={() => setMobileMenuOpen(false)}
          className={`absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300 ${
            mobileMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Sliding Sidebar Panel — Right Side */}
        <div
          className={`absolute top-0 right-0 bottom-0 w-[85vw] max-w-[350px] glass-panel-heavy border-l border-white/15 shadow-[-20px_0_50px_rgba(0,0,0,0.9)] flex flex-col justify-between transition-transform duration-300 ease-out z-10 ${
            mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Sidebar Top Header */}
          <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/10">
            <Link 
              href="/" 
              onClick={() => setMobileMenuOpen(false)} 
              className="flex items-center"
            >
              <Image
                src="/images/radiicato-3d-chrome.png"
                alt="RADIICATO"
                width={130}
                height={45}
                className="h-8 w-auto object-contain"
              />
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="w-9 h-9 rounded-full bg-white/5 border border-white/15 hover:bg-white/10 flex items-center justify-center text-white transition-colors cursor-pointer"
              aria-label="Close navigation sidebar"
            >
              <X size={18} />
            </button>
          </div>

          {/* Quick Search Action Pill */}
          <div className="px-6 pt-5 pb-2">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSearch();
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-left text-xs font-mono text-white/50 hover:text-white hover:border-white/30 hover:bg-white/10 transition-all group cursor-pointer"
            >
              <Search size={15} className="text-white/60 group-hover:text-white transition-colors" />
              <span>Search collections & drops...</span>
            </button>
          </div>

          {/* Primary Navigation Links */}
          <div className="px-6 py-3 flex-1 overflow-y-auto space-y-1">
            <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 mb-3 px-2">
              Navigation Menu
            </div>

            {navLinks.map((link, idx) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`group flex items-center justify-between px-3.5 py-3 rounded-xl transition-all ${
                    active
                      ? 'bg-white/15 text-white border border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.06)]'
                      : 'text-white/75 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-baseline gap-3">
                    <span className="text-[11px] font-mono text-white/40 group-hover:text-white/70">
                      0{idx + 1}
                    </span>
                    <span className="text-base font-bold uppercase tracking-wider">
                      {link.name}
                    </span>
                  </div>

                  {active ? (
                    <span className="flex items-center gap-1.5 text-[9px] font-mono tracking-widest text-emerald-400 font-bold bg-white/10 px-2 py-0.5 rounded-full border border-white/10">
                      ACTIVE
                    </span>
                  ) : (
                    <ChevronRight size={15} className="text-white/30 group-hover:text-white/80 transition-transform group-hover:translate-x-0.5" />
                  )}
                </Link>
              );
            })}

            {/* Quick Access: Cart & Account */}
            <div className="pt-4 mt-3 border-t border-white/10 space-y-1">
              <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 mb-2 px-2">
                Quick Access
              </div>

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenCart();
                }}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-white/75 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2.5 text-xs font-mono uppercase">
                  <ShoppingBag size={15} className="text-white" />
                  <span>Shopping Bag</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-white font-bold border border-white/15">
                  {cartSummary.itemsCount} ITEMS
                </span>
              </button>

              <Link
                href="/account"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-white/75 hover:text-white hover:bg-white/5 transition-all"
              >
                <div className="flex items-center gap-2.5 text-xs font-mono uppercase">
                  <User size={15} className="text-white" />
                  <span>My Account / Sign In</span>
                </div>
                <ChevronRight size={14} className="text-white/30" />
              </Link>
            </div>
          </div>

          {/* Sidebar Footer Details */}
          <div className="p-6 border-t border-white/15 bg-black/40 space-y-4 pb-[max(1.5rem,env(safe-area-inset-bottom,1.5rem))]">
            {/* Currency selector mobile */}
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-white/50">CURRENCY</span>
              <select
                aria-label="Display currency"
                defaultValue="KES"
                className="cursor-pointer rounded-xl border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-mono font-medium tracking-wider text-white focus:outline-none focus:border-white transition-colors"
              >
                <option value="KES" className="text-black">KES (KSh)</option>
                <option value="USD" className="text-black">USD ($)</option>
                <option value="EUR" className="text-black">EUR (€)</option>
                <option value="GBP" className="text-black">GBP (£)</option>
              </select>
            </div>

            <div className="text-[11px] font-mono tracking-[0.14em] uppercase text-white/50 space-y-1 pt-1">
              <p className="text-white/80 font-bold">NAIROBI, KENYA</p>
              <p className="text-[10px]">WE ARE WHO WE ARE.</p>
              <p className="text-[9px] text-white/40">© 2026 RADIICATO ATELIER</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
