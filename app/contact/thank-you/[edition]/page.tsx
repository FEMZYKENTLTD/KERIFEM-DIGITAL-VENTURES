import type { Metadata } from 'next';
import { QuoteReceiptScreen } from '@/components/QuoteReceiptSession';
import { QUOTE_EDITION_SLUGS } from '@/lib/quote-editions';

export const metadata: Metadata = {
  title: 'Quote request summary',
  robots: { index: false, follow: false },
};
export const dynamicParams = false;
export function generateStaticParams() {
  return QUOTE_EDITION_SLUGS.map((edition) => ({ edition }));
}

export default async function QuoteThankYouPage({
  params,
}: {
  params: Promise<{ edition: string }>;
}) {
  const { edition } = await params;
  return (
    <div className="kv-wrap kv-section">
      <QuoteReceiptScreen edition={edition} />
    </div>
  );
}
