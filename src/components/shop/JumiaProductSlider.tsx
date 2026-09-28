'use client';

import { useRef } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { Product } from '@/types';
import { ProductCard } from '@/components/product/ProductCard';
import { isLegacySkullCapProduct } from '@/lib/utils';

interface JumiaProductSliderProps {
	products: Product[];
}

export function JumiaProductSlider({ products }: JumiaProductSliderProps) {
	const sliderRef = useRef<HTMLDivElement>(null);
	const featuredProducts = products
		.filter((product) => product.status === 'active' && !isLegacySkullCapProduct(product))
		.sort((first, second) => Number(second.isFeatured || second.isLimitedDrop) - Number(first.isFeatured || first.isLimitedDrop))
		.slice(0, 10);

	const scroll = (direction: -1 | 1) => {
		sliderRef.current?.scrollBy({ left: direction * 320, behavior: 'smooth' });
	};

	if (featuredProducts.length === 0) return null;

	return (
		<section aria-label="Featured products" className="border-y border-[#E4E4E7] py-5 sm:py-6">
			<div className="mb-4 flex items-center justify-between gap-4">
				<div className="flex min-w-0 items-center gap-2">
					<Sparkles size={15} aria-hidden="true" />
					<h2 className="truncate text-[11px] font-mono font-bold uppercase tracking-wider text-[#0A0A0A]">
						Featured Pieces
					</h2>
					<span className="shrink-0 text-[10px] font-mono text-[#71717A]">{featuredProducts.length}</span>
				</div>
				<div className="flex shrink-0 items-center gap-1.5">
					<button
						type="button"
						onClick={() => scroll(-1)}
						className="border border-[#E4E4E7] bg-white p-1.5 text-[#0A0A0A] transition-colors hover:border-[#0A0A0A]"
						aria-label="Scroll featured products left"
					>
						<ChevronLeft size={16} />
					</button>
					<button
						type="button"
						onClick={() => scroll(1)}
						className="border border-[#E4E4E7] bg-white p-1.5 text-[#0A0A0A] transition-colors hover:border-[#0A0A0A]"
						aria-label="Scroll featured products right"
					>
						<ChevronRight size={16} />
					</button>
				</div>
			</div>
			<div
				ref={sliderRef}
				className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-3 scrollbar-none sm:gap-6"
			>
				{featuredProducts.map((product) => (
					<div key={product.id} className="w-[190px] shrink-0 snap-start sm:w-[220px] md:w-[240px]">
						<ProductCard product={product} />
					</div>
				))}
			</div>
		</section>
	);
}
