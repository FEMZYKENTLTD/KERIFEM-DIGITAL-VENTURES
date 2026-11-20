import LegalPage from '@/components/ui/LegalPage';
import { COOKIE_POLICY } from '@/lib/legal';
import { pageMetadata } from '@/lib/metadata';

export const metadata = pageMetadata(
  COOKIE_POLICY.title,
  COOKIE_POLICY.metaDescription,
  COOKIE_POLICY.path,
);

export default function CookiePolicyPage() {
  return <LegalPage doc={COOKIE_POLICY} />;
}
