'use client';

import React from 'react';

export default function ReturnsPage() {
  return (
    <main className="pt-28 sm:pt-36 pb-32 px-5 sm:px-8 lg:px-12 bg-white min-h-screen">
      <div className="max-w-3xl mx-auto">
        <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#71717A] mb-3">CLIENT ASSURANCE</p>
        <h1 className="text-display-sm font-black uppercase mb-4">RETURNS & EXCHANGES</h1>
        <p className="text-sm text-[#71717A] mb-12 pb-10 border-b border-[#E4E4E7]">
          We guarantee the construction and textile integrity of every Radiicato garment.
        </p>

        <div className="space-y-12 text-sm text-[#71717A] leading-relaxed">
          <div className="p-8 border border-[#E4E4E7] space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#0A0A0A]">7-DAY RETURN WINDOW</h3>
            <p>
              You have 7 calendar days from the date of package delivery to request an exchange or return for store credit.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#0A0A0A]">ELIGIBILITY CONDITIONS</h3>
            <ul className="list-disc pl-5 space-y-3 text-sm text-[#71717A]">
              <li>Garments must be entirely unworn, unwashed, and without scent or deodorant marks.</li>
              <li>Original metallic security tags and woven neck labels must remain attached.</li>
              <li>Limited Edition serial-numbered pieces (e.g. 50 pcs run) are eligible for size exchange only if alternate sizes exist in the atelier inventory.</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#0A0A0A]">HOW TO INITIATE AN EXCHANGE</h3>
            <p>
              Contact our concierge via WhatsApp (+254 712 904 883) or email concierge@radiicato.co.ke with your order number (e.g. RAD-2026-000123) and the replacement size required. In Nairobi, our rider will conduct a doorstep swap.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
