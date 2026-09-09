'use client';

import React from 'react';
import Link from 'next/link';
import { RotateCcw, ShieldCheck, ArrowRight } from 'lucide-react';

export default function ReturnsPage() {
  return (
    <div className="pt-28 sm:pt-36 pb-32 px-6 sm:px-12 max-w-4xl mx-auto min-h-screen bg-white">
      <div className="pb-10 border-b border-[#E4E4E7] mb-12">
        <span className="text-[10px] font-mono tracking-widest uppercase text-[#4D5936] font-bold">CLIENT ASSURANCE</span>
        <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-[#0A0A0A] font-display mt-1">
          RETURNS & EXCHANGES
        </h1>
        <p className="text-xs sm:text-sm text-[#71717A] max-w-lg mt-2 font-light">
          We guarantee the construction and textile integrity of every Radiicato garment.
        </p>
      </div>

      <div className="space-y-10 text-xs sm:text-sm text-[#71717A] leading-relaxed font-light">
        <div className="p-6 bg-[#FAFAF9] border border-[#E4E4E7] space-y-3 shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#0A0A0A]">7-DAY RETURN WINDOW</h3>
          <p>
            You have 7 calendar days from the date of package delivery to request an exchange or return for store credit.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#0A0A0A]">ELIGIBILITY CONDITIONS</h3>
          <ul className="list-disc pl-5 space-y-2 text-xs font-mono text-[#71717A]">
            <li>Garments must be entirely unworn, unwashed, and without scent or deodorant marks.</li>
            <li>Original metallic security tags and woven neck labels must remain attached.</li>
            <li>Limited Edition serial-numbered pieces (e.g. 50 pcs run) are eligible for size exchange only if alternate sizes exist in the atelier inventory.</li>
          </ul>
        </div>

        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#0A0A0A]">HOW TO INITIATE AN EXCHANGE</h3>
          <p>
            Contact our concierge via WhatsApp (+254 712 904 883) or email concierge@radiicato.co.ke with your order number (e.g. RAD-2026-000123) and the replacement size required. In Nairobi, our rider will conduct a doorstep swap.
          </p>
        </div>
      </div>
    </div>
  );
}
