'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ShieldCheck, ArrowRight, Eye, EyeOff, KeyRound, 
  AlertCircle, CheckCircle2, UserCheck, Shield, HelpCircle, Check
} from 'lucide-react';
import { useStore } from '@/lib/use-store';
import { AdminRole } from '@/types';
import { supabase } from '@/lib/supabase';

const ROLES: { role: AdminRole; label: string; desc: string }[] = [
  { 
    role: 'ADMIN', 
    label: 'Atelier Administrator', 
    desc: 'Full catalog control, order dispatches, client care, and analytics' 
  },
  { 
    role: 'INVENTORY_MANAGER', 
    label: 'Inventory Specialist', 
    desc: '280 GSM fabric reserves, stock adjustments, and low-threshold alerts' 
  },
  { 
    role: 'ORDER_MANAGER', 
    label: 'Order Fulfillment Manager', 
    desc: 'M-PESA verification, packing slips, Fargo & G4S courier dispatch' 
  },
  { 
    role: 'CONTENT_MANAGER', 
    label: 'Editorial Content Director', 
    desc: 'Lookbook spreads, CMS drops, brand copy, and community reviews' 
  },
];

export default function AdminSignUpPage() {
  const router = useRouter();
  const { registerAdmin } = useStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<AdminRole>('ADMIN');
  const [inviteCode, setInviteCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Live Password Strength Calculation
  const passwordStrength = useMemo(() => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
    if (/\d/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    return score; // 0 to 4
  }, [password]);

  const strengthLabel = useMemo(() => {
    switch (passwordStrength) {
      case 0: return { text: 'Too Weak', color: 'text-zinc-500', bar: 'bg-zinc-700' };
      case 1: return { text: 'Weak', color: 'text-red-400', bar: 'bg-red-500' };
      case 2: return { text: 'Fair', color: 'text-amber-400', bar: 'bg-amber-500' };
      case 3: return { text: 'Good', color: 'text-blue-400', bar: 'bg-blue-500' };
      case 4: return { text: 'Strong (Atelier Grade)', color: 'text-emerald-400', bar: 'bg-emerald-500' };
      default: return { text: '', color: '', bar: '' };
    }
  }, [passwordStrength]);

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validations
    if (!name.trim()) {
      setError('Please provide your full legal name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please provide a valid official work email address.');
      return;
    }
    if (password.length < 8) {
      setError('Master Password must be at least 8 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify.');
      return;
    }
    if (!agreed) {
      setError('You must accept the Atelier Security & Confidentiality protocol.');
      return;
    }

    setLoading(true);

    const trimmedEmail = email.trim().toLowerCase();
    const isSuperAdminEmail = trimmedEmail === 'joshkigs8@gmail.com';
    const assignedRole = isSuperAdminEmail ? 'SUPER_ADMIN' : role;

    // 1. Authenticate & Register with Supabase Auth
    const registerWithSupabase = async () => {
      if (supabase) {
        try {
          const { data: authData, error: authError } = await supabase.auth.signUp({
            email: trimmedEmail,
            password,
            options: {
              data: {
                full_name: name.trim(),
                role: isSuperAdminEmail ? 'super_admin' : role.toLowerCase(),
              },
            },
          });
          if (authError) {
            console.warn('Supabase Auth signUp note:', authError.message);
          }
        } catch (authErr) {
          console.warn('Supabase Auth exception:', authErr);
        }
      }
    };

    registerWithSupabase();

    // 2. Register staff in Atelier Store session
    setTimeout(() => {
      const res = registerAdmin({
        name: name.trim(),
        email: trimmedEmail,
        role: assignedRole,
        inviteCode: inviteCode.trim(),
      });

      if (!res.success) {
        setError(res.error || 'Registration failed. Please check your invite code.');
        setLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/admin');
      }, 700);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#EDEDED] flex flex-col justify-center items-center p-4 sm:p-6 py-12 relative selection:bg-[#4D5936] selection:text-white">
      {/* Ambient Atelier Background */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: '48px 48px'
        }}
      />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[32rem] h-[32rem] bg-[#4D5936]/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Container */}
      <div className="max-w-xl w-full relative z-10 space-y-6">
        <div className="bg-[#121212]/95 backdrop-blur-xl border border-[#27272A] rounded-2xl p-7 sm:p-10 shadow-2xl shadow-black/80 space-y-7">
          {/* Header */}
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
                STAFF ONBOARDING
              </span>
            </div>

            <p className="text-xs text-[#A1A1AA] font-mono">
              AUTHORIZED PERSONNEL REGISTRATION // NAIROBI
            </p>
          </div>

          {/* Error & Success Feedback */}
          {error && (
            <div className="p-3.5 bg-red-950/40 border border-red-800/60 rounded-lg flex items-start gap-2.5 text-xs text-red-300 animate-in fade-in slide-in-from-top-1">
              <AlertCircle size={16} className="shrink-0 text-red-400 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3.5 bg-emerald-950/40 border border-emerald-800/60 rounded-lg flex items-center gap-2.5 text-xs text-emerald-300 animate-in fade-in slide-in-from-top-1">
              <CheckCircle2 size={16} className="shrink-0 text-emerald-400" />
              <span>Registration approved. Provisioning atelier credentials...</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSignUp} className="space-y-5">
            {/* Full Name & Work Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-[#A1A1AA]">
                  Full Legal Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Amani Kamau"
                  className="w-full bg-[#18181B] border border-[#27272A] rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-[#52525B] focus:outline-none focus:border-[#4D5936] focus:ring-1 focus:ring-[#4D5936] transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-[#A1A1AA]">
                  Official Work Email
                </label>
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

            {/* Role Selection */}
            <div className="space-y-2">
              <label className="text-[11px] font-mono uppercase tracking-wider text-[#A1A1AA] block">
                Assign Atelier Role & Permissions
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {ROLES.map((r) => {
                  const isSelected = role === r.role;
                  return (
                    <div
                      key={r.role}
                      onClick={() => setRole(r.role)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        isSelected 
                          ? 'bg-[#4D5936]/15 border-[#4D5936] text-white' 
                          : 'bg-[#18181B] border-[#27272A] text-[#A1A1AA] hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs text-white">{r.label}</span>
                        {isSelected && <Check size={14} className="text-[#A3BE75]" />}
                      </div>
                      <p className="text-[10px] text-[#71717A] mt-1 leading-snug line-clamp-2">
                        {r.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Atelier Authorization Code */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#A1A1AA]">
                <span className="flex items-center gap-1">
                  <KeyRound size={12} className="text-[#A3BE75]" />
                  <span>Atelier Invite / Security Token</span>
                </span>
              </div>
              <input
                type="text"
                required
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                placeholder="RAD-ATELIER-XXXX"
                className="w-full bg-[#18181B] border border-[#27272A] rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-[#52525B] focus:outline-none focus:border-[#4D5936] focus:ring-1 focus:ring-[#4D5936] transition-all font-mono uppercase"
              />
              <p className="text-[10px] text-[#71717A]">
                Enter the authorization token issued by Nairobi atelier directors.
              </p>
            </div>

            {/* Password & Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#A1A1AA]">
                  <span>Master Password</span>
                  <span className={`text-[10px] ${strengthLabel.color}`}>{strengthLabel.text}</span>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 8 characters"
                    className="w-full bg-[#18181B] border border-[#27272A] rounded-lg px-3.5 py-2.5 pr-10 text-xs text-white placeholder-[#52525B] focus:outline-none focus:border-[#4D5936] focus:ring-1 focus:ring-[#4D5936] transition-all font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#71717A] hover:text-[#EDEDED] transition-colors"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {/* Strength Meter Bar */}
                {password && (
                  <div className="w-full bg-zinc-800 h-1 rounded-full overflow-hidden flex gap-1 mt-1">
                    {[1, 2, 3, 4].map((step) => (
                      <div
                        key={step}
                        className={`h-full flex-1 transition-all ${
                          passwordStrength >= step ? strengthLabel.bar : 'bg-zinc-800'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-[#A1A1AA] block">
                  Confirm Master Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat password"
                  className="w-full bg-[#18181B] border border-[#27272A] rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-[#52525B] focus:outline-none focus:border-[#4D5936] focus:ring-1 focus:ring-[#4D5936] transition-all font-mono"
                />
              </div>
            </div>

            {/* Confidentiality Checkbox */}
            <div className="pt-1">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-[#A1A1AA] hover:text-white select-none">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 rounded border-[#27272A] bg-[#18181B] text-[#4D5936] focus:ring-[#4D5936] focus:ring-offset-0"
                />
                <span className="text-[11px] leading-relaxed text-[#A1A1AA]">
                  I agree to Radiicato Atelier security protocol, confidential catalog embargoes, and Kenya data protection compliance.
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || success}
              className="w-full py-3 bg-[#4D5936] hover:bg-[#3D472B] disabled:opacity-50 text-white rounded-lg text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#4D5936]/20 group mt-3"
            >
              <span>{loading ? 'Validating Token & Provisioning...' : 'Complete Staff Onboarding'}</span>
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </form>

          {/* Already have an account */}
          <div className="pt-2 text-center border-t border-[#27272A]">
            <p className="text-xs text-[#A1A1AA]">
              Already have an authorized terminal key?{' '}
              <Link
                href="/admin/login"
                className="text-[#849B5C] hover:text-[#A3BE75] font-semibold transition-colors underline"
              >
                Sign In to Atelier OS &rarr;
              </Link>
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

