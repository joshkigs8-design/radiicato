'use client';

import React from 'react';

export default function TermsPage() {
  return (
    <div className="pt-28 sm:pt-36 pb-32 px-6 sm:px-12 max-w-4xl mx-auto min-h-screen bg-white">
      <div className="pb-10 border-b border-[#E4E4E7] mb-12">
        <span className="text-[10px] font-mono tracking-widest uppercase text-[#4D5936] font-bold">LEGAL & ATELIER CONDITIONS</span>
        <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-[#0A0A0A] font-display mt-1">
          TERMS & CONDITIONS
        </h1>
        <p className="text-xs text-[#71717A] font-mono mt-2">
          OPERATED BY RADIICATO APPAREL LIMITED • REGISTRATION NAIROBI, KENYA
        </p>
      </div>

      <div className="space-y-8 text-xs sm:text-sm text-[#71717A] leading-relaxed font-light">
        <section className="space-y-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#0A0A0A]">1. INTRODUCTION</h2>
          <p>
            By accessing or ordering from the Radiicato digital portal, you agree to be bound by these Terms and Conditions. Radiicato reserves the right to decline or cancel orders if inventory discrepancies or fraud indicators occur.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#0A0A0A]">2. PRICING & CURRENCY</h2>
          <p>
            All prices listed on the storefront are denominated in Kenyan Shillings (KES) inclusive of applicable domestic taxes unless otherwise specified. We reserve the right to amend pricing prior to order confirmation.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#0A0A0A]">3. LIMITED RUN ARCHIVES</h2>
          <p>
            Due to the extreme scarcity of our limited drop runs (strictly capped at 50 pieces), purchases are allocated strictly on a verified first-completed transaction basis. Adding a piece to your cart does not reserve inventory until payment completes.
          </p>
        </section>
      </div>
    </div>
  );
}
