'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';

const FAQS = [
  {
    q: 'HOW DO RADIICATO OVERSIZED TEES FIT?',
    a: 'All Radiicato tees are cut in an intentional relaxed streetwear silhouette featuring dropped shoulders, wide double-needle collar ribbing, and structured drape. If you prefer the intended oversized streetwear drape, take your normal size. For a standard or tailored fit, we recommend sizing down one full size.',
  },
  {
    q: 'WHAT GSM ARE RADIICATO GARMENTS?',
    a: 'We use custom heavyweight organic textiles: our graphic and core t-shirts are milled at 280 GSM combed cotton. Our luxury hoodies and fleece outerwear are cut from 460 GSM high-density loopback French terry.',
  },
  {
    q: 'HOW DO M-PESA PAYMENTS OPERATE AT CHECKOUT?',
    a: 'When you select M-PESA at checkout, an automated Daraja STK Push prompt is sent directly to your Safaricom SIM. Simply enter your 4-digit M-PESA PIN. Once confirmed, your payment receipt is registered instantaneously without needing manual reference codes.',
  },
  {
    q: 'WHAT ARE THE SHIPPING TIMELINES IN NAIROBI & KENYA?',
    a: 'Nairobi orders placed before 2:00 PM are dispatched same-day or next business day. Upcountry locations (Mombasa, Kisumu, Nakuru, Eldoret) arrive within 1-2 business days via Fargo Courier. All Kenyan orders above KES 10,000 enjoy free express delivery.',
  },
  {
    q: 'CAN I EXCHANGE SIZES IF IT DOES NOT FIT?',
    a: 'Yes. We offer a hassle-free 7-day exchange window for all unworn garments with original metallic tags attached. Contact concierge@radiicato.co.ke or message our WhatsApp helpline.',
  },
  {
    q: 'ARE LIMITED DROPS RESTOCKED?',
    a: 'Garments marked as LIMITED DROP (e.g. numbered series of 50 pieces) are strictly archival and will never be reprinted or remanufactured once sold out.',
  },
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((faq) => ({
    '@type': 'Question',
    name: faq.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.a,
    },
  })),
};

export default function FAQPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <div className="pt-28 sm:pt-36 pb-32 px-6 sm:px-12 max-w-4xl mx-auto min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="pb-10 border-b border-[#E4E4E7] mb-12">
        <span className="text-[10px] font-mono tracking-widest uppercase text-[#4D5936] font-bold">CLIENT KNOWLEDGE BASE</span>
        <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-[#0A0A0A] font-display mt-1">
          FREQUENTLY ASKED QUESTIONS
        </h1>
        <p className="text-xs sm:text-sm text-[#71717A] max-w-lg mt-2 font-light">
          Essential details regarding sizing drape, heavyweight textiles, Kenyan dispatch, and exchange protocols.
        </p>
      </div>

      <div className="divide-y divide-[#E4E4E7] border-y border-[#E4E4E7]">
        {FAQS.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div key={idx} className="py-6">
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full flex justify-between items-center text-left gap-4 text-sm font-bold uppercase tracking-wider text-[#0A0A0A]"
              >
                <span>{faq.q}</span>
                {isOpen ? <ChevronUp size={18} className="text-[#4D5936]" /> : <ChevronDown size={18} className="text-[#71717A]" />}
              </button>
              {isOpen && (
                <p className="mt-3 text-xs sm:text-sm text-[#71717A] leading-relaxed font-light">
                  {faq.a}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-16 p-8 bg-[#FAFAF9] border border-[#E4E4E7] flex flex-col sm:flex-row justify-between items-center gap-6 shadow-sm">
        <div>
          <h3 className="text-sm font-bold uppercase text-[#0A0A0A] font-display">Still have questions?</h3>
          <p className="text-xs text-[#71717A] mt-1">Reach our client care concierge in Nairobi.</p>
        </div>
        <Link
          href="/contact"
          className="bg-[#0A0A0A] text-white px-7 py-3.5 text-xs font-bold uppercase tracking-widest hover:bg-[#27272A] transition-colors shadow-sm"
        >
          CONTACT CONCIERGE
        </Link>
      </div>
    </div>
  );
}
