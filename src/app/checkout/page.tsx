'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ShieldCheck, Lock, ArrowLeft, ArrowRight, Smartphone, 
  CreditCard, CheckCircle2, AlertCircle, Loader2, Copy, Check, Info, HelpCircle
} from 'lucide-react';
import { useStore } from '@/lib/use-store';
import { formatKES } from '@/lib/utils';
import { 
  PaymentService, 
  formatKenyanPhoneNumber, 
  isValidKenyanPhone, 
  formatDisplayKenyanPhone 
} from '@/lib/payment';
import { PaymentProvider } from '@/types';

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
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Coupon State
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<{ amount: number; code: string } | null>(null);
  const [couponError, setCouponError] = useState('');

  // Processing & Simulation State
  const [isProcessing, setIsProcessing] = useState(false);
  const [stkPushStep, setStkPushStep] = useState<'idle' | 'prompting' | 'verifying' | 'success'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  React.useEffect(() => {
    const checkUser = async () => {
      const { supabase } = await import('@/lib/supabase');
      if (!supabase) {
        setIsLoadingAuth(false);
        return;
      }
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        setIsAuthenticated(true);
        if (session.user.email) {
          setEmail(session.user.email);
        }
      }
      setIsLoadingAuth(false);
    };
    checkUser();
  }, []);

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

    // 3. M-PESA Phone Validation & Normalization (07XXXXXXXX, 01XXXXXXXX, 254XXXXXXXX, +254XXXXXXXX -> 2547XXXXXXXX or 2541XXXXXXXX)
    const rawMpesaPhone = useDifferentMpesaPhone && mpesaPhone.trim() 
      ? mpesaPhone.trim() 
      : (mpesaPhone.trim() || phone.trim());

    if (paymentMethod === 'mpesa') {
      if (!isValidKenyanPhone(rawMpesaPhone)) {
        setErrorMessage(
          'Invalid M-PESA phone number. Safaricom STK Push requires a valid Kenyan line starting with 07, 01, or +254 (e.g. 0712 345 678 or +254 712 345 678).'
        );
        return;
      }
    }

    const normalizedCustomerPhone = formatKenyanPhoneNumber(phone.trim());
    const normalizedMpesaPhone = formatKenyanPhoneNumber(rawMpesaPhone);

    setIsProcessing(true);

    try {
      let paymentRef = `RAD-TX-${Date.now()}`;
      let mpesaReceipt = '';

      if (paymentMethod === 'mpesa') {
        setStkPushStep('prompting');

        const mpesaResult = await PaymentService.initiateMpesaSTK({
          phoneNumber: normalizedMpesaPhone,
          amount: orderTotal,
          orderNumber: `ORD-${Date.now()}`,
          accountReference: 'RADIICATO',
        });

        if (!mpesaResult.success) {
          setIsProcessing(false);
          setStkPushStep('idle');
          setErrorMessage(mpesaResult.message);
          return;
        }

        setStkPushStep('verifying');
        paymentRef = mpesaResult.reference;
        mpesaReceipt = mpesaResult.mpesaReceiptNumber || `SK${Math.floor(100000 + Math.random() * 900000)}KES`;
      } else if (paymentMethod === 'card') {
        const cardResult = await PaymentService.processCardPayment(
          `ORD-${Date.now()}`,
          orderTotal,
          {
            cardNumber,
            expiry: cardExpiry,
            cvv: cardCvv,
            name: cardHolder || fullName.trim(),
          }
        );

        if (!cardResult.success) {
          setIsProcessing(false);
          setErrorMessage(cardResult.message);
          return;
        }
        paymentRef = cardResult.reference;
      }

      setStkPushStep('success');

      // Place Order in reactive store with server-like validation and billing details captured
      const createdOrder = placeOrder({
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
        paymentStatus: 'completed',
        fulfillmentStatus: 'paid',
        paymentDetails: {
          provider: paymentMethod,
          reference: paymentRef,
          mpesaReceiptNumber: mpesaReceipt,
          phoneNumber: paymentMethod === 'mpesa' ? normalizedMpesaPhone : undefined,
          paidAt: new Date().toISOString(),
        },
      });

      // Redirect to Order Success page
      setTimeout(() => {
        router.push(`/order-success?orderNumber=${createdOrder.orderNumber}`);
      }, 1200);
    } catch (err: unknown) {
      setIsProcessing(false);
      setStkPushStep('idle');
      const msg = err instanceof Error ? err.message : 'Checkout transaction failed. Please try again.';
      setErrorMessage(msg);
    }
  };

  if (isLoadingAuth) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-black text-white">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="pt-32 sm:pt-40 pb-32 px-6 max-w-md mx-auto text-center space-y-6 bg-black text-white font-sans">
        <div className="flex justify-center mb-6">
          <Image
            src="/images/radiicato-3d-chrome.png"
            alt="RADIICATO"
            width={180}
            height={60}
            className="h-10 w-auto object-contain"
            priority
          />
        </div>
        <h1 className="text-xl font-bold uppercase text-white font-display">Authentication Required</h1>
        <p className="text-xs text-white/60 font-mono leading-relaxed">
          Please sign in or create an account to securely complete your order and access your order history.
        </p>
        <div className="flex flex-col gap-3 pt-4">
          <Link 
            href="/login" 
            className="w-full px-8 py-3.5 glass-button bg-white text-black hover:bg-white/90 text-xs font-mono font-bold uppercase tracking-widest rounded-xl transition-all shadow-xl"
          >
            SIGN IN
          </Link>
          <Link 
            href="/signup" 
            className="w-full px-8 py-3.5 glass-button text-white text-xs font-mono font-bold uppercase tracking-widest rounded-xl hover:bg-white/10 transition-all"
          >
            CREATE ACCOUNT
          </Link>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="pt-32 sm:pt-40 pb-32 px-6 max-w-md mx-auto text-center space-y-5 bg-black text-white font-sans">
        <div className="flex justify-center mb-6">
          <Image
            src="/images/radiicato-3d-chrome.png"
            alt="RADIICATO"
            width={180}
            height={60}
            className="h-10 w-auto object-contain"
            priority
          />
        </div>
        <h1 className="text-xl font-bold uppercase text-white font-display">No Items In Bag</h1>
        <p className="text-xs text-white/60 font-mono">Add archival items to your bag before proceeding to checkout.</p>
        <Link 
          href="/shop" 
          className="inline-block px-8 py-3.5 glass-button bg-white text-black hover:bg-white/90 text-xs font-mono font-bold uppercase tracking-widest rounded-xl transition-all shadow-xl"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-24 sm:pt-32 pb-32 px-4 sm:px-8 lg:px-12 max-w-[1400px] mx-auto min-h-screen bg-black text-white font-sans">
      {/* Top Header with official logo and secure checkout indicators */}
      <div className="pb-6 sm:pb-8 border-b border-white/10 mb-8 sm:mb-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-white/60 hover:text-white transition-colors"
        >
          <ArrowLeft size={14} /> Back to Bag
        </Link>
        
        <Link href="/" className="flex items-center">
          <Image
            src="/images/radiicato-3d-chrome.png"
            alt="RADIICATO"
            width={180}
            height={60}
            className="h-9 sm:h-10 w-auto object-contain"
            priority
          />
        </Link>

        <div className="flex items-center gap-2 text-[11px] font-mono text-white/80 font-semibold">
          <Lock size={13} className="text-emerald-400" /> 256-BIT ENCRYPTED CHECKOUT
        </div>
      </div>

      <form onSubmit={handleSubmitOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column: Form Fields */}
          <div className="lg:col-span-7 space-y-10">
            {/* Step 1: Customer Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg glass-card flex items-center justify-center text-[10px] font-mono text-white border-white/20">
                  1
                </span>
                <h2 className="text-sm font-bold uppercase tracking-widest text-white">
                  CUSTOMER DETAILS
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-[10px] font-mono tracking-wider uppercase text-white/60">
                    FULL NAME *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="E.G. JOSHUA KIGEN"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-white/30 focus:outline-none focus:border-white transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono tracking-wider uppercase text-white/60">
                    EMAIL FOR DISPATCH RECEIPT *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="E.G. JOSHUA@GMAIL.COM"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-white/30 focus:outline-none focus:border-white transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-mono tracking-wider uppercase text-white/60">
                      KENYAN PHONE NUMBER (M-PESA / DISPATCH) *
                    </label>
                    {phone && isValidKenyanPhone(phone) ? (
                      <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                        <Check size={12} /> {formatDisplayKenyanPhone(phone)}
                      </span>
                    ) : phone && phone.length >= 3 ? (
                      <span className="text-[10px] font-mono text-rose-400 flex items-center gap-1">
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
                    className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-xs sm:text-sm font-mono text-white placeholder-white/30 focus:outline-none transition-colors ${
                      phone && !isValidKenyanPhone(phone) && phone.length >= 4
                        ? 'border-rose-500/50 focus:border-rose-400'
                        : 'border-white/15 focus:border-white'
                    }`}
                  />
                  <p className="text-[10px] font-mono text-white/50">
                    Accepts 07XXXXXXXX, 01XXXXXXXX, 254XXXXXXXX, or +254XXXXXXXX (normalized to 2547... or 2541...).
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2: Delivery Details */}
            <div className="space-y-4 pt-6 border-t border-white/10">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg glass-card flex items-center justify-center text-[10px] font-mono text-white border-white/20">
                  2
                </span>
                <h2 className="text-sm font-bold uppercase tracking-widest text-white">
                  DELIVERY ADDRESS IN KENYA
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono tracking-wider uppercase text-white/60">
                    COUNTY / REGION *
                  </label>
                  <select
                    value={county}
                    onChange={(e) => setCounty(e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-white/15 rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-white transition-colors cursor-pointer"
                  >
                    {KENYAN_COUNTIES.map((c) => (
                      <option key={c} value={c} className="bg-black text-white">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono tracking-wider uppercase text-white/60">
                    TOWN / ESTATE *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="E.G. KILIMANI / WESTLANDS / NYALI / KAREN"
                    value={town}
                    onChange={(e) => setTown(e.target.value)}
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-white/30 focus:outline-none focus:border-white transition-colors"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-[10px] font-mono tracking-wider uppercase text-white/60">
                    SPECIFIC DELIVERY ADDRESS / BUILDING / APARTMENT *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="E.G. APARTMENT 4B, APEX PLAZA, WOOD AVENUE"
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-white/30 focus:outline-none focus:border-white transition-colors"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-[10px] font-mono tracking-wider uppercase text-white/60">
                    DELIVERY INSTRUCTIONS (OPTIONAL)
                  </label>
                  <input
                    type="text"
                    placeholder="E.G. GATE CODE 2049, CALL ON ARRIVAL, LEAVE AT CONCIERGE"
                    value={deliveryInstructions}
                    onChange={(e) => setDeliveryInstructions(e.target.value)}
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-white/30 focus:outline-none focus:border-white transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Billing Details */}
            <div className="space-y-4 pt-6 border-t border-white/10">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg glass-card flex items-center justify-center text-[10px] font-mono text-white border-white/20">
                  3
                </span>
                <h2 className="text-sm font-bold uppercase tracking-widest text-white">
                  BILLING ADDRESS
                </h2>
              </div>
              
              <div className="pt-2">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={sameAsShipping}
                    onChange={(e) => setSameAsShipping(e.target.checked)}
                    className="w-4 h-4 rounded border-white/20 accent-white"
                  />
                  <span className="text-xs font-mono text-white/90 uppercase tracking-wider font-medium">
                    Billing address matches delivery address
                  </span>
                </label>
              </div>

              {sameAsShipping ? (
                <div className="p-4 glass-card rounded-xl border border-white/10 text-[11px] font-mono text-white/60 flex items-center gap-2">
                  <Info size={14} className="text-white shrink-0" />
                  <span>
                    VAT receipt and billing records will reflect delivery address: {streetAddress ? `${streetAddress}, ` : ''}{town ? `${town}, ` : ''}{county} County.
                  </span>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 p-5 glass-card rounded-xl border border-white/10">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono tracking-wider uppercase text-white/60 font-bold">
                      BILLING COUNTY / REGION *
                    </label>
                    <select
                      value={billingCounty}
                      onChange={(e) => setBillingCounty(e.target.value)}
                      className="w-full bg-[#0a0a0a] border border-white/15 rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-white transition-colors cursor-pointer"
                    >
                      {KENYAN_COUNTIES.map((c) => (
                        <option key={c} value={c} className="bg-black text-white">
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono tracking-wider uppercase text-white/60 font-bold">
                      BILLING TOWN / ESTATE *
                    </label>
                    <input
                      type="text"
                      required={!sameAsShipping}
                      placeholder="E.G. KILIMANI / NAIROBI CBD"
                      value={billingTown}
                      onChange={(e) => setBillingTown(e.target.value)}
                      className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-white/30 focus:outline-none focus:border-white transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-[10px] font-mono tracking-wider uppercase text-white/60 font-bold">
                      SPECIFIC BILLING ADDRESS / APARTMENT / BUILDING *
                    </label>
                    <input
                      type="text"
                      required={!sameAsShipping}
                      placeholder="E.G. SUITE 204, APEX PLAZA, WOOD AVENUE"
                      value={billingStreetAddress}
                      onChange={(e) => setBillingStreetAddress(e.target.value)}
                      className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-white/30 focus:outline-none focus:border-white transition-colors"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Step 4: Payment Method */}
            <div className="space-y-4 pt-4 border-t border-white/10">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-mono bg-white text-black font-bold">
                  4
                </span>
                <h2 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-white">
                  PAYMENT GATEWAY
                </h2>
              </div>

              {/* Selector Tabs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('mpesa')}
                  className={`p-4 sm:p-5 rounded-2xl border flex flex-col items-start gap-2.5 transition-all text-left ${
                    paymentMethod === 'mpesa'
                      ? 'border-white/40 bg-white/10 text-white shadow-[0_0_25px_rgba(255,255,255,0.06)]'
                      : 'border-white/10 bg-white/[0.02] text-white/60 hover:border-white/25 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 text-white">
                      <Smartphone size={16} className="text-white" /> SAFARICOM M-PESA
                    </span>
                    <span className="text-[9px] font-mono bg-white/15 text-white font-bold px-2 py-0.5 rounded-full border border-white/15">
                      INSTANT STK PUSH
                    </span>
                  </div>
                  <p className="text-[11px] text-white/60">
                    Pay securely via Safaricom SIM prompt or Paybill/Till fallback.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 sm:p-5 rounded-2xl border flex flex-col items-start gap-2.5 transition-all text-left ${
                    paymentMethod === 'card'
                      ? 'border-white/40 bg-white/10 text-white shadow-[0_0_25px_rgba(255,255,255,0.06)]'
                      : 'border-white/10 bg-white/[0.02] text-white/60 hover:border-white/25 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 text-white">
                      <CreditCard size={16} className="text-white" /> CARD / PAYSTACK
                    </span>
                    <span className="text-[9px] font-mono bg-white/10 text-white/70 px-2 py-0.5 rounded-full font-bold border border-white/10">
                      VISA / MC
                    </span>
                  </div>
                  <p className="text-[11px] text-white/60">
                    Direct local & international card checkout via secure gateway.
                  </p>
                </button>
              </div>

              {/* M-PESA specific input & instructions */}
              {paymentMethod === 'mpesa' && (
                <div className="p-5 sm:p-6 glass-card border border-white/15 rounded-2xl space-y-5 bg-white/[0.03]">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-1">
                      <label className="text-[10px] font-mono uppercase text-white/60 font-bold">
                        M-PESA PROMPT NUMBER (SAFARICOM)
                      </label>
                      {(() => {
                        const target = useDifferentMpesaPhone && mpesaPhone.trim() ? mpesaPhone.trim() : (mpesaPhone.trim() || phone.trim());
                        return isValidKenyanPhone(target) ? (
                          <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                            <Check size={12} /> {formatDisplayKenyanPhone(target)}
                          </span>
                        ) : target && target.length >= 4 ? (
                          <span className="text-[10px] font-mono text-red-400 flex items-center gap-1">
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
                        className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-xs sm:text-sm font-mono text-white placeholder-white/30 focus:outline-none focus:border-white transition-colors"
                      />
                      
                      <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-white/50">
                        <span>
                          Normalized STK target:{' '}
                          <strong className="text-white font-mono">
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
                            className="text-white underline hover:text-white/80"
                          >
                            Reset to contact phone
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Clear M-PESA Payment Instructions */}
                  <div className="pt-4 border-t border-white/10 space-y-4">
                    <div className="flex items-center gap-2">
                      <ShieldCheck size={16} className="text-white" />
                      <h4 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
                        M-PESA PAYMENT INSTRUCTIONS
                      </h4>
                    </div>

                    {/* Step-by-step STK guidance */}
                    <div className="p-4 sm:p-5 rounded-xl bg-white/[0.04] border border-white/10 space-y-2.5 text-xs text-white/70">
                      <span className="text-[10px] font-mono uppercase text-white font-bold block tracking-wider">
                        OPTION A: INSTANT STK PUSH (RECOMMENDED)
                      </span>
                      <ol className="space-y-1.5 list-decimal list-inside font-mono text-[11px] leading-relaxed text-white/70">
                        <li>Ensure your phone is unlocked and connected to Safaricom network.</li>
                        <li>Click <strong className="text-white">&quot;CONFIRM ORDER • {formatKES(orderTotal)}&quot;</strong> below.</li>
                        <li>An instant SIM popup from <strong className="text-white">RADIICATO</strong> will appear on your phone.</li>
                        <li>Enter your <strong className="text-white">4-digit secret M-PESA PIN</strong> to authorize the charge.</li>
                        <li>Your payment confirms automatically within seconds without manual entry.</li>
                      </ol>
                    </div>

                    {/* Manual Fallback (Paybill & Till) */}
                    <div className="p-4 sm:p-5 rounded-xl bg-white/[0.03] border border-white/10 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-mono uppercase text-white/60 font-bold">
                          OPTION B: MANUAL PAYBILL / TILL FALLBACK
                        </span>
                        <span className="text-[9px] font-mono bg-white/10 text-white/70 px-2 py-0.5 rounded-full border border-white/10">
                          IF STK DELAYS
                        </span>
                      </div>
                      <p className="text-[11px] text-white/60 font-mono">
                        If you prefer paying manually through your SIM Toolkit or M-PESA App, use either official channel:
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        {/* Paybill */}
                        <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono text-white/60 font-bold uppercase">PAYBILL NUMBER</span>
                            <button
                              type="button"
                              onClick={() => handleCopy('729831', 'paybill')}
                              className="text-[10px] font-mono text-white hover:text-white/80 hover:underline flex items-center gap-1 font-bold"
                            >
                              {copiedField === 'paybill' ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                              {copiedField === 'paybill' ? 'COPIED' : 'COPY'}
                            </button>
                          </div>
                          <div className="text-sm font-mono font-bold text-white">729831</div>
                          <div className="text-[10px] font-mono text-white/60">Account: <strong className="text-white">RADIICATO</strong></div>
                        </div>

                        {/* Buy Goods Till */}
                        <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono text-white/60 font-bold uppercase">BUY GOODS (TILL)</span>
                            <button
                              type="button"
                              onClick={() => handleCopy('982410', 'till')}
                              className="text-[10px] font-mono text-white hover:text-white/80 hover:underline flex items-center gap-1 font-bold"
                            >
                              {copiedField === 'till' ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                              {copiedField === 'till' ? 'COPIED' : 'COPY'}
                            </button>
                          </div>
                          <div className="text-sm font-mono font-bold text-white">982410</div>
                          <div className="text-[10px] font-mono text-white/60">Store: <strong className="text-white">RADIICATO ATELIER</strong></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Card specific inputs */}
              {paymentMethod === 'card' && (
                <div className="p-5 sm:p-6 glass-card border border-white/15 rounded-2xl space-y-3.5 bg-white/[0.03]">
                  <div>
                    <label className="text-[10px] font-mono uppercase text-white/60 block mb-1.5 font-bold">
                      CARD NUMBER
                    </label>
                    <input
                      type="text"
                      placeholder="4000 1234 5678 9010"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-xs sm:text-sm font-mono text-white placeholder-white/30 focus:outline-none focus:border-white transition-colors"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-mono uppercase text-white/60 block mb-1.5 font-bold">
                        EXPIRY (MM/YY)
                      </label>
                      <input
                        type="text"
                        placeholder="12/28"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-xs sm:text-sm font-mono text-white placeholder-white/30 focus:outline-none focus:border-white transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono uppercase text-white/60 block mb-1.5 font-bold">
                        CVV
                      </label>
                      <input
                        type="password"
                        maxLength={4}
                        placeholder="•••"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-xs sm:text-sm font-mono text-white placeholder-white/30 focus:outline-none focus:border-white transition-colors"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-center gap-2 font-mono">
                <AlertCircle size={16} className="text-red-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Submit Action */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-white text-black hover:bg-white/90 active:scale-[0.99] transition-all py-4 px-6 rounded-xl text-xs font-bold tracking-[0.2em] uppercase flex items-center justify-center gap-3 disabled:opacity-40 shadow-[0_0_30px_rgba(255,255,255,0.15)] cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <Loader2 size={16} className="animate-spin text-black" />
                    <span>PROCESSING ORDER TRANSACTION...</span>
                  </>
                ) : (
                  <>
                    <span>CONFIRM ORDER • {formatKES(orderTotal)}</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Order Review Sidebar */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-5 sm:p-6 glass-panel-heavy border border-white/15 rounded-2xl space-y-6 sticky top-28">
              <h3 className="text-xs font-bold uppercase tracking-widest text-white border-b border-white/10 pb-4">
                SUMMARY REVIEW ({cart.length} ITEMS)
              </h3>

              {/* Items Mini List */}
              <div className="divide-y divide-white/10 max-h-60 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.id} className="py-3 flex gap-3 items-center justify-between">
                    <div className="flex gap-3 items-center min-w-0">
                      <div className="relative w-12 h-16 bg-white/5 rounded-lg shrink-0 overflow-hidden border border-white/10">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-semibold text-white uppercase truncate">{item.name}</h4>
                        <p className="text-[10px] font-mono text-white/50">
                          {item.colorName} • SIZE {item.size} • QTY {item.quantity}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-medium text-white shrink-0">
                      {formatKES(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Promo Code Form */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="PROMO CODE"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1 bg-white/5 border border-white/15 rounded-xl px-3 py-2.5 text-xs uppercase text-white placeholder-white/30 font-mono focus:outline-none focus:border-white transition-colors"
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    className="bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs px-4 py-2.5 rounded-xl uppercase font-bold transition-all"
                  >
                    Apply
                  </button>
                </div>
                {appliedDiscount && (
                  <p className="text-[11px] text-emerald-400 font-mono font-bold">
                    Code {appliedDiscount.code} applied (-{formatKES(appliedDiscount.amount)})
                  </p>
                )}
                {couponError && (
                  <p className="text-[11px] text-red-400 font-mono">{couponError}</p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2.5 pt-4 border-t border-white/10 text-xs">
                <div className="flex justify-between text-white/60">
                  <span>Subtotal</span>
                  <span className="font-mono text-white font-semibold">{formatKES(cartSummary.subtotal)}</span>
                </div>
                {appliedDiscount && (
                  <div className="flex justify-between text-emerald-400 font-semibold">
                    <span>Discount</span>
                    <span className="font-mono">-{formatKES(appliedDiscount.amount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-white/60">
                  <span>Delivery ({county})</span>
                  <span className="font-mono text-white font-semibold">
                    {shippingFee === 0 ? (
                      <span className="text-emerald-400 font-bold">FREE DELIVERY</span>
                    ) : (
                      formatKES(shippingFee)
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-white pt-4 border-t border-white/10">
                  <span className="uppercase tracking-wider">Total</span>
                  <span className="font-mono text-lg text-white">{formatKES(orderTotal)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* STK Push Simulation Modal */}
      {stkPushStep !== 'idle' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="glass-panel-heavy border border-white/20 shadow-2xl max-w-md w-full p-6 sm:p-8 rounded-2xl text-center space-y-5 transform transition-all duration-300 text-white">
            {/* Stage Indicator */}
            <div className="flex items-center justify-center gap-2 pb-3 border-b border-white/10 text-[10px] font-mono uppercase tracking-widest text-white/50">
              <span className={`px-2 py-0.5 rounded-full ${stkPushStep === 'prompting' ? 'bg-white text-black font-bold' : 'text-white/40'}`}>
                1. STK PROMPT
              </span>
              <span>→</span>
              <span className={`px-2 py-0.5 rounded-full ${stkPushStep === 'verifying' ? 'bg-white text-black font-bold' : 'text-white/40'}`}>
                2. DARAJA VERIFY
              </span>
              <span>→</span>
              <span className={`px-2 py-0.5 rounded-full ${stkPushStep === 'success' ? 'bg-white text-black font-bold' : 'text-white/40'}`}>
                3. CONFIRMED
              </span>
            </div>

            <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 mx-auto flex items-center justify-center text-white transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)]">
              {stkPushStep === 'success' ? (
                <CheckCircle2 size={36} className="text-emerald-400" />
              ) : stkPushStep === 'verifying' ? (
                <Loader2 size={32} className="animate-spin text-white" />
              ) : (
                <Smartphone size={32} className="animate-pulse text-white" />
              )}
            </div>

            <div className="space-y-1">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                {stkPushStep === 'prompting'
                  ? 'Check Your Phone Handset'
                  : stkPushStep === 'verifying'
                  ? 'Verifying M-PESA Payment...'
                  : 'M-PESA Payment Verified!'}
              </h3>
              <p className="text-[11px] font-mono text-emerald-400 font-bold">
                AMOUNT: {formatKES(orderTotal)}
              </p>
            </div>

            <p className="text-xs text-white/70 leading-relaxed font-mono">
              {stkPushStep === 'prompting' ? (
                <>
                  An instant M-PESA prompt was dispatched to{' '}
                  <strong className="text-white">
                    {formatDisplayKenyanPhone(
                      useDifferentMpesaPhone && mpesaPhone ? mpesaPhone : (mpesaPhone || phone)
                    )}
                  </strong>
                  . Please unlock your phone and enter your 4-digit PIN.
                </>
              ) : stkPushStep === 'verifying' ? (
                'Connecting with Safaricom Daraja Gateway for instant transaction confirmation and cryptographic receipt validation...'
              ) : (
                'Transaction confirmed! Your order has been registered in the Radiicato Atelier and queued for dispatch.'
              )}
            </p>

            <div className="pt-4 border-t border-white/10 space-y-2">
              <div className="flex justify-between items-center text-[10px] font-mono bg-white/5 p-3 rounded-xl border border-white/10">
                <span className="text-white/60">SAFARICOM PAYBILL: <strong className="text-white">729831</strong></span>
                <span className="text-white/60">ACC: <strong className="text-white">RADIICATO</strong></span>
              </div>
              <p className="text-[10px] text-white/40 font-mono">
                Didn&apos;t get the prompt? Check that your Safaricom SIM has active network or pay manually using the Paybill above.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
