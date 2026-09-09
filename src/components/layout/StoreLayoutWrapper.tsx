'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { SearchOverlay } from '@/components/search/SearchOverlay';

export function StoreLayoutWrapper({ children }: { children: React.ReactNode }) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleOpenCart = () => setIsCartOpen(true);
    window.addEventListener('open-cart', handleOpenCart);
    return () => window.removeEventListener('open-cart', handleOpenCart);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#0A0A0A]">
      <Navbar
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      <main className="flex-1">
        {children}
      </main>

      <Footer />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />

      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </div>
  );
}

