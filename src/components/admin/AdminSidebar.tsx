'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, Package, FolderTree, Tag, Boxes, Image as ImageIcon, 
  ShoppingCart, Users, Percent, Sliders, Camera, MessageSquare, 
  BarChart3, Bell, Shield, History, Settings, ExternalLink, ChevronDown, LogOut 
} from 'lucide-react';
import { useStore } from '@/lib/use-store';
import { AdminRole } from '@/types';

export function AdminSidebar() {
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
        { name: 'Lookbook Archive', href: '/admin/lookbook', icon: Camera },
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
    <aside className="w-64 bg-[#FFFFFF] border-r border-[#E5E7EB] text-[#111827] flex flex-col h-screen fixed top-0 left-0 z-30 select-none shadow-sm">
      {/* Brand Header */}
      <div className="p-4 border-b border-[#E5E7EB] flex items-center justify-between bg-[#FAFAFA]">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-7 flex-shrink-0">
            <Image
              src="/logo.png"
              alt="RADIICATO"
              fill
              className="object-contain"
              sizes="40px"
              priority
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-black tracking-wider text-base text-[#0A0A0A]">RADIICATO</span>
              <span className="text-[9px] font-mono px-1 py-0.5 bg-[#4D5936] text-white rounded font-bold">OS</span>
            </div>
            <p className="text-[10px] text-[#6B7280] font-mono">Commerce System</p>
          </div>
        </div>
      </div>

      {/* Role Switcher Widget */}
      <div className="p-3 mx-3 mt-3 bg-[#F3F4F6] border border-[#E5E7EB] rounded-md">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">Active Role</span>
          <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
        </div>
        <select
          value={currentAdmin.role}
          onChange={(e) => switchAdminRole(e.target.value as AdminRole)}
          className="mt-1 w-full bg-white border border-[#D1D5DB] rounded text-xs font-mono font-semibold text-[#111827] p-1.5 focus:outline-none focus:border-[#4D5936]"
        >
          <option value="SUPER_ADMIN">SUPER ADMIN (Full Access)</option>
          <option value="ADMIN">ADMIN (Catalog & Sales)</option>
          <option value="INVENTORY_MANAGER">INVENTORY MANAGER</option>
          <option value="ORDER_MANAGER">ORDER DISPATCHER</option>
          <option value="CONTENT_MANAGER">CONTENT & CMS MGR</option>
        </select>
        <p className="text-[10px] text-[#6B7280] mt-1 truncate">User: {currentAdmin.name}</p>
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {navGroups.map((group) => (
          <div key={group.label} className="space-y-1">
            <span className="px-3 text-[10px] font-bold tracking-wider text-[#9CA3AF] uppercase">
              {group.label}
            </span>
            <div className="space-y-0.5 pt-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-[#4D5936] text-white font-semibold'
                        : 'text-[#4B5563] hover:bg-[#F3F4F6] hover:text-[#111827]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon size={16} className={isActive ? 'text-white' : 'text-[#6B7280]'} />
                      <span>{item.name}</span>
                    </div>
                    {item.badge ? (
                      <span className="bg-[#DC2626] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
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
      <div className="p-3 border-t border-[#E5E7EB] bg-[#FAFAFA] space-y-2">
        <Link
          href="/admin/login"
          onClick={() => logoutAdmin()}
          className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-[#4B5563] hover:text-[#DC2626] hover:bg-[#FEE2E2]/60 rounded-md transition-colors"
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
          className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-[#4D5936] bg-[#4D5936]/10 hover:bg-[#4D5936]/15 border border-[#4D5936]/30 rounded-md transition-colors"
        >
          <span>View Live Storefront</span>
          <ExternalLink size={13} />
        </Link>
      </div>
    </aside>
  );
}

