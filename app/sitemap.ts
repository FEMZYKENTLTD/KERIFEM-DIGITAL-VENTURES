import type { MetadataRoute } from 'next';

import { ALL_LEGAL_DOCS } from '@/lib/legal';
import { SITE_URL } from '@/lib/site';

/** Generates /sitemap.xml at build time (Next.js metadata route). */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const landing: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 1,
    },
  ];

  const legal: MetadataRoute.Sitemap = ALL_LEGAL_DOCS.map((doc) => ({
    url: `${SITE_URL}${doc.path}`,
    lastModified,
    changeFrequency: 'yearly',
    priority: 0.3,
  }));

  return [...landing, ...legal];
}
