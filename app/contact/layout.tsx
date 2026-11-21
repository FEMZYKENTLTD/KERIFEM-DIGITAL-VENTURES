import type { ReactNode } from 'react';
import { QuoteReceiptSession } from '@/components/QuoteReceiptSession';

export default function ContactLayout({ children }: { children: ReactNode }) {
  return <QuoteReceiptSession>{children}</QuoteReceiptSession>;
}
