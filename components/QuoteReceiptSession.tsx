'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { quoteReceiptPath } from '@/lib/quote-editions';
import QuoteReceipt, { type Receipt } from './QuoteReceipt';

const ReceiptContext = createContext<{
  receipt: Receipt | null;
  setReceipt: (receipt: Receipt | null) => void;
} | null>(null);

export function useReceiptSession() {
  const session = useContext(ReceiptContext);
  if (!session) throw new Error('Missing quote receipt session');
  return session;
}

export function QuoteReceiptSession({ children }: { children: ReactNode }) {
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const pathname = usePathname();
  useEffect(() => {
    setReceipt((current) =>
      current && quoteReceiptPath(current.values.budget) === pathname ? current : null,
    );
  }, [pathname]);
  return (
    <ReceiptContext.Provider value={{ receipt, setReceipt }}>{children}</ReceiptContext.Provider>
  );
}

export function QuoteReceiptScreen({ edition }: { edition: string }) {
  const { receipt, setReceipt } = useReceiptSession();
  const router = useRouter();
  if (!receipt || quoteReceiptPath(receipt.values.budget) !== `/contact/thank-you/${edition}`) {
    return (
      <section className="kv-card">
        <h1>Quote summary unavailable</h1>
        <p>
          For your privacy, your submitted details are only shown immediately after sending a quote
          request. You don’t need to resubmit just to reopen this page.
        </p>
        <Link className="kv-btn" href="/contact">
          Back to contact
        </Link>
      </section>
    );
  }
  return (
    <QuoteReceipt
      receipt={receipt}
      onClose={() => {
        setReceipt(null);
        router.replace('/contact');
      }}
    />
  );
}
