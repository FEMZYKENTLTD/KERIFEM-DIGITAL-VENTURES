'use client';

import { motion } from 'framer-motion';
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion';
import { ArrowDown, ArrowUpRight } from 'lucide-react';

import { BRAND, CONTACT, REGION_LABEL } from '@/lib/site';

const EASE = [0.22, 1, 0.36, 1] as const;

/** Faux code panel — decorative only, aria-hidden, GPU-cheap (transform + opacity). */
const CODE_LINES = [
  {
    indent: 0,
    parts: [
      ['const', 'kw'],
      [' femzyk = {', 'plain'],
    ],
  },
  {
    indent: 1,
    parts: [
      ['services', 'prop'],
      [': [', 'plain'],
      ["'web'", 'str'],
      [', ', 'plain'],
      ["'software'", 'str'],
      [', ', 'plain'],
      ["'ai'", 'str'],
      ['],', 'plain'],
    ],
  },
  {
    indent: 1,
    parts: [
      ['delivery', 'prop'],
      [': ', 'plain'],
      ["'remote-first'", 'str'],
      [',', 'plain'],
    ],
  },
  {
    indent: 1,
    parts: [
      ['markets', 'prop'],
      [': ', 'plain'],
      ["'global'", 'str'],
      [',', 'plain'],
    ],
  },
  {
    indent: 1,
    parts: [
      ['standard', 'prop'],
      [': ', 'plain'],
      ["'precision'", 'gold'],
      [',', 'plain'],
    ],
  },
  { indent: 0, parts: [['};', 'plain']] },
] as const;

const TONE: Record<string, string> = {
  kw: 'text-gold/90',
  prop: 'text-white/85',
  str: 'text-white/55',
  plain: 'text-white/55',
  gold: 'text-gold',
};

