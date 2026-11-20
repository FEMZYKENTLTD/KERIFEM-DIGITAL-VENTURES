import type { Metadata } from 'next';

import LegalPage from '@/components/ui/LegalPage';
import { COOKIE_POLICY } from '@/lib/legal';
import { BRAND, SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description: COOKIE_POLICY.metaDescription,
  alternates: { canonical: COOKIE_POLICY.path },
  openGraph: {
    type: 'article',
    url: `${SITE_URL}${COOKIE_POLICY.path}`,
    title: `Cookie Policy | ${BRAND.name}`,
    description: COOKIE_POLICY.metaDescription,
  },
};

export default function CookiePolicyPage() {
  return <LegalPage doc={COOKIE_POLICY} />;
}
