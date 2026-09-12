'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Search, ShoppingBag, Heart, User, Menu, X, ChevronDown } from 'lucide-react';
import { useStore } from '@/lib/use-store';

interface NavbarProps {
  onOpenCart: () => void;
  onOpenSearch: () => void;
}

export function Navbar({ onOpenCart, onOpenSearch }: NavbarProps) {
  const pathname = usePathname();
  const { cartSummary, wishlist, cms, activeAnnouncement } = useStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Handle scroll opacity
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isAdmin = pathname?.startsWith('/admin');
  if (isAdmin) return null; // Admin has its own dedicated navigation

  const isBarActive = activeAnnouncement ? activeAnnouncement.isActive : cms.isAnnouncementActive;
  const barText = activeAnnouncement?.message || cms.announcementText;
  const barBadge = activeAnnouncement?.badge || 'FREE DELIVERY';
  const barLink = activeAnnouncement?.linkUrl || '/shipping';

  return (
    <header className="fixed top-0 left-0 right-0 z-40 transition-all duration-300">
      {/* Announcement Bar */}
      {isBarActive && (
        <div className="bg-[#0A0A0A] text-white font-mono text-[10px] tracking-[0.2em] uppercase py-2 px-4 text-center font-medium">
          <Link
            href={barLink}
            className="inline-flex items-center gap-2 hover:text-white transition-colors group"
          >
            <span>·</span>
            {barBadge && (
              <span className="text-white text-[10px] font-mono font-bold px-1.5 py-0.5 tracking-[0.2em]">
                {barBadge}
              </span>
            )}
            <span className="truncate max-w-[280px] sm:max-w-none">
              {barText}
            </span>
          </Link>
        </div>
      )}

      {/* Main Bar */}
      <div
        className={`px-4 sm:px-8 lg:px-12 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-xl border-b border-[#E4E4E7] py-2.5'
            : 'bg-white/90 backdrop-blur-md border-b border-transparent py-3 sm:py-3.5'
        }`}
      >
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          {/* Left Side: Logo + Navigation Links */}
          <div className="flex items-center gap-6 sm:gap-10 lg:gap-12">
            {/* Brand Logo */}
            <Link href="/" className="inline-block group py-1 shrink-0">
              <Image
                src="/logo.png"
                alt="RADIICATO"
                width={260}
                height={100}
                priority
                className="h-9 sm:h-10 lg:h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.03]"
              />
            </Link>

            <nav className="hidden md:flex items-center space-x-5 lg:space-x-8 text-[10px] font-mono font-semibold tracking-[0.18em] uppercase">
              {/* Home */}
              <Link
                href="/"
                className={`transition-colors py-1 ${
                  pathname === '/' 
                    ? 'text-[#0A0A0A]' 
                    : 'text-[#71717A] hover:text-[#0A0A0A]'
                }`}
              >
                Home
              </Link>

              {/* Collections with Dropdown */}
              <div className="relative group">
                <Link
                  href="/collections"
                  className={`transition-colors flex items-center gap-1.5 py-1 ${
                    pathname?.startsWith('/collections') 
                      ? 'text-[#0A0A0A]' 
                      : 'text-[#71717A] hover:text-[#0A0A0A]'
                  }`}
                >
                  <span>Collections</span>
                  <ChevronDown size={15} className="text-[#71717A] group-hover:rotate-180 transition-transform duration-200" />
                </Link>

                {/* Dropdown Menu on Hover */}
                <div className="absolute top-full left-0 pt-2 w-72 opacity-0 translate-y-1 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200 z-50">
                  <div className="bg-white border border-[#E4E4E7] rounded-none p-3 space-y-1.5">
                    <div className="px-2 py-1 text-[10px] font-mono tracking-[0.18em] font-semibold text-[#71717A] uppercase border-b border-[#F4F4F5]">
                      NAIROBI CAPSULES
                    </div>
                    <Link
                      href="/collections/broken-record"
                      className="flex items-center justify-between p-2 rounded-none hover:bg-[#F4F4F5] transition-colors group/item"
                    >
                      <div>
                        <p className="text-[10px] font-mono font-bold tracking-[0.18em] uppercase text-[#0A0A0A]">Broken Record</p>
                        <p className="text-[10px] text-[#71717A]">Drop 01 // Atelier White</p>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 bg-[#F4F4F5] text-[#0A0A0A] font-bold border border-[#E4E4E7] rounded-none font-mono">KES 1,000</span>
                    </Link>
                    <Link
                      href="/collections/we-are-who-we-are"
                      className="flex items-center justify-between p-2 rounded-none hover:bg-[#F4F4F5] transition-colors group/item"
                    >
                      <div>
                        <p className="text-[10px] font-mono font-bold tracking-[0.18em] uppercase text-[#0A0A0A]">We Are Who We Are</p>
                        <p className="text-[10px] text-[#71717A]">Drop 02 // Washed Black</p>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 bg-[#0A0A0A] text-white font-bold rounded-none font-mono">KES 800</span>
                    </Link>
                    <Link
                      href="/collections/skull-caps"
                      className="flex items-center justify-between p-2 rounded-none hover:bg-[#F4F4F5] transition-colors group/item"
                    >
                      <div>
                        <p className="text-[10px] font-mono font-bold tracking-[0.18em] uppercase text-[#0A0A0A]">Skull Caps</p>
                        <p className="text-[10px] text-[#0A0A0A] font-semibold">Capsule 03 // Now Live</p>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 bg-[#0A0A0A] text-white font-bold border border-[#0A0A0A] rounded-none font-mono">KES 500</span>
                    </Link>
                    <div className="pt-2 border-t border-[#F4F4F5]">
                      <Link
                        href="/collections"
                        className="block text-center text-[10px] font-mono font-semibold tracking-[0.18em] uppercase text-[#0A0A0A] hover:underline py-1"
                      >
                        View All Collections &rarr;
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shop */}
              <Link
                href="/shop"
                className={`transition-colors py-1 ${
                  pathname === '/shop' 
                    ? 'text-[#0A0A0A]' 
                    : 'text-[#71717A] hover:text-[#0A0A0A]'
                }`}
              >
                Shop
              </Link>

              {/* Our Story */}
              <Link
                href="/about"
                className={`transition-colors py-1 ${
                  pathname === '/about' 
                    ? 'text-[#0A0A0A]' 
                    : 'text-[#71717A] hover:text-[#0A0A0A]'
                }`}
              >
                Our Story
              </Link>
            </nav>
          </div>

          {/* Right Actions: Search, Wishlist, Account, Cart, Mobile Menu Toggle */}
          <div className="flex items-center space-x-1 sm:space-x-2 text-[#71717A]">
            {/* Search */}
            <button
              onClick={onOpenSearch}
              className="p-2 text-[#71717A] hover:text-[#0A0A0A] transition-colors"
              aria-label="Search catalog"
            >
              <Search size={19} />
            </button>

            {/* Wishlist */}
            <Link
              href="/account#wishlist"
              className="p-2 text-[#71717A] hover:text-[#0A0A0A] transition-colors relative hidden sm:block"
              aria-label="Wishlist"
            >
              <Heart size={19} />
              {wishlist.length > 0 && (
                <span className="absolute top-0 right-0 bg-[#0A0A0A] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Customer Account */}
            <Link
              href="/account"
              className="p-2 text-[#71717A] hover:text-[#0A0A0A] transition-colors hidden sm:block"
              aria-label="Customer account"
            >
              <User size={19} />
            </Link>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="flex items-center space-x-2 bg-[#0A0A0A] text-white hover:opacity-80 transition-opacity px-3 py-2 text-[10px] font-bold tracking-[0.12em] uppercase rounded-none"
              aria-label="Open cart drawer"
            >
              <ShoppingBag size={15} />
              <span className="text-[11px] font-mono font-bold">({cartSummary.itemsCount})</span>
            </button>

            {/* Mobile Menu Toggle Button */}
            <div className="flex md:hidden items-center pl-1">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-1 text-[#71717A] hover:text-[#0A0A0A] transition-colors"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[96px] bg-white border-t border-[#E4E4E7] z-50 flex flex-col justify-between p-6 sm:p-8 overflow-y-auto">
          <div className="space-y-5 pt-2">
            <div className="pb-4 border-b border-[#F4F4F5]">
              <Image
                src="/logo.png"
                alt="RADIICATO"
                width={200}
                height={80}
                className="h-12 sm:h-14 w-auto object-contain mb-1"
              />
            </div>

            {/* Mobile Navigation Order: Home, Collections, Shop, Our Story */}
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`block text-2xl font-black tracking-widest transition-colors ${
                pathname === '/' ? 'text-[#0A0A0A]' : 'text-[#71717A]'
              }`}
            >
              HOME
            </Link>

            <div className="space-y-2 pt-2 border-t border-[#F4F4F5]">
              <Link
                href="/collections"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-[10px] font-mono font-semibold tracking-[0.18em] text-[#71717A] uppercase"
              >
                COLLECTIONS //
              </Link>
              <div className="pl-3 space-y-3 border-l-2 border-[#E4E4E7]">
                <Link
                  href="/collections/broken-record"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between text-lg font-black tracking-wider text-[#71717A] hover:text-[#0A0A0A] transition-colors"
                >
                  <span>BROKEN RECORD</span>
                  <span className="text-[10px] px-2 py-0.5 bg-[#F4F4F5] text-black border border-[#E4E4E7] rounded-none font-mono font-bold">WHITE • KES 1,000</span>
                </Link>
                <Link
                  href="/collections/we-are-who-we-are"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between text-lg font-black tracking-wider text-[#71717A] hover:text-[#0A0A0A] transition-colors"
                >
                  <span>WE ARE WHO WE ARE</span>
                  <span className="text-[10px] px-2 py-0.5 bg-[#0A0A0A] text-white rounded-none font-mono font-bold">BLACK • KES 800</span>
                </Link>
                <Link
                  href="/collections/skull-caps"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between text-base font-bold tracking-wider text-[#71717A] hover:text-[#0A0A0A] transition-colors"
                >
                  <span>SKULL CAPS</span>
                  <span className="text-[10px] px-2 py-0.5 bg-[#0A0A0A] text-white rounded-none font-mono font-bold">NOW LIVE • KES 500</span>
                </Link>
              </div>
            </div>

            <Link
              href="/shop"
              onClick={() => setMobileMenuOpen(false)}
              className={`block text-2xl font-black tracking-widest transition-colors pt-2 border-t border-[#F4F4F5] ${
                pathname === '/shop' ? 'text-[#0A0A0A]' : 'text-[#71717A]'
              }`}
            >
              SHOP
            </Link>

            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className={`block text-2xl font-black tracking-wider transition-colors pt-2 border-t border-[#F4F4F5] ${
                pathname === '/about' ? 'text-[#0A0A0A]' : 'text-[#71717A]'
              }`}
            >
              OUR STORY
            </Link>

            <Link
              href="/account"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-[10px] font-mono font-semibold tracking-[0.18em] text-[#71717A] hover:text-[#0A0A0A] transition-colors pt-2 border-t border-[#F4F4F5] uppercase"
            >
              MY ACCOUNT
            </Link>
          </div>

          <div className="border-t border-[#E4E4E7] pt-5 pb-6 space-y-1 text-xs">
            <p className="text-[#71717A] tracking-wider uppercase font-semibold">Nairobi Atelier & Flagship</p>
            <p className="text-[#71717A]">Studio 04, The Alchemist Yard, Parklands Road</p>
            <p className="text-[#71717A] font-mono">+254 712 904 883</p>
          </div>
        </div>
      )}
    </header>
  );
}
