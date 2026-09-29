'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ShieldCheck, Lock, ArrowLeft, ArrowRight, Smartphone, 
  CheckCircle2, AlertCircle, Loader2, Copy, Check, Info, HelpCircle
} from 'lucide-react';
import { useStore } from '@/lib/use-store';
import { formatKES } from '@/lib/utils';
import {
  formatKenyanPhoneNumber,
  isValidKenyanPhone, 
  formatDisplayKenyanPhone 
} from '@/lib/payment';
import { PaymentProvider } from '@/types';
import { supabase } from '@/lib/supabase';

const KENYAN_COUNTIES = [
  'Nairobi',
  'Kiambu',
  'Machakos',
  'Kajiado',
  'Mombasa',
  'Kisumu',
  'Nakuru',
  'Uasin Gishu',
  'Kilifi',
  'Other Kenya',
];

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartSummary, placeOrder, validateCoupon, settings } = useStore();

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('07');
  const [county, setCounty] = useState('Nairobi');
  const [town, setTown] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');

  // Billing State
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [billingCounty, setBillingCounty] = useState('Nairobi');
  const [billingTown, setBillingTown] = useState('');
  const [billingStreetAddress, setBillingStreetAddress] = useState('');

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<PaymentProvider>('mpesa');
  const [useDifferentMpesaPhone, setUseDifferentMpesaPhone] = useState(false);
  const [mpesaPhone, setMpesaPhone] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Coupon State
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<{ amount: number; code: string } | null>(null);
  const [couponError, setCouponError] = useState('');

  // Order request state
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Auth State
  const [authUser, setAuthUser] = useState<{ id: string; email: string } | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  React.useEffect(() => {
    const checkUser = async () => {
      const { supabase } = await import('@/lib/supabase');
      if (!supabase) {
        setIsLoadingAuth(false);
        return;
      }
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user || session.user.is_anonymous || !session.user.email) {
        router.replace('/signup?redirect=/checkout');
      } else {
        const userEmail = session.user.email || '';
        setAuthUser({ id: session.user.id, email: userEmail });
        if (userEmail) {
          setEmail(userEmail);
        }
      }
      setIsLoadingAuth(false);
    };
    checkUser();
  }, [router]);

  // Calculate Shipping fee based on selected County
  const shippingFee = useMemo(() => {
    if (county === 'Nairobi') {
      return cartSummary.subtotal >= 10000 ? 0 : 350;
    }
    if (['Kiambu', 'Machakos', 'Kajiado'].includes(county)) {
      return cartSummary.subtotal >= 12000 ? 0 : 450;
    }
    if (['Mombasa', 'Kisumu', 'Nakuru', 'Uasin Gishu', 'Kilifi'].includes(county)) {
      return cartSummary.subtotal >= 15000 ? 0 : 650;
    }
    return 800;
  }, [county, cartSummary.subtotal]);

  const discountAmount = appliedDiscount ? appliedDiscount.amount : 0;
  const orderTotal = Math.max(0, cartSummary.subtotal - discountAmount + shippingFee);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (!promoCode.trim()) return;

    const res = validateCoupon(promoCode.trim(), cartSummary.subtotal);
    if (res.valid) {
      setAppliedDiscount({ amount: res.discountAmount, code: promoCode.trim().toUpperCase() });
      setPromoCode('');
    } else {
      setCouponError(res.message);
    }
  };

  const handleCopy = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      // Fallback
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (cart.length === 0) {
      setErrorMessage('Your cart is empty. Please add items to order.');
      return;
    }

    if (!fullName.trim() || !email.trim() || !phone.trim() || !county || !town.trim() || !streetAddress.trim()) {
      setErrorMessage('Please fill in all required customer contact and delivery address fields.');
      return;
    }

    // 1. Kenyan Phone Validation for Customer Details
    if (!isValidKenyanPhone(phone.trim())) {
      setErrorMessage(
        'Invalid Kenyan phone number for delivery contact. Please enter a valid 10 or 12-digit number (e.g. 0712 345 678, 0112 345 678, or +254 712 345 678).'
      );
      return;
    }

    // 2. Billing Address Details Validation (County, Town/Estate, Specific Apartment/Street)
    if (!sameAsShipping) {
      if (!billingCounty || !billingTown.trim() || !billingStreetAddress.trim()) {
        setErrorMessage(
          'Please complete all required billing address details (County/Region, Town/Estate, and Specific Street/Apartment Address).'
        );
        return;
      }
    }

    // Record the customer's payment contact for the owner's manual confirmation call.
    const rawMpesaPhone = useDifferentMpesaPhone && mpesaPhone.trim() 
      ? mpesaPhone.trim() 
      : (mpesaPhone.trim() || phone.trim());

    if (!isValidKenyanPhone(rawMpesaPhone)) {
      setErrorMessage(
        'Invalid M-PESA contact number. Please enter a valid Kenyan line so the owner can call to confirm your order.'
      );
      return;
    }

    const normalizedCustomerPhone = formatKenyanPhoneNumber(phone.trim());
    const normalizedMpesaPhone = formatKenyanPhoneNumber(rawMpesaPhone);

    setIsProcessing(true);

    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user || user.is_anonymous || !user.email) {
        setIsProcessing(false);
        setErrorMessage('Please sign up or sign in before placing an order.');
        router.replace('/signup?redirect=/checkout');
        return;
      }

      // Place Order in reactive store with server-like validation and billing details captured
      const createdOrder = await placeOrder({
        customerId: user.id,
        customerName: fullName.trim(),
        email: email.trim(),
        phone: normalizedCustomerPhone,
        shippingAddress: {
          fullName: fullName.trim(),
          email: email.trim(),
          phone: normalizedCustomerPhone,
          county,
          town: town.trim(),
          streetAddress: streetAddress.trim(),
          deliveryInstructions: deliveryInstructions.trim(),
        },
        billingAddress: !sameAsShipping
          ? {
              fullName: fullName.trim(),
              email: email.trim(),
              phone: normalizedCustomerPhone,
              county: billingCounty,
              town: billingTown.trim(),
              streetAddress: billingStreetAddress.trim(),
            }
          : {
              fullName: fullName.trim(),
              email: email.trim(),
              phone: normalizedCustomerPhone,
              county,
              town: town.trim(),
              streetAddress: streetAddress.trim(),
              deliveryInstructions: deliveryInstructions.trim(),
            },
        internalNotes: !sameAsShipping 
          ? `Billing Address: ${billingStreetAddress.trim()}, ${billingTown.trim()}, ${billingCounty} County` 
          : `Billing Address: Same as delivery address (${streetAddress.trim()}, ${town.trim()}, ${county})`,
        items: cart.map((c) => ({
          id: `oi-${Date.now()}-${c.id}`,
          orderId: '',
          productId: c.productId,
          variantId: c.variantId,
          productName: c.name,
          variantTitle: `${c.colorName} / ${c.size}`,
          sku: `${c.slug.toUpperCase()}-${c.size}`,
          price: c.price,
          quantity: c.quantity,
          total: c.price * c.quantity,
          imageUrl: c.image,
        })),
        subtotal: cartSummary.subtotal,
        discount: discountAmount,
        discountCode: appliedDiscount?.code,
        shippingFee,
        total: orderTotal,
        paymentMethod,
        paymentStatus: 'pending',
        fulfillmentStatus: 'pending',
        paymentDetails: {
          provider: 'mpesa',
          reference: 'MANUAL-PAYMENT-PENDING',
          phoneNumber: normalizedMpesaPhone,
        },
      });

      // Redirect to Order Success page
      setTimeout(() => {
        router.push(`/order-success?orderNumber=${createdOrder.orderNumber}`);
      }, 1200);
    } catch (err: unknown) {
      setIsProcessing(false);
      const msg = err instanceof Error ? err.message : 'Checkout transaction failed. Please try again.';
      setErrorMessage(msg);
    }
  };

  if (isLoadingAuth || !authUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#0A0A0A]" />
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="pt-36 pb-32 px-6 max-w-md mx-auto text-center space-y-5">
        <div className="flex justify-center mb-6">
          <Image
            src="/logo.png"
            alt="RADIICATO"
            width={160}
            height={55}
            className="h-10 w-auto object-contain"
            priority
          />
        </div>
        <h1 className="text-xl font-bold uppercase text-[#0A0A0A] font-display">No Items In Bag</h1>
        <p className="text-xs text-[#71717A]">Add items to your bag before proceeding to checkout.</p>
        <Link 
          href="/shop" 
          className="inline-block px-8 py-3.5 bg-[#0A0A0A] text-white text-xs font-bold uppercase tracking-widest hover:opacity-80 transition-colors"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#F7F5EF] text-[#0A0A0A] pt-28 sm:pt-36 pb-32 px-5 sm:px-8 lg:px-12 max-w-[1200px] mx-auto">
      <div className="fixed inset-0 -z-10 bg-[#F7F5EF]" />
      {/* Top Header with official logo and secure checkout indicators */}
      <div className="pb-8 border-b border-[#E4E4E7] mb-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#71717A] hover:text-[#0A0A0A] transition-colors"
        >
          <ArrowLeft size={14} /> Back to Bag
        </Link>
        
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="RADIICATO"
            width={160}
            height={55}
            className="h-10 w-auto object-contain"
            priority
          />
        </Link>

        <div className="flex items-center gap-2 text-[11px] font-mono text-[#0A0A0A] font-semibold">
          <Lock size={13} /> 256-BIT ENCRYPTED CHECKOUT
        </div>
      </div>

      <form onSubmit={handleSubmitOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column: Form Fields */}
          <div className="lg:col-span-7 space-y-10">
            {/* Step 1: Customer Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 border border-[#0A0A0A] flex items-center justify-center text-[10px] font-mono bg-[#0A0A0A] text-white">
                  1
                </span>
                <h2 className="text-sm font-bold uppercase tracking-widest text-[#0A0A0A]">
                  CUSTOMER DETAILS
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-[10px] font-mono tracking-wider uppercase text-[#71717A]">
                    FULL NAME *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="E.G. JOSHUA KIGEN"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-transparent border-b border-[#E4E4E7] py-3 text-[11px] font-mono uppercase focus:border-[#0A0A0A] outline-none transition-colors text-[#0A0A0A] placeholder-[#A1A1AA]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono tracking-wider uppercase text-[#71717A]">
                    EMAIL FOR DISPATCH RECEIPT *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="E.G. JOSHUA@GMAIL.COM"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent border-b border-[#E4E4E7] py-3 text-[11px] font-mono uppercase focus:border-[#0A0A0A] outline-none transition-colors text-[#0A0A0A] placeholder-[#A1A1AA]"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-mono tracking-wider uppercase text-[#71717A]">
                      KENYAN PHONE NUMBER (M-PESA / DISPATCH) *
                    </label>
                    {phone && isValidKenyanPhone(phone) ? (
                      <span className="text-[10px] font-mono text-[#0A0A0A] font-bold flex items-center gap-1">
                        <Check size={12} /> {formatDisplayKenyanPhone(phone)}
                      </span>
                    ) : phone && phone.length >= 3 ? (
                      <span className="text-[10px] font-mono text-red-600 flex items-center gap-1">
                        <AlertCircle size={11} /> 07XX / 01XX / +254
                      </span>
                    ) : null}
                  </div>
                  <input
                    type="tel"
                    required
                    placeholder="0712 345 678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={`w-full bg-white border p-3 text-xs font-mono text-[#0A0A0A] placeholder-[#A1A1AA] focus:outline-none transition-colors ${
                      phone && !isValidKenyanPhone(phone) && phone.length >= 4
                        ? 'border-red-400 focus:border-red-600'
                        : 'border-[#E4E4E7] focus:border-[#0A0A0A]'
                    }`}
                  />
                  <p className="text-[10px] font-mono text-[#71717A]">
                    Accepts 07XXXXXXXX, 01XXXXXXXX, 254XXXXXXXX, or +254XXXXXXXX (normalized to 2547... or 2541...).
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2: Delivery Details */}
            <div className="space-y-4 pt-4 border-t border-[#E4E4E7]">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 border border-[#0A0A0A] flex items-center justify-center text-[10px] font-mono bg-[#0A0A0A] text-white">
                  2
                </span>
                <h2 className="text-sm font-bold uppercase tracking-widest text-[#0A0A0A]">
                  DELIVERY ADDRESS IN KENYA
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono tracking-wider uppercase text-[#71717A]">
                    COUNTY / REGION *
                  </label>
                  <select
                    value={county}
                    onChange={(e) => setCounty(e.target.value)}
                    className="w-full bg-transparent border-b border-[#E4E4E7] py-3 text-[11px] font-mono uppercase focus:border-[#0A0A0A] outline-none transition-colors text-[#0A0A0A] appearance-none"
                  >
                    {KENYAN_COUNTIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono tracking-wider uppercase text-[#71717A]">
                    TOWN / ESTATE *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="E.G. KILIMANI / WESTLANDS / NYALI / KAREN"
                    value={town}
                    onChange={(e) => setTown(e.target.value)}
                    className="w-full bg-transparent border-b border-[#E4E4E7] py-3 text-[11px] font-mono uppercase focus:border-[#0A0A0A] outline-none transition-colors text-[#0A0A0A] placeholder-[#A1A1AA]"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-[10px] font-mono tracking-wider uppercase text-[#71717A]">
                    SPECIFIC DELIVERY ADDRESS / BUILDING / APARTMENT *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="E.G. APARTMENT 4B, APEX PLAZA, WOOD AVENUE"
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    className="w-full bg-transparent border-b border-[#E4E4E7] py-3 text-[11px] font-mono uppercase focus:border-[#0A0A0A] outline-none transition-colors text-[#0A0A0A] placeholder-[#A1A1AA]"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-[10px] font-mono tracking-wider uppercase text-[#71717A]">
                    DELIVERY INSTRUCTIONS (OPTIONAL)
                  </label>
                  <input
                    type="text"
                    placeholder="E.G. GATE CODE 2049, CALL ON ARRIVAL, LEAVE AT CONCIERGE"
                    value={deliveryInstructions}
                    onChange={(e) => setDeliveryInstructions(e.target.value)}
                    className="w-full bg-transparent border-b border-[#E4E4E7] py-3 text-[11px] font-mono uppercase focus:border-[#0A0A0A] outline-none transition-colors text-[#0A0A0A] placeholder-[#A1A1AA]"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Billing Details */}
            <div className="space-y-4 pt-4 border-t border-[#E4E4E7]">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 border border-[#0A0A0A] flex items-center justify-center text-[10px] font-mono bg-[#0A0A0A] text-white">
                  3
                </span>
                <h2 className="text-sm font-bold uppercase tracking-widest text-[#0A0A0A]">
                  BILLING ADDRESS
                </h2>
              </div>
              
              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={sameAsShipping}
                    onChange={(e) => setSameAsShipping(e.target.checked)}
                    className="w-4 h-4 rounded-none border-[#E4E4E7] accent-[#0A0A0A]"
                  />
                  <span className="text-xs font-mono text-[#0A0A0A] uppercase tracking-wider font-medium">
                    Billing address matches delivery address
                  </span>
                </label>
              </div>

              {sameAsShipping ? (
                <div className="p-3.5 bg-[#FAFAF9] border border-[#E4E4E7] text-[11px] font-mono text-[#71717A] flex items-center gap-2">
                  <Info size={14} className="text-[#0A0A0A] shrink-0" />
                  <span>
                    VAT receipt and billing records will reflect delivery address: {streetAddress ? `${streetAddress}, ` : ''}{town ? `${town}, ` : ''}{county} County.
                  </span>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 p-4 bg-[#FAFAF9] border border-[#E4E4E7]">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono tracking-wider uppercase text-[#71717A] font-bold">
                      BILLING COUNTY / REGION *
                    </label>
                    <select
                      value={billingCounty}
                      onChange={(e) => setBillingCounty(e.target.value)}
                      className="w-full bg-transparent border-b border-[#E4E4E7] py-3 text-[11px] font-mono uppercase focus:border-[#0A0A0A] outline-none transition-colors text-[#0A0A0A] appearance-none"
                    >
                      {KENYAN_COUNTIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono tracking-wider uppercase text-[#71717A] font-bold">
                      BILLING TOWN / ESTATE *
                    </label>
                    <input
                      type="text"
                      required={!sameAsShipping}
                      placeholder="E.G. KILIMANI / NAIROBI CBD"
                      value={billingTown}
                      onChange={(e) => setBillingTown(e.target.value)}
                      className="w-full bg-transparent border-b border-[#E4E4E7] py-3 text-[11px] font-mono uppercase focus:border-[#0A0A0A] outline-none transition-colors text-[#0A0A0A] placeholder-[#A1A1AA]"
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-[10px] font-mono tracking-wider uppercase text-[#71717A] font-bold">
                      SPECIFIC BILLING ADDRESS / APARTMENT / BUILDING *
                    </label>
                    <input
                      type="text"
                      required={!sameAsShipping}
                      placeholder="E.G. SUITE 204, APEX PLAZA, WOOD AVENUE"
                      value={billingStreetAddress}
                      onChange={(e) => setBillingStreetAddress(e.target.value)}
                      className="w-full bg-transparent border-b border-[#E4E4E7] py-3 text-[11px] font-mono uppercase focus:border-[#0A0A0A] outline-none transition-colors text-[#0A0A0A] placeholder-[#A1A1AA]"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Step 4: Payment Method */}
            <div className="space-y-4 pt-4 border-t border-[#E4E4E7]">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 border border-[#0A0A0A] flex items-center justify-center text-[10px] font-mono bg-[#0A0A0A] text-white">
                  4
                </span>
                <h2 className="text-sm font-bold uppercase tracking-widest text-[#0A0A0A]">
                  ORDER CONFIRMATION
                </h2>
              </div>

              {/* Selector Tabs */}
              <div className="grid grid-cols-1 gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('mpesa')}
                  className={`p-4 border flex flex-col items-start gap-2 transition-all ${
                    paymentMethod === 'mpesa'
                      ? 'border-[#0A0A0A] bg-[#FAFAFA] text-[#0A0A0A] '
                      : 'border-[#E4E4E7] bg-white text-[#71717A] hover:border-[#A1A1AA]'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 text-[#0A0A0A]">
                      <Smartphone size={16} className="text-[#0A0A0A]" /> SAFARICOM M-PESA
                    </span>
                    <span className="text-[9px] font-mono bg-[#E4E4E7] text-[#0A0A0A] font-bold px-1.5 py-0.5 rounded-none">
                      MANUAL PAYMENT
                    </span>
                  </div>
                  <p className="text-[11px] text-[#71717A] text-left">
                    Submit your order first. The owner will call to confirm availability and payment.
                  </p>
                </button>

              </div>

              {/* M-PESA specific input & instructions */}
              {paymentMethod === 'mpesa' && (
                <div className="p-5 bg-[#FAFAF9] border border-[#E4E4E7] space-y-5">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-mono uppercase text-[#71717A] font-bold">
                        M-PESA CONTACT NUMBER
                      </label>
                      {(() => {
                        const target = useDifferentMpesaPhone && mpesaPhone.trim() ? mpesaPhone.trim() : (mpesaPhone.trim() || phone.trim());
                        return isValidKenyanPhone(target) ? (
                          <span className="text-[10px] font-mono text-[#0A0A0A] font-bold flex items-center gap-1">
                            <Check size={12} /> {formatDisplayKenyanPhone(target)}
                          </span>
                        ) : target && target.length >= 4 ? (
                          <span className="text-[10px] font-mono text-red-600 flex items-center gap-1">
                            <AlertCircle size={11} /> Format: 07XX / 01XX / +254
                          </span>
                        ) : null;
                      })()}
                    </div>

                    <div className="space-y-2">
                      <input
                        type="tel"
                        placeholder="07XX XXX XXX (e.g. 0712 345 678)"
                        value={useDifferentMpesaPhone ? mpesaPhone : (mpesaPhone || phone)}
                        onChange={(e) => {
                          setMpesaPhone(e.target.value);
                          if (!useDifferentMpesaPhone) setUseDifferentMpesaPhone(true);
                        }}
                        className="w-full bg-transparent border-b border-[#E4E4E7] py-3 text-[11px] font-mono uppercase focus:border-[#0A0A0A] outline-none transition-colors text-[#0A0A0A] placeholder-[#A1A1AA]"
                      />
                      
                      <div className="flex items-center justify-between text-[10px] font-mono text-[#71717A]">
                        <span>
                          Payment contact:{' '}
                          <strong className="text-[#0A0A0A]">
                            {formatKenyanPhoneNumber(useDifferentMpesaPhone && mpesaPhone ? mpesaPhone : (mpesaPhone || phone)) || '254XXXXXXXXX'}
                          </strong>
                        </span>
                        {useDifferentMpesaPhone && (
                          <button
                            type="button"
                            onClick={() => {
                              setMpesaPhone('');
                              setUseDifferentMpesaPhone(false);
                            }}
                            className="text-[#0A0A0A] underline hover:text-black"
                          >
                            Reset to contact phone
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Clear M-PESA Payment Instructions */}
                  <div className="pt-4 border-t border-[#E4E4E7] space-y-4">
                    <div className="flex items-center gap-2">
                      <ShieldCheck size={16} className="text-[#0A0A0A]" />
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#0A0A0A] font-mono">
                        M-PESA PAYMENT INSTRUCTIONS
                      </h4>
                    </div>

                    {/* Step-by-step STK guidance */}
                    <div className="bg-white p-4 border border-[#E4E4E7] space-y-2.5 text-xs text-[#52525B]">
                      <span className="text-[10px] font-mono uppercase text-[#0A0A0A] font-bold block">
                        MANUAL PAYMENT CONFIRMATION
                      </span>
                      <ol className="space-y-1.5 list-decimal list-inside font-mono text-[11px] leading-relaxed">
                        <li>Submit your order request with your preferred M-PESA contact number.</li>
                        <li>The RADIICATO owner will call you to confirm stock, delivery, and payment.</li>
                        <li>Do not send payment until the owner confirms the order by phone.</li>
                      </ol>
                    </div>

                    {/* Manual Fallback (Paybill & Till) */}
                    <div className="bg-white p-4 border border-[#E4E4E7] space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-mono uppercase text-[#71717A] font-bold">
                          OPTIONAL PAYMENT DETAILS
                        </span>
                        <span className="text-[9px] font-mono bg-[#F4F4F5] text-[#71717A] px-1.5 py-0.5 rounded-none">
                          OWNER WILL CONFIRM
                        </span>
                      </div>
                      <p className="text-[11px] text-[#71717A] font-mono">
                        Keep these details for the confirmation call. Payment is not collected automatically at checkout.
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        {/* Paybill */}
                        <div className="p-3 bg-[#FAFAF9] border border-[#E4E4E7] space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono text-[#71717A] font-bold uppercase">PAYBILL NUMBER</span>
                            <button
                              type="button"
                              onClick={() => handleCopy('729831', 'paybill')}
                              className="text-[10px] font-mono text-[#0A0A0A] hover:underline flex items-center gap-1 font-bold"
                            >
                              {copiedField === 'paybill' ? <Check size={11} /> : <Copy size={11} />}
                              {copiedField === 'paybill' ? 'COPIED' : 'COPY'}
                            </button>
                          </div>
                          <div className="text-sm font-mono font-bold text-[#0A0A0A]">729831</div>
                          <div className="text-[10px] font-mono text-[#71717A]">Account: <strong>RADIICATO</strong></div>
                        </div>

                        {/* Buy Goods Till */}
                        <div className="p-3 bg-[#FAFAF9] border border-[#E4E4E7] space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono text-[#71717A] font-bold uppercase">BUY GOODS (TILL)</span>
                            <button
                              type="button"
                              onClick={() => handleCopy('982410', 'till')}
                              className="text-[10px] font-mono text-[#0A0A0A] hover:underline flex items-center gap-1 font-bold"
                            >
                              {copiedField === 'till' ? <Check size={11} /> : <Copy size={11} />}
                              {copiedField === 'till' ? 'COPIED' : 'COPY'}
                            </button>
                          </div>
                          <div className="text-sm font-mono font-bold text-[#0A0A0A]">982410</div>
                          <div className="text-[10px] font-mono text-[#71717A]">Store: <strong>RADIICATO ATELIER</strong></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-4 bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                <AlertCircle size={16} />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Submit Action */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-[#0A0A0A] text-white hover:opacity-80 transition-all py-4 px-6 text-xs font-bold tracking-[0.2em] uppercase flex items-center justify-center gap-3 disabled:opacity-50 "
              >
                {isProcessing ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>SUBMITTING ORDER REQUEST...</span>
                  </>
                ) : (
                  <>
                    <span>REQUEST ORDER • {formatKES(orderTotal)}</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Order Review Sidebar */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 bg-[#FAFAF9] border border-[#E4E4E7] space-y-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#0A0A0A] border-b border-[#E4E4E7] pb-3">
                SUMMARY REVIEW ({cart.length} ITEMS)
              </h3>

              {/* Items Mini List */}
              <div className="divide-y divide-[#E4E4E7] max-h-60 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.id} className="py-3 flex gap-3 items-center justify-between">
                    <div className="flex gap-3 items-center">
                      <div className="relative w-12 h-16 bg-[#F4F4F5] flex-shrink-0 overflow-hidden border border-[#E4E4E7]">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-[#0A0A0A] uppercase line-clamp-1">{item.name}</h4>
                        <p className="text-[10px] font-mono text-[#71717A]">
                          {item.colorName} • SIZE {item.size} • QTY {item.quantity}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-medium text-[#0A0A0A]">
                      {formatKES(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Promo Code Form */}
              <div className="space-y-2 pt-2 border-t border-[#E4E4E7]">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="PROMO CODE"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1 bg-white border border-[#E4E4E7] px-3 py-2 text-xs uppercase text-[#0A0A0A] placeholder-[#A1A1AA] font-mono focus:outline-none focus:border-[#0A0A0A]"
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    className="bg-[#0A0A0A] hover:opacity-80 text-white text-xs px-4 py-2 uppercase font-bold transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {appliedDiscount && (
                  <p className="text-[11px] text-[#0A0A0A] font-mono font-bold">
                    Code {appliedDiscount.code} applied (-{formatKES(appliedDiscount.amount)})
                  </p>
                )}
                {couponError && (
                  <p className="text-[11px] text-red-600 font-mono">{couponError}</p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 pt-4 border-t border-[#E4E4E7] text-xs">
                <div className="flex justify-between text-[#71717A]">
                  <span>Subtotal</span>
                  <span className="font-mono text-[#0A0A0A] font-semibold">{formatKES(cartSummary.subtotal)}</span>
                </div>
                {appliedDiscount && (
                  <div className="flex justify-between text-[#0A0A0A] font-semibold">
                    <span>Discount</span>
                    <span className="font-mono">-{formatKES(appliedDiscount.amount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#71717A]">
                  <span>Delivery ({county})</span>
                  <span className="font-mono text-[#0A0A0A] font-semibold">
                    {shippingFee === 0 ? (
                      <span className="text-[#0A0A0A] font-bold">FREE DELIVERY</span>
                    ) : (
                      formatKES(shippingFee)
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-[#0A0A0A] pt-4 border-t border-[#E4E4E7]">
                  <span className="uppercase tracking-wider">Total</span>
                  <span className="font-mono text-lg">{formatKES(orderTotal)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>

    </div>
  );
}
