'use client';

import React, { useState } from 'react';
import { Settings, Save, Check, Shield, Smartphone, CreditCard, Mail } from 'lucide-react';
import { useStore } from '@/lib/use-store';

export default function AdminSettingsPage() {
  const { settings, updateSettings } = useStore();

  const [storeName, setStoreName] = useState(settings.storeName);
  const [tagline, setTagline] = useState(settings.tagline);
  const [email, setEmail] = useState(settings.contactEmail);
  const [phone, setPhone] = useState(settings.contactPhone);
  const [currency, setCurrency] = useState(settings.currency);
  const [country, setCountry] = useState(settings.country);
  const [address, setAddress] = useState(settings.address);
  const [mpesaPaybill, setMpesaPaybill] = useState(settings.mpesaPaybill);
  const [mpesaAccount, setMpesaAccount] = useState(settings.mpesaAccountName);
  const [mpesaPasskey, setMpesaPasskey] = useState(settings.mpesaPasskey);
  const [paystackKey, setPaystackKey] = useState(settings.paystackPublicKey);
  const [enableMpesa, setEnableMpesa] = useState(settings.enableMpesa);
  const [enablePaystack, setEnablePaystack] = useState(settings.enablePaystack);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      storeName,
      tagline,
      contactEmail: email,
      contactPhone: phone,
      currency,
      country,
      address,
      mpesaPaybill,
      mpesaAccountName: mpesaAccount,
      mpesaPasskey,
      paystackPublicKey: paystackKey,
      enableMpesa,
      enablePaystack,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-16">
      {saved && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#111827] text-white px-4 py-2.5 rounded-md shadow-xl text-xs font-bold flex items-center gap-2 border border-[#374151]">
          <Check size={16} className="text-[#10B981]" />
          <span>Atelier settings & payment credentials saved successfully!</span>
        </div>
      )}

      <div className="border-b border-[#E5E7EB] pb-6">
        <h1 className="text-2xl font-bold text-[#111827]">Atelier & Storefront Settings</h1>
        <p className="text-xs text-[#6B7280] mt-0.5">
          Configure Safaricom Daraja M-PESA parameters, Paystack API keys, and store contact info.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-8 text-xs">
        {/* Store Information */}
        <div className="p-6 bg-white border border-[#E5E7EB] rounded-lg shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-[#111827] uppercase tracking-wider border-b border-[#E5E7EB] pb-3">
            Store Identity
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-[#374151]">Store Name</label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full border border-[#D1D5DB] rounded p-2 text-[#111827]"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-[#374151]">Tagline</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full border border-[#D1D5DB] rounded p-2 text-[#111827]"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-[#374151]">Currency (Default)</label>
              <input
                type="text"
                value={currency}
                disabled
                className="w-full bg-[#F3F4F6] border border-[#D1D5DB] rounded p-2 font-mono font-bold text-[#374151]"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-[#374151]">Operating Country</label>
              <input
                type="text"
                value={country}
                disabled
                className="w-full bg-[#F3F4F6] border border-[#D1D5DB] rounded p-2 font-mono text-[#374151]"
              />
            </div>
            <div className="space-y-1 sm:col-span-2">
              <label className="font-bold text-[#374151]">Atelier Physical Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full border border-[#D1D5DB] rounded p-2 text-[#111827]"
              />
            </div>
          </div>
        </div>

        {/* M-PESA Settings */}
        <div className="p-6 bg-white border border-[#E5E7EB] rounded-lg shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-[#E5E7EB] pb-3">
            <h3 className="text-sm font-bold text-[#111827] uppercase tracking-wider flex items-center gap-2">
              <Smartphone size={16} className="text-[#059669]" /> Safaricom Lipa Na M-PESA Online (STK Push)
            </h3>
            <label className="flex items-center gap-2 cursor-pointer font-bold text-xs">
              <input
                type="checkbox"
                checked={enableMpesa}
                onChange={(e) => setEnableMpesa(e.target.checked)}
                className="accent-[#4D5936]"
              />
              <span>Enabled</span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-[#374151]">Paybill / Till Number</label>
              <input
                type="text"
                value={mpesaPaybill}
                onChange={(e) => setMpesaPaybill(e.target.value)}
                className="w-full border border-[#D1D5DB] rounded p-2 font-mono text-[#111827]"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-[#374151]">Account Name</label>
              <input
                type="text"
                value={mpesaAccount}
                onChange={(e) => setMpesaAccount(e.target.value)}
                className="w-full border border-[#D1D5DB] rounded p-2 font-mono text-[#111827]"
              />
            </div>
            <div className="space-y-1 sm:col-span-2">
              <label className="font-bold text-[#374151]">Daraja Online Passkey</label>
              <input
                type="password"
                value={mpesaPasskey}
                onChange={(e) => setMpesaPasskey(e.target.value)}
                className="w-full border border-[#D1D5DB] rounded p-2 font-mono text-[#111827]"
              />
            </div>
          </div>
        </div>

        {/* Paystack / Card Settings */}
        <div className="p-6 bg-white border border-[#E5E7EB] rounded-lg shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-[#E5E7EB] pb-3">
            <h3 className="text-sm font-bold text-[#111827] uppercase tracking-wider flex items-center gap-2">
              <CreditCard size={16} /> Paystack Credit / Debit Card Gateway
            </h3>
            <label className="flex items-center gap-2 cursor-pointer font-bold text-xs">
              <input
                type="checkbox"
                checked={enablePaystack}
                onChange={(e) => setEnablePaystack(e.target.checked)}
                className="accent-[#4D5936]"
              />
              <span>Enabled</span>
            </label>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-[#374151]">Paystack Public Key</label>
            <input
              type="text"
              value={paystackKey}
              onChange={(e) => setPaystackKey(e.target.value)}
              className="w-full border border-[#D1D5DB] rounded p-2 font-mono text-[#111827]"
            />
          </div>
        </div>

        {/* Email Templates Preview */}
        <div className="p-6 bg-white border border-[#E5E7EB] rounded-lg shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-[#111827] uppercase tracking-wider border-b border-[#E5E7EB] pb-3 flex items-center gap-2">
            <Mail size={16} /> Branded Dispatch Email System
          </h3>
          <p className="text-[#6B7280]">
            System templates configured: Order Confirmation, M-PESA STK Verified, Fargo Courier Dispatch Notice, Delivery Receipt, New Drop Private Password.
          </p>
        </div>

        <button
          type="submit"
          className="px-8 py-3.5 bg-[#4D5936] hover:bg-[#343D2D] text-white rounded-md text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2"
        >
          <Save size={16} />
          <span>Save Store Configuration</span>
        </button>
      </form>
    </div>
  );
}

