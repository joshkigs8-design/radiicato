'use client';

import React, { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import * as THREE from 'three';

export function ChromeWebGLViewer() {
  const mountRef = useRef<HTMLDivElement>(null);

  const [isLoaded, setIsLoaded] = useState(false);

  // References to communicate with Three.js render loop
  const stateRef = useRef({
    rotationX: 0,
    rotationY: 0,
    isDragging: false,
    prevPointerX: 0,
    prevPointerY: 0,
    velocityX: 0,
    velocityY: 0,
    baseY: 0,
    pointLight: null as THREE.PointLight | null,
    modelGroup: null as THREE.Group | null,
  });

  // Main Three.js Scene Setup
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth;
    let height = container.clientHeight;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = null; // Transparent canvas

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.5);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // 2. Procedural Photographic HDR Studio Environment Map
    const envCanvas = document.createElement('canvas');
    envCanvas.width = 1024;
    envCanvas.height = 512;
    const ctx = envCanvas.getContext('2d')!;

    // Dark moody studio base
    const gradBase = ctx.createLinearGradient(0, 0, 0, 512);
    gradBase.addColorStop(0, '#0a0a10');
    gradBase.addColorStop(0.5, '#040406');
    gradBase.addColorStop(1, '#000000');
    ctx.fillStyle = gradBase;
    ctx.fillRect(0, 0, 1024, 512);

    // Overhead high-intensity white studio softbox
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(360, 40, 300, 110);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.filter = 'blur(16px)';
    ctx.fillRect(340, 20, 340, 150);
    ctx.filter = 'none';

    // Left cool-white lateral strip light
    const gradLeft = ctx.createLinearGradient(0, 180, 160, 340);
    gradLeft.addColorStop(0, 'rgba(235, 245, 255, 0.9)');
    gradLeft.addColorStop(1, 'rgba(100, 150, 220, 0)');
    ctx.fillStyle = gradLeft;
    ctx.fillRect(40, 160, 140, 180);

    // Right warm-silver rim light strip
    const gradRight = ctx.createLinearGradient(1024, 180, 860, 340);
    gradRight.addColorStop(0, 'rgba(255, 250, 240, 0.9)');
    gradRight.addColorStop(1, 'rgba(200, 180, 140, 0)');
    ctx.fillStyle = gradRight;
    ctx.fillRect(840, 160, 140, 180);

    // Bottom soft ground bounce
    ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.fillRect(200, 420, 624, 60);

    const envTexture = new THREE.CanvasTexture(envCanvas);
    envTexture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = envTexture;

    // 3. Dynamic Lights
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
    keyLight.position.set(5, 7, 6);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xd0e0ff, 1.2);
    fillLight.position.set(-6, -2, 4);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 1.8);
    rimLight.position.set(0, -6, -4);
    scene.add(rimLight);

    // Interactive pointer light
    const pointLight = new THREE.PointLight(0xffffff, 3.5, 12, 1.5);
    pointLight.position.set(0, 0, 3.5);
    scene.add(pointLight);
    stateRef.current.pointLight = pointLight;

    // 4. Group for 3D Model
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);
    stateRef.current.modelGroup = modelGroup;

    // 5. Build True 3D Liquid Chrome Polygon Geometry
    const textureLoader = new THREE.TextureLoader();
    const logoMap = textureLoader.load('/images/radiicato-3d-chrome.png', () => {
      setIsLoaded(true);
    });
    logoMap.colorSpace = THREE.SRGBColorSpace;

    // PBR Liquid Chrome Material
    const chromeMaterial = new THREE.MeshPhysicalMaterial({
      map: logoMap,
      color: 0xffffff,
      metalness: 1.0,
      roughness: 0.03,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
      reflectivity: 1.0,
      envMap: envTexture,
      envMapIntensity: 2.8,
      transparent: true,
      alphaTest: 0.08,
      side: THREE.DoubleSide,
    });

    // High polygon density planar base for 3D extrusion
    // 120 x 120 segments = 28,800 polygons of real 3D geometry!
    const meshWidth = 4.8;
    const meshHeight = 4.8;
    const segments = 90;

    const frontGeom = new THREE.PlaneGeometry(meshWidth, meshHeight, segments, segments);
    const frontPos = frontGeom.attributes.position;

    // Extrude vertices along Z to give physical curvature and depth
    for (let i = 0; i < frontPos.count; i++) {
      const x = frontPos.getX(i);
      const y = frontPos.getY(i);
      const distFromCenter = Math.sqrt(x * x + y * y);
      // Gentle convex 3D dome curvature across letters
      const domeZ = Math.max(0, 0.15 - distFromCenter * 0.03);
      frontPos.setZ(i, domeZ);
    }
    frontGeom.computeVertexNormals();

    const frontMesh = new THREE.Mesh(frontGeom, chromeMaterial);
    frontMesh.position.z = 0.08;
    modelGroup.add(frontMesh);

    // Deep backplate mesh (mirrored for true 360° back profile)
    const backGeom = frontGeom.clone();
    const backMaterial = chromeMaterial.clone();
    backMaterial.roughness = 0.08; // slightly darker brushed chrome back
    backMaterial.envMapIntensity = 2.2;

    const backMesh = new THREE.Mesh(backGeom, backMaterial);
    backMesh.rotation.y = Math.PI;
    backMesh.position.z = -0.08;
    modelGroup.add(backMesh);

    // Volumetric 3D depth slice stack (giving tangible solid metallic thickness)
    const SLICES = 5;
    for (let s = 1; s <= SLICES; s++) {
      const zOffset = -0.08 + (0.16 * s) / (SLICES + 1);
      const sliceGeom = frontGeom.clone();
      const sliceMat = chromeMaterial.clone();
      sliceMat.opacity = 0.45;
      const sliceMesh = new THREE.Mesh(sliceGeom, sliceMat);
      sliceMesh.position.z = zOffset;
      modelGroup.add(sliceMesh);
    }

    // 6. Showroom Floor Shadow Plane
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const sCtx = shadowCanvas.getContext('2d')!;
    const sGrad = sCtx.createRadialGradient(128, 128, 10, 128, 128, 120);
    sGrad.addColorStop(0, 'rgba(255, 255, 255, 0.12)');
    sGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.03)');
    sGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    sCtx.fillStyle = sGrad;
    sCtx.fillRect(0, 0, 256, 256);

    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowGeom = new THREE.PlaneGeometry(6, 6);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(shadowGeom, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -2.2;
    scene.add(shadowMesh);

    // 7. Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      const delta = Math.min(clock.getDelta(), 0.05);
      const elapsedTime = clock.getElapsedTime();

      // Continuous 360-degree rotation & interactive physics
      if (!stateRef.current.isDragging) {
        // Inertia damping if recently dragged by user
        if (Math.abs(stateRef.current.velocityX) > 0.001) {
          stateRef.current.rotationY += stateRef.current.velocityX;
          stateRef.current.velocityX *= 0.93;
        } else {
          // Continuous smooth luxury turntable spin (~6s per 360° rotation)
          stateRef.current.rotationY += delta * 1.05;
        }

        if (Math.abs(stateRef.current.velocityY) > 0.001) {
          stateRef.current.rotationX += stateRef.current.velocityY;
          stateRef.current.velocityY *= 0.93;
        }

        // Return rotationX gently to subtle natural floating wave
        stateRef.current.rotationX = THREE.MathUtils.lerp(
          stateRef.current.rotationX,
          Math.sin(elapsedTime * 1.1) * 0.06,
          0.04
        );

        // Natural gentle floating wave on Y around responsive baseY
        const baseY = stateRef.current.baseY || 0;
        modelGroup.position.y = baseY + Math.sin(elapsedTime * 1.5) * 0.1;
      } else {
        modelGroup.rotation.x = stateRef.current.rotationX;
      }

      modelGroup.rotation.y = stateRef.current.rotationY;

      // Dynamic specular light tracking for liquid chrome gleam
      if (stateRef.current.pointLight) {
        stateRef.current.pointLight.position.x = Math.sin(elapsedTime * 1.8) * 3;
        stateRef.current.pointLight.position.y = Math.cos(elapsedTime * 1.4) * 2;
      }

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    // 8. Dynamic Responsive Framing (Guarantees perfect logo fit on any phone or desktop)
    const applyResponsiveFraming = () => {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      if (width === 0 || height === 0) return;

      const aspect = width / height;
      camera.aspect = aspect;

      // The 3D logo mesh width is 4.8 units. Vertical FOV is 42 degrees.
      // Horizontal visible span = 2 * Z * tan(21°) * aspect.
      // On narrow mobile screens (aspect < 1.25), we dynamically adjust camera Z
      // so the 4.8-wide logo comfortably fills ~74% of the screen width with ~13% safe margins.
      if (aspect < 1.25) {
        const targetVisibleWidth = 6.4; // 4.8 / 0.75
        const halfFovRad = (camera.fov * Math.PI) / 360;
        const requiredZ = targetVisibleWidth / (2 * Math.tan(halfFovRad) * aspect);
        camera.position.z = THREE.MathUtils.clamp(requiredZ, 7.5, 17.5);
        // Elevate model slightly on phone portrait so it sits in the upper visual sweet spot
        stateRef.current.baseY = THREE.MathUtils.lerp(0.35, 0, THREE.MathUtils.clamp((aspect - 0.45) / 0.8, 0, 1));
      } else {
        camera.position.z = 7.5;
        stateRef.current.baseY = 0;
      }

      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    // Initial calculation
    applyResponsiveFraming();

    // Listen for resize and orientation changes
    window.addEventListener('resize', applyResponsiveFraming);
    window.addEventListener('orientationchange', applyResponsiveFraming);

    // ResizeObserver watches the container element directly for mobile toolbar changes
    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        applyResponsiveFraming();
      });
      resizeObserver.observe(container);
    }

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animId);
      if (resizeObserver) resizeObserver.disconnect();
      window.removeEventListener('resize', applyResponsiveFraming);
      window.removeEventListener('orientationchange', applyResponsiveFraming);
      renderer.dispose();
      frontGeom.dispose();
      backGeom.dispose();
      chromeMaterial.dispose();
      envTexture.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Pointer drag to spin 360°
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    stateRef.current.isDragging = true;
    stateRef.current.prevPointerX = e.clientX;
    stateRef.current.prevPointerY = e.clientY;
    stateRef.current.velocityX = 0;
    stateRef.current.velocityY = 0;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!stateRef.current.isDragging) return;

    const deltaX = e.clientX - stateRef.current.prevPointerX;
    const deltaY = e.clientY - stateRef.current.prevPointerY;

    stateRef.current.rotationY += deltaX * 0.008;
    stateRef.current.rotationX = Math.max(-0.6, Math.min(0.6, stateRef.current.rotationX + deltaY * 0.006));

    stateRef.current.velocityX = deltaX * 0.006;
    stateRef.current.velocityY = deltaY * 0.004;

    stateRef.current.prevPointerX = e.clientX;
    stateRef.current.prevPointerY = e.clientY;

    // Move interactive light in 3D
    if (stateRef.current.pointLight && mountRef.current) {
      const rect = mountRef.current.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 6 - 3;
      const ny = -(((e.clientY - rect.top) / rect.height) * 6 - 3);
      stateRef.current.pointLight.position.set(nx, ny, 3.5);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    stateRef.current.isDragging = false;
    (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
  };

  return (
    <div
      className="relative w-full h-[calc(100svh-var(--navbar-height))] sm:h-[calc(100vh-var(--navbar-height))] overflow-hidden bg-black select-none touch-pan-y cursor-grab active:cursor-grabbing flex items-center justify-center"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* Three.js Canvas Container */}
      <div ref={mountRef} className="absolute inset-0 z-10 w-full h-full" />

      {/* Atmospheric Radial Gradient */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(ellipse 65% 55% at 50% 48%, rgba(255, 255, 255, 0.06), rgba(0, 0, 0, 0.95) 75%)',
        }}
      />

      {/* Showroom Floor Grid */}
      <div
        className="absolute inset-x-0 bottom-0 h-40 sm:h-52 pointer-events-none opacity-20 z-0"
        style={{
          background: 'linear-gradient(to top, rgba(255,255,255,0.08) 1px, transparent 1px)',
          backgroundSize: '100% 24px',
          maskImage: 'linear-gradient(to top, black, transparent)',
          WebkitMaskImage: 'linear-gradient(to top, black, transparent)',
        }}
      />

      {/* Bottom Pinned Frosted Glass CTA — PESOS Exact Match */}
      <div className="pointer-events-none absolute inset-x-0 bottom-4 sm:bottom-6 z-20 flex justify-center px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <Link
          href="/shop"
          className="group pointer-events-auto glass-button rounded-xl px-7 py-3.5 sm:px-9 sm:py-4 text-center font-sans text-[13px] sm:text-[14px] font-semibold uppercase leading-[1.3] tracking-[0.14em] shadow-2xl transition-all duration-300 hover:scale-105"
        >
          <span className="text-white transition-colors group-hover:text-black">
            Shop latest collection
          </span>
        </Link>
      </div>
    </div>
  );
}

