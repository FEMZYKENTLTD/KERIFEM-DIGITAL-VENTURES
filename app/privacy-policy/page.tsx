import LegalPage from '@/components/ui/LegalPage';
import { PRIVACY_POLICY } from '@/lib/legal';
import { pageMetadata } from '@/lib/metadata';

export const metadata = pageMetadata(
  PRIVACY_POLICY.title,
  PRIVACY_POLICY.metaDescription,
  PRIVACY_POLICY.path,
);

export default function PrivacyPolicyPage() {
  return <LegalPage doc={PRIVACY_POLICY} />;
}
