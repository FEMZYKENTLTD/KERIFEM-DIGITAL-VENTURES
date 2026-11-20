import type { Metadata, Viewport } from 'next';
import './globals.css';

import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import JsonLd from '@/components/seo/JsonLd';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { landingPageSchema } from '@/lib/schema';
import { BRAND, CONTACT, SITE_URL } from '@/lib/site';

const PAGE_TITLE = 'FEMZYK ENTERPRISES | Web Development, Software Solutions & Digital Services';
const OG_IMAGE_ALT =
  'FEMZYK ENTERPRISES — precision-engineered digital solutions. Deep black background with a gold geometric monogram.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: PAGE_TITLE,
    template: '%s | FEMZYK ENTERPRISES',
  },
  description: BRAND.description,
  applicationName: BRAND.name,
  keywords: [
    'web development Nigeria',
    'custom software development',
    'WordPress developer',
    'API integration services',
    'ghostwriting services Nigeria',
    'document editing services',
    'technology tutoring',
    'AI integration services',
    'remote web developer',
    'Next.js developer Nigeria',
  ],
  authors: [{ name: BRAND.name, url: SITE_URL }],
  creator: BRAND.name,
  publisher: BRAND.name,
  category: 'technology',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: `${SITE_URL}/`,
    siteName: BRAND.name,
    title: PAGE_TITLE,
    description: BRAND.description,
    locale: 'en_NG',
    images: [
      {
        url: `${SITE_URL}/og.png`,
        width: 1200,
        height: 630,
        alt: OG_IMAGE_ALT,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@KeripeOluf1604',
    creator: '@KeripeOluf1604',
    title: PAGE_TITLE,
    description: BRAND.description,
    images: [{ url: `${SITE_URL}/og.png`, alt: OG_IMAGE_ALT }],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  other: {
    // Longevity guard: the brand never carries a corporate suffix.
    'brand:name': BRAND.name,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  colorScheme: 'dark',
  themeColor: '#080808',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/*
          Brand typography (Playfair Display + Poppins).
          Loaded from the Google Fonts CDN with `display=swap` and robust local
          fallbacks declared in globals.css, so the site renders immediately and
          still looks correct if the CDN is unreachable. To self-host instead,
          swap these two lines for `next/font/google` (see README).
        */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-css-tags */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Poppins:wght@300;400;500;600&display=swap"
        />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        <meta name="format-detection" content="telephone=no" />
        {/*
          Entrance animations start from an invisible state so they can fade up on
          scroll. If a visitor has JavaScript disabled, that initial state must not
          persist, so reveal elements are tagged with [data-reveal] and shown here.
        */}
        <noscript>
          <style>{'[data-reveal]{opacity:1 !important;transform:none !important}'}</style>
        </noscript>
      </head>
      <body className="relative min-h-dvh overflow-x-clip bg-ink text-white antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-gold focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-ink"
        >
          Skip to main content
        </a>

        {/* Ambient depth layer: single radial wash + faint grid, nothing noisy. */}
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 bg-hero-glow" />

        <Navbar />
        <main id="main" className="relative">
          {children}
        </main>
        <Footer />
        <WhatsAppFloat />

        <JsonLd data={landingPageSchema()} />

        {/* Site-wide verification hooks live here once the client owns a domain. */}
        <span hidden aria-hidden="true">
          {CONTACT.location} — {BRAND.registrationShort}
        </span>
      </body>
    </html>
  );
}
