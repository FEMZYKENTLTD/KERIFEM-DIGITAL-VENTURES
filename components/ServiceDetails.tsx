'use client';

import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion';
import { ChevronDown } from 'lucide-react';

import Section from '@/components/ui/Section';
import SectionHeading from '@/components/ui/SectionHeading';
import { SERVICES } from '@/lib/content';
import { SELECT_SERVICE_EVENT } from '@/lib/utils';

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G'] as const;

/**
 * Detailed service categories as an accessible accordion (one panel open at a
 * time). The Services cards dispatch `SELECT_SERVICE_EVENT` to open + focus the
 * matching panel, so the two sections stay in sync without global state.
 */
export default function ServiceDetails() {
  const [openSlug, setOpenSlug] = useState<string>(SERVICES[0]!.slug);
  const reduceMotion = usePrefersReducedMotion();

  const select = useCallback((slug: string) => setOpenSlug(slug), []);

  /* Deep links: #wordpress (from the footer or a shared URL) opens that panel. */
  useEffect(() => {
    const openFromHash = () => {
      const slug = window.location.hash.replace('#', '');
      if (slug && SERVICES.some((service) => service.slug === slug)) {
        setOpenSlug(slug);
      }
    };
    openFromHash();
    window.addEventListener('hashchange', openFromHash);
    return () => window.removeEventListener('hashchange', openFromHash);
  }, []);

  useEffect(() => {
    const handler = (event: Event) => {
      const slug = (event as CustomEvent<string>).detail;
      if (SERVICES.some((service) => service.slug === slug)) {
        setOpenSlug(slug);
        // Move focus to the opened panel header once the browser has scrolled.
        window.setTimeout(() => {
          document.getElementById(`service-trigger-${slug}`)?.focus({ preventScroll: true });
        }, 420);
      }
    };

    window.addEventListener(SELECT_SERVICE_EVENT, handler);
    return () => window.removeEventListener(SELECT_SERVICE_EVENT, handler);
  }, []);

  return (
    <Section id="services-detail">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <SectionHeading
              id="services-detail-title"
              align="left"
              eyebrow="Deep dive"
              title="Service Scope, In Detail"
              lead="Select a capability to see exactly what is included in each engagement."
            />
            <div className="mt-8 hidden flex-col gap-2 lg:flex" aria-label="Jump to service">
              {SERVICES.map((service) => {
                const active = service.slug === openSlug;
                return (
                  <button
                    key={service.slug}
                    type="button"
                    onClick={() => {
                      select(service.slug);
                      document.getElementById(`services-detail`)?.scrollIntoView({
                        behavior: reduceMotion ? 'auto' : 'smooth',
                        block: 'start',
                      });
                    }}
                    className={`group flex items-center gap-3 rounded-lg border px-4 py-2.5 text-left text-sm transition-colors duration-300 ${
                      active
                        ? 'border-gold/45 bg-gold/[0.07] text-white'
                        : 'border-transparent text-white/50 hover:border-white/10 hover:text-white/85'
                    }`}
                    aria-pressed={active}
                    aria-label={`Show scope for ${service.title}`}
                  >
                    <span
                      className={`font-display text-xs ${active ? 'text-gold' : 'text-white/50'}`}
                    >
                      {LETTERS[SERVICES.indexOf(service)]}
                    </span>
                    {service.title}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="lg:col-span-8">
          <ul className="divide-y divide-white/[0.07] overflow-hidden rounded-xl border border-white/[0.08] bg-[#0B0B0B]">
            {SERVICES.map((service, index) => {
              const isOpen = service.slug === openSlug;
              return (
                <li key={service.slug} id={service.slug} className="scroll-mt-28 list-none">
                  <h3>
                    <button
                      type="button"
                      id={`service-trigger-${service.slug}`}
                      onClick={() => select(isOpen ? '' : service.slug)}
                      aria-expanded={isOpen}
                      aria-controls={`service-panel-${service.slug}`}
                      className="flex w-full items-center gap-4 px-5 py-5 text-left transition-colors duration-300 hover:bg-white/[0.02] sm:px-7"
                    >
                      <span
                        aria-hidden="true"
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border font-display text-sm transition-colors duration-300 ${
                          isOpen
                            ? 'border-gold/60 bg-gold/10 text-gold'
                            : 'border-white/12 text-white/55'
                        }`}
                      >
                        {LETTERS[index]}
                      </span>
                      <span className="flex-1 font-display text-lg font-semibold text-white sm:text-xl">
                        {service.title}
                      </span>
                      <ChevronDown
                        className={`h-5 w-5 shrink-0 text-gold/80 transition-transform duration-300 ease-luxury ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                        strokeWidth={1.6}
                      />
                    </button>
                  </h3>

                  <AnimatePresence initial={false}>
                    {isOpen ? (
                      <motion.div
                        id={`service-panel-${service.slug}`}
                        role="region"
                        aria-labelledby={`service-trigger-${service.slug}`}
                        initial={reduceMotion ? { opacity: 1 } : { height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-7 sm:px-7 sm:pl-20">
                          <p className="max-w-2xl text-sm leading-[1.8] text-fog">
                            {service.blurb}
                          </p>
                          <ul className="mt-5 grid gap-x-8 gap-y-2.5 sm:grid-cols-2">
                            {service.details.map((detail) => (
                              <li key={detail} className="flex items-start gap-3">
                                <span
                                  aria-hidden="true"
                                  className="mt-[0.55rem] h-1 w-1 shrink-0 rounded-full bg-gold"
                                />
                                <span className="text-sm leading-relaxed text-white/75">
                                  {detail}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>

          <p className="mt-6 text-center text-[0.72rem] uppercase tracking-[0.2em] text-white/50 lg:text-left">
            Need something not listed?{' '}
            <a href="#contact" className="link-underline text-gold">
              Discuss Your Project
            </a>
          </p>
        </div>
      </div>
    </Section>
  );
}
