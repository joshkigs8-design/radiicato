'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Check, ShoppingBag, ArrowRight } from 'lucide-react';
import { useStore } from '@/lib/use-store';
import { LookbookModal } from '@/components/lookbook/LookbookModal';
import { formatKES } from '@/lib/utils';
import { Size } from '@/types';
import { ProductCard } from '@/components/product/ProductCard';

export default function HomePage() {
  const { products, collections, lookbook, addToCart } = useStore();
  const [lookbookModalOpen, setLookbookModalOpen] = useState(false);
  const [selectedLookbookIndex, setSelectedLookbookIndex] = useState(0);

  // The Three Official Products
  const brokenRecordProduct = products.find((p) => p.slug === 'broken-record-heavyweight-tee');
  const weAreWhoWeAreProduct = products.find((p) => p.slug === 'we-are-who-we-are-boxy-tee');
  const skullCapProduct = products.find((p) => p.slug === 'radiicato-heavyweight-ribbed-knit-skull-cap') || products.find((p) => p.id === 'prod-skull-cap-teaser');

  // Interactive View Switchers for the Two Showcase Tees
  const [brokenRecordView, setBrokenRecordView] = useState<'front' | 'back' | 'full'>('front');
  const [weAreWhoWeAreView, setWeAreWhoWeAreView] = useState<'front' | 'back' | 'full'>('front');

  // In-Card Size Selectors for Tees
  const [brokenRecordSize, setBrokenRecordSize] = useState<Size>('L');
  const [weAreWhoWeAreSize, setWeAreWhoWeAreSize] = useState<Size>('L');

  // Interactive Colorway Switcher for the Launched Skull Caps
  const [selectedCapColor, setSelectedCapColor] = useState<'black' | 'grey' | 'camo'>('black');

  // Quick Add Toast feedback
  const [quickAddedId, setQuickAddedId] = useState<string | null>(null);

  // Atelier Newsletter Subscription State
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const handleNewsletterSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    try {
      localStorage.setItem('rad_newsletter_email', newsletterEmail.trim());
    } catch {}
    setNewsletterSubscribed(true);
    setNewsletterEmail('');
  };

  const handleQuickAddTee = (
    product: typeof brokenRecordProduct,
    selectedSize: Size
  ) => {
    if (!product) return;
    const variant = product.variants.find((v) => v.size === selectedSize) || product.variants[0];
    const primaryImage = product.images.find((i) => i.isPrimary) || product.images[0];
    
    addToCart({
      productId: product.id,
      variantId: variant.id,
      name: product.name,
      slug: product.slug,
      image: primaryImage?.url || '',
      price: product.salePrice || product.price,
      colorName: variant.colorName,
      colorHex: variant.colorHex,
      size: selectedSize,
      quantity: 1,
      maxStock: variant.stockQuantity,
    });

    setQuickAddedId(product.id);
    setTimeout(() => setQuickAddedId(null), 2500);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('open-cart'));
    }
  };

  const handleQuickAddSkullCap = () => {
    if (!skullCapProduct) return;

    let targetVariant = skullCapProduct.variants[0];
    let targetImage = skullCapProduct.images[0]?.url || '/images/products/radiicato-skull-cap-black.jpg';

    if (selectedCapColor === 'black') {
      targetVariant = skullCapProduct.variants.find((v) => v.colorName.toLowerCase().includes('black')) || skullCapProduct.variants[0];
      targetImage = '/images/products/radiicato-skull-cap-black.jpg';
    } else if (selectedCapColor === 'grey') {
      targetVariant = skullCapProduct.variants.find((v) => v.colorName.toLowerCase().includes('grey')) || skullCapProduct.variants[1] || skullCapProduct.variants[0];
      targetImage = '/images/products/radiicato-skull-cap-grey.jpg';
    } else if (selectedCapColor === 'camo') {
      targetVariant = skullCapProduct.variants.find((v) => v.colorName.toLowerCase().includes('camo')) || skullCapProduct.variants[2] || skullCapProduct.variants[0];
      targetImage = '/images/products/radiicato-skull-cap-camo.jpg';
    }

    addToCart({
      productId: skullCapProduct.id,
      variantId: targetVariant?.id || 'v-sc-blk',
      name: skullCapProduct.name,
      slug: skullCapProduct.slug,
      image: targetImage,
      price: skullCapProduct.salePrice || skullCapProduct.price || 500,
      colorName: targetVariant?.colorName || 'Onyx Black',
      colorHex: targetVariant?.colorHex || '#0A0A0A',
      size: 'ONE SIZE',
      quantity: 1,
      maxStock: targetVariant?.stockQuantity || 40,
    });

    setQuickAddedId(skullCapProduct.id);
    setTimeout(() => setQuickAddedId(null), 2500);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('open-cart'));
    }
  };

  const handleOpenLookbook = (index: number) => {
    setSelectedLookbookIndex(index);
    setLookbookModalOpen(true);
  };

  const getBrokenRecordImage = () => {
    switch (brokenRecordView) {
      case 'front':
        return '/images/products/broken-record-front.jpg';
      case 'back':
        return '/images/products/broken-record-back.jpg';
      case 'full':
        return '/images/products/broken-record-full.jpg';
    }
  };

  const getWeAreWhoWeAreImage = () => {
    switch (weAreWhoWeAreView) {
      case 'front':
        return '/images/products/we-are-who-we-are-front.jpg';
      case 'back':
        return '/images/products/we-are-who-we-are-back.jpg';
      case 'full':
        return '/images/products/we-are-who-we-are-full.jpg';
    }
  };

  const availableSizes: Size[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  const motionProps = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-100px' },
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  };

  return (
    <div className="bg-white text-[#0A0A0A] min-h-screen relative overflow-x-hidden selection:bg-[#0A0A0A] selection:text-white">
      
      {/* 1. HERO — Full viewport, White background */}
      <section className="min-h-screen flex flex-col justify-center items-center relative px-5 sm:px-8 lg:px-12">
        <motion.h1 
          className="text-[15vw] sm:text-[18vw] font-black tracking-[-0.06em] leading-[0.85] uppercase text-[#0A0A0A] text-center"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          RADIICATO
        </motion.h1>
        <motion.p 
          className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#71717A] mt-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          INDEPENDENT LUXURY STREETWEAR · NAIROBI
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12"
        >
          <Link href="#collections" className="btn-outline px-8 py-4 text-[11px] font-mono tracking-[0.2em] uppercase">
            SHOP COLLECTION &rarr;
          </Link>
        </motion.div>
      </section>

      {/* 2. EDITORIAL STRIP */}
      <div className="w-full border-y border-[#E4E4E7] py-4">
        <p className="text-center text-[10px] font-mono tracking-[0.2em] uppercase text-[#71717A]">
          HEAVYWEIGHT 280 GSM · COMBED ORGANIC COTTON · NAIROBI ATELIER · LIMITED CAPSULES
        </p>
      </div>

      {/* 3. FEATURED COLLECTIONS */}
      <motion.section id="collections" className="py-20 sm:py-32 px-5 sm:px-8 lg:px-12 max-w-[1400px] mx-auto" {...motionProps}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* LEFT: Broken Record */}
          <div className="flex flex-col group">
            <Link href="/collections/broken-record" className="relative aspect-[3/4] img-zoom-container border border-[#E4E4E7] block overflow-hidden rounded-none">
              <Image
                src={getBrokenRecordImage()}
                alt="Broken Record Collection"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6 sm:p-8">
                <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white">
                  BROKEN RECORD
                </h2>
              </div>
            </Link>
            
            {/* View/Size Controls */}
            <div className="mt-4 flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  {(['front', 'back', 'full'] as const).map(view => (
                    <button 
                      key={view}
                      onClick={() => setBrokenRecordView(view)}
                      className={`text-[10px] font-mono uppercase px-2 py-1 border rounded-none ${brokenRecordView === view ? 'bg-[#0A0A0A] text-white border-[#0A0A0A]' : 'border-[#E4E4E7] text-[#71717A] hover:border-[#0A0A0A]'}`}
                    >
                      {view}
                    </button>
                  ))}
                </div>
                <span className="text-[11px] font-mono text-[#71717A]">
                  {formatKES(1000)}
                </span>
              </div>
              
              <div className="flex justify-between items-center gap-4">
                <div className="flex gap-1 flex-1">
                  {['S', 'M', 'L', 'XL'].map(size => (
                    <button
                      key={size}
                      onClick={() => setBrokenRecordSize(size as Size)}
                      className={`flex-1 py-1.5 text-[10px] font-mono border rounded-none ${brokenRecordSize === size ? 'bg-[#0A0A0A] text-white border-[#0A0A0A]' : 'border-[#E4E4E7] text-[#71717A] hover:border-[#0A0A0A]'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => handleQuickAddTee(brokenRecordProduct, brokenRecordSize)}
                  className="btn-primary py-1.5 px-4 rounded-none"
                >
                  {quickAddedId === brokenRecordProduct?.id ? 'ADDED' : '+ ADD'}
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: We Are Who We Are */}
          <div className="flex flex-col group md:mt-16">
            <Link href="/collections/we-are-who-we-are" className="relative aspect-[3/4] img-zoom-container border border-[#E4E4E7] block overflow-hidden rounded-none">
              <Image
                src={getWeAreWhoWeAreImage()}
                alt="We Are Who We Are Collection"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6 sm:p-8">
                <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white">
                  WE ARE WHO WE ARE
                </h2>
              </div>
            </Link>
            
            {/* View/Size Controls */}
            <div className="mt-4 flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  {(['front', 'back', 'full'] as const).map(view => (
                    <button 
                      key={view}
                      onClick={() => setWeAreWhoWeAreView(view)}
                      className={`text-[10px] font-mono uppercase px-2 py-1 border rounded-none ${weAreWhoWeAreView === view ? 'bg-[#0A0A0A] text-white border-[#0A0A0A]' : 'border-[#E4E4E7] text-[#71717A] hover:border-[#0A0A0A]'}`}
                    >
                      {view}
                    </button>
                  ))}
                </div>
                <span className="text-[11px] font-mono text-[#71717A]">
                  {formatKES(800)}
                </span>
              </div>
              
              <div className="flex justify-between items-center gap-4">
                <div className="flex gap-1 flex-1">
                  {['S', 'M', 'L', 'XL'].map(size => (
                    <button
                      key={size}
                      onClick={() => setWeAreWhoWeAreSize(size as Size)}
                      className={`flex-1 py-1.5 text-[10px] font-mono border rounded-none ${weAreWhoWeAreSize === size ? 'bg-[#0A0A0A] text-white border-[#0A0A0A]' : 'border-[#E4E4E7] text-[#71717A] hover:border-[#0A0A0A]'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => handleQuickAddTee(weAreWhoWeAreProduct, weAreWhoWeAreSize)}
                  className="btn-primary py-1.5 px-4 rounded-none"
                >
                  {quickAddedId === weAreWhoWeAreProduct?.id ? 'ADDED' : '+ ADD'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* 4. SKULL CAPS */}
      <motion.section className="py-20 sm:py-32 px-5 sm:px-8 lg:px-12 w-full border-t border-[#E4E4E7]" {...motionProps}>
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#71717A] mb-6">
              CAPSULE 03
            </h3>
            <h2 className="text-display-md font-black uppercase">
              SKULL CAPS
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="flex flex-col text-center">
              <div className="aspect-[3/4] relative border border-[#E4E4E7] mb-3 rounded-none">
                <Image src="/images/products/radiicato-skull-cap-black.jpg" alt="Black Skull Cap" fill className="object-cover" />
              </div>
              <span className="text-xs font-bold uppercase">ONYX BLACK</span>
              <span className="text-[11px] font-mono text-[#71717A]">{formatKES(500)}</span>
            </div>
            <div className="flex flex-col text-center">
              <div className="aspect-[3/4] relative border border-[#E4E4E7] mb-3 rounded-none">
                <Image src="/images/products/radiicato-skull-cap-grey.jpg" alt="Grey Skull Cap" fill className="object-cover" />
              </div>
              <span className="text-xs font-bold uppercase">SLATE GREY</span>
              <span className="text-[11px] font-mono text-[#71717A]">{formatKES(500)}</span>
            </div>
            <div className="flex flex-col text-center">
              <div className="aspect-[3/4] relative border border-[#E4E4E7] mb-3 rounded-none">
                <Image src="/images/products/radiicato-skull-cap-camo.jpg" alt="Camo Skull Cap" fill className="object-cover" />
              </div>
              <span className="text-xs font-bold uppercase">NIGHT CAMO</span>
              <span className="text-[11px] font-mono text-[#71717A]">{formatKES(500)}</span>
            </div>
          </div>

          <div className="flex flex-col items-center max-w-sm mx-auto gap-6">
            <div className="flex gap-2 w-full">
              {(['black', 'grey', 'camo'] as const).map(color => (
                <button
                  key={color}
                  onClick={() => setSelectedCapColor(color)}
                  className={`flex-1 py-3 text-[11px] font-mono uppercase tracking-wider border rounded-none ${selectedCapColor === color ? 'bg-[#0A0A0A] text-white border-[#0A0A0A]' : 'bg-white text-[#71717A] border-[#E4E4E7] hover:border-[#0A0A0A]'}`}
                >
                  {color}
                </button>
              ))}
            </div>
            <button
              onClick={handleQuickAddSkullCap}
              className="w-full btn-primary py-4 text-xs tracking-widest flex items-center justify-center gap-2 rounded-none"
            >
              <ShoppingBag size={16} />
              {quickAddedId === skullCapProduct?.id ? 'ADDED TO BAG' : `ADD TO BAG (${selectedCapColor})`}
            </button>
          </div>
        </div>
      </motion.section>

      {/* 5. PRODUCT SHOWCASE */}
      <motion.section className="py-20 sm:py-32 px-5 sm:px-8 lg:px-12 bg-[#FAFAFA] border-t border-[#E4E4E7]" {...motionProps}>
        <div className="max-w-[1400px] mx-auto">
          <h2 className="text-display-lg font-black uppercase text-center mb-16">
            ARCHIVE
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {products.map((product, idx) => (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="rounded-none"
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* 6. MARQUEE STRIP */}
      <div className="py-8 border-y border-[#E4E4E7] overflow-hidden bg-white">
        <div className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#A1A1AA] whitespace-nowrap animate-marquee inline-flex gap-4">
          {[...Array(5)].map((_, i) => (
            <span key={i}>
              RADIICATO · NAIROBI · BROKEN RECORD · WE ARE WHO WE ARE · SKULL CAPS · 
            </span>
          ))}
        </div>
      </div>

      {/* 7. BRAND STORY */}
      <motion.section className="py-20 sm:py-32 px-5 sm:px-8 lg:px-12 w-full" {...motionProps}>
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
          <div>
            <h2 className="text-display-md font-black uppercase leading-[0.9]">
              NOT FOR<br />EVERYBODY
            </h2>
          </div>
          <div className="space-y-6">
            <p className="text-sm text-[#71717A] leading-relaxed">
              Founded in Nairobi, Radiicato is an ongoing study in non-conformity, architectural silhouettes, and raw underground craftsmanship. We reject fast-fashion dilution in favor of heavyweight combed organic cotton, hand-finished 3D metallic badges, and subversive graphics made for the streets.
            </p>
            <p className="text-sm text-[#71717A] leading-relaxed">
              Every stitch, collar ribbing, and pigment wash is engineered right here in Kenya to outlast seasons and deliver undeniable quiet confidence.
            </p>
            <div>
              <Link href="/about" className="link-underline text-xs font-mono uppercase tracking-widest text-[#0A0A0A] font-bold">
                READ OUR MANIFESTO &rarr;
              </Link>
            </div>
          </div>
        </div>
      </motion.section>

      {/* 8. NEWSLETTER */}
      <motion.section className="py-20 sm:py-32 px-5 sm:px-8 lg:px-12 bg-[#FAFAFA] border-t border-[#E4E4E7]" {...motionProps}>
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-display-sm font-black uppercase mb-3 text-[#0A0A0A]">
            JOIN THE ARCHIVE
          </h2>
          <p className="text-sm text-[#71717A] mb-8">
            First access to new drops, restocks, and studio dispatches.
          </p>

          {newsletterSubscribed ? (
            <div className="flex items-center justify-center gap-2 text-sm text-[#0A0A0A] font-medium py-4">
              <Check size={18} />
              <span>You're in.</span>
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubscribe} className="flex w-full">
              <input
                type="email"
                required
                placeholder="EMAIL ADDRESS"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="bg-transparent border border-[#E4E4E7] border-r-0 px-4 py-3 text-sm w-full focus:border-[#0A0A0A] focus:outline-none transition-colors rounded-none"
              />
              <button
                type="submit"
                className="btn-primary px-8 py-3 rounded-none whitespace-nowrap"
              >
                SUBSCRIBE
              </button>
            </form>
          )}
        </div>
      </motion.section>

      {/* 9. LOOKBOOK MODAL */}
      <LookbookModal
        items={lookbook}
        selectedIndex={selectedLookbookIndex}
        isOpen={lookbookModalOpen}
        onClose={() => setLookbookModalOpen(false)}
        onSelectIndex={setSelectedLookbookIndex}
      />

    </div>
  );
}
