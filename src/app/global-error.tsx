'use client';

import React, { useEffect, useState } from 'react';
import { RefreshCw, ArrowLeft, AlertOctagon, Terminal, Shield } from 'lucide-react';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  const [showTrace, setShowTrace] = useState(false);

  useEffect(() => {
    console.error('RADIICATO Atelier Catastrophic Root Exception:', error);
  }, [error]);

  const errorCode = error?.digest || 'ERR_ROOT_CRITICAL_EXCEPTION';

  const handleReturnHome = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  return (
    <html
      lang="en"
      className="dark"
      style={{ backgroundColor: '#0A0A0A', color: '#EDEDED', margin: 0, padding: 0 }}
    >
      <head>
        <title>System Safeguard | RADIICATO Nairobi</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0A0A0A" />
      </head>
      <body
        className="min-h-screen bg-[#0A0A0A] text-[#EDEDED] flex flex-col justify-center items-center p-6 selection:bg-[#4D5936] selection:text-white antialiased font-sans"
        style={{
          backgroundColor: '#0A0A0A',
          color: '#EDEDED',
          margin: 0,
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        }}
      >
        {/* Ambient Grid Pattern */}
        <div
          className="fixed inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
          }}
        />

        {/* Emerald/Olive Accent Glow */}
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#4D5936]/10 blur-[160px] pointer-events-none rounded-full" />

        {/* Catastrophic Recovery Card */}
        <div className="relative z-10 w-full max-w-lg bg-[#111113] border border-white/10 rounded-2xl p-8 sm:p-10 shadow-2xl text-center space-y-6">
          {/* Header Atelier Status */}
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#4D5936]" />
              <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-[#8E8E93]">
                RADIICATO // CORE RUNTIME
              </span>
            </div>
            <span className="text-[10px] font-mono text-[#D4D4D8] border border-white/10 px-2 py-0.5 rounded bg-black/40">
              FAILSAFE
            </span>
          </div>

          {/* Core Icon & Status */}
          <div className="space-y-3">
            <div className="mx-auto w-16 h-16 rounded-full bg-[#18181B] border border-white/10 flex items-center justify-center text-[#4D5936] shadow-lg">
              <AlertOctagon size={28} strokeWidth={1.75} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#EDEDED]">
              ROOT RUNTIME ANOMALY
            </h1>
            <p className="text-sm text-[#A1A1AA] font-light leading-relaxed max-w-md mx-auto">
              A root-level layout execution faulted. The atelier isolation boundary intercepted the crash to safeguard your session.
            </p>
          </div>

          {/* Incident Code & Trace */}
          <div className="bg-[#18181B]/90 border border-white/5 rounded-xl p-3.5 text-left space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono text-[#8E8E93]">
              <span className="flex items-center gap-1.5">
                <Terminal size={13} className="text-[#4D5936]" />
                ERROR DIGEST
              </span>
              <span className="text-white/90 font-semibold">{errorCode}</span>
            </div>

            {error?.message && (
              <div className="pt-2 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setShowTrace(!showTrace)}
                  className="text-[10px] font-mono text-[#71717A] hover:text-[#EDEDED] transition-colors"
                >
                  {showTrace ? '[-] Hide system trace' : '[+] Inspect system trace'}
                </button>
                {showTrace && (
                  <pre className="mt-2 p-2.5 bg-black/80 rounded border border-white/5 text-[10px] font-mono text-[#D4D4D8] overflow-x-auto whitespace-pre-wrap break-all max-h-36">
                    {error.message}
                  </pre>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => reset()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#4D5936] hover:bg-[#5D6B42] text-white text-xs font-bold font-mono tracking-wider uppercase transition-all shadow-lg shadow-[#4D5936]/20 active:scale-[0.98] cursor-pointer"
            >
              <RefreshCw size={14} />
              <span>TRY AGAIN</span>
            </button>

            <button
              type="button"
              onClick={handleReturnHome}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#18181B] hover:bg-[#27272A] border border-white/10 text-[#EDEDED] text-xs font-bold font-mono tracking-wider uppercase transition-all active:scale-[0.98] cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>RETURN TO ATELIER HOME</span>
            </button>
          </div>

          {/* Bottom Atelier Dispatch */}
          <div className="pt-4 border-t border-white/5 flex items-center justify-between text-[9px] font-mono text-[#71717A] tracking-wider uppercase">
            <span className="flex items-center gap-1">
              <Shield size={11} className="text-[#4D5936]" />
              ATELIER FAILSAFE LEVEL 1
            </span>
            <span>NAIROBI, KE</span>
          </div>
        </div>
      </body>
    </html>
  );
}
