import type { Metadata } from 'next';
import './globals.css';
import { StoreLayoutWrapper } from '@/components/layout/StoreLayoutWrapper';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://radiicato.co.ke';

export const metadata: Metadata = {
  metadataBase: new URL('https://radiicato.co.ke'),
  title: {
    default: 'RADIICATO | Premium Kenyan Streetwear — Nairobi Atelier Archive',
    template: '%s | RADIICATO',
  },
  description: 'Independent luxury streetwear engineered in Nairobi, Kenya. Heavyweight 280 GSM combed organic cotton tees, 3D chrome metallic badges, and underground graphic capsules. M-PESA checkout & Kenya-wide dispatch.',
  keywords: [
    'Radiicato',
    'luxury streetwear',
    'Nairobi atelier',
    'heavyweight fleece',
    'Kenyan designer',
    '280 GSM',
    'skull caps',
    'curated apparel',
    'streetwear kenya',
    'nairobi streetwear brand',
    'radiicato clothing',
    'broken record white tee',
    'we are who we are black tee',
    'kenyan graphic tees',
    'heavyweight 280 gsm t-shirts kenya',
    'mf doom tribute shirt kenya',
    'm-pesa streetwear shopping',
    'fargo courier delivery kenya',
    'african streetwear designers',
    'urban fashion nairobi'
  ],
  authors: [{ name: 'RADIICATO', url: 'https://radiicato.co.ke' }],
  creator: 'RADIICATO',
  publisher: 'RADIICATO',
  category: 'Fashion & Apparel',
  applicationName: 'RADIICATO',
  alternates: {
    canonical: 'https://radiicato.co.ke',
  },
  openGraph: {
    type: 'website',
    locale: 'en_KE',
    url: 'https://radiicato.co.ke',
    siteName: 'RADIICATO',
    title: 'RADIICATO | Premium Kenyan Streetwear — Nairobi Atelier Archive',
    description: 'Independent luxury streetwear engineered in Nairobi, Kenya. Heavyweight 280 GSM combed organic cotton tees, 3D chrome metallic badges, and underground graphic capsules. M-PESA checkout & Kenya-wide dispatch.',
    images: [
      {
        url: '/images/broken-record.jpg',
        width: 1200,
        height: 630,
        alt: 'RADIICATO Nairobi Atelier Editorial Campaign',
      },
      {
        url: '/images/products/broken-record-front.jpg',
        width: 800,
        height: 800,
        alt: 'Radiicato Broken Record White Heavyweight Tee',
      },
      {
        url: '/images/products/we-are-who-we-are-front.jpg',
        width: 800,
        height: 800,
        alt: 'Radiicato We Are Who We Are Washed Black Boxy Tee',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@radiicato',
    creator: '@radiicato',
    title: 'RADIICATO | Premium Kenyan Streetwear — Nairobi',
    description: 'Independent luxury streetwear engineered in Nairobi, Kenya. Heavyweight 280 GSM cotton and subversive underground aesthetics.',
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
  name: 'RADIICATO',
  legalName: 'RADIICATO APPAREL CO.',
  url: siteUrl,
  logo: `${siteUrl}/logo.png`,
  image: `${siteUrl}/images/broken-record.jpg`,
  description: 'Independent luxury streetwear engineered in Nairobi, Kenya. Heavyweight 280 GSM combed organic cotton tees, 3D chrome metallic badges, and underground graphic capsules.',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Studio 04, The Alchemist Yard, Parklands Road',
    addressLocality: 'Nairobi',
    addressRegion: 'Nairobi County',
    addressCountry: 'KE',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: -1.2618,
    longitude: 36.8042,
  },
  telephone: '+254712904883',
  priceRange: 'KES 500 - KES 1000',
  currenciesAccepted: 'KES',
  paymentAccepted: 'M-PESA, Cash, Credit Card',
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '09:00',
      closes: '20:00',
    },
  ],
  sameAs: [
    'https://instagram.com/radiicato',
    'https://tiktok.com/@radiicato',
    'https://wa.me/254712904883',
  ],
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'RADIICATO',
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
    <html lang="en">
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
      <body className="bg-white text-[#0A0A0A] antialiased selection:bg-[#4D5936] selection:text-white">
        <StoreLayoutWrapper>
          {children}
        </StoreLayoutWrapper>
      </body>
    </html>
  );
}

