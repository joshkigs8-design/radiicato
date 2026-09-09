'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ProductWizard } from '@/components/admin/ProductWizard';
import { useStore } from '@/lib/use-store';

export default function EditProductPage() {
  const params = useParams();
  const id = params.id as string;
  const { getProductById } = useStore();

  const product = getProductById(id);

  if (!product) {
    return (
      <div className="p-12 text-center space-y-4">
        <h2 className="text-lg font-bold text-[#111827]">Product Not Found</h2>
        <p className="text-xs text-[#6B7280]">Could not locate product with ID: {id}</p>
        <Link
          href="/admin/products"
          className="inline-block px-4 py-2 bg-[#111827] text-white rounded text-xs font-bold"
        >
          Return to Products Catalog
        </Link>
      </div>
    );
  }

  return <ProductWizard initialProduct={product} isEditing={true} />;
}

