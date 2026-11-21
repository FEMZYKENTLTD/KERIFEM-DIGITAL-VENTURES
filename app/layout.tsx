import type { Metadata, Viewport } from 'next';
import './globals.css';
import { CorporateFooter, CorporateNav } from '@/components/Corporate';
import SiteTelemetry from '@/components/SiteTelemetry';
import JsonLd from '@/components/seo/JsonLd';
import { pageMetadata } from '@/lib/metadata';
import { BRAND, CONTACT, INDEXABLE, SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  ...pageMetadata('Digital Solutions & Intelligent Systems', BRAND.description, '/'),
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${BRAND.name} | Digital Solutions & Intelligent Systems`,
    template: `%s | ${BRAND.name}`,
  },
  robots: { index: INDEXABLE, follow: INDEXABLE },
};
export const viewport: Viewport = { colorScheme: 'dark', themeColor: '#0b1321' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-palette="midnight" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(localStorage.getItem('kerifem-palette')==='obsidian')document.documentElement.dataset.palette='obsidian'}catch{}",
          }}
        />
      </head>
      <body className="bg-ink text-white antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:z-50 focus:bg-gold focus:p-4 focus:text-ink"
        >
          Skip to main content
        </a>
        <CorporateNav />
        <main id="main">{children}</main>
        <CorporateFooter />
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: BRAND.name,
            description: BRAND.description,
            email: CONTACT.email.primary,
            sameAs: Object.values(CONTACT.social),
            ...(INDEXABLE ? { url: SITE_URL } : {}),
          }}
        />
        {process.env.VERCEL_ENV === 'production' && <SiteTelemetry />}
      </body>
    </html>
  );
}
