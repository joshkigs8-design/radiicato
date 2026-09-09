'use client';

import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="pt-28 sm:pt-36 pb-32 px-6 sm:px-12 max-w-4xl mx-auto min-h-screen bg-white">
      <div className="pb-10 border-b border-[#E4E4E7] mb-12">
        <span className="text-[10px] font-mono tracking-widest uppercase text-[#4D5936] font-bold">DATA GOVERNANCE</span>
        <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-[#0A0A0A] font-display mt-1">
          PRIVACY POLICY
        </h1>
        <p className="text-xs text-[#71717A] font-mono mt-2">
          COMPLIANT WITH THE KENYA DATA PROTECTION ACT (2019) • LAST UPDATED: SEPTEMBER 2026
        </p>
      </div>

      <div className="space-y-8 text-xs sm:text-sm text-[#71717A] leading-relaxed font-light">
        <section className="space-y-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#0A0A0A]">1. INFORMATION WE COLLECT</h2>
          <p>
            When you interact with the Radiicato storefront or place an order, we collect personal data including your full name, email address, Kenyan telephone number, delivery address, and transaction logs.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#0A0A0A]">2. PAYMENT TRANSACTION DATA</h2>
          <p>
            All M-PESA mobile transactions are orchestrated securely via Safaricom Daraja API. All card payments are tokenized via PCI-DSS certified gateway partners (Paystack). Radiicato does not store plaintext card numbers or M-PESA PINs on our servers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#0A0A0A]">3. PURPOSE OF PROCESSING</h2>
          <p>
            Your information is utilized solely to process your orders, schedule courier dispatch via Fargo Courier / Wells Fargo, send real-time delivery notifications, and ensure account security.
          </p>
        </section>
      </div>
    </div>
  );
}
