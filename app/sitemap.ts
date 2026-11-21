import type { MetadataRoute } from 'next';
import { publicPages } from '@/lib/public-pages';
import { INDEXABLE, SITE_URL } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  return INDEXABLE ? publicPages.map((path) => ({ url: `${SITE_URL}${path}` })) : [];
}
