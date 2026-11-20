import type { Metadata } from 'next';

import LegalPage from '@/components/ui/LegalPage';
import { TERMS_OF_SERVICE } from '@/lib/legal';
import { BRAND, SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: TERMS_OF_SERVICE.metaDescription,
  alternates: { canonical: TERMS_OF_SERVICE.path },
  openGraph: {
    type: 'article',
    url: `${SITE_URL}${TERMS_OF_SERVICE.path}`,
    title: `Terms of Service | ${BRAND.name}`,
    description: TERMS_OF_SERVICE.metaDescription,
  },
};

export default function TermsOfServicePage() {
  return <LegalPage doc={TERMS_OF_SERVICE} />;
}
