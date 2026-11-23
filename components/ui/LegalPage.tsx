import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import JsonLd from '@/components/seo/JsonLd';
import { ALL_LEGAL_DOCS, LEGAL_LAST_UPDATED, type LegalDoc } from '@/lib/legal';
import { BRAND, CONTACT, INDEXABLE } from '@/lib/site';
import { breadcrumbSchema } from '@/lib/schema';

export default function LegalPage({ doc }: { doc: LegalDoc }) {
  const others = ALL_LEGAL_DOCS.filter((item) => item.slug !== doc.slug);

  return (
    <article className="relative">
      {INDEXABLE && (
        <JsonLd
          data={breadcrumbSchema([
            { name: 'Home', href: '/' },
            { name: doc.title, href: doc.path },
          ])}
        />
      )}

      <div className="container-shell max-w-shell pb-24 pt-32 md:pb-32 md:pt-40">
        <div className="mx-auto max-w-3xl">
          <p className="eyebrow">Legal</p>
          <h1 className="mt-5 font-display text-display font-semibold text-white">{doc.title}</h1>

          <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-white/[0.07] pb-6 text-xs text-white/50">
            <span>{BRAND.name}</span>
            <span aria-hidden="true" className="hidden h-3 w-px bg-white/15 sm:block" />
            <span>Last updated: {LEGAL_LAST_UPDATED}</span>
          </div>

          <p className="mt-10 text-pretty text-lede leading-relaxed text-white/85">{doc.intro}</p>

          <div className="mt-10 space-y-10">
            {doc.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="font-display text-h3 font-semibold text-white">{section.heading}</h2>
                {section.paragraphs?.map((paragraph, index) => (
                  <p
                    key={index}
                    className="mt-4 text-pretty text-[0.95rem] leading-[1.85] text-fog"
                  >
                    {paragraph}
                  </p>
                ))}
                {section.bullets ? (
                  <ul className="mt-4 space-y-2.5 border-l border-gold/25 pl-5">
                    {section.bullets.map((bullet) => (
                      <li key={bullet} className="text-[0.92rem] leading-[1.75] text-white/70">
                        {bullet}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}
          </div>

          <section className="mt-12 rounded-xl border border-white/[0.07] bg-[#0B0B0B] p-6">
            <h2 className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-gold">
              Contact
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-fog">
              Questions about this document, or a data request? Email{' '}
              <a href={`mailto:${CONTACT.email.primary}`} className="link-underline text-white">
                {CONTACT.email.primary}
              </a>{' '}
              or message {CONTACT.whatsapp.primary.display} on WhatsApp. We work remotely with
              clients worldwide.
            </p>
          </section>

          <div className="mt-10 flex flex-col gap-4 border-t border-white/[0.07] pt-8 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-gold"
            >
              <ArrowLeft className="h-4 w-4" strokeWidth={1.6} aria-hidden="true" />
              Back to the website
            </Link>
            <nav aria-label="Other legal documents" className="flex flex-wrap gap-x-5 gap-y-2">
              {others.map((item) => (
                <a
                  key={item.slug}
                  href={item.path}
                  className="link-underline text-sm text-white/55 transition-colors hover:text-white"
                >
                  {item.title}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </article>
  );
}
