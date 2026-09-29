'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { ArrowRight, Lock, Loader2, AlertCircle, CheckCircle2, ShoppingBag } from 'lucide-react';

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/checkout';
  const isForCheckout = redirectPath.includes('checkout');

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

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

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedName = fullName.trim();

    try {
      // 1. Call server API to register & confirm user in Supabase
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: trimmedEmail,
          password,
          fullName: trimmedName,
        }),
      });

      const resData = await res.json();

      if (!res.ok) {
        if (resData.code === 'user_exists') {
          setError('An account with this email already exists. Please sign in below.');
          setLoading(false);
          return;
        }
        throw new Error(resData.error || 'Failed to create account.');
      }

      // 2. Log in with the registered credentials to establish active browser session
      if (supabase) {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password,
        });

        if (signInError) {
          throw new Error(signInError.message);
        }
      }

      setSuccess(true);
      setTimeout(() => {
        router.push(redirectPath);
      }, 1000);
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
            {isForCheckout ? 'CUSTOMER SIGN UP' : 'CREATE ACCOUNT'}
          </h1>
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#71717A]">
            {isForCheckout ? 'SIGN UP TO PROCEED WITH YOUR ORDER' : 'JOIN THE RADIICATO ATELIER'}
          </p>
        </div>

        {isForCheckout && (
          <div className="p-3.5 bg-[#F7F5EF] border border-[#E4E4E7] text-xs font-mono text-[#0A0A0A] flex items-center gap-2.5">
            <ShoppingBag size={16} className="text-[#0A0A0A] shrink-0" />
            <span>Please create an account or sign in to complete your checkout.</span>
          </div>
        )}

        {error && (
          <div className="p-4 bg-white border border-[#E4E4E7] text-sm text-red-600 flex items-start gap-2">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span>{error}</span>
              {error.includes('already exists') && (
                <div>
                  <Link
                    href={`/login?redirect=${encodeURIComponent(redirectPath)}&email=${encodeURIComponent(email)}`}
                    className="underline font-bold text-[#0A0A0A] text-xs font-mono uppercase tracking-wider inline-block mt-1"
                  >
                    Click here to Sign In &rarr;
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        {success && (
          <div className="p-4 bg-white border border-[#E4E4E7] text-sm text-[#0A0A0A] flex items-center gap-2">
            <CheckCircle2 size={16} className="text-green-600" />
            <span>Account created and verified! Redirecting to checkout...</span>
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-mono tracking-[0.12em] uppercase text-[#71717A]">
              FULL NAME *
            </label>
            <input
              type="text"
              required
              placeholder="E.G. JOSHUA KIGEN"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-transparent border-b border-[#E4E4E7] py-3 text-sm uppercase text-[#0A0A0A] placeholder-[#A1A1AA] font-mono focus:outline-none focus:border-[#0A0A0A] transition-colors"
            />
          </div>

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
            <label className="text-[10px] font-mono tracking-[0.12em] uppercase text-[#71717A]">
              PASSWORD *
            </label>
            <input
              type="password"
              required
              minLength={6}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border-b border-[#E4E4E7] py-3 text-sm font-mono text-[#0A0A0A] placeholder-[#A1A1AA] focus:outline-none focus:border-[#0A0A0A] transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading || success}
            className="btn-primary w-full flex items-center justify-center gap-3 disabled:opacity-50 mt-6 py-4 text-xs font-mono font-bold tracking-widest uppercase bg-[#0A0A0A] text-white hover:opacity-85 transition-opacity"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <>
                <span>{isForCheckout ? 'CREATE ACCOUNT & PROCEED' : 'CREATE ACCOUNT'}</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div className="pt-6 border-t border-[#E4E4E7] text-center">
          <p className="text-[11px] font-mono uppercase tracking-wider text-[#71717A]">
            ALREADY HAVE AN ACCOUNT?{' '}
            <Link
              href={`/login?redirect=${encodeURIComponent(redirectPath)}`}
              className="text-[#0A0A0A] font-bold hover:underline"
            >
              SIGN IN
            </Link>
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-[#71717A] pt-8">
          <Lock size={12} /> SECURE REGISTRATION // 256-BIT ENCRYPTION
        </div>
      </div>
    </main>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#0A0A0A]" />
      </div>
    }>
      <SignupForm />
    </Suspense>
  );
}
