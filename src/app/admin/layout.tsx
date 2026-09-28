'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { useStore } from '@/lib/use-store';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAdminAuthenticated } = useStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isAuthRoute =
    pathname === '/admin/login' ||
    pathname === '/admin/signup' ||
    pathname === '/admin/forgot-password';

  useEffect(() => {
    // 1. If currently on an auth route, allow immediate access without redirect loops
    if (isAuthRoute) {
      setIsLoading(false);
      setIsAuthenticated(true);
      return;
    }

    let isMounted = true;

    const checkAdminSession = async () => {
      // 1. Check Store in-memory / state
      let active = isAdminAuthenticated;

      // 2. Check Browser Storage / Cookie persistence
      if (!active && typeof window !== 'undefined') {
        const storedAuth = localStorage.getItem('rad_admin_authenticated') === 'true';
        const hasSessionCookie = document.cookie
          .split(';')
          .some((item) => item.trim().startsWith('rad_admin_session='));

        if (storedAuth || hasSessionCookie) {
          active = true;
        }
      }

      // 3. Fallback to Supabase Auth Session
      if (!active && supabase) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            active = true;
          }
        } catch (authErr) {
          console.warn('Supabase admin session check exception:', authErr);
        }
      }

      if (!isMounted) return;

      if (!active) {
        setIsAuthenticated(false);
        setIsLoading(false);
        router.replace('/admin/login');
      } else {
        setIsAuthenticated(true);
        setIsLoading(false);
      }
    };

    checkAdminSession();

    return () => {
      isMounted = false;
    };
  }, [pathname, isAuthRoute, router, isAdminAuthenticated]);

  // Auth pages (login, signup, forgot-password) are rendered directly with zero chrome
  if (isAuthRoute) {
    return <>{children}</>;
  }

  // Zero-white-flicker dark atelier loading state while checking credentials
  if (isLoading) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center bg-[#0A0A0A] text-[#EDEDED] antialiased"
        style={{ backgroundColor: '#0A0A0A' }}
      >
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-7 h-7 animate-spin text-[#4D5936]" />
          <p className="text-[11px] font-mono tracking-[0.2em] uppercase text-[#8E8E93]">
            AUTHENTICATING ATELIER TERMINAL...
          </p>
        </div>
      </div>
    );
  }

  // Not authenticated: waiting for router.replace to finish
  if (!isAuthenticated) {
    return null;
  }

  // Authenticated Admin Canvas
  return (
    <div className="min-h-screen bg-[#10110F] text-[#F1F0EA] selection:bg-[#D8E2B8] selection:text-[#161812]">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="min-h-screen lg:ml-72">
        <AdminHeader onMenuOpen={() => setSidebarOpen(true)} />
        <main className="min-h-[calc(100vh-76px)] overflow-y-auto px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
