'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { ArrowRight, Lock, Loader2, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const trimmedEmail = email.trim().toLowerCase();

    try {
      if (!supabase) {
        setError('Supabase is not configured.');
        setLoading(false);
        return;
      }
      
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password,
      });

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      if (data.user) {
        router.push('/checkout');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white text-[#0A0A0A] flex flex-col justify-center items-center p-5 sm:px-8 py-32">
      <div className="max-w-sm w-full space-y-8">
        <div className="text-center space-y-4">
          <Link href="/" className="inline-block">
            <Image
              src="/logo.png"
              alt="RADIICATO"
              width={140}
              height={48}
              className="h-8 w-auto object-contain mx-auto"
              priority
            />
          </Link>
          <h1 className="text-display-sm font-black uppercase tracking-tight text-[#0A0A0A]">
            ACCOUNT LOGIN
          </h1>
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#71717A]">
            ACCESS YOUR ORDER ARCHIVE & DETAILS
          </p>
        </div>

        {error && (
          <div className="p-4 bg-white border border-[#E4E4E7] text-sm text-red-600 flex items-center gap-2">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-mono tracking-[0.12em] uppercase text-[#71717A]">
              EMAIL ADDRESS *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border-b border-[#E4E4E7] py-3 text-sm uppercase text-[#0A0A0A] placeholder-[#A1A1AA] font-mono focus:outline-none focus:border-[#0A0A0A] transition-colors"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-mono tracking-[0.12em] uppercase text-[#71717A]">
                PASSWORD *
              </label>
              <Link 
                href="/forgot-password"
                className="text-[10px] font-mono text-[#71717A] hover:text-[#0A0A0A] underline"
              >
                FORGOT PASSWORD?
              </Link>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border-b border-[#E4E4E7] py-3 text-sm font-mono text-[#0A0A0A] placeholder-[#A1A1AA] focus:outline-none focus:border-[#0A0A0A] transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-3 disabled:opacity-50 mt-6"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <>
                <span>SIGN IN</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div className="pt-6 border-t border-[#E4E4E7] text-center">
          <p className="text-[11px] font-mono uppercase tracking-wider text-[#71717A]">
            DON'T HAVE AN ACCOUNT?{' '}
            <Link href="/signup" className="text-[#0A0A0A] font-bold hover:underline">
              SIGN UP
            </Link>
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-[#71717A] pt-8">
          <Lock size={12} /> SECURE LOGIN // 256-BIT ENCRYPTION
        </div>
      </div>
    </main>
  );
}

