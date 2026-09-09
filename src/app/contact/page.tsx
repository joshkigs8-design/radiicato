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
    <div className="pt-28 sm:pt-36 pb-32 px-6 sm:px-12 max-w-[1400px] mx-auto min-h-screen bg-white">
      <div className="pb-10 border-b border-[#E4E4E7] mb-12">
        <span className="text-[10px] font-mono tracking-widest uppercase text-[#4D5936] font-bold">CLIENT CONCIERGE</span>
        <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-[#0A0A0A] font-display mt-1">
          CONTACT THE ATELIER
        </h1>
        <p className="text-xs sm:text-sm text-[#71717A] max-w-lg mt-2 font-light">
          For sizing guidance, private archive viewing, or wholesale inquiries, connect with our Nairobi concierge.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Contact Info */}
        <div className="lg:col-span-5 space-y-8">
          <div className="p-6 bg-[#FAFAF9] border border-[#E4E4E7] space-y-6 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#0A0A0A] border-b border-[#E4E4E7] pb-3">
              DIRECT CHANNELS
            </h3>

            <div className="space-y-4 text-xs font-mono">
              <div className="flex items-start gap-3">
                <Mail size={16} className="text-[#4D5936] mt-0.5" />
                <div>
                  <span className="text-[#71717A] block font-semibold">CLIENT INQUIRIES</span>
                  <a href={`mailto:${settings.contactEmail}`} className="text-[#0A0A0A] font-bold hover:underline">
                    {settings.contactEmail}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone size={16} className="text-[#4D5936] mt-0.5" />
                <div>
                  <span className="text-[#71717A] block font-semibold">CONCIERGE HOTLINE & WHATSAPP</span>
                  <a href="https://wa.me/254712904883" target="_blank" rel="noreferrer" className="text-[#0A0A0A] font-bold hover:underline">
                    {settings.contactPhone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-[#4D5936] mt-0.5" />
                <div>
                  <span className="text-[#71717A] block font-semibold">NAIROBI ATELIER & STUDIO</span>
                  <p className="text-[#71717A]">{settings.address}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 bg-[#4D5936]/5 border border-[#4D5936]/20 text-xs text-[#4D5936] space-y-2">
            <p className="font-bold uppercase tracking-wider text-[#0A0A0A]">OPERATIONAL HOURS</p>
            <p className="font-mono text-[11px] text-[#4D5936]">
              Monday – Saturday: 10:00 AM – 7:00 PM EAT<br />
              Sunday: Private Appointments Only
            </p>
          </div>
        </div>

        {/* Message Form */}
        <div className="lg:col-span-7">
          <div className="p-8 bg-[#FAFAF9] border border-[#E4E4E7] shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#0A0A0A] border-b border-[#E4E4E7] pb-4 mb-6">
              SEND DIRECT TRANSMISSION
            </h3>

            {submitted ? (
              <div className="p-8 bg-[#4D5936]/10 border border-[#4D5936]/20 text-xs text-[#4D5936] space-y-2 text-center">
                <Check size={32} className="mx-auto text-[#4D5936]" />
                <h4 className="text-sm font-bold uppercase text-[#0A0A0A]">Transmission Received</h4>
                <p className="text-xs text-[#71717A]">
                  Our Nairobi concierge will review your message and reply via email within 4 business hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-[#71717A] font-semibold">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="NAME"
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
                      placeholder="EMAIL"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white border border-[#E4E4E7] p-3 text-xs uppercase text-[#0A0A0A] font-mono focus:outline-none focus:border-[#0A0A0A] transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-[#71717A] font-semibold">Subject</label>
                  <select
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full bg-white border border-[#E4E4E7] p-3 text-xs uppercase text-[#0A0A0A] font-mono focus:outline-none focus:border-[#0A0A0A] transition-colors"
                  >
                    <option value="Order Inquiry">Order Inquiry / Tracking</option>
                    <option value="Sizing Advice">Sizing & Drape Advisory</option>
                    <option value="Wholesale">Press / Editorial / Wholesale</option>
                    <option value="Other">Other Atelier Question</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-[#71717A] font-semibold">Message</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="YOUR MESSAGE..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-white border border-[#E4E4E7] p-3 text-xs uppercase text-[#0A0A0A] font-mono focus:outline-none focus:border-[#0A0A0A] transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-[#0A0A0A] text-white px-8 py-3.5 text-xs font-bold tracking-widest uppercase hover:bg-[#27272A] transition-colors flex items-center gap-2 shadow-sm"
                >
                  <Send size={14} />
                  <span>TRANSMIT MESSAGE</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
