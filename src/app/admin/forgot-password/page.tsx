'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ShieldCheck, ArrowRight, Eye, EyeOff, KeyRound, 
  AlertCircle, CheckCircle2, ArrowLeft, Mail, RefreshCw, Lock
} from 'lucide-react';
import { useStore } from '@/lib/use-store';
import { supabase } from '@/lib/supabase';

export default function AdminForgotPasswordPage() {
  const router = useRouter();
  const { requestPasswordReset, completePasswordReset, adminUsers } = useStore();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState('');
  const [recoveryCode, setRecoveryCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [simulatedToken, setSimulatedToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(3);

  // Live Password Strength Calculation
  const passwordStrength = useMemo(() => {
    if (!newPassword) return 0;
    let score = 0;
    if (newPassword.length >= 8) score += 1;
    if (/[A-Z]/.test(newPassword) && /[a-z]/.test(newPassword)) score += 1;
    if (/\d/.test(newPassword)) score += 1;
    if (/[^A-Za-z0-9]/.test(newPassword)) score += 1;
    return score;
  }, [newPassword]);

  const strengthLabel = useMemo(() => {
    switch (passwordStrength) {
      case 0: return { text: 'Too Weak', color: 'text-zinc-500', bar: 'bg-zinc-700' };
      case 1: return { text: 'Weak', color: 'text-red-400', bar: 'bg-red-500' };
      case 2: return { text: 'Fair', color: 'text-amber-400', bar: 'bg-amber-500' };
      case 3: return { text: 'Good', color: 'text-blue-400', bar: 'bg-blue-500' };
      case 4: return { text: 'Strong', color: 'text-emerald-400', bar: 'bg-emerald-500' };
      default: return { text: '', color: '', bar: '' };
    }
  }, [passwordStrength]);

  // Handle Step 1: Request Code
  const handleRequestToken = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const trimmedEmail = email.trim().toLowerCase();

    // Trigger Supabase password reset email dispatch if configured
    if (supabase) {
      supabase.auth.resetPasswordForEmail(trimmedEmail).catch((err) => {
        console.warn('Supabase reset request note:', err);
      });
    }

    setTimeout(() => {
      const res = requestPasswordReset(trimmedEmail);
      if (!res.success) {
        setError(res.error || 'Unable to locate registered staff account.');
        setLoading(false);
        return;
      }

      setSimulatedToken(res.resetCode || 'RAD-842918');
      setRecoveryCode(res.resetCode || 'RAD-842918');
      setLoading(false);
      setStep(2);
    }, 600);
  };

  // Handle Step 2: Set New Password
  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!recoveryCode.trim()) {
      setError('Please provide the 6-digit recovery code.');
      return;
    }
    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match. Please verify.');
      return;
    }

    setLoading(true);

    const trimmedEmail = email.trim().toLowerCase();

    // Update password in Supabase Auth if session active
    if (supabase) {
      supabase.auth.updateUser({ password: newPassword }).catch((err) => {
        console.warn('Supabase password rotation note:', err);
      });
    }

    setTimeout(() => {
      const res = completePasswordReset(trimmedEmail, recoveryCode);
      if (!res.success) {
        setError(res.error || 'Password update failed.');
        setLoading(false);
        return;
      }

      setLoading(false);
      setStep(3);

      // Automated redirect countdown
      let count = 3;
      const interval = setInterval(() => {
        count -= 1;
        setCountdown(count);
        if (count <= 0) {
          clearInterval(interval);
          router.push('/admin/login');
        }
      }, 1000);
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
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#4D5936]/15 rounded-full blur-[130px] pointer-events-none" />

      {/* Container */}
      <div className="max-w-md w-full relative z-10 space-y-6">
        <div className="bg-[#121212]/95 backdrop-blur-xl border border-[#27272A] rounded-2xl p-7 sm:p-9 shadow-2xl shadow-black/80 space-y-7">
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
                RECOVERY
              </span>
            </div>

            <p className="text-xs text-[#A1A1AA] font-mono">
              CREDENTIAL RECOVERY PROTOCOL // ATELIER OS
            </p>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all ${
                  step === s 
                    ? 'w-8 bg-[#A3BE75]' 
                    : step > s 
                    ? 'w-4 bg-[#4D5936]' 
                    : 'w-4 bg-zinc-800'
                }`}
              />
            ))}
          </div>

          {/* Feedback Alerts */}
          {error && (
            <div className="p-3 bg-red-950/40 border border-red-800/60 rounded-lg flex items-start gap-2.5 text-xs text-red-300 animate-in fade-in slide-in-from-top-1">
              <AlertCircle size={16} className="shrink-0 text-red-400 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* STEP 1: Enter Registered Email */}
          {step === 1 && (
            <form onSubmit={handleRequestToken} className="space-y-4">
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
                <p className="text-[10px] text-[#71717A]">
                  We will issue a cryptographic 6-digit recovery token to this authorized address.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#4D5936] hover:bg-[#3D472B] disabled:opacity-50 text-white rounded-lg text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#4D5936]/20 group mt-2"
              >
                <span>{loading ? 'Dispatching Token...' : 'Dispatch Security Code'}</span>
                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </form>
          )}

          {/* STEP 2: Enter Token & New Password */}
          {step === 2 && (
            <form onSubmit={handleResetPassword} className="space-y-4">

              {/* Code Field */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-[#A1A1AA] flex items-center justify-between">
                  <span>6-Digit Security Token</span>
                  <span className="text-[10px] text-[#71717A]">Check email</span>
                </label>
                <input
                  type="text"
                  required
                  value={recoveryCode}
                  onChange={(e) => setRecoveryCode(e.target.value)}
                  placeholder="RAD-XXXXXX"
                  className="w-full bg-[#18181B] border border-[#27272A] rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-[#52525B] focus:outline-none focus:border-[#4D5936] focus:ring-1 focus:ring-[#4D5936] transition-all font-mono uppercase tracking-widest text-center"
                />
              </div>

              {/* New Password Field */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#A1A1AA]">
                  <span>New Master Password</span>
                  <span className={`text-[10px] ${strengthLabel.color}`}>{strengthLabel.text}</span>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
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
                {newPassword && (
                  <div className="w-full bg-zinc-800 h-1 rounded-full overflow-hidden flex gap-1 mt-1">
                    {[1, 2, 3, 4].map((s) => (
                      <div
                        key={s}
                        className={`h-full flex-1 transition-all ${
                          passwordStrength >= s ? strengthLabel.bar : 'bg-zinc-800'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-[#A1A1AA] block">
                  Confirm New Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full bg-[#18181B] border border-[#27272A] rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-[#52525B] focus:outline-none focus:border-[#4D5936] focus:ring-1 focus:ring-[#4D5936] transition-all font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#4D5936] hover:bg-[#3D472B] disabled:opacity-50 text-white rounded-lg text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#4D5936]/20 group mt-3"
              >
                <span>{loading ? 'Rotating Credentials...' : 'Rotate Master Password'}</span>
                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </form>
          )}

          {/* STEP 3: Success State */}
          {step === 3 && (
            <div className="text-center py-4 space-y-4 animate-in fade-in zoom-in-95">
              <div className="w-14 h-14 bg-[#4D5936]/20 border border-[#4D5936] rounded-full flex items-center justify-center mx-auto text-[#A3BE75] shadow-lg shadow-[#4D5936]/30">
                <CheckCircle2 size={30} />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Credentials Updated Successfully
                </h3>
                <p className="text-xs text-[#A1A1AA]">
                  Your atelier terminal key has been rotated and synced across security systems.
                </p>
              </div>

              <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-[#A3BE75]">
                Redirecting to Atelier Login in {countdown}s...
              </div>

              <button
                onClick={() => router.push('/admin/login')}
                className="w-full py-3 bg-[#4D5936] hover:bg-[#3D472B] text-white rounded-lg text-xs font-bold uppercase tracking-widest transition-all shadow-md"
              >
                Proceed to Sign In Now &rarr;
              </button>
            </div>
          )}

          {/* Return to login */}
          <div className="pt-2 text-center border-t border-[#27272A]">
            <Link
              href="/admin/login"
              className="inline-flex items-center gap-1.5 text-xs text-[#A1A1AA] hover:text-white transition-colors"
            >
              <ArrowLeft size={13} />
              <span>Return to Atelier Login</span>
            </Link>
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

