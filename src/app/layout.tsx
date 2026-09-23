import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { StoreLayoutWrapper } from '@/components/layout/StoreLayoutWrapper';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['400', '500', '600', '700', '900'],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pesosworldwide.com';

export const metadata: Metadata = {
  metadataBase: new URL('https://pesosworldwide.com'),
  title: {
    default: 'PESOS Worldwide | Global Streetwear, Culture & Movement',
    template: '%s | PESOS Worldwide',
  },
  description: 'PESOS Worldwide is a global streetwear label shaped by music, movement, and contemporary culture. Discover curated drops, hard-wearing essentials, and a bold worldwide aesthetic.',
  keywords: [
    'PESOS Worldwide',
    'streetwear brand',
    'global fashion',
    'urban culture',
    'worldwide apparel',
    'modern streetwear',
    'premium essentials',
    'oversized tees',
    'graphic capsule',
    'music inspired streetwear',
    'global drop culture',
    'cult streetwear',
    'limited edition clothing',
    'PESOS drops',
    'editorial streetwear label'
  ],
  authors: [{ name: 'PESOS Worldwide', url: 'https://pesosworldwide.com' }],
  creator: 'PESOS Worldwide',
  publisher: 'PESOS Worldwide',
  category: 'Fashion & Apparel',
  applicationName: 'PESOS Worldwide',
  alternates: {
    canonical: 'https://pesosworldwide.com',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://pesosworldwide.com',
    siteName: 'PESOS Worldwide',
    title: 'PESOS Worldwide | Global Streetwear, Culture & Movement',
    description: 'PESOS Worldwide is a global streetwear label shaped by music, movement, and contemporary culture. Discover curated drops, hard-wearing essentials, and a bold worldwide aesthetic.',
    images: [
      {
        url: '/images/broken-record.jpg',
        width: 1200,
        height: 630,
        alt: 'PESOS Worldwide Editorial Campaign',
      },
      {
        url: '/images/products/broken-record-front.jpg',
        width: 800,
        height: 800,
        alt: 'PESOS Worldwide Broken Record Tee',
      },
      {
        url: '/images/products/we-are-who-we-are-front.jpg',
        width: 800,
        height: 800,
        alt: 'PESOS Worldwide We Are Who We Are Tee',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@pesosworldwide',
    creator: '@pesosworldwide',
    title: 'PESOS Worldwide | Global Streetwear, Culture & Movement',
    description: 'A worldwide movement in streetwear, defined by identity, attitude and culture.',
    images: ['/images/broken-record.jpg'],
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/icon.svg' },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  other: {
    'geo.region': 'KE-30',
    'geo.placename': 'Nairobi',
    'geo.position': '-1.2921;36.8219',
    'ICBM': '-1.2921, 36.8219',
  },
};

// Global Schema.org JSON-LD Structured Data
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'PESOS Worldwide',
  legalName: 'PESOS Worldwide',
  url: siteUrl,
  logo: `${siteUrl}/logo.png`,
  image: `${siteUrl}/images/broken-record.jpg`,
  description: 'Global streetwear label rooted in movement, identity, and culture. Designed for a worldwide audience with premium essentials and limited-edition drops.',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Global Studio',
    addressLocality: 'Worldwide',
    addressCountry: 'US',
  },
  priceRange: '$50 - $180',
  currenciesAccepted: 'USD, KES, EUR, GBP',
  paymentAccepted: 'Credit Card, PayPal, M-PESA',
  sameAs: [
    'https://instagram.com/pesosworldwide',
    'https://tiktok.com/@pesosworldwide',
    'https://x.com/pesosworldwide',
  ],
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'PESOS Worldwide',
  url: siteUrl,
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${siteUrl}/shop?search={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className={`${inter.className} min-h-full flex flex-col bg-black text-white antialiased`}>
        <StoreLayoutWrapper>
          {children}
        </StoreLayoutWrapper>
      </body>
    </html>
  );
}

