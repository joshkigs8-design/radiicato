'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, Package, FolderTree, Tag, Boxes, Image as ImageIcon, 
  ShoppingCart, Users, Percent, Sliders, Camera, MessageSquare, 
  BarChart3, Bell, Shield, History, Settings, ExternalLink, LogOut, X
} from 'lucide-react';
import { useStore } from '@/lib/use-store';
import { AdminRole } from '@/types';

export function AdminSidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const { currentAdmin, switchAdminRole, notifications, logoutAdmin } = useStore();
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const navGroups = [
    {
      label: 'MAIN',
      items: [
        { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
      ],
    },
    {
      label: 'CATALOG',
      items: [
        { name: 'Products', href: '/admin/products', icon: Package },
        { name: 'Collections', href: '/admin/collections', icon: FolderTree },
        { name: 'Categories', href: '/admin/categories', icon: Tag },
        { name: 'Inventory Matrix', href: '/admin/inventory', icon: Boxes },
        { name: 'Media Library', href: '/admin/media', icon: ImageIcon },
      ],
    },
    {
      label: 'SALES & ORDERS',
      items: [
        { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
        { name: 'Customers', href: '/admin/customers', icon: Users },
        { name: 'Discounts & Coupons', href: '/admin/discounts', icon: Percent },
      ],
    },
    {
      label: 'CONTENT & BRAND',
      items: [
        { name: 'Homepage CMS', href: '/admin/homepage', icon: Sliders },
        { name: 'Lookbook Gallery', href: '/admin/lookbook', icon: Camera },
        { name: 'Customer Reviews', href: '/admin/reviews', icon: MessageSquare },
      ],
    },
    {
      label: 'PERFORMANCE',
      items: [
        { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
      ],
    },
    {
      label: 'SYSTEM & SETTINGS',
      items: [
        { name: 'Notifications', href: '/admin/notifications', icon: Bell, badge: unreadCount },
        { name: 'Admin Users & Roles', href: '/admin/users', icon: Shield },
        { name: 'Audit Activity Log', href: '/admin/activity', icon: History },
        { name: 'Store Settings', href: '/admin/settings', icon: Settings },
      ],
    },
  ];

  return (
    <>
      <button
        aria-label="Close navigation"
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/70 transition-opacity lg:hidden ${isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
      />
    <aside className={`fixed left-0 top-0 z-50 flex h-screen w-72 select-none flex-col border-r border-white/10 bg-[#171914] text-[#F1F0EA] shadow-2xl shadow-black/30 transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      {/* Brand Header */}
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-7 flex-shrink-0">
            <Image
              src="/logo.png"
              alt="RADIICATO"
              fill
              className="object-contain brightness-0 invert"
              sizes="40px"
              priority
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-black tracking-wider text-base text-white">RADIICATO</span>
              <span className="rounded bg-[#D8E2B8] px-1.5 py-0.5 text-[9px] font-mono font-bold text-[#24291B]">OS</span>
            </div>
            <p className="text-[10px] font-mono text-white/40">Commerce System</p>
          </div>
        </div>
        <button onClick={onClose} className="rounded p-2 text-white/40 hover:bg-white/10 hover:text-white lg:hidden" aria-label="Close navigation"><X size={18} /></button>
      </div>

      {/* Role Switcher Widget */}
      <div className="mx-4 mt-5 rounded border border-white/10 bg-white/[0.04] p-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-white/45">Active Role</span>
          <span className="h-2 w-2 rounded-full bg-[#B9D477]"></span>
        </div>
        <select
          value={currentAdmin.role}
          onChange={(e) => switchAdminRole(e.target.value as AdminRole)}
          className="mt-2 w-full rounded border border-white/10 bg-[#10110F] p-2 text-xs font-mono font-semibold text-white focus:border-[#B9D477] focus:outline-none"
        >
          <option value="SUPER_ADMIN">SUPER ADMIN (Full Access)</option>
          <option value="ADMIN">ADMIN (Catalog & Sales)</option>
          <option value="INVENTORY_MANAGER">INVENTORY MANAGER</option>
          <option value="ORDER_MANAGER">ORDER DISPATCHER</option>
          <option value="CONTENT_MANAGER">CONTENT & CMS MGR</option>
        </select>
        <p className="mt-2 truncate text-[10px] text-white/40">User: {currentAdmin.name}</p>
      </div>

      {/* Nav List */}
      <div className="flex-1 space-y-7 overflow-y-auto px-4 py-6">
        {navGroups.map((group) => (
          <div key={group.label} className="space-y-1">
            <span className="px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-white/30">
              {group.label}
            </span>
            <div className="space-y-1 pt-2">
              {group.items.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={`flex items-center justify-between rounded px-3 py-2.5 text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-[#D8E2B8] font-semibold text-[#24291B]'
                        : 'text-white/55 hover:bg-white/[0.06] hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon size={16} className={isActive ? 'text-[#24291B]' : 'text-white/35'} />
                      <span>{item.name}</span>
                    </div>
                    {item.badge ? (
                      <span className="rounded-full bg-[#E27B62] px-1.5 py-0.5 text-[10px] font-bold text-[#21110D]">
                        {item.badge}
                      </span>
                    ) : null}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Actions */}
      <div className="space-y-2 border-t border-white/10 p-4">
        <Link
          href="/admin/login"
          onClick={() => logoutAdmin()}
          className="flex items-center justify-between rounded px-3 py-2.5 text-xs font-semibold text-white/50 transition-colors hover:bg-[#E27B62]/10 hover:text-[#E27B62]"
        >
          <div className="flex items-center gap-2">
            <LogOut size={13} />
            <span>Lock Terminal</span>
          </div>
          <span className="text-[10px] font-mono text-[#9CA3AF]">LOG OUT</span>
        </Link>

        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between rounded border border-[#B9D477]/30 bg-[#B9D477]/10 px-3 py-2.5 text-xs font-semibold text-[#D8E2B8] transition-colors hover:bg-[#B9D477]/20"
        >
          <span>View Live Storefront</span>
          <ExternalLink size={13} />
        </Link>
      </div>
    </aside>
    </>
  );
}

