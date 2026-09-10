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

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
        } else if (authError && trimmedEmail === 'joshkigs8@gmail.com' && password === 'Josh3940.') {
          // Auto-provision in Supabase Auth on first login if not yet registered
          try {
            const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
              email: trimmedEmail,
              password: password,
              options: {
                data: {
                  full_name: 'Joshua Kigen',
                  role: 'super_admin',
                },
              },
            });
            if (!signUpError && signUpData.user) {
              loginAdmin(trimmedEmail, 'SUPER_ADMIN');
              setSuccess(true);
              setTimeout(() => {
                router.push('/admin');
              }, 400);
              return;
            }
          } catch (signUpErr) {
            console.warn('Auto sign-up attempt error:', signUpErr);
          }
        }
      } catch (authErr) {
        console.warn('Supabase login error:', authErr);
      }
    }

    // 2. Direct verification for owner credentials
    if (trimmedEmail === 'joshkigs8@gmail.com' && password === 'Josh3940.') {
      loginAdmin(trimmedEmail, 'SUPER_ADMIN');
      setSuccess(true);
      setTimeout(() => {
        router.push('/admin');
      }, 400);
      return;
    }

    setError('Invalid credentials. Access is strictly restricted to the atelier owner.');
    setLoading(false);
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
                OWNER PORTAL
              </span>
            </div>

            <p className="text-xs text-[#A1A1AA] font-mono">
              AUTHORIZED ATELIER MANAGEMENT TERMINAL
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
              <label className="text-[11px] font-mono uppercase tracking-wider text-[#A1A1AA] block">
                Owner Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="joshkigs8@gmail.com"
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

          {/* Security Notice */}
          <div className="pt-3 text-center border-t border-[#27272A]">
            <p className="text-[10px] font-mono text-[#71717A] uppercase tracking-wider">
              SOLE OWNER TERMINAL // UNAUTHORIZED ACCESS IS PROHIBITED &amp; LOGGED
            </p>
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
