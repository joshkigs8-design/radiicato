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
        <div className="bg-[#0A0A0A] border-b border-[#18181B] text-[#E4E4E7] text-[10px] sm:text-[11px] tracking-widest uppercase py-2 px-4 text-center font-medium">
          <Link
            href={barLink}
            className="inline-flex items-center gap-2 hover:text-white transition-colors group"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#4D5936] animate-pulse shrink-0"></span>
            {barBadge && (
              <span className="bg-[#4D5936] text-white text-[9px] font-mono font-bold px-1.5 py-0.5 rounded tracking-wider">
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
            ? 'bg-white/95 backdrop-blur-md border-b border-[#E5E5E5] py-2 sm:py-3 shadow-sm'
            : 'bg-white/90 backdrop-blur-sm border-b border-[#F0F0F0] py-3.5 sm:py-4 lg:py-5'
        }`}
      >
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          {/* Left Side: Logo + Navigation Links */}
          <div className="flex items-center gap-6 sm:gap-10 lg:gap-14">
            {/* Brand Logo on Left - Enlarged Prominent Luxury Scale */}
            <Link href="/" className="inline-block group py-1 shrink-0">
              <Image
                src="/logo.png"
                alt="RADIICATO"
                width={260}
                height={100}
                priority
                className="h-12 sm:h-16 lg:h-20 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </Link>

            {/* Navigation: Home, Collections, Shop, Our Story - Enlarged & High Impact */}
            <nav className="hidden md:flex items-center space-x-6 lg:space-x-10 text-sm sm:text-base lg:text-[17px] font-black tracking-wider uppercase">
              {/* Home */}
              <Link
                href="/"
                className={`transition-colors py-1 ${
                  pathname === '/' 
                    ? 'text-black border-b-2 border-black pb-0.5 font-black' 
                    : 'text-[#52525B] hover:text-black font-extrabold'
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
                      ? 'text-black border-b-2 border-black pb-0.5 font-black' 
                      : 'text-[#52525B] hover:text-black font-extrabold'
                  }`}
                >
                  <span>Collections</span>
                  <ChevronDown size={15} className="text-[#71717A] group-hover:rotate-180 transition-transform duration-200" />
                </Link>

                {/* Dropdown Menu on Hover */}
                <div className="absolute top-full left-0 pt-2 w-72 opacity-0 translate-y-1 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200 z-50">
                  <div className="bg-white border border-[#E5E5E5] shadow-xl rounded-lg p-3 space-y-1.5">
                    <div className="px-2 py-1 text-[10px] font-mono tracking-widest text-[#71717A] uppercase border-b border-[#F4F4F5]">
                      NAIROBI CAPSULES
                    </div>
                    <Link
                      href="/collections/broken-record"
                      className="flex items-center justify-between p-2 rounded hover:bg-[#F9FAFB] transition-colors group/item"
                    >
                      <div>
                        <p className="text-xs font-black text-[#0A0A0A] group-hover/item:text-[#4D5936]">Broken Record</p>
                        <p className="text-[10px] text-[#71717A]">Drop 01 // Atelier White</p>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 bg-[#F4F4F5] text-[#0A0A0A] font-bold border border-[#E4E4E7] rounded font-mono">KES 1,000</span>
                    </Link>
                    <Link
                      href="/collections/we-are-who-we-are"
                      className="flex items-center justify-between p-2 rounded hover:bg-[#F9FAFB] transition-colors group/item"
                    >
                      <div>
                        <p className="text-xs font-black text-[#0A0A0A] group-hover/item:text-[#4D5936]">We Are Who We Are</p>
                        <p className="text-[10px] text-[#71717A]">Drop 02 // Washed Black</p>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 bg-[#0A0A0A] text-white font-bold rounded font-mono">KES 800</span>
                    </Link>
                    <Link
                      href="/collections/skull-caps"
                      className="flex items-center justify-between p-2 rounded hover:bg-[#F9FAFB] transition-colors group/item"
                    >
                      <div>
                        <p className="text-xs font-black text-[#0A0A0A] group-hover/item:text-[#4D5936]">Skull Caps</p>
                        <p className="text-[10px] text-[#4D5936] font-semibold">Capsule 03 // Now Live</p>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 bg-[#4D5936]/10 text-[#4D5936] font-bold border border-[#4D5936]/20 rounded font-mono">KES 500</span>
                    </Link>
                    <div className="pt-2 border-t border-[#F4F4F5]">
                      <Link
                        href="/collections"
                        className="block text-center text-[11px] font-black text-[#4D5936] hover:underline py-1"
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
                    ? 'text-black border-b-2 border-black pb-0.5 font-black' 
                    : 'text-[#52525B] hover:text-black font-extrabold'
                }`}
              >
                Shop
              </Link>

              {/* Our Story */}
              <Link
                href="/about"
                className={`transition-colors py-1 ${
                  pathname === '/about' 
                    ? 'text-black border-b-2 border-black pb-0.5 font-black' 
                    : 'text-[#52525B] hover:text-black font-extrabold'
                }`}
              >
                Our Story
              </Link>
            </nav>
          </div>

          {/* Right Actions: Search, Wishlist, Account, Cart, Mobile Menu Toggle */}
          <div className="flex items-center space-x-3 sm:space-x-5 text-[#18181B]">
            {/* Search */}
            <button
              onClick={onOpenSearch}
              className="p-1.5 text-[#18181B] hover:text-[#4D5936] transition-colors"
              aria-label="Search catalog"
            >
              <Search size={19} />
            </button>

            {/* Wishlist */}
            <Link
              href="/account#wishlist"
              className="p-1.5 text-[#18181B] hover:text-[#4D5936] transition-colors relative hidden sm:block"
              aria-label="Wishlist"
            >
              <Heart size={19} />
              {wishlist.length > 0 && (
                <span className="absolute top-0 right-0 bg-[#4D5936] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Customer Account */}
            <Link
              href="/account"
              className="p-1.5 text-[#18181B] hover:text-[#4D5936] transition-colors hidden sm:block"
              aria-label="Customer account"
            >
              <User size={19} />
            </Link>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="flex items-center space-x-2 bg-[#0A0A0A] text-white hover:bg-[#27272A] transition-all px-3.5 py-1.5 text-xs font-semibold tracking-wider uppercase shadow-sm"
              aria-label="Open cart drawer"
            >
              <ShoppingBag size={15} />
              <span className="text-[11px] font-mono font-bold">({cartSummary.itemsCount})</span>
            </button>

            {/* Mobile Menu Toggle Button */}
            <div className="flex md:hidden items-center pl-1">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-1 text-black hover:text-[#52525B] transition-colors"
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
        <div className="md:hidden fixed inset-0 top-[96px] bg-white/98 backdrop-blur-xl border-t border-[#E5E5E5] z-50 flex flex-col justify-between p-6 sm:p-8 shadow-2xl overflow-y-auto">
          <div className="space-y-5 pt-2">
            <div className="pb-4 border-b border-[#F0F0F0]">
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
                pathname === '/' ? 'text-[#4D5936]' : 'text-[#0A0A0A]'
              }`}
            >
              HOME
            </Link>

            <div className="space-y-2 pt-2 border-t border-[#F0F0F0]">
              <Link
                href="/collections"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-mono font-bold tracking-widest text-[#71717A] uppercase"
              >
                COLLECTIONS //
              </Link>
              <div className="pl-3 space-y-3 border-l-2 border-[#E5E5E5]">
                <Link
                  href="/collections/broken-record"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between text-lg font-black tracking-wider text-[#0A0A0A] hover:text-[#4D5936] transition-colors"
                >
                  <span>BROKEN RECORD</span>
                  <span className="text-[10px] px-2 py-0.5 bg-[#F4F4F5] text-black border border-[#E4E4E7] rounded font-mono font-bold">WHITE • KES 1,000</span>
                </Link>
                <Link
                  href="/collections/we-are-who-we-are"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between text-lg font-black tracking-wider text-[#0A0A0A] hover:text-[#4D5936] transition-colors"
                >
                  <span>WE ARE WHO WE ARE</span>
                  <span className="text-[10px] px-2 py-0.5 bg-[#0A0A0A] text-white rounded font-mono font-bold">BLACK • KES 800</span>
                </Link>
                <Link
                  href="/collections/skull-caps"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between text-base font-bold tracking-wider text-[#71717A] hover:text-black transition-colors"
                >
                  <span>SKULL CAPS</span>
                  <span className="text-[10px] px-2 py-0.5 bg-[#4D5936] text-white rounded font-mono font-bold">NOW LIVE • KES 500</span>
                </Link>
              </div>
            </div>

            <Link
              href="/shop"
              onClick={() => setMobileMenuOpen(false)}
              className={`block text-2xl font-black tracking-widest transition-colors pt-2 border-t border-[#F0F0F0] ${
                pathname === '/shop' ? 'text-[#4D5936]' : 'text-[#0A0A0A]'
              }`}
            >
              SHOP
            </Link>

            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className={`block text-2xl font-black tracking-wider transition-colors pt-2 border-t border-[#F0F0F0] ${
                pathname === '/about' ? 'text-[#4D5936]' : 'text-[#52525B]'
              }`}
            >
              OUR STORY
            </Link>

            <Link
              href="/account"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-bold tracking-wider text-[#71717A] hover:text-black transition-colors pt-2 border-t border-[#F0F0F0]"
            >
              MY ACCOUNT
            </Link>
          </div>

          <div className="border-t border-[#E5E5E5] pt-5 pb-6 space-y-1 text-xs">
            <p className="text-[#71717A] tracking-wider uppercase font-semibold">Nairobi Atelier & Flagship</p>
            <p className="text-[#52525B]">Studio 04, The Alchemist Yard, Parklands Road</p>
            <p className="text-[#71717A] font-mono">+254 712 904 883</p>
          </div>
        </div>
      )}
    </header>
  );
}

