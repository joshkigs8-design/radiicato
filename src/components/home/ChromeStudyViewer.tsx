'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export function ChromeStudyViewer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [targetRotate, setTargetRotate] = useState({ x: 0, y: 0 });
  const [isInteracting, setIsInteracting] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const animFrameRef = useRef<number | null>(null);

  // Smooth lerp physics for interactive 3D rotation
  useEffect(() => {
    let idleAngle = 0;
    const updatePhysics = () => {
      if (!isInteracting) {
        idleAngle += 0.015;
        // Gentle sinusoidal floating motion when idle
        const idleX = Math.sin(idleAngle * 0.7) * 4;
        const idleY = Math.cos(idleAngle * 0.5) * 6;
        setRotate((prev) => ({
          x: prev.x + (idleX - prev.x) * 0.05,
          y: prev.y + (idleY - prev.y) * 0.05,
        }));
      } else {
        setRotate((prev) => ({
          x: prev.x + (targetRotate.x - prev.x) * 0.12,
          y: prev.y + (targetRotate.y - prev.y) * 0.12,
        }));
      }
      animFrameRef.current = requestAnimationFrame(updatePhysics);
    };

    animFrameRef.current = requestAnimationFrame(updatePhysics);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isInteracting, targetRotate]);

  // Handle pointer tracking for 3D tilt
  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const normX = (x / rect.width) * 2 - 1; // -1 to 1
    const normY = (y / rect.height) * 2 - 1; // -1 to 1

    // Map to 3D rotation angles (up to 16 deg tilt)
    setTargetRotate({
      x: -normY * 16,
      y: normX * 22,
    });

    setMousePos({
      x: Math.max(0, Math.min(100, (x / rect.width) * 100)),
      y: Math.max(0, Math.min(100, (y / rect.height) * 100)),
    });
  }, []);

  const handlePointerEnter = () => setIsInteracting(true);
  const handlePointerLeave = () => {
    setIsInteracting(false);
    setTargetRotate({ x: 0, y: 0 });
  };

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      className="relative w-full h-[calc(100vh-var(--navbar-height))] overflow-hidden bg-black select-none touch-none cursor-grab active:cursor-grabbing flex items-center justify-center"
      style={{ perspective: '1200px' }}
    >
      {/* Deep Obsidian Background Glow with Ambient Flare */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-700"
        style={{
          background: `radial-gradient(circle 500px at ${mousePos.x}% ${mousePos.y}%, rgba(255, 255, 255, 0.08), rgba(0, 0, 0, 0.95) 75%)`,
        }}
      />

      {/* Grid Floor Line (Pesos 3D Study Vibe) */}
      <div
        className="absolute inset-x-0 bottom-0 h-48 pointer-events-none opacity-20"
        style={{
          background: 'linear-gradient(to top, rgba(255,255,255,0.08) 1px, transparent 1px)',
          backgroundSize: '100% 24px',
          maskImage: 'linear-gradient(to top, black, transparent)',
          WebkitMaskImage: 'linear-gradient(to top, black, transparent)',
        }}
      />

      {/* 3D Floating Chrome Study Model */}
      <div
        className="relative z-10 flex flex-col items-center justify-center p-6"
        style={{
          transformStyle: 'preserve-3d',
          transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) translateZ(30px)`,
          transition: 'transform 0.08s ease-out',
        }}
      >
        {/* Soft Metallic Under-Glow / Ambient Floor Shadow */}
        <div
          className="absolute -bottom-10 w-[80%] h-12 bg-white/5 blur-2xl rounded-full scale-90 pointer-events-none"
          style={{ transform: 'translateZ(-40px)' }}
        />

        {/* Liquid Chrome Logo Container */}
        <div className="relative group max-w-[85vw] sm:max-w-[70vw] md:max-w-[620px] lg:max-w-[760px]">
          {/* Real Chrome 3D Logo Image */}
          <Image
            src="/images/radiicato-3d-chrome.png"
            alt="RADIICATO 3D Liquid Chrome Study"
            width={760}
            height={760}
            priority
            className="w-full h-auto object-contain filter drop-shadow-[0_20px_45px_rgba(255,255,255,0.22)] drop-shadow-[0_45px_90px_rgba(0,0,0,0.9)]"
            style={{ transform: 'translateZ(20px)' }}
          />

          {/* Interactive Light Beam / Dynamic Specular Chrome Flare */}
          <div
            className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-60 transition-opacity duration-300"
            style={{
              background: `radial-gradient(ellipse 350px 200px at ${mousePos.x}% ${mousePos.y}%, rgba(255,255,255,0.85), transparent 70%)`,
            }}
          />

          {/* Star Flare Accent Over Star Flourish */}
          <div
            className="absolute top-[18%] right-[10%] w-8 h-8 pointer-events-none animate-pulse"
            style={{
              background: 'radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 70%)',
              filter: 'blur(1px)',
              transform: 'translateZ(35px)',
            }}
          />
        </div>

        {/* 3D Study Metadata Tag (Subtle Pesos aesthetic) */}
        <div
          className="mt-6 flex items-center gap-3 text-[11px] font-mono tracking-[0.25em] text-white/40 uppercase pointer-events-none"
          style={{ transform: 'translateZ(10px)' }}
        >
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-white/60 animate-ping" />
          <span>CHROME STUDY 01 // ROTATE &amp; EXPLORE</span>
        </div>
      </div>

      {/* Bottom Pinned Frosted Glass CTA — PESOS Exact Match */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-center px-6 pb-[max(2.5rem,env(safe-area-inset-bottom))] sm:pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        <Link
          href="/shop"
          className="group pointer-events-auto rounded-[2px] border border-white/40 bg-white/10 px-5 py-4 text-center font-sans text-[14px] font-semibold uppercase leading-[1.3] tracking-[0.14em] backdrop-blur-md transition-colors hover:border-white hover:bg-white focus-visible:outline focus-visible:outline-1 focus-visible:outline-white max-[359px]:px-3 max-[359px]:text-[13px] max-[359px]:tracking-[0.1em] sm:px-8"
        >
          <span className="text-white transition-colors group-hover:text-black">
            Shop latest collection
          </span>
        </Link>
      </div>
    </div>
  );
}
