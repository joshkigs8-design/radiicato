'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { ArrowRight, Lock, Loader2, AlertCircle, ShoppingBag } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/checkout';
  const initialEmail = searchParams.get('email') || '';
  const isForCheckout = redirectPath.includes('checkout');

  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If already logged in, redirect directly
  useEffect(() => {
    const checkActiveSession = async () => {
      if (!supabase) return;
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user && !session.user.is_anonymous && session.user.email) {
        router.replace(redirectPath);
      }
    };
    checkActiveSession();
  }, [redirectPath, router]);

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
        setError(authError.message.toLowerCase().includes('email not confirmed')
          ? 'Please confirm your email address before signing in.'
          : authError.message);
        setLoading(false);
        return;
      }

      if (data?.user) {
        router.push(redirectPath);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.';
      setError(msg);
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
            {isForCheckout ? 'CUSTOMER SIGN IN' : 'ACCOUNT LOGIN'}
          </h1>
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#71717A]">
            {isForCheckout ? 'SIGN IN TO COMPLETE YOUR ORDER' : 'ACCESS YOUR ORDER HISTORY & DETAILS'}
          </p>
        </div>

        {isForCheckout && (
          <div className="p-3.5 bg-[#F7F5EF] border border-[#E4E4E7] text-xs font-mono text-[#0A0A0A] flex items-center gap-2.5">
            <ShoppingBag size={16} className="text-[#0A0A0A] shrink-0" />
            <span>Sign in to proceed to secure checkout.</span>
          </div>
        )}

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
              placeholder="YOU@EXAMPLE.COM"
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
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border-b border-[#E4E4E7] py-3 text-sm font-mono text-[#0A0A0A] placeholder-[#A1A1AA] focus:outline-none focus:border-[#0A0A0A] transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-3 disabled:opacity-50 mt-6 py-4 text-xs font-mono font-bold tracking-widest uppercase bg-[#0A0A0A] text-white hover:opacity-85 transition-opacity"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <>
                <span>{isForCheckout ? 'SIGN IN & PROCEED' : 'SIGN IN'}</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div className="pt-6 border-t border-[#E4E4E7] text-center">
          <p className="text-[11px] font-mono uppercase tracking-wider text-[#71717A]">
            DON'T HAVE AN ACCOUNT?{' '}
            <Link
              href={`/signup?redirect=${encodeURIComponent(redirectPath)}`}
              className="text-[#0A0A0A] font-bold hover:underline"
            >
              CREATE ONE HERE
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

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#0A0A0A]" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
