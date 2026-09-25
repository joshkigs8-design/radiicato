'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Check, Send } from 'lucide-react';
import { useStore } from '@/lib/use-store';

export default function ContactPage() {
  const { settings } = useStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('Order Inquiry');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="pt-24 sm:pt-32 pb-24 px-4 sm:px-8 lg:px-12 bg-black text-white min-h-screen font-sans">
      <div className="max-w-4xl mx-auto">
        <p className="text-[10px] sm:text-[11px] font-mono tracking-[0.22em] uppercase text-white/50 mb-2 font-bold">
          CLIENT CONCIERGE // NAIROBI
        </p>
        <h1 className="pesos-text-face text-3xl sm:text-5xl font-bold uppercase tracking-[-0.04em] mb-8 sm:mb-12 text-white">
          CONTACT THE ATELIER
        </h1>

        {/* Message Form */}
        <div className="glass-card rounded-2xl sm:rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl">
          {submitted ? (
            <div className="p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500 text-black flex items-center justify-center mx-auto mb-2">
                <Check size={24} />
              </div>
              <h4 className="text-base font-bold uppercase text-white">Transmission Received</h4>
              <p className="text-xs sm:text-sm text-white/70 max-w-md mx-auto leading-relaxed">
                Our Nairobi concierge will review your message and reply via email within 4 business hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[10px] font-mono tracking-[0.14em] uppercase text-white/60">Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="E.G. JOSHUA KIGEN"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-white/30 focus:outline-none focus:border-white transition-colors"
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[10px] font-mono tracking-[0.14em] uppercase text-white/60">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="E.G. JOSHUA@GMAIL.COM"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-white/30 focus:outline-none focus:border-white transition-colors"
                  />
                </div>
              </div>

              <div className="flex flex-col space-y-1.5">
                <label className="text-[10px] font-mono tracking-[0.14em] uppercase text-white/60">Subject</label>
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="bg-[#0a0a0a] border border-white/15 rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-white transition-colors cursor-pointer"
                >
                  <option value="Order Inquiry" className="bg-black text-white">Order Inquiry / Delivery Tracking</option>
                  <option value="Sizing Advice" className="bg-black text-white">Sizing &amp; Drape Advisory</option>
                  <option value="Wholesale" className="bg-black text-white">Press / Editorial / Wholesale</option>
                  <option value="Other" className="bg-black text-white">Other Atelier Inquiry</option>
                </select>
              </div>

              <div className="flex flex-col space-y-1.5">
                <label className="text-[10px] font-mono tracking-[0.14em] uppercase text-white/60">Message *</label>
                <textarea
                  rows={5}
                  required
                  placeholder="YOUR MESSAGE..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-white/30 focus:outline-none focus:border-white transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto glass-button bg-white text-black hover:bg-white/90 px-8 py-3.5 text-xs font-mono font-bold tracking-[0.15em] uppercase rounded-xl transition-all shadow-xl active:scale-95 cursor-pointer"
              >
                TRANSMIT MESSAGE
              </button>
            </form>
          )}
        </div>

        {/* Contact Info Grid */}
        <div className="border-t border-white/10 mt-12 sm:mt-16 pt-10 sm:pt-12 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
            <div className="space-y-5">
              <div className="space-y-1">
                <span className="text-[10px] font-mono tracking-[0.14em] uppercase text-white/50">CLIENT CONCIERGE</span>
                <a href={`mailto:${settings.contactEmail || 'info@radiicato.co.ke'}`} className="block text-sm text-white hover:text-white/70 font-mono transition-colors">
                  {settings.contactEmail || 'info@radiicato.co.ke'}
                </a>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-mono tracking-[0.14em] uppercase text-white/50">HOTLINE &amp; WHATSAPP</span>
                <a href="https://wa.me/254712904883" target="_blank" rel="noreferrer" className="block text-sm text-white hover:text-white/70 font-mono transition-colors">
                  {settings.contactPhone || '+254 712 904 883'}
                </a>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-mono tracking-[0.14em] uppercase text-white/50">NAIROBI ATELIER &amp; STUDIO</span>
                <p className="text-sm text-white/80 font-mono">{settings.address || 'Nairobi, Kenya'}</p>
              </div>
            </div>
            
            <div className="glass-card rounded-2xl p-6 border-white/10 h-fit space-y-2">
              <p className="text-[10px] font-mono tracking-[0.14em] uppercase text-white/50">OPERATIONAL HOURS</p>
              <p className="text-xs sm:text-sm font-mono text-white/90 leading-relaxed">
                Monday – Saturday: 10:00 AM – 7:00 PM EAT<br />
                Sunday: Private Appointments Only
              </p>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
