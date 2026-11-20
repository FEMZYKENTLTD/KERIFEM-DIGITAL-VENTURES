import Link from 'next/link';
import { ArrowLeft, SearchX } from 'lucide-react';

export default function NotFound() {
  return (
    <section className="relative flex min-h-[80svh] items-center overflow-hidden">
      <div aria-hidden="true" className="grid-overlay pointer-events-none absolute inset-0" />
      <div className="container-shell relative py-32 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-gold/30 bg-gold/[0.06] text-gold">
          <SearchX className="h-6 w-6" strokeWidth={1.5} aria-hidden="true" />
        </span>
        <p className="eyebrow mt-8">Error 404</p>
        <h1 className="mt-4 font-display text-display font-semibold text-white">
          This page could not be found
        </h1>
        <p className="mx-auto mt-5 max-w-md text-lede text-fog">
          The link may be out of date, or the section you were looking for lives further down the
          home page.
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/" className="btn-primary">
            <ArrowLeft className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
            Return to the home page
          </Link>
          <Link href="/#contact" className="btn-secondary">
            Contact FEMZYK
          </Link>
        </div>
      </div>
    </section>
  );
}
