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
    await supabase.auth.signOut();
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
    <div className="pt-28 sm:pt-36 pb-32 px-6 sm:px-12 max-w-[1600px] mx-auto min-h-screen bg-white">
      {/* Header */}
      <div className="pb-10 border-b border-[#E4E4E7] mb-12 flex flex-col md:flex-row justify-between md:items-end gap-6">
        <div>
          <span className="text-[10px] font-mono tracking-widest uppercase text-[#4D5936] font-bold">
            CLIENT CONCIERGE & ARCHIVE
          </span>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-[#0A0A0A] font-display mt-1">
            MY ACCOUNT
          </h1>
          <p className="text-xs text-[#71717A] mt-2 font-mono uppercase">
            LOGGED IN AS: {userEmail}
          </p>
          <button 
            onClick={handleLogout}
            className="text-[10px] text-red-600 font-bold uppercase underline tracking-wider mt-2 hover:text-red-800"
          >
            Sign Out
          </button>
        </div>

        {/* Quick Nav Links */}
        <div className="flex gap-3 text-xs font-mono">
          <Link
            href="/account/orders"
            className="px-4 py-2 border border-[#E4E4E7] hover:border-[#0A0A0A] text-[#0A0A0A] bg-white transition-colors shadow-sm font-semibold"
          >
            ALL ORDERS ({orders.length})
          </Link>
          <Link
            href="/account/profile"
            className="px-4 py-2 border border-[#E4E4E7] hover:border-[#0A0A0A] text-[#0A0A0A] bg-white transition-colors shadow-sm font-semibold"
          >
            PROFILE & ADDRESSES
          </Link>
        </div>
      </div>

      {/* Account KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
        <div className="p-5 bg-[#FAFAF9] border border-[#E4E4E7]">
          <span className="text-[10px] font-mono text-[#71717A] uppercase font-semibold">TOTAL ORDERS</span>
          <div className="text-2xl font-black font-mono text-[#0A0A0A] mt-1">{orders.length}</div>
        </div>
        <div className="p-5 bg-[#FAFAF9] border border-[#E4E4E7]">
          <span className="text-[10px] font-mono text-[#71717A] uppercase font-semibold">SAVED IN WISHLIST</span>
          <div className="text-2xl font-black font-mono text-[#0A0A0A] mt-1">{wishlist.length}</div>
        </div>
        <div className="p-5 bg-[#FAFAF9] border border-[#E4E4E7]">
          <span className="text-[10px] font-mono text-[#71717A] uppercase font-semibold">VIP TIER</span>
          <div className="text-2xl font-black font-mono text-[#4D5936] mt-1">INNER CIRCLE</div>
        </div>
        <div className="p-5 bg-[#FAFAF9] border border-[#E4E4E7]">
          <span className="text-[10px] font-mono text-[#71717A] uppercase font-semibold">ATELIER PASS</span>
          <div className="text-2xl font-black font-mono text-[#0A0A0A] mt-1">ACTIVE</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Recent Orders */}
        <div className="lg:col-span-8 space-y-8">
          <div className="flex justify-between items-center pb-4 border-b border-[#E4E4E7]">
            <h2 className="text-sm font-bold uppercase tracking-widest text-[#0A0A0A] flex items-center gap-2">
              <Package size={16} /> RECENT ORDERS
            </h2>
            <Link
              href="/account/orders"
              className="text-xs font-mono text-[#71717A] hover:text-[#0A0A0A] flex items-center gap-1 uppercase font-semibold transition-colors"
            >
              <span>View All</span>
              <ArrowRight size={12} />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="p-8 bg-[#FAFAF9] border border-[#E4E4E7] text-center text-xs text-[#71717A]">
              No orders placed yet.
            </div>
          ) : (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="p-6 bg-[#FAFAF9] border border-[#E4E4E7] hover:border-[#D4D4D8] transition-all space-y-4"
                >
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-[#E4E4E7] pb-4 text-xs font-mono">
                    <div>
                      <span className="text-[#0A0A0A] font-bold">{order.orderNumber}</span>
                      <span className="text-[#71717A] ml-3">{formatDate(order.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-[#4D5936] uppercase font-bold">
                        {order.fulfillmentStatus}
                      </span>
                      <span className="text-[#0A0A0A] font-bold">{formatKES(order.total)}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 items-center">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 text-xs">
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
                          <p className="font-semibold text-[#0A0A0A] uppercase">{item.productName}</p>
                          <p className="text-[10px] font-mono text-[#71717A]">
                            {item.variantTitle} • QTY: {item.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {order.trackingNumber && (
                    <div className="pt-2 text-[11px] font-mono text-[#4D5936] flex items-center gap-1.5 font-bold">
                      <span>Tracking: {order.trackingNumber}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Wishlist Section */}
          <div id="wishlist" className="pt-12">
            <div className="flex justify-between items-center pb-4 border-b border-[#E4E4E7] mb-8">
              <h2 className="text-sm font-bold uppercase tracking-widest text-[#0A0A0A] flex items-center gap-2">
                <Heart size={16} /> SAVED IN WISHLIST ({wishlistedProducts.length})
              </h2>
            </div>

            {wishlistedProducts.length === 0 ? (
              <div className="p-12 text-center bg-[#FAFAF9] border border-[#E4E4E7] text-xs text-[#71717A]">
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
          <div className="p-6 bg-[#FAFAF9] border border-[#E4E4E7] space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#0A0A0A] border-b border-[#E4E4E7] pb-3 flex items-center gap-2">
              <MapPin size={15} /> PRIMARY DELIVERY ADDRESS
            </h3>
            <div className="text-xs font-mono space-y-1.5 text-[#71717A]">
              <p className="text-[#0A0A0A] font-bold">Kariuki Mwangi</p>
              <p>Wood Avenue Plaza, Apt 4B</p>
              <p>Kilimani, Nairobi, Kenya</p>
              <p className="text-[#71717A]">+254 722 123 456</p>
            </div>
            <div className="pt-2">
              <Link
                href="/account/profile"
                className="text-[11px] font-mono uppercase text-[#0A0A0A] font-bold hover:underline"
              >
                Edit Address & Phone &rarr;
              </Link>
            </div>
          </div>

          <div className="p-6 bg-[#4D5936]/5 border border-[#4D5936]/20 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#0A0A0A]">
              NEED ATELIER ASSISTANCE?
            </h3>
            <p className="text-xs text-[#71717A] leading-relaxed">
              Have questions about your order or sizing? Reach our Nairobi studio directly.
            </p>
            <div className="pt-2">
              <a
                href="https://wa.me/254712904883"
                target="_blank"
                rel="noreferrer"
                className="inline-block bg-[#4D5936] text-white hover:bg-[#384227] px-4 py-2 text-xs font-mono uppercase font-bold transition-colors shadow-sm"
              >
                WhatsApp Atelier VIP &rarr;
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
