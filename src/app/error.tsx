'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { RefreshCw, ArrowLeft, ShieldAlert, Terminal, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

interface ErrorBoundaryProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorBoundaryProps) {
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Log exception safely to client console for telemetry
    console.error('RADIICATO Atelier App Exception:', error);
  }, [error]);

  const errorCode = error?.digest || 'ERR_ATELIER_FRAMEWORK_EXCEPTION';

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-center items-center p-6 bg-[#0A0A0A] text-[#EDEDED] overflow-y-auto selection:bg-[#4D5936] selection:text-white antialiased"
      style={{ backgroundColor: '#0A0A0A' }}
    >
      {/* Ambient Atelier Grid & Atmospheric Glow */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#4D5936]/10 blur-[140px] pointer-events-none rounded-full" />

      {/* Luxury Atelier Error Card */}
      <div className="relative z-10 w-full max-w-xl bg-[#121212]/90 border border-white/10 rounded-xl p-8 sm:p-10 shadow-2xl backdrop-blur-xl text-center space-y-6">
        {/* Top Atelier Badge */}
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#4D5936] animate-pulse" />
            <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-[#8E8E93] font-medium">
              RADIICATO // ARCHIVE SAFELIGHT
            </span>
          </div>
          <span className="text-[10px] font-mono text-[#4D5936] bg-[#4D5936]/15 border border-[#4D5936]/30 px-2 py-0.5 rounded">
            CIRCUIT GUARD
          </span>
        </div>

        {/* Icon & Headline */}
        <div className="space-y-3 pt-2">
          <div className="mx-auto w-14 h-14 rounded-full bg-[#18181B] border border-white/10 flex items-center justify-center text-[#4D5936] shadow-inner">
            <ShieldAlert size={26} strokeWidth={1.75} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#EDEDED] font-display">
            UNEXPECTED INTERRUPT
          </h1>
          <p className="text-sm text-[#A1A1AA] font-light max-w-md mx-auto leading-relaxed">
            The requested studio archive encounter met an unexpected rendering anomaly. Our atelier safeguard prevented catastrophic state failure.
          </p>
        </div>

        {/* Error Code / Digest Badge */}
        <div className="bg-[#18181B]/80 border border-white/5 rounded-lg p-3 text-left">
          <div className="flex items-center justify-between text-[11px] font-mono text-[#8E8E93]">
            <span className="flex items-center gap-1.5">
              <Terminal size={13} className="text-[#4D5936]" />
              INCIDENT DIGEST
            </span>
            <span className="text-white/80 font-semibold">{errorCode}</span>
          </div>

          {error?.message && (
            <div className="mt-2 pt-2 border-t border-white/5">
              <button
                type="button"
                onClick={() => setShowDetails(!showDetails)}
                className="flex items-center gap-1 text-[10px] font-mono text-[#A1A1AA] hover:text-white transition-colors"
              >
                <span>{showDetails ? 'Hide diagnostic trace' : 'View diagnostic trace'}</span>
                {showDetails ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              </button>

              {showDetails && (
                <pre className="mt-2 text-[10px] font-mono text-[#D4D4D8] bg-black/60 p-2.5 rounded border border-white/5 overflow-x-auto whitespace-pre-wrap text-left break-all max-h-32">
                  {error.message}
                </pre>
              )}
            </div>
          )}
        </div>

        {/* Action Controls: Try Again & Return to Atelier Home */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#4D5936] hover:bg-[#5D6B42] text-white text-xs font-bold font-mono tracking-wider uppercase transition-all shadow-lg shadow-[#4D5936]/20 active:scale-[0.98] cursor-pointer"
          >
            <RefreshCw size={14} />
            <span>TRY AGAIN</span>
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#18181B] hover:bg-[#27272A] border border-white/10 hover:border-white/20 text-[#EDEDED] text-xs font-bold font-mono tracking-wider uppercase transition-all active:scale-[0.98]"
          >
            <ArrowLeft size={14} />
            <span>RETURN TO ATELIER HOME</span>
          </Link>
        </div>

        {/* Bottom Editorial Coordinates */}
        <div className="pt-4 border-t border-white/5 flex items-center justify-between text-[9px] font-mono text-[#71717A] tracking-wider uppercase">
          <span className="flex items-center gap-1">
            <Sparkles size={10} className="text-[#4D5936]" />
            RADIICATO APPAREL CO.
          </span>
          <span>STUDIO 04 // NAIROBI</span>
        </div>
      </div>
    </div>
  );
}
