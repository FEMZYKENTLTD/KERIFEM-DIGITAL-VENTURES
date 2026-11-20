import type { Metadata } from 'next';
import { BRAND, INDEXABLE, SITE_URL } from './site';

export function pageMetadata(title: string, description: string, path: string): Metadata {
  const full = `${title} | ${BRAND.name}`;
  const image = { url: `${SITE_URL}/og.png`, width: 1200, height: 630, alt: BRAND.name };
  return {
    title,
    description,
    alternates: INDEXABLE ? { canonical: `${SITE_URL}${path}` } : undefined,
    openGraph: {
      title: full,
      description,
      type: 'website',
      siteName: BRAND.name,
      url: INDEXABLE ? `${SITE_URL}${path}` : undefined,
      images: [image],
    },
    twitter: { card: 'summary_large_image', title: full, description, images: [image] },
  };
}
