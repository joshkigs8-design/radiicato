'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface ErrorBoundaryProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorBoundaryProps) {
  useEffect(() => {
    console.error('RADIICATO Atelier App Exception:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-white text-[#0A0A0A] flex flex-col justify-center items-center p-6 text-center antialiased">
      <div className="max-w-md w-full space-y-8">
        <div className="space-y-4">
          <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#71717A]">
            SYSTEM INTERRUPT
          </p>
          <h1 className="text-display-sm font-black uppercase tracking-tight text-[#0A0A0A]">
            ANOMALY DETECTED
          </h1>
          <p className="text-sm text-[#71717A] leading-relaxed">
            The requested studio archive encounter met an unexpected rendering anomaly.
          </p>
        </div>

        <div className="flex flex-col items-center gap-4 pt-6">
          <button
            onClick={() => reset()}
            className="btn-primary w-full"
          >
            TRY AGAIN
          </button>

          <Link
            href="/"
            className="text-[11px] font-mono text-[#71717A] hover:text-[#0A0A0A] uppercase tracking-wider border-b border-transparent hover:border-[#0A0A0A] transition-colors pb-1 mt-4"
          >
            RETURN TO ATELIER
          </Link>
        </div>
      </div>
    </div>
  );
}
