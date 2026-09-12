'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  Package, Heart, User, MapPin, ArrowRight, ShieldCheck, 
  ExternalLink, Clock, ShoppingBag, Loader2 
} from 'lucide-react';
import { useStore } from '@/lib/use-store';
import { formatKES, formatDate } from '@/lib/utils';
import { ProductCard } from '@/components/product/ProductCard';
import { supabase } from '@/lib/supabase';

export default function AccountDashboardPage() {
  const router = useRouter();
  const { orders, wishlist, products } = useStore();
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const checkUser = async () => {
      if (!supabase) {
        setIsLoadingAuth(false);
        return;
      }
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        router.push('/login');
      } else {
        setIsAuthenticated(true);
        setUserEmail(session.user.email || '');
      }
      setIsLoadingAuth(false);
    };
    checkUser();
  }, [router]);

  const recentOrders = orders.slice(0, 3);
  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    router.push('/login');
  };

  if (isLoadingAuth || !isAuthenticated) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#0A0A0A]" />
      </div>
    );
  }

  return (
    <main className="pt-28 sm:pt-36 pb-32 px-5 sm:px-8 lg:px-12 bg-white min-h-screen">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="pb-10 border-b border-[#E4E4E7] mb-12 flex flex-col md:flex-row justify-between md:items-end gap-6">
          <div>
            <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#71717A] mb-3">
              CLIENT CONCIERGE & ARCHIVE
            </p>
            <h1 className="text-display-sm font-black uppercase tracking-tight text-[#0A0A0A]">
              MY ACCOUNT
            </h1>
            <p className="text-[10px] text-[#71717A] mt-3 font-mono uppercase tracking-[0.12em]">
              LOGGED IN AS: {userEmail}
            </p>
            <button 
              onClick={handleLogout}
              className="text-[10px] font-mono text-[#A1A1AA] hover:text-[#0A0A0A] uppercase tracking-[0.12em] mt-3 underline"
            >
              SIGN OUT
            </button>
          </div>

          {/* Quick Nav Links */}
          <div className="flex gap-3 text-[11px] font-mono uppercase tracking-[0.12em]">
            <Link
              href="/account/orders"
              className="px-4 py-2 border border-[#E4E4E7] hover:border-[#0A0A0A] text-[#0A0A0A] bg-white transition-colors"
            >
              ALL ORDERS ({orders.length})
            </Link>
            <Link
              href="/account/profile"
              className="px-4 py-2 border border-[#E4E4E7] hover:border-[#0A0A0A] text-[#0A0A0A] bg-white transition-colors"
            >
              PROFILE & ADDRESSES
            </Link>
          </div>
        </div>

        {/* Account KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-16">
          <div className="p-6 border border-[#E4E4E7]">
            <p className="label-mono mb-2">TOTAL ORDERS</p>
            <p className="text-3xl font-black font-mono text-[#0A0A0A]">{orders.length}</p>
          </div>
          <div className="p-6 border border-[#E4E4E7]">
            <p className="label-mono mb-2">SAVED IN WISHLIST</p>
            <p className="text-3xl font-black font-mono text-[#0A0A0A]">{wishlist.length}</p>
          </div>
          <div className="p-6 border border-[#E4E4E7]">
            <p className="label-mono mb-2">VIP TIER</p>
            <p className="text-3xl font-black font-mono text-[#0A0A0A]">INNER CIRCLE</p>
          </div>
          <div className="p-6 border border-[#E4E4E7]">
            <p className="label-mono mb-2">ATELIER PASS</p>
            <p className="text-3xl font-black font-mono text-[#0A0A0A]">ACTIVE</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Left Column: Recent Orders */}
          <div className="lg:col-span-8 space-y-12">
            <div>
              <div className="flex justify-between items-center pb-4 border-b border-[#E4E4E7] mb-6">
                <h2 className="text-sm font-bold uppercase tracking-widest text-[#0A0A0A] flex items-center gap-2">
                  <Package size={16} /> RECENT ORDERS
                </h2>
                <Link
                  href="/account/orders"
                  className="text-[10px] font-mono text-[#71717A] hover:text-[#0A0A0A] flex items-center gap-1 uppercase tracking-wider transition-colors"
                >
                  <span>VIEW ALL</span>
                  <ArrowRight size={12} />
                </Link>
              </div>

              {recentOrders.length === 0 ? (
                <div className="p-8 border border-[#E4E4E7] bg-white text-center text-sm text-[#71717A]">
                  No orders placed yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="p-5 bg-white border border-[#E4E4E7] hover:border-[#0A0A0A] transition-colors space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-[#E4E4E7] pb-4 font-mono text-[11px] uppercase tracking-wider">
                        <div>
                          <span className="text-[#0A0A0A] font-bold">{order.orderNumber}</span>
                          <span className="text-[#71717A] ml-3">{formatDate(order.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-[#0A0A0A] font-bold">
                            STATUS: {order.fulfillmentStatus}
                          </span>
                          <span className="text-[#0A0A0A] font-bold">{formatKES(order.total)}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4 items-center">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-center gap-3">
                            <div className="relative w-12 h-16 bg-[#F4F4F5] overflow-hidden flex-shrink-0 border border-[#E4E4E7]">
                              {item.imageUrl && (
                                <Image
                                  src={item.imageUrl}
                                  alt={item.productName}
                                  fill
                                  className="object-cover"
                                  sizes="48px"
                                />
                              )}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-[#0A0A0A] uppercase">{item.productName}</p>
                              <p className="text-[10px] font-mono text-[#71717A] mt-1 uppercase">
                                {item.variantTitle} • QTY: {item.quantity}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {order.trackingNumber && (
                        <div className="pt-2 text-[10px] font-mono text-[#0A0A0A] flex items-center gap-1.5 uppercase font-bold tracking-wider">
                          <span>TRACKING: {order.trackingNumber}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Wishlist Section */}
            <div id="wishlist">
              <div className="flex justify-between items-center pb-4 border-b border-[#E4E4E7] mb-6">
                <h2 className="text-sm font-bold uppercase tracking-widest text-[#0A0A0A] flex items-center gap-2">
                  <Heart size={16} /> SAVED IN WISHLIST ({wishlistedProducts.length})
                </h2>
              </div>

              {wishlistedProducts.length === 0 ? (
                <div className="p-12 text-center bg-white border border-[#E4E4E7] text-sm text-[#71717A]">
                  Your wishlist is empty. Tap the heart on any archival piece to save it.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                  {wishlistedProducts.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Customer Profile & Addresses Card */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 bg-white border border-[#E4E4E7] space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-[#0A0A0A] border-b border-[#E4E4E7] pb-3 flex items-center gap-2">
                <MapPin size={16} /> PRIMARY DELIVERY ADDRESS
              </h3>
              <div className="text-xs font-mono space-y-2 text-[#71717A] uppercase tracking-wider leading-relaxed">
                <p className="text-[#0A0A0A] font-bold">Kariuki Mwangi</p>
                <p>Wood Avenue Plaza, Apt 4B</p>
                <p>Kilimani, Nairobi, Kenya</p>
                <p className="text-[#0A0A0A]">+254 722 123 456</p>
              </div>
              <div className="pt-4">
                <Link
                  href="/account/profile"
                  className="text-[10px] font-mono uppercase tracking-[0.12em] text-[#0A0A0A] font-bold hover:underline"
                >
                  EDIT ADDRESS & PHONE &rarr;
                </Link>
              </div>
            </div>

            <div className="p-6 bg-white border border-[#E4E4E7] space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-[#0A0A0A]">
                NEED ATELIER ASSISTANCE?
              </h3>
              <p className="text-sm text-[#71717A] leading-relaxed">
                Have questions about your order or sizing? Reach our Nairobi studio directly.
              </p>
              <div className="pt-2">
                <a
                  href="https://wa.me/254712904883"
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary inline-flex"
                >
                  WHATSAPP ATELIER VIP &rarr;
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
