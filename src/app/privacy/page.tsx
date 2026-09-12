'use client';

import React from 'react';

export default function PrivacyPage() {
  return (
    <main className="pt-28 sm:pt-36 pb-32 px-5 sm:px-8 lg:px-12 bg-white min-h-screen">
      <div className="max-w-3xl mx-auto">
        <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#71717A] mb-3">DATA GOVERNANCE</p>
        <h1 className="text-display-sm font-black uppercase mb-4">PRIVACY POLICY</h1>
        <p className="text-[10px] text-[#71717A] font-mono uppercase tracking-[0.2em] mb-12 pb-10 border-b border-[#E4E4E7]">
          COMPLIANT WITH THE KENYA DATA PROTECTION ACT (2019) • LAST UPDATED: SEPTEMBER 2026
        </p>

        <div className="space-y-8 text-sm text-[#71717A] leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#0A0A0A]">1. INFORMATION WE COLLECT</h2>
            <p>
              When you interact with the Radiicato storefront or place an order, we collect personal data including your full name, email address, Kenyan telephone number, delivery address, and transaction logs.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#0A0A0A]">2. PAYMENT TRANSACTION DATA</h2>
            <p>
              All M-PESA mobile transactions are orchestrated securely via Safaricom Daraja API. All card payments are tokenized via PCI-DSS certified gateway partners (Paystack). Radiicato does not store plaintext card numbers or M-PESA PINs on our servers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#0A0A0A]">3. PURPOSE OF PROCESSING</h2>
            <p>
              Your information is utilized solely to process your orders, schedule courier dispatch via Fargo Courier / Wells Fargo, send real-time delivery notifications, and ensure account security.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
