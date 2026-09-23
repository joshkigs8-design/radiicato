'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import * as THREE from 'three';

export function ChromeWebGLViewer() {
  const mountRef = useRef<HTMLDivElement>(null);

  // UI state
  const [autoRotate, setAutoRotate] = useState(true);
  const [isWireframe, setIsWireframe] = useState(false);
  const [flipY, setFlipY] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // References to communicate with Three.js render loop
  const stateRef = useRef({
    autoRotate: true,
    isWireframe: false,
    flipY: false,
    rotationX: 0,
    rotationY: 0,
    targetRotationX: 0,
    targetRotationY: 0,
    isDragging: false,
    prevPointerX: 0,
    prevPointerY: 0,
    velocityX: 0.008,
    velocityY: 0,
    zoom: 1,
    material: null as THREE.MeshPhysicalMaterial | null,
    pointLight: null as THREE.PointLight | null,
    modelGroup: null as THREE.Group | null,
  });

  // Keep stateRef synced with React state
  useEffect(() => {
    stateRef.current.autoRotate = autoRotate;
  }, [autoRotate]);

  useEffect(() => {
    stateRef.current.isWireframe = isWireframe;
    if (stateRef.current.material) {
      stateRef.current.material.wireframe = isWireframe;
    }
  }, [isWireframe]);

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
    stateRef.current.material = chromeMaterial;

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
      const elapsedTime = clock.getElapsedTime();

      // Continuous 360-degree rotation & interactive physics
      if (stateRef.current.autoRotate && !stateRef.current.isDragging) {
        stateRef.current.rotationY += 0.012;
        // Natural gentle floating wave
        modelGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.12;
        modelGroup.rotation.x = THREE.MathUtils.lerp(
          modelGroup.rotation.x,
          Math.sin(elapsedTime * 0.9) * 0.08,
          0.05
        );
      } else if (!stateRef.current.isDragging) {
        // Inertia damping
        if (Math.abs(stateRef.current.velocityX) > 0.0001) {
          stateRef.current.rotationY += stateRef.current.velocityX;
          stateRef.current.velocityX *= 0.94;
        }
        if (Math.abs(stateRef.current.velocityY) > 0.0001) {
          stateRef.current.rotationX += stateRef.current.velocityY;
          stateRef.current.velocityY *= 0.94;
        }
      }

      modelGroup.rotation.y = stateRef.current.rotationY;
      modelGroup.rotation.z = stateRef.current.flipY ? Math.PI : 0;
      if (stateRef.current.isDragging) {
        modelGroup.rotation.x = stateRef.current.rotationX;
      }

      // Dynamic light tracking
      if (stateRef.current.pointLight) {
        stateRef.current.pointLight.position.x = Math.sin(elapsedTime * 1.8) * 3;
        stateRef.current.pointLight.position.y = Math.cos(elapsedTime * 1.4) * 2;
      }

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    // 8. Handle Window Resize
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
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

  const resetView = () => {
    stateRef.current.rotationX = 0;
    stateRef.current.rotationY = 0;
    if (stateRef.current.modelGroup) {
      stateRef.current.modelGroup.rotation.set(0, 0, 0);
    }
    setAutoRotate(true);
  };

  return (
    <div
      className="relative w-full h-[calc(100vh-var(--navbar-height))] overflow-hidden bg-black select-none touch-none cursor-grab active:cursor-grabbing flex items-center justify-center"
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
        className="absolute inset-x-0 bottom-0 h-52 pointer-events-none opacity-20 z-0"
        style={{
          background: 'linear-gradient(to top, rgba(255,255,255,0.08) 1px, transparent 1px)',
          backgroundSize: '100% 24px',
          maskImage: 'linear-gradient(to top, black, transparent)',
          WebkitMaskImage: 'linear-gradient(to top, black, transparent)',
        }}
      />

      {/* Glassmorphic 3D Controls HUD */}
      <div
        className="absolute top-6 inset-x-0 z-20 flex justify-center pointer-events-none px-4"
      >
        <div className="glass-panel px-4 py-2 rounded-full flex items-center gap-3 pointer-events-auto">
          <span className="w-2 h-2 rounded-full bg-white animate-ping" />
          <span className="text-[11px] font-mono tracking-[0.2em] uppercase text-white/80">
            WEBGL 3D CHROME STUDY
          </span>
          <div className="h-3 w-[1px] bg-white/20 mx-1" />
          <button
            type="button"
            onClick={() => setAutoRotate((prev) => !prev)}
            className={`text-[10px] font-mono uppercase tracking-[0.14em] px-2.5 py-1 rounded-full transition-colors ${
              autoRotate ? 'bg-white text-black font-semibold' : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            {autoRotate ? 'ROTATING' : 'PAUSED'}
          </button>
          <button
            type="button"
            onClick={() => setIsWireframe((prev) => !prev)}
            className={`text-[10px] font-mono uppercase tracking-[0.14em] px-2.5 py-1 rounded-full transition-colors ${
              isWireframe ? 'bg-white text-black font-semibold' : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            {isWireframe ? 'WIREFRAME: ON' : 'POLYGONS'}
          </button>
          <button
            type="button"
            onClick={() => {
              setFlipY((prev) => {
                const next = !prev;
                stateRef.current.flipY = next;
                return next;
              });
            }}
            className="text-[10px] font-mono uppercase tracking-[0.14em] px-2.5 py-1 rounded-full bg-white/10 text-white/70 hover:bg-white/20 transition-colors"
          >
            FLIP 180°
          </button>
          <button
            type="button"
            onClick={resetView}
            className="text-[10px] font-mono uppercase tracking-[0.14em] px-2.5 py-1 rounded-full bg-white/10 text-white/70 hover:bg-white/20 transition-colors"
          >
            RESET
          </button>
        </div>
      </div>

      {/* Drag instruction cue */}
      <div className="absolute bottom-28 inset-x-0 z-20 flex justify-center pointer-events-none">
        <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-white/40 glass-pill px-4 py-1">
          DRAG TO ORBIT 360° // SCROLL TO ZOOM
        </span>
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

