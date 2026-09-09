'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ShieldCheck, Lock, ArrowLeft, ArrowRight, Smartphone, 
  CreditCard, CheckCircle2, AlertCircle, Loader2 
} from 'lucide-react';
import { useStore } from '@/lib/use-store';
import { formatKES } from '@/lib/utils';
import { PaymentService, formatKenyanPhoneNumber } from '@/lib/payment';
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
  const { cart, cartSummary, placeOrder, validateCoupon } = useStore();

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('07');
  const [county, setCounty] = useState('Nairobi');
  const [town, setTown] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<PaymentProvider>('mpesa');
  const [mpesaPhone, setMpesaPhone] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardHolder, setCardHolder] = useState('');

  // Coupon State
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<{ amount: number; code: string } | null>(null);
  const [couponError, setCouponError] = useState('');

  // Processing & Simulation State
  const [isProcessing, setIsProcessing] = useState(false);
  const [stkPushStep, setStkPushStep] = useState<'idle' | 'prompting' | 'verifying' | 'success'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

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

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (cart.length === 0) {
      setErrorMessage('Your cart is empty. Please add items to order.');
      return;
    }

    if (!fullName || !email || !phone || !county || !town || !streetAddress) {
      setErrorMessage('Please fill in all required customer and delivery details.');
      return;
    }

    setIsProcessing(true);

    try {
      let paymentRef = `RAD-TX-${Date.now()}`;
      let mpesaReceipt = '';

      if (paymentMethod === 'mpesa') {
        const targetPhone = mpesaPhone.trim() || phone.trim();
        setStkPushStep('prompting');

        const mpesaResult = await PaymentService.initiateMpesaSTK({
          phoneNumber: targetPhone,
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
            name: cardHolder || fullName,
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

      // Place Order in reactive store with server-like validation
      const createdOrder = placeOrder({
        customerName: fullName,
        email,
        phone,
        shippingAddress: {
          fullName,
          email,
          phone,
          county,
          town,
          streetAddress,
          deliveryInstructions,
        },
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
          phoneNumber: paymentMethod === 'mpesa' ? formatKenyanPhoneNumber(mpesaPhone || phone) : undefined,
          paidAt: new Date().toISOString(),
        },
      });

      // Redirect to Order Success page
      setTimeout(() => {
        router.push(`/order-success?orderNumber=${createdOrder.orderNumber}`);
      }, 1000);
    } catch (err: unknown) {
      setIsProcessing(false);
      setStkPushStep('idle');
      const msg = err instanceof Error ? err.message : 'Checkout transaction failed. Please try again.';
      setErrorMessage(msg);
    }
  };

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
        <p className="text-xs text-[#71717A]">Add archival items to your bag before proceeding to checkout.</p>
        <Link 
          href="/shop" 
          className="inline-block px-8 py-3.5 bg-[#0A0A0A] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#27272A] transition-colors"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-28 sm:pt-36 pb-32 px-6 sm:px-12 max-w-[1400px] mx-auto min-h-screen">
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

        <div className="flex items-center gap-2 text-[11px] font-mono text-[#4D5936] font-semibold">
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
                <span className="w-6 h-6 rounded-full bg-[#0A0A0A] text-white text-xs font-mono font-bold flex items-center justify-center">
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
                    className="w-full bg-white border border-[#E4E4E7] p-3 text-xs uppercase text-[#0A0A0A] placeholder-[#A1A1AA] font-mono focus:outline-none focus:border-[#0A0A0A] transition-colors"
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
                    className="w-full bg-white border border-[#E4E4E7] p-3 text-xs uppercase text-[#0A0A0A] placeholder-[#A1A1AA] font-mono focus:outline-none focus:border-[#0A0A0A] transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono tracking-wider uppercase text-[#71717A]">
                    KENYAN PHONE NUMBER (M-PESA) *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="0712 345 678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-white border border-[#E4E4E7] p-3 text-xs font-mono text-[#0A0A0A] placeholder-[#A1A1AA] focus:outline-none focus:border-[#0A0A0A] transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Delivery Details */}
            <div className="space-y-4 pt-4 border-t border-[#E4E4E7]">
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-[#0A0A0A] text-white text-xs font-mono font-bold flex items-center justify-center">
                  2
                </span>
                <h2 className="text-sm font-bold uppercase tracking-widest text-[#0A0A0A]">
                  DELIVERY ADDRESS IN KENYA
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono tracking-wider uppercase text-[#71717A]">
                    COUNTY *
                  </label>
                  <select
                    value={county}
                    onChange={(e) => setCounty(e.target.value)}
                    className="w-full bg-white border border-[#E4E4E7] p-3 text-xs uppercase text-[#0A0A0A] font-mono focus:outline-none focus:border-[#0A0A0A] transition-colors"
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
                    TOWN / SUBURB *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="E.G. KILIMANI / WESTLANDS / NYALI"
                    value={town}
                    onChange={(e) => setTown(e.target.value)}
                    className="w-full bg-white border border-[#E4E4E7] p-3 text-xs uppercase text-[#0A0A0A] placeholder-[#A1A1AA] font-mono focus:outline-none focus:border-[#0A0A0A] transition-colors"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-[10px] font-mono tracking-wider uppercase text-[#71717A]">
                    STREET ADDRESS / BUILDING / APARTMENT *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="E.G. APARTMENT 4B, APEX PLAZA, WOOD AVENUE"
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    className="w-full bg-white border border-[#E4E4E7] p-3 text-xs uppercase text-[#0A0A0A] placeholder-[#A1A1AA] font-mono focus:outline-none focus:border-[#0A0A0A] transition-colors"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-[10px] font-mono tracking-wider uppercase text-[#71717A]">
                    DELIVERY INSTRUCTIONS (OPTIONAL)
                  </label>
                  <input
                    type="text"
                    placeholder="E.G. GATE CODE 2049, CALL ON ARRIVAL"
                    value={deliveryInstructions}
                    onChange={(e) => setDeliveryInstructions(e.target.value)}
                    className="w-full bg-white border border-[#E4E4E7] p-3 text-xs uppercase text-[#0A0A0A] placeholder-[#A1A1AA] font-mono focus:outline-none focus:border-[#0A0A0A] transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Payment Method */}
            <div className="space-y-4 pt-4 border-t border-[#E4E4E7]">
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-[#0A0A0A] text-white text-xs font-mono font-bold flex items-center justify-center">
                  3
                </span>
                <h2 className="text-sm font-bold uppercase tracking-widest text-[#0A0A0A]">
                  PAYMENT GATEWAY
                </h2>
              </div>

              {/* Selector Tabs */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('mpesa')}
                  className={`p-4 border flex flex-col items-start gap-2 transition-all ${
                    paymentMethod === 'mpesa'
                      ? 'border-[#4D5936] bg-[#4D5936]/5 text-[#0A0A0A] shadow-sm'
                      : 'border-[#E4E4E7] bg-white text-[#71717A] hover:border-[#A1A1AA]'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 text-[#0A0A0A]">
                      <Smartphone size={16} className="text-[#4D5936]" /> SAFARICOM M-PESA
                    </span>
                    <span className="text-[9px] font-mono bg-[#4D5936]/15 text-[#4D5936] font-bold px-1.5 py-0.5 rounded">
                      INSTANT STK PUSH
                    </span>
                  </div>
                  <p className="text-[11px] text-[#71717A] text-left">
                    Pay securely using your Safaricom SIM prompt.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 border flex flex-col items-start gap-2 transition-all ${
                    paymentMethod === 'card'
                      ? 'border-[#4D5936] bg-[#4D5936]/5 text-[#0A0A0A] shadow-sm'
                      : 'border-[#E4E4E7] bg-white text-[#71717A] hover:border-[#A1A1AA]'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 text-[#0A0A0A]">
                      <CreditCard size={16} className="text-[#4D5936]" /> CARD / PAYSTACK
                    </span>
                    <span className="text-[9px] font-mono bg-[#F4F4F5] text-[#71717A] px-1.5 py-0.5 rounded font-bold">
                      VISA / MC
                    </span>
                  </div>
                  <p className="text-[11px] text-[#71717A] text-left">
                    Direct local & international card checkout.
                  </p>
                </button>
              </div>

              {/* M-PESA specific input */}
              {paymentMethod === 'mpesa' && (
                <div className="p-5 bg-[#FAFAF9] border border-[#E4E4E7] space-y-2">
                  <label className="text-[10px] font-mono uppercase text-[#71717A] font-bold">
                    M-PESA PROMPT NUMBER (SAFARICOM)
                  </label>
                  <input
                    type="tel"
                    placeholder="07XX XXX XXX"
                    value={mpesaPhone || phone}
                    onChange={(e) => setMpesaPhone(e.target.value)}
                    className="w-full bg-white border border-[#E4E4E7] p-3 text-xs font-mono text-[#0A0A0A] placeholder-[#A1A1AA] focus:outline-none focus:border-[#0A0A0A] transition-colors"
                  />
                  <p className="text-[11px] font-mono text-[#71717A]">
                    An instant STK Push prompt will be sent to this phone to enter your 4-digit M-PESA PIN.
                  </p>
                </div>
              )}

              {/* Card specific inputs */}
              {paymentMethod === 'card' && (
                <div className="p-5 bg-[#FAFAF9] border border-[#E4E4E7] space-y-3">
                  <div>
                    <label className="text-[10px] font-mono uppercase text-[#71717A] block mb-1 font-bold">
                      CARD NUMBER
                    </label>
                    <input
                      type="text"
                      placeholder="4000 1234 5678 9010"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-white border border-[#E4E4E7] p-3 text-xs font-mono text-[#0A0A0A] placeholder-[#A1A1AA] focus:outline-none focus:border-[#0A0A0A] transition-colors"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-mono uppercase text-[#71717A] block mb-1 font-bold">
                        EXPIRY (MM/YY)
                      </label>
                      <input
                        type="text"
                        placeholder="12/28"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full bg-white border border-[#E4E4E7] p-3 text-xs font-mono text-[#0A0A0A] placeholder-[#A1A1AA] focus:outline-none focus:border-[#0A0A0A] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono uppercase text-[#71717A] block mb-1 font-bold">
                        CVV
                      </label>
                      <input
                        type="password"
                        maxLength={4}
                        placeholder="•••"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full bg-white border border-[#E4E4E7] p-3 text-xs font-mono text-[#0A0A0A] placeholder-[#A1A1AA] focus:outline-none focus:border-[#0A0A0A] transition-colors"
                      />
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
                className="w-full bg-[#0A0A0A] text-white hover:bg-[#27272A] transition-all py-4 px-6 text-xs font-bold tracking-[0.2em] uppercase flex items-center justify-center gap-3 disabled:opacity-50 shadow-md"
              >
                {isProcessing ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
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
                    className="bg-[#0A0A0A] hover:bg-[#27272A] text-white text-xs px-4 py-2 uppercase font-bold transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {appliedDiscount && (
                  <p className="text-[11px] text-[#4D5936] font-mono font-bold">
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
                  <div className="flex justify-between text-[#4D5936] font-semibold">
                    <span>Discount</span>
                    <span className="font-mono">-{formatKES(appliedDiscount.amount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#71717A]">
                  <span>Delivery ({county})</span>
                  <span className="font-mono text-[#0A0A0A] font-semibold">
                    {shippingFee === 0 ? (
                      <span className="text-[#4D5936] font-bold">FREE DELIVERY</span>
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

      {/* STK Push Simulation Modal */}
      {stkPushStep !== 'idle' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white border border-[#E4E4E7] shadow-2xl max-w-sm w-full p-7 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#4D5936]/10 border border-[#4D5936]/20 mx-auto flex items-center justify-center text-[#4D5936]">
              {stkPushStep === 'success' ? (
                <CheckCircle2 size={36} />
              ) : (
                <Smartphone size={32} className="animate-pulse" />
              )}
            </div>

            <h3 className="text-sm font-bold uppercase tracking-wider text-[#0A0A0A]">
              {stkPushStep === 'prompting'
                ? 'Check Your Phone'
                : stkPushStep === 'verifying'
                ? 'Verifying M-PESA Payment...'
                : 'M-PESA Payment Verified!'}
            </h3>

            <p className="text-xs text-[#71717A] leading-relaxed font-light">
              {stkPushStep === 'prompting'
                ? `An M-PESA STK Push prompt has been sent to ${formatKenyanPhoneNumber(
                    mpesaPhone || phone
                  )}. Please enter your 4-digit PIN to authorize payment of ${formatKES(orderTotal)}.`
                : stkPushStep === 'verifying'
                ? 'Communicating with Safaricom Daraja Gateway for instant transaction confirmation...'
                : 'Order confirmed and registered in Radiicato Atelier.'}
            </p>

            <div className="pt-3 border-t border-[#F4F4F5]">
              <span className="text-[10px] font-mono text-[#4D5936] font-bold uppercase tracking-wider">
                SAFARICOM PAYBILL: 729831 • RADIICATO
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
