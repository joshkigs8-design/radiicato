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
    <main className="pt-28 sm:pt-36 pb-32 px-5 sm:px-8 lg:px-12 bg-white min-h-screen">
      <div className="max-w-3xl mx-auto">
        <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#71717A] mb-3">CLIENT CONCIERGE</p>
        <h1 className="text-display-sm font-black uppercase mb-8">CONTACT THE ATELIER</h1>

        {/* Message Form */}
        <div>
          {submitted ? (
            <div className="p-8 bg-[#F4F4F5] border border-[#E4E4E7] text-center">
              <Check size={32} className="mx-auto text-[#0A0A0A] mb-4" />
              <h4 className="text-sm font-bold uppercase text-[#0A0A0A]">Transmission Received</h4>
              <p className="text-sm text-[#71717A] mt-2">
                Our Nairobi concierge will review your message and reply via email within 4 business hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="flex flex-col">
                  <label className="text-[10px] font-mono tracking-[0.12em] uppercase text-[#71717A] mb-2">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="NAME"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-transparent border-b border-[#E4E4E7] py-3 text-sm focus:border-[#0A0A0A] outline-none w-full"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-[10px] font-mono tracking-[0.12em] uppercase text-[#71717A] mb-2">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="EMAIL"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-transparent border-b border-[#E4E4E7] py-3 text-sm focus:border-[#0A0A0A] outline-none w-full"
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <label className="text-[10px] font-mono tracking-[0.12em] uppercase text-[#71717A] mb-2">Subject</label>
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="bg-transparent border-b border-[#E4E4E7] py-3 text-sm focus:border-[#0A0A0A] outline-none w-full appearance-none"
                >
                  <option value="Order Inquiry">Order Inquiry / Tracking</option>
                  <option value="Sizing Advice">Sizing & Drape Advisory</option>
                  <option value="Wholesale">Press / Editorial / Wholesale</option>
                  <option value="Other">Other Atelier Question</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-[10px] font-mono tracking-[0.12em] uppercase text-[#71717A] mb-2">Message</label>
                <textarea
                  rows={4}
                  required
                  placeholder="YOUR MESSAGE..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="bg-transparent border-b border-[#E4E4E7] py-3 text-sm focus:border-[#0A0A0A] outline-none w-full resize-none"
                />
              </div>

              <button type="submit" className="btn-primary w-full sm:w-auto">
                TRANSMIT MESSAGE
              </button>
            </form>
          )}
        </div>

        {/* Contact Info */}
        <div className="border-t border-[#E4E4E7] mt-16 pt-12 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="space-y-1">
                <span className="text-[10px] font-mono tracking-[0.12em] uppercase text-[#71717A]">CLIENT INQUIRIES</span>
                <a href={`mailto:${settings.contactEmail}`} className="block text-sm text-[#0A0A0A] hover:underline font-mono">
                  {settings.contactEmail}
                </a>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-mono tracking-[0.12em] uppercase text-[#71717A]">CONCIERGE HOTLINE & WHATSAPP</span>
                <a href="https://wa.me/254712904883" target="_blank" rel="noreferrer" className="block text-sm text-[#0A0A0A] hover:underline font-mono">
                  {settings.contactPhone}
                </a>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-mono tracking-[0.12em] uppercase text-[#71717A]">NAIROBI ATELIER & STUDIO</span>
                <p className="text-sm text-[#0A0A0A] font-mono">{settings.address}</p>
              </div>
            </div>
            
            <div className="bg-[#F4F4F5] border border-[#E4E4E7] p-6 h-fit">
              <p className="text-[10px] font-mono tracking-[0.12em] uppercase text-[#71717A] mb-2">OPERATIONAL HOURS</p>
              <p className="text-sm font-mono text-[#0A0A0A]">
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
