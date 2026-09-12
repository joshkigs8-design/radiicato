'use client';

import React from 'react';

export default function TermsPage() {
  return (
    <main className="pt-28 sm:pt-36 pb-32 px-5 sm:px-8 lg:px-12 bg-white min-h-screen">
      <div className="max-w-3xl mx-auto">
        <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#71717A] mb-3">LEGAL & ATELIER CONDITIONS</p>
        <h1 className="text-display-sm font-black uppercase mb-4">TERMS & CONDITIONS</h1>
        <p className="text-[10px] text-[#71717A] font-mono uppercase tracking-[0.2em] mb-12 pb-10 border-b border-[#E4E4E7]">
          OPERATED BY RADIICATO APPAREL LIMITED • REGISTRATION NAIROBI, KENYA
        </p>

        <div className="space-y-8 text-sm text-[#71717A] leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#0A0A0A]">1. INTRODUCTION</h2>
            <p>
              By accessing or ordering from the Radiicato digital portal, you agree to be bound by these Terms and Conditions. Radiicato reserves the right to decline or cancel orders if inventory discrepancies or fraud indicators occur.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#0A0A0A]">2. PRICING & CURRENCY</h2>
            <p>
              All prices listed on the storefront are denominated in Kenyan Shillings (KES) inclusive of applicable domestic taxes unless otherwise specified. We reserve the right to amend pricing prior to order confirmation.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#0A0A0A]">3. LIMITED RUN ARCHIVES</h2>
            <p>
              Due to the extreme scarcity of our limited drop runs (strictly capped at 50 pieces), purchases are allocated strictly on a verified first-completed transaction basis. Adding a piece to your cart does not reserve inventory until payment completes.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
