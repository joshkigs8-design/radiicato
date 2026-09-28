'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Bell, ExternalLink, LogOut, Menu } from 'lucide-react';
import { useStore } from '@/lib/use-store';

export function AdminHeader({ onMenuOpen }: { onMenuOpen: () => void }) {
  const { currentAdmin, notifications, markNotificationRead } = useStore();
  const [notifOpen, setNotifOpen] = useState(false);
  const unreadNotifs = notifications.filter((n) => !n.isRead);

  return (
    <header className="sticky top-0 z-20 flex h-[76px] items-center justify-between border-b border-white/10 bg-[#10110F]/90 px-4 backdrop-blur-xl sm:px-6 lg:px-10">
      <button onClick={onMenuOpen} className="mr-3 rounded p-2 text-white/60 hover:bg-white/10 hover:text-white lg:hidden" aria-label="Open navigation"><Menu size={20} /></button>
      {/* Search Input */}
      <div className="flex w-full max-w-xl items-center gap-3">
        <div className="relative w-full">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/35" />
          <input
            type="text"
            placeholder="Search orders, customers, SKUs, drops..."
            className="w-full rounded border border-white/10 bg-white/[0.04] py-2.5 pl-9 pr-3 text-xs text-white placeholder-white/30 focus:border-[#B9D477] focus:outline-none"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="ml-3 flex items-center gap-2 sm:gap-4">
        {/* Live Storefront */}
        <Link
          href="/"
          target="_blank"
          className="hidden items-center gap-1.5 rounded border border-white/10 px-3 py-2 text-xs font-semibold text-white/55 hover:bg-white/10 hover:text-white sm:flex"
        >
          <span>Storefront</span>
          <ExternalLink size={12} />
        </Link>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative rounded p-2 text-white/55 hover:bg-white/10 hover:text-white"
            aria-label="Notifications"
          >
            <Bell size={18} />
            {unreadNotifs.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#EF4444]" />
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-[#E5E7EB] shadow-xl rounded-md p-3 z-50 space-y-2">
              <div className="flex justify-between items-center pb-2 border-b border-[#E5E7EB]">
                <span className="text-xs font-bold text-[#111827]">Atelier Notifications</span>
                <span className="text-[10px] text-[#6B7280] font-mono">{unreadNotifs.length} Unread</span>
              </div>

              <div className="max-h-64 overflow-y-auto space-y-2 divide-y divide-[#F3F4F6]">
                {notifications.length === 0 ? (
                  <p className="text-[11px] text-[#6B7280] py-4 text-center">No new operational alerts</p>
                ) : (
                  notifications.slice(0, 5).map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        markNotificationRead(n.id);
                      }}
                      className={`pt-2 text-xs cursor-pointer ${
                        n.isRead ? 'opacity-60' : 'font-medium text-[#111827]'
                      }`}
                    >
                      <p className="text-[11px] font-bold text-[#111827]">{n.title}</p>
                      <p className="text-[10px] text-[#6B7280] line-clamp-2">{n.message}</p>
                    </div>
                  ))
                )}
              </div>

              <div className="pt-2 border-t border-[#E5E7EB] text-center">
                <Link
                  href="/admin/notifications"
                  onClick={() => setNotifOpen(false)}
                  className="text-[11px] text-[#4D5936] font-bold hover:underline"
                >
                  View All Notifications
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Current User Pill */}
          <div className="flex items-center gap-3 border-l border-white/10 pl-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#D8E2B8] text-xs font-bold text-[#24291B]">
            {currentAdmin.name.charAt(0)}
          </div>
          <div className="text-left hidden md:block">
            <p className="text-xs font-bold leading-none text-white">{currentAdmin.name}</p>
            <p className="mt-0.5 text-[10px] font-mono leading-tight text-white/40">{currentAdmin.role}</p>
          </div>
          <Link
            href="/admin/login"
            title="Lock Terminal / Switch Account"
            className="ml-1 rounded p-1.5 text-white/40 transition-colors hover:bg-[#E27B62]/10 hover:text-[#E27B62]"
          >
            <LogOut size={16} />
          </Link>
        </div>
      </div>
    </header>
  );
}

