'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthRoute = 
    pathname === '/admin/login' || 
    pathname === '/admin/signup' || 
    pathname === '/admin/forgot-password';

  if (isAuthRoute) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#111827] flex">
      {/* Fixed Admin Sidebar */}
      <AdminSidebar />

      {/* Main Admin Scrollable Canvas */}
      <div className="ml-64 flex-1 flex flex-col min-w-0">
        <AdminHeader />
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

