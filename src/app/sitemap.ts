import { MetadataRoute } from 'next';
import { INITIAL_PRODUCTS, INITIAL_COLLECTIONS } from '@/lib/seed-data';
import { supabase } from '@/lib/supabase';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://radiicato.co.ke';
  const now = new Date();

  // 1. Core Storefront Pages
  const corePages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/collections`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/lookbook`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
  ];

  // 2. Dynamic Collections Mapping
  const collectionSlugs = new Map<string, { updatedAt: Date; priority: number }>();
  INITIAL_COLLECTIONS.forEach((col) => {
    collectionSlugs.set(col.slug, {
      updatedAt: col.createdAt ? new Date(col.createdAt) : now,
      priority: col.status === 'live' ? 0.9 : 0.8,
    });
  });

  // 3. Dynamic Products Mapping
  const productSlugs = new Map<string, { updatedAt: Date; priority: number }>();
  INITIAL_PRODUCTS.forEach((prod) => {
    productSlugs.set(prod.slug, {
      updatedAt: prod.updatedAt ? new Date(prod.updatedAt) : now,
      priority: prod.isFeatured ? 0.9 : 0.85,
    });
  });

  // Enrich dynamically with live Supabase database records when configured
  try {
    if (supabase) {
      const [productsRes, collectionsRes] = await Promise.all([
        supabase.from('products').select('slug, updated_at, is_featured, status').eq('status', 'active'),
        supabase.from('collections').select('slug, updated_at, status'),
      ]);

      if (productsRes.data && productsRes.data.length > 0) {
        productsRes.data.forEach((p: any) => {
          if (p.slug) {
            productSlugs.set(p.slug, {
              updatedAt: p.updated_at ? new Date(p.updated_at) : now,
              priority: p.is_featured ? 0.9 : 0.85,
            });
          }
        });
      }

      if (collectionsRes.data && collectionsRes.data.length > 0) {
        collectionsRes.data.forEach((c: any) => {
          if (c.slug) {
            collectionSlugs.set(c.slug, {
              updatedAt: c.updated_at ? new Date(c.updated_at) : now,
              priority: c.status === 'live' ? 0.9 : 0.8,
            });
          }
        });
      }
    }
  } catch (err) {
    console.warn('Supabase dynamic sitemap query fallback:', err);
  }

  const collectionEntries: MetadataRoute.Sitemap = Array.from(collectionSlugs.entries()).map(
    ([slug, meta]) => ({
      url: `${baseUrl}/collections/${slug}`,
      lastModified: meta.updatedAt,
      changeFrequency: 'weekly',
      priority: meta.priority,
    })
  );

  const productEntries: MetadataRoute.Sitemap = Array.from(productSlugs.entries()).map(
    ([slug, meta]) => ({
      url: `${baseUrl}/product/${slug}`,
      lastModified: meta.updatedAt,
      changeFrequency: 'weekly',
      priority: meta.priority,
    })
  );

  // 4. Legal & Customer Information Pages
  const legalAndInfoPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/shipping`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/returns`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.4,
    },
  ];

  return [
    ...corePages,
    ...collectionEntries,
    ...productEntries,
    ...legalAndInfoPages,
  ];
}

