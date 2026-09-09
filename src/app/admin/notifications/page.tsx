'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Bell, Truck, Sparkles, Check, ArrowRight, Plus, Trash2, 
  Power, ExternalLink, ShieldCheck, Eye, RefreshCw 
} from 'lucide-react';
import { useStore } from '@/lib/use-store';
import { formatDateTime } from '@/lib/utils';
import { StoreAnnouncement } from '@/types';

export default function AdminNotificationsPage() {
  const { 
    notifications, 
    markNotificationRead, 
    storeAnnouncements, 
    activeAnnouncement, 
    addStoreAnnouncement, 
    updateStoreAnnouncement, 
    deleteStoreAnnouncement, 
    toggleStoreAnnouncement,
    setActiveStoreAnnouncement
  } = useStore();

  const [activeTab, setActiveTab] = useState<'storefront' | 'internal'>('storefront');
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [badge, setBadge] = useState('FREE DELIVERY');
  const [type, setType] = useState<'delivery' | 'drop' | 'promo' | 'general'>('delivery');
  const [linkUrl, setLinkUrl] = useState('/shipping');
  const [makeActive, setMakeActive] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    addStoreAnnouncement({
      title: title.trim(),
      message: message.trim().toUpperCase(),
      badge: badge.trim().toUpperCase(),
      type,
      linkUrl: linkUrl.trim() || '/shipping',
      isActive: makeActive,
      priority: 1,
    });

    setTitle('');
    setMessage('');
    setShowAddForm(false);
    showToast('Storefront notification published successfully!');
  };

  // Quick Presets
  const applyPreset = (preset: {
    title: string;
    message: string;
    badge: string;
    type: 'delivery' | 'drop' | 'promo' | 'general';
    linkUrl: string;
  }) => {
    addStoreAnnouncement({
      ...preset,
      isActive: true,
      priority: 1,
    });
    showToast(`Activated: ${preset.title}`);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-20">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#111827] text-white px-4 py-2.5 rounded-md shadow-xl text-xs font-bold flex items-center gap-2 border border-[#374151] animate-in fade-in">
          <Check size={16} className="text-[#10B981]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-[#E5E7EB] pb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#111827] font-display">Notification & Broadcast Center</h1>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Manage live customer delivery banners, drop announcements, and internal atelier operational alerts.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-[#F3F4F6] p-1 rounded-md border border-[#E5E7EB] text-xs font-semibold">
          <button
            onClick={() => setActiveTab('storefront')}
            className={`px-4 py-1.5 rounded transition-colors flex items-center gap-2 ${
              activeTab === 'storefront' ? 'bg-white text-[#111827] shadow-sm font-bold' : 'text-[#6B7280]'
            }`}
          >
            <Truck size={14} className="text-[#4D5936]" />
            <span>Storefront Banners & Delivery</span>
            {activeAnnouncement?.isActive && (
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('internal')}
            className={`px-4 py-1.5 rounded transition-colors flex items-center gap-2 ${
              activeTab === 'internal' ? 'bg-white text-[#111827] shadow-sm font-bold' : 'text-[#6B7280]'
            }`}
          >
            <Bell size={14} />
            <span>Atelier Internal Logs</span>
            {notifications.filter((n) => !n.isRead).length > 0 && (
              <span className="px-1.5 py-0.2 bg-[#EF4444] text-white rounded-full text-[10px]">
                {notifications.filter((n) => !n.isRead).length}
              </span>
            )}
          </button>
        </div>
      </div>

      {activeTab === 'storefront' ? (
        <div className="space-y-8">
          {/* Live Storefront Preview */}
          <div className="bg-[#0A0A0A] border border-[#27272A] rounded-xl p-5 shadow-lg space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-zinc-400 font-mono text-[10px] tracking-widest uppercase flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#4D5936] animate-ping"></span>
                LIVE STOREFRONT TOP TICKER PREVIEW
              </span>
              <Link
                href="/"
                target="_blank"
                className="text-zinc-400 hover:text-white flex items-center gap-1 font-mono text-[11px]"
              >
                <span>View Storefront</span>
                <ExternalLink size={12} />
              </Link>
            </div>

            {/* Rendered Bar Preview */}
            <div className="bg-[#18181B] border border-[#27272A] p-3 rounded-lg flex items-center justify-between text-xs">
              {activeAnnouncement && activeAnnouncement.isActive ? (
                <div className="flex items-center gap-2 text-[#E4E4E7] font-medium truncate">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4D5936] animate-pulse shrink-0"></span>
                  {activeAnnouncement.badge && (
                    <span className="bg-[#4D5936] text-white text-[9px] font-mono font-bold px-1.5 py-0.5 rounded tracking-wider shrink-0">
                      {activeAnnouncement.badge}
                    </span>
                  )}
                  <span className="truncate text-zinc-200">{activeAnnouncement.message}</span>
                </div>
              ) : (
                <span className="text-zinc-500 italic text-xs">
                  Ticker is currently deactivated. Customer top banner is hidden.
                </span>
              )}

              {activeAnnouncement && (
                <button
                  onClick={() => toggleStoreAnnouncement(activeAnnouncement.id)}
                  className={`ml-4 px-3 py-1 rounded text-[11px] font-bold uppercase transition-colors shrink-0 ${
                    activeAnnouncement.isActive
                      ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                      : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                  }`}
                >
                  {activeAnnouncement.isActive ? 'Turn Off' : 'Turn On'}
                </button>
              )}
            </div>
          </div>

          {/* Quick Presets */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-[#111827] uppercase tracking-wider">
              1-Click Delivery & Capsule Announcement Presets
            </h3>
            <p className="text-xs text-[#6B7280]">
              Instantly broadcast pre-configured promotional and logistics messages to the customer header:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => applyPreset({
                  title: 'Free Express Nairobi Delivery',
                  message: 'FREE EXPRESS DELIVERY ACROSS NAIROBI FOR ORDERS OVER KES 10,000 • SAME-DAY DISPATCH VIA FARGO',
                  badge: 'FREE DELIVERY',
                  type: 'delivery',
                  linkUrl: '/shipping',
                })}
                className="p-3.5 border border-[#E5E7EB] hover:border-[#4D5936] rounded-lg text-left transition-all hover:shadow-sm group bg-[#FAFAF9]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-[#4D5936] bg-[#4D5936]/10 px-1.5 py-0.5 rounded">
                    DELIVERY PROMO
                  </span>
                  <Truck size={14} className="text-[#6B7280] group-hover:text-[#4D5936]" />
                </div>
                <h4 className="text-xs font-bold text-[#111827] mt-1.5">Free Express Nairobi Delivery</h4>
                <p className="text-[11px] text-[#6B7280] mt-0.5 font-mono line-clamp-1">
                  Orders over KES 10,000 • Same-day Fargo dispatch
                </p>
              </button>

              <button
                onClick={() => applyPreset({
                  title: 'Broken Record Drop 01 Live',
                  message: 'DROP 01 // BROKEN RECORD (ATELIER WHITE 280 GSM) IS LIVE • 100 PIECES ALLOCATED',
                  badge: 'LIMITED DROP',
                  type: 'drop',
                  linkUrl: '/collections/broken-record',
                })}
                className="p-3.5 border border-[#E5E7EB] hover:border-[#4D5936] rounded-lg text-left transition-all hover:shadow-sm group bg-[#FAFAF9]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-[#4D5936] bg-[#4D5936]/10 px-1.5 py-0.5 rounded">
                    DROP 01
                  </span>
                  <Sparkles size={14} className="text-[#6B7280] group-hover:text-[#4D5936]" />
                </div>
                <h4 className="text-xs font-bold text-[#111827] mt-1.5">Broken Record White Tee Live</h4>
                <p className="text-[11px] text-[#6B7280] mt-0.5 font-mono line-clamp-1">
                  280 GSM • MF DOOM shattered vinyl reverse • KES 1,000
                </p>
              </button>

              <button
                onClick={() => applyPreset({
                  title: 'We Are Who We Are Dispatch',
                  message: 'DROP 02 // WE ARE WHO WE ARE (WASHED BLACK 280 GSM) NOW DISPATCHING NATIONWIDE',
                  badge: 'IN STOCK',
                  type: 'drop',
                  linkUrl: '/collections/we-are-who-we-are',
                })}
                className="p-3.5 border border-[#E5E7EB] hover:border-[#4D5936] rounded-lg text-left transition-all hover:shadow-sm group bg-[#FAFAF9]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-[#4D5936] bg-[#4D5936]/10 px-1.5 py-0.5 rounded">
                    DROP 02
                  </span>
                  <Sparkles size={14} className="text-[#6B7280] group-hover:text-[#4D5936]" />
                </div>
                <h4 className="text-xs font-bold text-[#111827] mt-1.5">We Are Who We Are Black Tee</h4>
                <p className="text-[11px] text-[#6B7280] mt-0.5 font-mono line-clamp-1">
                  Washed Black • Mascot graffiti &amp; collage • KES 800
                </p>
              </button>

              <button
                onClick={() => applyPreset({
                  title: 'Skull Caps Dropping Soon',
                  message: 'COMING SOON: RADIICATO HEAVYWEIGHT RIBBED KNIT SKULL CAPS IN OBSIDIAN & OLIVE (KES 500)',
                  badge: 'COMING SOON',
                  type: 'drop',
                  linkUrl: '/collections/skull-caps',
                })}
                className="p-3.5 border border-[#E5E7EB] hover:border-[#4D5936] rounded-lg text-left transition-all hover:shadow-sm group bg-[#FAFAF9]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-[#4D5936] bg-[#4D5936]/10 px-1.5 py-0.5 rounded">
                    DROP 03 TEASER
                  </span>
                  <Sparkles size={14} className="text-[#6B7280] group-hover:text-[#4D5936]" />
                </div>
                <h4 className="text-xs font-bold text-[#111827] mt-1.5">Heavyweight Ribbed Skull Caps</h4>
                <p className="text-[11px] text-[#6B7280] mt-0.5 font-mono line-clamp-1">
                  Double knit acrylic-merino • Chrome insignia • KES 500
                </p>
              </button>
            </div>
          </div>

          {/* Create Custom Announcement Accordion */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 flex justify-between items-center border-b border-[#E5E7EB]">
              <div>
                <h3 className="text-sm font-bold text-[#111827] uppercase tracking-wider">
                  Custom Announcement Composer
                </h3>
                <p className="text-xs text-[#6B7280] mt-0.5">
                  Draft a custom headline, shipping notification, or flash offer.
                </p>
              </div>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#111827] hover:bg-black text-white rounded text-xs font-semibold"
              >
                <Plus size={14} />
                <span>{showAddForm ? 'Close Form' : 'New Broadcast'}</span>
              </button>
            </div>

            {showAddForm && (
              <form onSubmit={handleCreateAnnouncement} className="p-6 space-y-4 bg-[#F9FAFB]">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#374151]">Announcement Internal Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Easter Weekend Free Shipping"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full border border-[#D1D5DB] rounded p-2 text-xs bg-white text-[#111827]"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#374151]">Badge Label</label>
                    <input
                      type="text"
                      placeholder="e.g. FREE DELIVERY, LIMITED DROP, FLASH SALE"
                      value={badge}
                      onChange={(e) => setBadge(e.target.value)}
                      className="w-full border border-[#D1D5DB] rounded p-2 text-xs uppercase font-mono bg-white text-[#111827]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#374151]">Storefront Banner Message (Displayed to Shoppers)</label>
                  <input
                    type="text"
                    placeholder="e.g. FREE EXPRESS DELIVERY ACROSS NAIROBI FOR ORDERS OVER KES 10,000"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full border border-[#D1D5DB] rounded p-2 text-xs uppercase font-mono bg-white text-[#111827]"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#374151]">Click Destination Link</label>
                    <input
                      type="text"
                      placeholder="e.g. /shipping or /shop"
                      value={linkUrl}
                      onChange={(e) => setLinkUrl(e.target.value)}
                      className="w-full border border-[#D1D5DB] rounded p-2 text-xs font-mono bg-white text-[#111827]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#374151]">Announcement Category</label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value as any)}
                      className="w-full border border-[#D1D5DB] rounded p-2 text-xs bg-white text-[#111827]"
                    >
                      <option value="delivery">Delivery &amp; Logistics Promo</option>
                      <option value="drop">Collection Drop Alert</option>
                      <option value="promo">Price Discount / Code</option>
                      <option value="general">General Atelier Announcement</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#374151]">
                    <input
                      type="checkbox"
                      checked={makeActive}
                      onChange={(e) => setMakeActive(e.target.checked)}
                      className="accent-[#4D5936]"
                    />
                    <span>Publish as Currently Active Ticker Immediately</span>
                  </label>

                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#4D5936] hover:bg-[#3D472B] text-white rounded text-xs font-bold uppercase tracking-wider"
                  >
                    Publish to Storefront
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Announcements Roster */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-[#E5E7EB]">
              <h3 className="text-sm font-bold text-[#111827]">Configured Storefront Broadcasts</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F9FAFB] text-[#6B7280] font-mono border-b border-[#E5E7EB]">
                  <tr>
                    <th className="py-3 px-4">STATUS</th>
                    <th className="py-3 px-4">BADGE &amp; TITLE</th>
                    <th className="py-3 px-4">STOREFRONT MESSAGE</th>
                    <th className="py-3 px-4">DESTINATION</th>
                    <th className="py-3 px-4 text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB] text-[#111827]">
                  {storeAnnouncements.map((ann) => (
                    <tr key={ann.id} className="hover:bg-[#F9FAFB] transition-colors">
                      <td className="py-3 px-4">
                        <button
                          onClick={() => toggleStoreAnnouncement(ann.id)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase transition-colors ${
                            ann.isActive
                              ? 'bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]'
                              : 'bg-[#F3F4F6] text-[#6B7280] border border-[#E5E7EB]'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              ann.isActive ? 'bg-[#10B981] animate-pulse' : 'bg-[#9CA3AF]'
                            }`}
                          ></span>
                          <span>{ann.isActive ? 'ACTIVE' : 'INACTIVE'}</span>
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-[#111827] block">{ann.title}</span>
                        <span className="text-[10px] font-mono bg-[#F4F4F5] text-[#71717A] px-1.5 py-0.5 rounded">
                          {ann.badge}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-[#4B5563] max-w-xs truncate">
                        {ann.message}
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-[#6B7280]">
                        {ann.linkUrl || '/shipping'}
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        {!ann.isActive && (
                          <button
                            onClick={() => setActiveStoreAnnouncement(ann.id)}
                            className="text-xs font-semibold text-[#4D5936] hover:underline"
                          >
                            Set Active
                          </button>
                        )}
                        <button
                          onClick={() => deleteStoreAnnouncement(ann.id)}
                          className="p-1 text-[#9CA3AF] hover:text-[#EF4444] transition-colors"
                          title="Delete announcement"
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Internal Operational Alerts */
        <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-sm divide-y divide-[#E5E7EB] overflow-hidden">
          {notifications.length === 0 ? (
            <div className="p-16 text-center space-y-2">
              <ShieldCheck size={28} className="mx-auto text-[#4D5936]" />
              <h4 className="text-sm font-bold text-[#111827]">Atelier Inbox Zero</h4>
              <p className="text-xs text-[#6B7280] max-w-sm mx-auto">
                No active operational alerts. Real customer orders, M-PESA confirmations, and inventory warnings will appear here automatically.
              </p>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`p-4 flex items-start justify-between gap-4 transition-colors ${
                  n.isRead ? 'bg-white opacity-70' : 'bg-[#F9FAFB]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-white border border-[#E5E7EB] rounded-full shadow-sm">
                    <Bell size={16} className="text-[#4D5936]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-bold text-[#111827]">{n.title}</h3>
                      {!n.isRead && (
                        <span className="w-2 h-2 rounded-full bg-[#EF4444]"></span>
                      )}
                    </div>
                    <p className="text-xs text-[#4B5563] mt-0.5">{n.message}</p>
                    <span className="text-[10px] font-mono text-[#9CA3AF] mt-1 block">
                      {formatDateTime(n.createdAt)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {!n.isRead && (
                    <button
                      onClick={() => markNotificationRead(n.id)}
                      className="p-1 text-[#6B7280] hover:text-[#111827]"
                      title="Mark as read"
                    >
                      <Check size={14} />
                    </button>
                  )}
                  {n.link && (
                    <Link
                      href={n.link}
                      className="text-xs font-semibold text-[#4D5936] hover:underline flex items-center gap-1"
                    >
                      <span>View</span>
                      <ArrowRight size={12} />
                    </Link>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
