import LegalPage from '@/components/ui/LegalPage';
import { TERMS_OF_SERVICE } from '@/lib/legal';
import { pageMetadata } from '@/lib/metadata';

export const metadata = pageMetadata(
  TERMS_OF_SERVICE.title,
  TERMS_OF_SERVICE.metaDescription,
  TERMS_OF_SERVICE.path,
);

export default function TermsOfServicePage() {
  return <LegalPage doc={TERMS_OF_SERVICE} />;
}
