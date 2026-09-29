'use client';

import React, { useEffect, useRef, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle2, Printer, Download, ArrowRight, Package, Truck, Calendar, ShieldCheck, Loader2 } from 'lucide-react';
import { useStore } from '@/lib/use-store';
import { formatKES, formatDateTime } from '@/lib/utils';
import confetti from 'canvas-confetti';
import { supabase } from '@/lib/supabase';

function OrderSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('orderNumber');
  const { getOrderById } = useStore();
  const [userId, setUserId] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const invoiceRef = useRef<HTMLDivElement>(null);

  const order = orderNumber ? getOrderById(orderNumber) : undefined;

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        router.replace('/login');
      } else {
        setUserId(session.user.id);
        setUserEmail(session.user.email?.toLowerCase() || '');

        const { data: profileData } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .maybeSingle();
        const profile = profileData as unknown as { role?: string } | null;
        setIsAdmin(profile?.role === 'super_admin');
      }
      setIsLoadingAuth(false);
    };
    checkUser();
  }, [router]);

  useEffect(() => {
    // Fire celebratory confetti on initial render
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#0A0A0A', '#E4E4E7', '#71717A', '#FFFFFF'],
      });
    } catch {
      // Ignore if canvas-confetti fails
    }
  }, []);

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleDownload = () => {
    if (!invoiceRef.current || !order) return;

    const invoiceHtml = `<!doctype html>
<html><head><meta charset="utf-8"><title>RADIICATO Invoice ${order.orderNumber}</title>
<style>body{font-family:Arial,sans-serif;color:#0A0A0A;padding:40px;max-width:800px;margin:auto}img{max-width:140px;height:auto}.invoice{border:1px solid #E4E4E7;padding:32px}.muted{color:#71717A}table{width:100%;border-collapse:collapse;margin-top:24px}td,th{border-bottom:1px solid #E4E4E7;padding:12px 4px;text-align:left}td:last-child,th:last-child{text-align:right}.total{font-weight:700;font-size:18px;text-align:right;margin-top:24px}</style></head>
<body><div class="invoice"><img src="${window.location.origin}/logo.png" alt="RADIICATO"><h1>RADIICATO INVOICE</h1><p class="muted">Order ${order.orderNumber}</p>${invoiceRef.current.innerHTML}</div></body></html>`;
    const blob = new Blob([invoiceHtml], { type: 'text/html;charset=utf-8' });
    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `radiicato-invoice-${order.orderNumber}.html`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(downloadUrl);
  };

  if (isLoadingAuth || !userId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#0A0A0A]" />
      </div>
    );
  }

  const isOrderOwner = Boolean(
    order && (isAdmin || order.customerId === userId || order.email.toLowerCase() === userEmail)
  );

  if (!order || !isOrderOwner) {
    return (
      <div className="pt-36 pb-32 px-6 max-w-md mx-auto text-center space-y-5">
        <div className="flex justify-center mb-4">
          <Image
            src="/logo.png"
            alt="RADIICATO"
            width={160}
            height={55}
            className="h-10 w-auto object-contain"
            priority
          />
        </div>
        <h1 className="text-xl font-bold uppercase text-[#0A0A0A] font-display">Order Confirmation</h1>
        <p className="text-xs text-[#71717A]">
          No recent order details located. Check your email or customer account.
        </p>
        <Link 
          href="/shop" 
          className="inline-block px-8 py-3.5 bg-[#0A0A0A] text-white text-xs font-bold uppercase tracking-widest hover:opacity-80 transition-opacity"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-28 sm:pt-36 pb-32 px-5 sm:px-8 lg:px-12 max-w-[1400px] mx-auto min-h-screen">
      {/* Success Badge */}
      <div className="text-center space-y-4 pb-12 border-b border-[#E4E4E7]">
        <div className="w-16 h-16 border border-[#0A0A0A] mx-auto flex items-center justify-center text-[#0A0A0A]">
          <CheckCircle2 size={36} />
        </div>
        <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#71717A] font-bold block mt-6">
          TRANSACTION VERIFIED & LOGGED
        </span>
        <h1 className="text-display-sm font-black uppercase tracking-tight text-[#0A0A0A]">
          ORDER CONFIRMED
        </h1>
        <p className="text-xs sm:text-sm text-[#71717A] max-w-md mx-auto font-light leading-relaxed">
          Thank you for choosing Radiicato. A formal dispatch receipt has been sent to{' '}
          <strong className="text-[#0A0A0A] font-semibold">{order.email}</strong>.
        </p>
        <div className="pt-2">
          <span className="inline-block bg-[#FAFAFA] border border-[#E4E4E7] px-4 py-2 text-sm font-mono font-bold text-[#0A0A0A] tracking-widest">
            ORDER ID: {order.orderNumber}
          </span>
        </div>
      </div>

      {/* Printable Invoice Container */}
      <div ref={invoiceRef} className="mt-12 border border-[#E4E4E7] p-6 sm:p-10 space-y-8 max-w-4xl mx-auto">
        {/* Invoice Top Strip with Official Logo */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-6 border-b border-[#E4E4E7] gap-4">
          <div className="flex items-center gap-4">
            <div className="relative w-28 h-10 flex-shrink-0">
              <Image
                src="/logo.png"
                alt="RADIICATO"
                fill
                className="object-contain"
                sizes="120px"
                priority
              />
            </div>
            <div>
              <p className="text-[11px] font-mono font-bold text-[#0A0A0A] uppercase">RADIICATO ATELIER</p>
              <p className="text-[10px] font-mono text-[#71717A] uppercase">Nairobi Flagship Studio</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 border border-[#E4E4E7] bg-white hover:border-[#0A0A0A] text-xs font-mono uppercase text-[#0A0A0A] flex items-center gap-2 transition-colors"
            >
              <Printer size={13} /> Print / Save PDF Invoice
            </button>
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-[#0A0A0A] hover:bg-[#27272A] text-white text-xs font-mono uppercase flex items-center gap-2 transition-colors"
            >
              <Download size={13} /> Download Invoice
            </button>
          </div>
        </div>

        {/* Order Details Metadata Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs font-mono border-b border-[#E4E4E7] pb-8">
          <div>
            <span className="text-[#71717A] uppercase block font-medium">DATE & TIME</span>
            <span className="text-[#0A0A0A] font-semibold mt-1 block">{formatDateTime(order.createdAt)}</span>
          </div>
          <div>
            <span className="text-[#71717A] uppercase block font-medium">PAYMENT METHOD</span>
            <span className="text-[#0A0A0A] font-semibold mt-1 block uppercase">
              {order.paymentMethod === 'mpesa' ? 'Safaricom M-PESA STK' : 'Card / Paystack'}
            </span>
            {order.paymentDetails?.mpesaReceiptNumber && (
              <span className="text-[10px] text-[#71717A] block">
                Receipt: {order.paymentDetails.mpesaReceiptNumber}
              </span>
            )}
          </div>
          <div>
            <span className="text-[#71717A] uppercase block font-medium">FULFILLMENT STATUS</span>
            <span className="text-[#0A0A0A] font-semibold mt-1 block uppercase">
              {order.fulfillmentStatus}
            </span>
          </div>
        </div>

        {/* Shipping Destination */}
        <div className="space-y-2 border-b border-[#E4E4E7] pb-8 text-xs">
          <h3 className="font-bold uppercase tracking-wider text-[#0A0A0A]">DELIVERY DESTINATION</h3>
          <p className="text-[#0A0A0A] font-mono font-semibold">
            {order.shippingAddress.fullName} • {order.shippingAddress.phone}
          </p>
          <p className="text-[#71717A]">
            {order.shippingAddress.streetAddress}, {order.shippingAddress.town}, {order.shippingAddress.county} County, Kenya
          </p>
          {order.shippingAddress.deliveryInstructions && (
            <p className="text-[11px] text-[#71717A] font-mono">
              Note: {order.shippingAddress.deliveryInstructions}
            </p>
          )}
        </div>

        {/* Order Items Table */}
        <div className="space-y-4">
          <h3 className="text-[11px] font-mono font-semibold uppercase tracking-[0.15em] text-[#0A0A0A]">ITEMS RESERVED</h3>
          <div className="divide-y divide-[#E4E4E7] border-y border-[#E4E4E7]">
            {order.items.map((item) => (
              <div key={item.id} className="py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
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
                    <h4 className="text-xs font-semibold uppercase text-[#0A0A0A]">{item.productName}</h4>
                    <p className="text-[10px] font-mono text-[#71717A] uppercase">
                      {item.variantTitle} • QTY: {item.quantity}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono font-semibold text-[#0A0A0A]">
                  {formatKES(item.total)}
                </span>
              </div>
            ))}
          </div>

          {/* Pricing Totals */}
          <div className="space-y-2 pt-4 text-xs font-mono max-w-xs ml-auto">
            <div className="flex justify-between text-[#71717A]">
              <span>Subtotal:</span>
              <span className="text-[#0A0A0A] font-medium">{formatKES(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-[#0A0A0A] font-medium">
                <span>Discount ({order.discountCode}):</span>
                <span>-{formatKES(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-[#71717A]">
              <span>Shipping Fee:</span>
              <span className="text-[#0A0A0A] font-medium">{formatKES(order.shippingFee)}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-[#0A0A0A] pt-4 mt-2 border-t border-[#0A0A0A]">
              <span>Total Paid:</span>
              <span className="text-base font-black">{formatKES(order.total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation CTAs */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-between items-center max-w-4xl mx-auto">
        <Link
          href="/account/orders"
          className="text-[10px] font-mono uppercase tracking-[0.1em] text-[#71717A] hover:text-[#0A0A0A] flex items-center gap-1.5 transition-colors font-medium"
        >
          <span>View In Customer Portal</span>
          <ArrowRight size={13} />
        </Link>
        <Link
          href="/shop"
          className="border border-[#0A0A0A] text-[#0A0A0A] px-8 py-4 text-[11px] font-mono font-bold tracking-[0.15em] uppercase hover:bg-[#0A0A0A] hover:text-white transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="pt-36 pb-32 px-6 text-center text-[10px] font-mono text-[#71717A] uppercase">
        VERIFYING ATELIER TRANSACTION...
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
}
