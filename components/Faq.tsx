'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion';
import { Plus } from 'lucide-react';

import Section from '@/components/ui/Section';
import SectionHeading from '@/components/ui/SectionHeading';
import { FAQS } from '@/lib/content';

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const reduceMotion = usePrefersReducedMotion();

  return (
    <Section id="faq">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <SectionHeading
              id="faq-title"
              align="left"
              eyebrow="Questions"
              title="Frequently Asked Questions"
              lead="Clear answers on scope, delivery, registration, and what we do not do."
            />
            <p className="mt-8 text-sm leading-relaxed text-fog">
              Still unsure?{' '}
              <a href="#contact" className="link-underline text-gold">
                Discuss Your Project
              </a>{' '}
              and we will answer directly.
            </p>
          </div>
        </div>

        <div className="lg:col-span-8">
          <ul className="divide-y divide-white/[0.07] overflow-hidden rounded-xl border border-white/[0.08] bg-[#0B0B0B]">
            {FAQS.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <li key={faq.question} className="list-none">
                  <h3>
                    <button
                      type="button"
                      id={`faq-trigger-${index}`}
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${index}`}
                      onClick={() => setOpenIndex(isOpen ? null : index)}
                      className="flex w-full items-start gap-5 px-5 py-5 text-left transition-colors duration-300 hover:bg-white/[0.02] sm:px-7 sm:py-6"
                    >
                      <span className="mt-0.5 font-display text-xs text-gold/70">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="flex-1 text-[0.98rem] font-medium leading-snug text-white sm:text-lg">
                        {faq.question}
                      </span>
                      <Plus
                        className={`mt-1 h-4 w-4 shrink-0 text-gold transition-transform duration-300 ease-luxury ${
                          isOpen ? 'rotate-45' : ''
                        }`}
                        strokeWidth={1.8}
                        aria-hidden="true"
                      />
                    </button>
                  </h3>

                  <AnimatePresence initial={false}>
                    {isOpen ? (
                      <motion.div
                        id={`faq-panel-${index}`}
                        role="region"
                        aria-labelledby={`faq-trigger-${index}`}
                        initial={reduceMotion ? { opacity: 1 } : { height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="max-w-2xl text-pretty px-5 pb-7 pl-[2.75rem] text-sm leading-[1.85] text-fog sm:px-7 sm:pb-8 sm:pl-[3.75rem]">
                          {faq.answer}
                        </p>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </Section>
  );
}
