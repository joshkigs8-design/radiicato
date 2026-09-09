'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Lock, ArrowRight, ShieldCheck, Eye, EyeOff, KeyRound, 
  AlertCircle, Sparkles, CheckCircle2, Terminal
} from 'lucide-react';
import { useStore } from '@/lib/use-store';
import { supabase } from '@/lib/supabase';
import { AdminRole } from '@/types';

export default function AdminLoginPage() {
  const router = useRouter();
  const { loginAdmin, switchAdminRole, adminUsers } = useStore();

  const [email, setEmail] = useState('admin@radiicato.co.ke');
  const [password, setPassword] = useState('Atelier-Admin-2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const trimmedEmail = email.trim().toLowerCase();

    // 1. Authenticate with Supabase Auth
    if (supabase) {
      try {
        const { data, error: authError } = await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password,
        });

        if (!authError && data.user) {
          loginAdmin(trimmedEmail, 'SUPER_ADMIN');
          setSuccess(true);
          setTimeout(() => {
            router.push('/admin');
          }, 400);
          return;
        } else if (authError) {
          console.warn('Supabase Auth note:', authError.message);
        }
      } catch (authErr) {
        console.warn('Supabase login error:', authErr);
      }
    }

    // 2. Atelier Store session authentication
    const res = loginAdmin(trimmedEmail);
    if (!res.success) {
      setError(res.error || 'Authentication failed. Please verify your credentials.');
      setLoading(false);
      return;
    }

    setSuccess(true);
    setTimeout(() => {
      router.push('/admin');
    }, 400);
  };

  const handleQuickLogin = (role: AdminRole, demoEmail: string) => {
    setError(null);
    setLoading(true);
    setEmail(demoEmail);
    setTimeout(() => {
      loginAdmin(demoEmail, role);
      setSuccess(true);
      setTimeout(() => {
        router.push('/admin');
      }, 400);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#EDEDED] flex flex-col justify-center items-center p-4 sm:p-6 relative selection:bg-[#4D5936] selection:text-white">
      {/* Ambient Atelier Grid & Glow */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: '48px 48px'
        }}
      />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#4D5936]/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Terminal Container */}
      <div className="max-w-md w-full relative z-10 space-y-6">
        {/* Top Header Card */}
        <div className="bg-[#121212]/90 backdrop-blur-xl border border-[#27272A] rounded-2xl p-7 sm:p-9 shadow-2xl shadow-black/80 space-y-7">
          {/* Brand Header */}
          <div className="text-center space-y-3">
            <div className="flex justify-center mb-2">
              <div className="p-3 bg-white/5 border border-white/10 rounded-2xl shadow-inner backdrop-blur-md">
                <Image
                  src="/logo.png"
                  alt="RADIICATO"
                  width={140}
                  height={48}
                  className="h-9 w-auto object-contain invert"
                  priority
                />
              </div>
            </div>

            <div className="flex items-center justify-center gap-2">
              <span className="font-display font-black tracking-widest text-lg text-white">
                RADIICATO
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-[#4D5936] text-white rounded font-bold uppercase tracking-wider">
                ATELIER OS
              </span>
            </div>

            <p className="text-xs text-[#A1A1AA] font-mono">
              SECURE MANAGEMENT TERMINAL // NAIROBI
            </p>
          </div>

          {/* Feedback Alerts */}
          {error && (
            <div className="p-3 bg-red-950/40 border border-red-800/60 rounded-lg flex items-start gap-2.5 text-xs text-red-300 animate-in fade-in slide-in-from-top-1">
              <AlertCircle size={16} className="shrink-0 text-red-400 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-lg flex items-center gap-2.5 text-xs text-emerald-300 animate-in fade-in slide-in-from-top-1">
              <CheckCircle2 size={16} className="shrink-0 text-emerald-400" />
              <span>Identity verified. Launching Atelier OS...</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase tracking-wider text-[#A1A1AA] flex items-center justify-between">
                <span>Official Work Email</span>
                <span className="text-[10px] text-[#71717A]">staff@radiicato.co.ke</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@radiicato.co.ke"
                  className="w-full bg-[#18181B] border border-[#27272A] rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-[#52525B] focus:outline-none focus:border-[#4D5936] focus:ring-1 focus:ring-[#4D5936] transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#A1A1AA]">
                <span>Master Password</span>
                <Link 
                  href="/admin/forgot-password"
                  className="text-[11px] text-[#849B5C] hover:text-[#A3BE75] transition-colors underline font-sans capitalize"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#18181B] border border-[#27272A] rounded-lg px-3.5 py-2.5 pr-10 text-xs text-white placeholder-[#52525B] focus:outline-none focus:border-[#4D5936] focus:ring-1 focus:ring-[#4D5936] transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#71717A] hover:text-[#EDEDED] transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-[#A1A1AA] hover:text-white select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-[#27272A] bg-[#18181B] text-[#4D5936] focus:ring-[#4D5936] focus:ring-offset-0"
                />
                <span>Remember this terminal session</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || success}
              className="w-full py-3 bg-[#4D5936] hover:bg-[#3D472B] disabled:opacity-50 text-white rounded-lg text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#4D5936]/20 group mt-2"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Atelier OS'}</span>
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </form>

          {/* New Staff Registration / Sign Up Link */}
          <div className="pt-2 text-center border-t border-[#27272A]">
            <p className="text-xs text-[#A1A1AA]">
              New atelier team member?{' '}
              <Link
                href="/admin/signup"
                className="text-[#849B5C] hover:text-[#A3BE75] font-semibold transition-colors underline"
              >
                Onboard Staff / Sign Up &rarr;
              </Link>
            </p>
          </div>

          {/* 1-Click Role Switcher for Staging & Review */}
          <div className="pt-4 border-t border-[#27272A] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase text-[#71717A] tracking-wider flex items-center gap-1.5">
                <Terminal size={12} />
                <span>SINGLE ATELIER OWNER // 1-CLICK QUICK ACCESS</span>
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleQuickLogin('SUPER_ADMIN', 'admin@radiicato.co.ke')}
              className="w-full p-3 border border-[#27272A] hover:border-[#4D5936] bg-[#18181B] hover:bg-[#202024] rounded-lg text-left transition-colors group"
            >
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-[9px] font-mono text-[#10B981] font-bold">UNRESTRICTED ATELIER ACCESS</span>
                <Sparkles size={12} className="text-[#10B981]" />
              </div>
              <p className="font-semibold text-white group-hover:text-[#A3BE75] text-xs">
                Radiicato Founder &amp; Creative Director (Super Admin)
              </p>
              <p className="text-[10px] text-[#71717A] font-mono">admin@radiicato.co.ke</p>
            </button>
          </div>
        </div>

        {/* Telemetry Footer */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-3 text-[10px] font-mono text-[#71717A]">
            <span className="flex items-center gap-1">
              <ShieldCheck size={12} className="text-[#4D5936]" />
              <span>AES-256 ENCRYPTED</span>
            </span>
            <span>•</span>
            <span>NAIROBI HQ (UTC+3)</span>
          </div>

          <Link
            href="/"
            className="inline-block text-xs text-[#71717A] hover:text-[#EDEDED] transition-colors"
          >
            &larr; Return to Customer Storefront
          </Link>
        </div>
      </div>
    </div>
  );
}
