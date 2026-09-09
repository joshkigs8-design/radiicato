'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Check, Save } from 'lucide-react';

export default function CustomerProfilePage() {
  const [name, setName] = useState('Kariuki Mwangi');
  const [email, setEmail] = useState('k.mwangi@gmail.com');
  const [phone, setPhone] = useState('0722123456');
  const [street, setStreet] = useState('Wood Avenue Plaza, Apt 4B');
  const [town, setTown] = useState('Kilimani');
  const [county, setCounty] = useState('Nairobi');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="pt-28 sm:pt-36 pb-32 px-6 sm:px-12 max-w-3xl mx-auto min-h-screen bg-white">
      <div className="pb-8 border-b border-[#E4E4E7] mb-10 flex items-center justify-between">
        <Link
          href="/account"
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#71717A] hover:text-[#0A0A0A] font-semibold transition-colors"
        >
          <ArrowLeft size={14} /> Back to Account
        </Link>
      </div>

      <div className="space-y-6">
        <h1 className="text-3xl font-black uppercase tracking-tight text-[#0A0A0A] font-display">
          CLIENT PROFILE & PREFERENCES
        </h1>

        {saved && (
          <div className="p-4 bg-[#4D5936]/10 border border-[#4D5936]/20 text-xs text-[#4D5936] font-semibold flex items-center gap-2">
            <Check size={16} />
            <span>Profile and default delivery credentials updated successfully.</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-8 bg-[#FAFAF9] border border-[#E4E4E7] p-8 shadow-sm">
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#0A0A0A] border-b border-[#E4E4E7] pb-3">
              PERSONAL PARTICULARS
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-[#71717A] font-semibold">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white border border-[#E4E4E7] p-3 text-xs uppercase text-[#0A0A0A] font-mono focus:outline-none focus:border-[#0A0A0A] transition-colors"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-[#71717A] font-semibold">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white border border-[#E4E4E7] p-3 text-xs uppercase text-[#0A0A0A] font-mono focus:outline-none focus:border-[#0A0A0A] transition-colors"
                />
              </div>
              <div className="space-y-1 sm:col-span-2">
                <label className="text-[10px] font-mono uppercase text-[#71717A] font-semibold">Kenyan Contact Phone (For M-PESA & Dispatch)</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-white border border-[#E4E4E7] p-3 text-xs font-mono text-[#0A0A0A] focus:outline-none focus:border-[#0A0A0A] transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-[#E4E4E7]">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#0A0A0A] border-b border-[#E4E4E7] pb-3">
              DEFAULT DELIVERY DESTINATION
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1 sm:col-span-2">
                <label className="text-[10px] font-mono uppercase text-[#71717A] font-semibold">Street & Apartment</label>
                <input
                  type="text"
                  required
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full bg-white border border-[#E4E4E7] p-3 text-xs uppercase text-[#0A0A0A] font-mono focus:outline-none focus:border-[#0A0A0A] transition-colors"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-[#71717A] font-semibold">Town / Suburb</label>
                <input
                  type="text"
                  required
                  value={town}
                  onChange={(e) => setTown(e.target.value)}
                  className="w-full bg-white border border-[#E4E4E7] p-3 text-xs uppercase text-[#0A0A0A] font-mono focus:outline-none focus:border-[#0A0A0A] transition-colors"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-[#71717A] font-semibold">County</label>
                <input
                  type="text"
                  required
                  value={county}
                  onChange={(e) => setCounty(e.target.value)}
                  className="w-full bg-white border border-[#E4E4E7] p-3 text-xs uppercase text-[#0A0A0A] font-mono focus:outline-none focus:border-[#0A0A0A] transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="bg-[#0A0A0A] text-white px-7 py-3.5 text-xs font-bold tracking-widest uppercase hover:bg-[#27272A] transition-colors flex items-center gap-2 shadow-sm"
            >
              <Save size={14} />
              <span>SAVE CHANGES</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
