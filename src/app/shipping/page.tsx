'use client';

import React from 'react';
import Link from 'next/link';
import { Truck, ShieldCheck, Clock, Package } from 'lucide-react';
import { INITIAL_SHIPPING_ZONES } from '@/lib/seed-data';
import { formatKES } from '@/lib/utils';

export default function ShippingPage() {
  return (
    <div className="pt-28 sm:pt-36 pb-32 px-6 sm:px-12 max-w-4xl mx-auto min-h-screen bg-white">
      <div className="pb-10 border-b border-[#E4E4E7] mb-12">
        <span className="text-[10px] font-mono tracking-widest uppercase text-[#4D5936] font-bold">DISPATCH & LOGISTICS</span>
        <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-[#0A0A0A] font-display mt-1">
          SHIPPING INFORMATION
        </h1>
        <p className="text-xs sm:text-sm text-[#71717A] max-w-lg mt-2 font-light">
          We dispatch all Radiicato garments directly from our Nairobi studio in custom tamper-evident packaging.
        </p>
      </div>

      <div className="space-y-12">
        {/* Highlight banner */}
        <div className="p-6 bg-[#4D5936]/5 border border-[#4D5936]/20 flex items-start gap-4">
          <ShieldCheck size={24} className="text-[#4D5936] mt-0.5 flex-shrink-0" />
          <div className="space-y-1 text-xs">
            <h3 className="font-bold uppercase tracking-wider text-[#0A0A0A]">
              COMPLIMENTARY EXPRESS NAIROBI SHIPPING OVER KES 10,000
            </h3>
            <p className="text-[#71717A] leading-relaxed">
              All domestic Kenyan orders meeting or exceeding KES 10,000 qualify for free express delivery.
            </p>
          </div>
        </div>

        {/* Shipping Rates Table */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-widest text-[#0A0A0A]">
            KENYAN SHIPPING ZONES & RATES
          </h2>

          <div className="divide-y divide-[#E4E4E7] border border-[#E4E4E7] bg-[#FAFAF9] shadow-sm">
            {INITIAL_SHIPPING_ZONES.map((zone) => (
              <div key={zone.id} className="p-6 space-y-3">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                  <h3 className="text-sm font-bold uppercase text-[#0A0A0A] font-display">
                    {zone.name}
                  </h3>
                  <div className="text-xs font-mono font-bold text-[#0A0A0A]">
                    STANDARD: {formatKES(zone.standardFee)} • EXPRESS: {formatKES(zone.expressFee)}
                  </div>
                </div>
                <p className="text-xs text-[#71717A] font-mono">
                  TIMELINE: {zone.estimatedDays}
                </p>
                <p className="text-[11px] text-[#4D5936] font-medium font-mono">
                  Free shipping automatically applies for basket sizes above {formatKES(zone.freeShippingThreshold)}.
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* International Dispatch */}
        <div className="p-6 bg-[#FAFAF9] border border-[#E4E4E7] space-y-3 text-xs shadow-sm">
          <h3 className="font-bold uppercase tracking-wider text-[#0A0A0A]">INTERNATIONAL COURIER (DHL EXPRESS)</h3>
          <p className="text-[#71717A] leading-relaxed font-light">
            We ship worldwide via DHL Express. International orders usually arrive in 3-5 business days across the UK, US, Europe, and UAE. Customs tariffs and duties are calculated in accordance with your destination country.
          </p>
        </div>
      </div>
    </div>
  );
}
