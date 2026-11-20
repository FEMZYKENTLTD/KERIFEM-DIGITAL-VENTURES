import { cases } from '@/lib/cases';
import type { MetadataRoute } from 'next';
import { ALL_LEGAL_DOCS } from '@/lib/legal';
import { INDEXABLE, SITE_URL } from '@/lib/site';
export default function sitemap(): MetadataRoute.Sitemap {
  return INDEXABLE
    ? [
        '/',
        '/about',
        '/services',
        '/portfolio',
        ...cases.map(({ id }) => `/portfolio/${id}`),
        '/contact',
        ...ALL_LEGAL_DOCS.map((doc) => doc.path),
      ].map((path) => ({ url: `${SITE_URL}${path}` }))
    : [];
}
