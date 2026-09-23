'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export function ChromeStudyViewer() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // 3D rotation angles (degrees)
  const [rotationY, setRotationY] = useState(0);
  const [rotationX, setRotationX] = useState(-5);
  const [isDragging, setIsDragging] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  
  // Drag physics tracking
  const dragStartRef = useRef<{ x: number; y: number; rotX: number; rotY: number }>({ x: 0, y: 0, rotX: 0, rotY: 0 });
  const velocityRef = useRef<{ x: number; y: number }>({ x: 0.6, y: 0 });
  const lastPointerRef = useRef<{ x: number; y: number; time: number }>({ x: 0, y: 0, time: 0 });
  const animFrameRef = useRef<number | null>(null);

  // 3D Animation & Physics loop
  useEffect(() => {
    const loop = () => {
      if (autoRotate && !isDragging) {
        // Continuous smooth 360° turntable spin
        setRotationY((prev) => (prev + 0.6) % 360);
        // Subtle vertical floating wave
        setRotationX((prev) => -4 + Math.sin(Date.now() * 0.002) * 5);
      } else if (!isDragging) {
        // Inertia damping after drag release
        if (Math.abs(velocityRef.current.x) > 0.05) {
          setRotationY((prev) => (prev + velocityRef.current.x) % 360);
          velocityRef.current.x *= 0.94; // friction
        } else if (autoRotate) {
          velocityRef.current.x = 0.6;
        }
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [autoRotate, isDragging]);

  // Pointer drag interactions
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      rotX: rotationX,
      rotY: rotationY,
    };
    lastPointerRef.current = {
      x: e.clientX,
      y: e.clientY,
      time: Date.now(),
    };
    velocityRef.current = { x: 0, y: 0 };
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;

    const deltaX = e.clientX - dragStartRef.current.x;
    const deltaY = e.clientY - dragStartRef.current.y;

    const newRotY = (dragStartRef.current.rotY + deltaX * 0.45) % 360;
    const newRotX = Math.max(-30, Math.min(30, dragStartRef.current.rotX - deltaY * 0.25));

    setRotationY(newRotY);
    setRotationX(newRotX);

    // Calculate drag velocity for momentum
    const now = Date.now();
    const dt = Math.max(1, now - lastPointerRef.current.time);
    const vx = ((e.clientX - lastPointerRef.current.x) / dt) * 8;
    velocityRef.current.x = vx;

    lastPointerRef.current = {
      x: e.clientX,
      y: e.clientY,
      time: now,
    };
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
  };

  // Specular light angle derived from rotation
  const radY = (rotationY * Math.PI) / 180;
  const lightX = 50 + Math.sin(radY) * 40;
  const lightOpacity = Math.max(0.2, (Math.cos(radY) + 1) / 2);

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className="relative w-full h-[calc(100vh-var(--navbar-height))] overflow-hidden bg-black select-none touch-none cursor-grab active:cursor-grabbing flex items-center justify-center"
      style={{ perspective: '1400px' }}
    >
      {/* Dynamic Background Chrome Environment Glow */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-300"
        style={{
          background: `radial-gradient(circle 600px at ${lightX}% 45%, rgba(255, 255, 255, 0.08), rgba(0, 0, 0, 0.95) 75%)`,
        }}
      />

      {/* Showroom Floor Light Grid (Pesos 3D Study Vibe) */}
      <div
        className="absolute inset-x-0 bottom-0 h-56 pointer-events-none opacity-25"
        style={{
          background: 'linear-gradient(to top, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '100% 28px',
          maskImage: 'linear-gradient(to top, black, transparent)',
          WebkitMaskImage: 'linear-gradient(to top, black, transparent)',
        }}
      />

      {/* Floating 3D Turntable Sculpture */}
      <div
        className="relative z-10 flex flex-col items-center justify-center p-6"
        style={{
          transformStyle: 'preserve-3d',
          transform: `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`,
          transition: isDragging ? 'none' : 'transform 0.05s linear',
        }}
      >
        {/* Soft Volumetric Showroom Floor Shadow */}
        <div
          className="absolute -bottom-16 w-[90%] h-14 bg-white/[0.04] blur-3xl rounded-full scale-90 pointer-events-none"
          style={{ transform: 'rotateX(90deg) translateZ(-60px)' }}
        />

        {/* 3D Volumetric Extrusion Stack (Multi-layered Chrome Slices) */}
        <div className="relative group max-w-[85vw] sm:max-w-[70vw] md:max-w-[620px] lg:max-w-[740px]" style={{ transformStyle: 'preserve-3d' }}>
          
          {/* Deep back slice */}
          <div
            className="absolute inset-0 pointer-events-none opacity-50 filter brightness-50"
            style={{ transform: 'translateZ(-14px)' }}
          >
            <Image
              src="/images/radiicato-3d-chrome.png"
              alt=""
              width={740}
              height={740}
              priority
              className="w-full h-auto object-contain"
            />
          </div>

          {/* Mid depth slice */}
          <div
            className="absolute inset-0 pointer-events-none opacity-70 filter brightness-75"
            style={{ transform: 'translateZ(-7px)' }}
          >
            <Image
              src="/images/radiicato-3d-chrome.png"
              alt=""
              width={740}
              height={740}
              priority
              className="w-full h-auto object-contain"
            />
          </div>

          {/* Front Primary 3D Liquid Chrome Model */}
          <div style={{ transform: 'translateZ(10px)' }}>
            <Image
              src="/images/radiicato-3d-chrome.png"
              alt="RADIICATO 3D Liquid Chrome Logo"
              width={740}
              height={740}
              priority
              className="w-full h-auto object-contain filter drop-shadow-[0_25px_50px_rgba(255,255,255,0.22)] drop-shadow-[0_45px_100px_rgba(0,0,0,0.95)]"
            />
          </div>

          {/* Forward specular flare slice */}
          <div
            className="absolute inset-0 pointer-events-none mix-blend-overlay transition-opacity duration-200"
            style={{
              transform: 'translateZ(20px)',
              opacity: lightOpacity * 0.75,
              background: `radial-gradient(ellipse 400px 250px at ${lightX}% 40%, rgba(255,255,255,0.95), transparent 70%)`,
            }}
          />

          {/* Star Flourish Flare Glint */}
          <div
            className="absolute top-[20%] right-[12%] w-10 h-10 pointer-events-none animate-pulse"
            style={{
              background: 'radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 75%)',
              filter: 'blur(1.5px)',
              transform: 'translateZ(30px)',
            }}
          />
        </div>

        {/* Glassmorphic 3D Control Pill */}
        <div
          className="mt-8 flex items-center gap-3 glass-pill px-4 py-1.5 pointer-events-auto"
          style={{ transform: 'translateZ(40px)' }}
          onClick={(e) => e.stopPropagation()}
        >
          <span className="w-2 h-2 rounded-full bg-white animate-ping" />
          <span className="text-[11px] font-mono tracking-[0.2em] uppercase text-white/80">
            3D CHROME ROTATE // DRAG TO SPIN
          </span>
          <button
            type="button"
            onClick={() => setAutoRotate((prev) => !prev)}
            className="ml-2 text-[10px] font-mono tracking-[0.16em] uppercase px-2 py-0.5 rounded-full border border-white/20 bg-white/10 hover:bg-white hover:text-black transition-colors"
          >
            {autoRotate ? 'PAUSE' : 'AUTO-SPIN'}
          </button>
        </div>
      </div>

      {/* Bottom Pinned Frosted Glass CTA — PESOS Exact Match */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-center px-6 pb-[max(2.5rem,env(safe-area-inset-bottom))] sm:pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        <Link
          href="/shop"
          className="group pointer-events-auto glass-button rounded-[2px] px-6 py-4 text-center font-sans text-[14px] font-semibold uppercase leading-[1.3] tracking-[0.14em] max-[359px]:px-4 max-[359px]:text-[13px] sm:px-9"
        >
          <span className="text-white transition-colors group-hover:text-black">
            Shop latest collection
          </span>
        </Link>
      </div>
    </div>
  );
}
