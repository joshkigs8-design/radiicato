'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Bell, ExternalLink, ShieldCheck, User, LogOut } from 'lucide-react';
import { useStore } from '@/lib/use-store';

export function AdminHeader() {
  const { currentAdmin, notifications, markNotificationRead } = useStore();
  const [notifOpen, setNotifOpen] = useState(false);
  const unreadNotifs = notifications.filter((n) => !n.isRead);

  return (
    <header className="h-16 bg-[#FFFFFF] border-b border-[#E5E7EB] px-8 flex items-center justify-between sticky top-0 z-20 shadow-sm">
      {/* Search Input */}
      <div className="flex items-center gap-3 w-96">
        <div className="relative w-full">
          <Search size={16} className="text-[#9CA3AF] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search orders, customers, SKUs, drops..."
            className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-md pl-9 pr-3 py-1.5 text-xs text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:border-[#4D5936] focus:bg-white"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Live Storefront */}
        <Link
          href="/"
          target="_blank"
          className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-[#4B5563] hover:text-[#111827] px-3 py-1.5 border border-[#E5E7EB] rounded-md hover:bg-[#F9FAFB]"
        >
          <span>Storefront</span>
          <ExternalLink size={12} />
        </Link>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="p-2 text-[#6B7280] hover:text-[#111827] relative rounded-md hover:bg-[#F3F4F6]"
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
                {notifications.slice(0, 5).map((n) => (
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
                ))}
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
        <div className="flex items-center gap-3 pl-3 border-l border-[#E5E7EB]">
          <div className="w-8 h-8 rounded-full bg-[#E5E7EB] flex items-center justify-center text-[#374151] font-bold text-xs">
            {currentAdmin.name.charAt(0)}
          </div>
          <div className="text-left hidden md:block">
            <p className="text-xs font-bold text-[#111827] leading-none">{currentAdmin.name}</p>
            <p className="text-[10px] font-mono text-[#6B7280] leading-tight mt-0.5">{currentAdmin.role}</p>
          </div>
          <Link
            href="/admin/login"
            title="Lock Terminal / Switch Account"
            className="p-1.5 text-[#6B7280] hover:text-[#DC2626] hover:bg-[#FEE2E2] rounded transition-colors ml-1"
          >
            <LogOut size={16} />
          </Link>
        </div>
      </div>
    </header>
  );
}

