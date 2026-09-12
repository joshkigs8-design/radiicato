'use client';

import React, { useEffect } from 'react';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error('RADIICATO Atelier Catastrophic Root Exception:', error);
  }, [error]);

  const handleReturnHome = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  return (
    <html lang="en">
      <head>
        <title>System Safeguard | RADIICATO Nairobi</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body className="min-h-screen bg-white text-[#0A0A0A] flex flex-col justify-center items-center p-6 antialiased font-sans">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="space-y-4">
            <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#71717A]">
              ROOT RUNTIME ANOMALY
            </p>
            <h1 className="text-display-sm font-black uppercase tracking-tight text-[#0A0A0A]">
              SYSTEM FAULT
            </h1>
            <p className="text-sm text-[#71717A] leading-relaxed">
              A root-level layout execution faulted. The atelier isolation boundary intercepted the crash to safeguard your session.
            </p>
          </div>

          <div className="flex flex-col items-center gap-4 pt-6">
            <button
              type="button"
              onClick={() => reset()}
              className="bg-[#0A0A0A] text-white w-full py-4 text-[11px] font-mono uppercase tracking-[0.12em] font-bold"
            >
              TRY AGAIN
            </button>

            <button
              type="button"
              onClick={handleReturnHome}
              className="text-[11px] font-mono text-[#71717A] hover:text-[#0A0A0A] uppercase tracking-wider border-b border-transparent hover:border-[#0A0A0A] transition-colors pb-1 mt-4"
            >
              RETURN TO ATELIER
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
