'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Product } from '@/types';

export interface SkullCapColorway {
  colorName: string;
  colorHex: string;
  image?: Product['images'][number];
}

export function useSkullCapVariants(product: Product | undefined, enabled: boolean) {
  const colorways = useMemo<SkullCapColorway[]>(() => {
    if (!product || !enabled) return [];

    const uniqueColors = Array.from(
      new Map(product.variants.map((variant) => [variant.colorName, variant])).values()
    );

    return uniqueColors.map((variant, index) => ({
      colorName: variant.colorName,
      colorHex: variant.colorHex,
      image:
        product.images.find((image) =>
          image.altText.toLowerCase().includes(variant.colorName.toLowerCase())
        ) || product.images.find((image) => image.displayOrder === index + 1) || product.images[0],
    }));
  }, [enabled, product]);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const resumeAt = useRef(0);

  useEffect(() => {
    if (!enabled || colorways.length < 2) return;

    const interval = window.setInterval(() => {
      if (isHovered || document.visibilityState !== 'visible' || Date.now() < resumeAt.current) return;
      setSelectedIndex((index) => (index + 1) % colorways.length);
    }, 4500);

    return () => window.clearInterval(interval);
  }, [colorways.length, enabled, isHovered]);

  const selectColor = (index: number) => {
    setSelectedIndex(index);
    resumeAt.current = Date.now() + 9000;
  };

  const pauseForTouch = () => {
    resumeAt.current = Date.now() + 9000;
  };

  return { colorways, selectedIndex, selectColor, setIsHovered, pauseForTouch };
}

interface SkullCapColorSwatchesProps {
  colorways: SkullCapColorway[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  appearance?: 'dark' | 'light';
}

export function SkullCapColorSwatches({
  colorways,
  selectedIndex,
  onSelect,
  appearance = 'dark',
}: SkullCapColorSwatchesProps) {
  if (colorways.length < 2) return null;

  const activeClass = appearance === 'dark' ? 'border-white' : 'border-[#0A0A0A]';
  const inactiveClass = appearance === 'dark' ? 'border-white/20' : 'border-[#D4D4D8]';

  return (
    <div role="group" aria-label="Choose a skull cap colour" className="flex items-center gap-1.5">
      {colorways.map((colorway, index) => (
        <button
          key={colorway.colorName}
          type="button"
          onClick={() => onSelect(index)}
          title={colorway.colorName}
          aria-label={`Select ${colorway.colorName} colour`}
          aria-pressed={selectedIndex === index}
          className={`h-9 w-9 rounded-full border p-1 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
            selectedIndex === index ? activeClass : inactiveClass
          }`}
        >
          <span
            aria-hidden="true"
            className="block h-full w-full rounded-full border border-black/10"
            style={{ backgroundColor: colorway.colorHex }}
          />
        </button>
      ))}
    </div>
  );
}