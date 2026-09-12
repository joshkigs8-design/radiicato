'use client';

import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { INITIAL_SHIPPING_ZONES } from '@/lib/seed-data';
import { formatKES } from '@/lib/utils';

export default function ShippingPage() {
  return (
    <main className="pt-28 sm:pt-36 pb-32 px-5 sm:px-8 lg:px-12 bg-white min-h-screen">
      <div className="max-w-3xl mx-auto">
        <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#71717A] mb-3">DISPATCH & LOGISTICS</p>
        <h1 className="text-display-sm font-black uppercase mb-4">SHIPPING INFORMATION</h1>
        <p className="text-sm text-[#71717A] mb-12 pb-10 border-b border-[#E4E4E7]">
          We dispatch all Radiicato garments directly from our Nairobi studio in custom tamper-evident packaging.
        </p>

        <div className="space-y-12">
          {/* Highlight banner */}
          <div className="p-8 border border-[#E4E4E7] flex items-start gap-4">
            <ShieldCheck size={24} className="text-[#0A0A0A] mt-0.5 flex-shrink-0" />
            <div className="space-y-2 text-sm">
              <h3 className="font-bold uppercase tracking-wider text-[#0A0A0A]">
                COMPLIMENTARY EXPRESS NAIROBI SHIPPING OVER KES 10,000
              </h3>
              <p className="text-[#71717A] leading-relaxed">
                All domestic Kenyan orders meeting or exceeding KES 10,000 qualify for free express delivery.
              </p>
            </div>
          </div>

          {/* Shipping Rates Table */}
          <div className="space-y-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#0A0A0A]">
              KENYAN SHIPPING ZONES & RATES
            </h2>

            <div className="divide-y divide-[#E4E4E7] border border-[#E4E4E7]">
              {INITIAL_SHIPPING_ZONES.map((zone) => (
                <div key={zone.id} className="p-6 space-y-3">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <h3 className="text-sm font-bold uppercase text-[#0A0A0A]">
                      {zone.name}
                    </h3>
                    <div className="text-[11px] font-mono font-bold text-[#0A0A0A] uppercase tracking-wider">
                      STANDARD: {formatKES(zone.standardFee)} • EXPRESS: {formatKES(zone.expressFee)}
                    </div>
                  </div>
                  <p className="text-[11px] text-[#71717A] font-mono uppercase tracking-wider">
                    TIMELINE: {zone.estimatedDays}
                  </p>
                  <p className="text-[11px] text-[#0A0A0A] font-mono uppercase tracking-wider mt-2">
                    Free shipping automatically applies for basket sizes above {formatKES(zone.freeShippingThreshold)}.
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* International Dispatch */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#0A0A0A]">INTERNATIONAL COURIER (DHL EXPRESS)</h3>
            <p className="text-sm text-[#71717A] leading-relaxed">
              We ship worldwide via DHL Express. International orders usually arrive in 3-5 business days across the UK, US, Europe, and UAE. Customs tariffs and duties are calculated in accordance with your destination country.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
