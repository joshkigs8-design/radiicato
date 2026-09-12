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
    <main className="pt-28 sm:pt-36 pb-32 px-5 sm:px-8 lg:px-12 bg-white min-h-screen">
      <div className="max-w-3xl mx-auto">
        <div className="pb-8 border-b border-[#E4E4E7] mb-10 flex items-center justify-between">
          <Link
            href="/account"
            className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-[#71717A] hover:text-[#0A0A0A] transition-colors"
          >
            <ArrowLeft size={14} /> Back to Account
          </Link>
        </div>

        <div className="space-y-8">
          <h1 className="text-display-sm font-black uppercase tracking-tight text-[#0A0A0A]">
            CLIENT PROFILE & PREFERENCES
          </h1>

          {saved && (
            <div className="p-4 bg-white border border-[#E4E4E7] text-sm text-[#0A0A0A] flex items-center gap-2">
              <Check size={16} />
              <span>Profile and default delivery credentials updated successfully.</span>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-12 bg-white border border-[#E4E4E7] p-8">
            <div className="space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-[#0A0A0A] border-b border-[#E4E4E7] pb-3">
                PERSONAL PARTICULARS
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-[0.12em] text-[#71717A]">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-transparent border-b border-[#E4E4E7] py-2 text-sm uppercase text-[#0A0A0A] font-mono focus:outline-none focus:border-[#0A0A0A] transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-[0.12em] text-[#71717A]">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent border-b border-[#E4E4E7] py-2 text-sm uppercase text-[#0A0A0A] font-mono focus:outline-none focus:border-[#0A0A0A] transition-colors"
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-[10px] font-mono uppercase tracking-[0.12em] text-[#71717A]">Kenyan Contact Phone (For M-PESA & Dispatch)</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-transparent border-b border-[#E4E4E7] py-2 text-sm font-mono text-[#0A0A0A] focus:outline-none focus:border-[#0A0A0A] transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6 pt-6 border-t border-[#E4E4E7]">
              <h3 className="text-sm font-bold uppercase tracking-widest text-[#0A0A0A] border-b border-[#E4E4E7] pb-3">
                DEFAULT DELIVERY DESTINATION
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-[10px] font-mono uppercase tracking-[0.12em] text-[#71717A]">Street & Apartment</label>
                  <input
                    type="text"
                    required
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className="w-full bg-transparent border-b border-[#E4E4E7] py-2 text-sm uppercase text-[#0A0A0A] font-mono focus:outline-none focus:border-[#0A0A0A] transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-[0.12em] text-[#71717A]">Town / Suburb</label>
                  <input
                    type="text"
                    required
                    value={town}
                    onChange={(e) => setTown(e.target.value)}
                    className="w-full bg-transparent border-b border-[#E4E4E7] py-2 text-sm uppercase text-[#0A0A0A] font-mono focus:outline-none focus:border-[#0A0A0A] transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-[0.12em] text-[#71717A]">County</label>
                  <input
                    type="text"
                    required
                    value={county}
                    onChange={(e) => setCounty(e.target.value)}
                    className="w-full bg-transparent border-b border-[#E4E4E7] py-2 text-sm uppercase text-[#0A0A0A] font-mono focus:outline-none focus:border-[#0A0A0A] transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                <Save size={14} />
                <span>SAVE CHANGES</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
