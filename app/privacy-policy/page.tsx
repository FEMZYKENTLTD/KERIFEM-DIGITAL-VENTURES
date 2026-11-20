import type { Metadata } from 'next';

import LegalPage from '@/components/ui/LegalPage';
import { PRIVACY_POLICY } from '@/lib/legal';
import { BRAND, SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: PRIVACY_POLICY.metaDescription,
  alternates: { canonical: PRIVACY_POLICY.path },
  openGraph: {
    type: 'article',
    url: `${SITE_URL}${PRIVACY_POLICY.path}`,
    title: `Privacy Policy | ${BRAND.name}`,
    description: PRIVACY_POLICY.metaDescription,
  },
};

export default function PrivacyPolicyPage() {
  return <LegalPage doc={PRIVACY_POLICY} />;
}