export default function Hero() {
  const reduceMotion = usePrefersReducedMotion();

  const rise = (delay: number) =>
    reduceMotion
      ? { initial: { opacity: 1 }, animate: { opacity: 1 } }
      : {
          initial: { opacity: 0, y: 22 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.8, delay, ease: EASE },
        };

  return (
    <section
      id="hero"
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden pb-20 pt-28 sm:pt-32 md:pb-28 md:pt-36"
    >
      {/* backdrop: faint engineering grid + vignette, nothing distracting */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="grid-overlay absolute inset-0" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-ink" />
        <div className="border-gold/12 absolute -right-32 top-1/4 hidden h-[26rem] w-[26rem] rotate-45 border lg:block" />
        <div className="absolute -right-16 top-1/3 hidden h-[18rem] w-[18rem] rotate-45 border border-white/[0.05] lg:block" />
      </div>

      <div className="container-shell grid w-full items-center gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7 xl:col-span-6">
          <motion.p
            data-reveal=""
            {...rise(0)}
            className="inline-flex items-center gap-2.5 rounded-full border border-gold/30 bg-gold/[0.06] px-3.5 py-1.5 text-[0.62rem] font-medium uppercase tracking-[0.2em] text-gold sm:text-[0.68rem] sm:tracking-[0.22em]"
          >
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-gold" />
            {BRAND.registration}
          </motion.p>

          <motion.h1
            data-reveal=""
            {...rise(0.1)}
            className="mt-7 max-w-[19ch] text-balance text-hero font-semibold text-white"
          >
            Precision-Engineered Digital Solutions for Ambitious Businesses
          </motion.h1>

          <motion.div data-reveal="" {...rise(0.18)} className="mt-7 flex items-center gap-4">
            <span aria-hidden="true" className="h-px w-14 bg-gold/70" />
            <span aria-hidden="true" className="h-px flex-1 bg-white/10" />
          </motion.div>

          <motion.p
            data-reveal=""
            {...rise(0.22)}
            className="mt-7 max-w-xl text-pretty text-lede text-fog-bright/90"
          >
            {BRAND.name} delivers world-class web development, custom software, AI integration, and
            professional digital services to clients across Nigeria and internationally.
          </motion.p>

          <motion.div
            data-reveal=""
            {...rise(0.3)}
            className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <a
              href="#contact"
              className="btn-primary group justify-between sm:justify-center sm:px-8"
            >
              Start Your Project
              <ArrowUpRight
                className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                strokeWidth={1.8}
              />
            </a>
            <a href="#services" className="btn-secondary justify-between sm:justify-center sm:px-8">
              Explore Our Services
            </a>
          </motion.div>

          <motion.dl
            data-reveal=""
            {...rise(0.4)}
            className="mt-12 grid max-w-xl grid-cols-2 gap-x-6 gap-y-5 border-t border-white/[0.07] pt-7 sm:grid-cols-3"
          >
            <div>
              <dt className="text-[0.6rem] uppercase tracking-[0.2em] text-white/50">Based in</dt>
              <dd className="mt-1.5 text-sm text-white/80">{CONTACT.location}</dd>
            </div>
            <div>
              <dt className="text-[0.6rem] uppercase tracking-[0.2em] text-white/50">Serving</dt>
              <dd className="mt-1.5 text-sm text-white/80">Remote-first, globally</dd>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <dt className="text-[0.6rem] uppercase tracking-[0.2em] text-white/50">
                Response time
              </dt>
              <dd className="mt-1.5 text-sm text-white/80">Within {CONTACT.responseTime}</dd>
            </div>
          </motion.dl>

          <motion.p data-reveal="" {...rise(0.48)} className="mt-6 text-[0.7rem] text-white/50">
            {REGION_LABEL}
          </motion.p>
        </div>

        {/* Decorative code panel */}
        <motion.div
          data-reveal=""
          {...rise(0.34)}
          aria-hidden="true"
          className="pointer-events-none hidden lg:col-span-5 lg:block xl:col-span-5 xl:col-start-8"
        >
          <div className={reduceMotion ? '' : 'animate-float'}>
            <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0C0C0C]/90 shadow-float backdrop-blur-sm">
              <div className="flex items-center gap-2 border-b border-white/[0.07] px-5 py-3.5">
                <span className="h-2 w-2 rounded-full bg-gold/70" />
                <span className="h-2 w-2 rounded-full bg-white/15" />
                <span className="h-2 w-2 rounded-full bg-white/10" />
                <span className="ml-auto font-sans text-[0.65rem] uppercase tracking-[0.18em] text-white/50">
                  femzyk.config.ts
                </span>
              </div>
              <pre className="overflow-hidden px-5 py-5 font-mono text-[0.72rem] leading-[1.9] sm:text-[0.78rem]">
                <code>
                  {CODE_LINES.map((line, lineIndex) => (
                    <span key={lineIndex} className="flex gap-4">
                      <span className="w-4 shrink-0 select-none text-right text-white/50">
                        {lineIndex + 1}
                      </span>
                      <span
                        className="min-w-0 truncate"
                        style={{ paddingLeft: `${line.indent * 1.25}rem` }}
                      >
                        {line.parts.map(([text, tone], partIndex) => (
                          <span key={partIndex} className={TONE[tone]}>
                            {text}
                          </span>
                        ))}
                        {lineIndex === CODE_LINES.length - 1 ? (
                          <span className="ml-0.5 inline-block h-3.5 w-[0.5ch] animate-caret-blink bg-gold align-middle" />
                        ) : null}
                      </span>
                    </span>
                  ))}
                </code>
              </pre>
              <div className="flex items-center justify-between gap-4 border-t border-white/[0.07] px-5 py-3.5 text-[0.62rem] uppercase tracking-[0.18em] text-white/50">
                <span>Quality · Accessibility · Affordability</span>
                <span className="text-gold/80">SMEDAN</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.a
        data-reveal=""
        href="#about"
        {...rise(0.6)}
        className="group absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[0.6rem] uppercase tracking-[0.28em] text-white/50 transition-colors hover:text-gold md:flex"
        aria-label="Scroll to About section"
      >
        Scroll
        <ArrowDown
          className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-y-1"
          strokeWidth={1.5}
        />
      </motion.a>
    </section>
  );
}
