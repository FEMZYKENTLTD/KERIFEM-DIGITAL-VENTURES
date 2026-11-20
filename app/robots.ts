import type { MetadataRoute } from 'next';

import { SITE_URL } from '@/lib/site';

/** Generates /robots.txt at build time (Next.js metadata route). */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
