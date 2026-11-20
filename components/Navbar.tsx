'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion';
import { ArrowUpRight, Menu, X } from 'lucide-react';

import Wordmark from '@/components/ui/Wordmark';
import { CONTACT, NAV_LINKS, SECTION_IDS, anchorId } from '@/lib/site';
import { cn } from '@/lib/utils';

/** `services-detail` should light up the "Services" item. */
function isActive(linkHref: string, current: string) {
  const id = anchorId(linkHref);
  if (id === current) return true;
  if (id === 'services') return current === 'services-detail';
  return false;
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>('top');
  const toggleRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const reduceMotion = usePrefersReducedMotion();

  /* Solid + blurred once the visitor leaves the hero. */
  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setScrolled(window.scrollY > 24));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  /* Active-section tracking for the nav pill. */
  useEffect(() => {
    const elements = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => Boolean(el),
    );
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(visible.target.id);
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: [0.05, 0.25, 0.6] },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  /* Drawer: escape to close + background scroll lock + focus handoff. */
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeyDown);
    const focusTimer = window.setTimeout(() => closeRef.current?.focus(), 60);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
      window.clearTimeout(focusTimer);
    };
  }, [open]);

  const goHome = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      setOpen(false);
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    },
    [reduceMotion],
  );

  return (
    <header
      id="top"
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,padding,border-color] duration-500 ease-luxury',
        scrolled
          ? 'bg-ink/92 border-b border-white/[0.07] py-3 backdrop-blur-xl supports-[backdrop-filter]:bg-ink/75'
          : 'border-b border-transparent bg-transparent py-5',
      )}
    >
      <nav aria-label="Primary" className="container-shell flex items-center justify-between gap-6">
        <a
          href="#top"
          onClick={goHome}
          className="shrink-0 rounded-sm"
          aria-label="FEMZYK ENTERPRISES — back to top"
        >
          <Wordmark size="md" />
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => {
            const current = isActive(link.href, active);
            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={link.href === '#top' ? goHome : undefined}
                  aria-current={current ? 'true' : undefined}
                  className={cn(
                    'group relative inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-normal tracking-wide transition-colors duration-300',
                    current ? 'text-white' : 'text-white/60 hover:text-white',
                  )}
                >
                  {link.label}
                  <span
                    aria-hidden="true"
                    className={cn(
                      'absolute inset-x-3.5 -bottom-0.5 h-px origin-left bg-gold transition-transform duration-300 ease-luxury',
                      current ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100',
                    )}
                  />
                </a>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2 sm:gap-3">
          <a href="#contact" className="btn-primary hidden px-5 text-[0.82rem] sm:inline-flex">
            Request a Quote
          </a>
          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            aria-label="Open navigation menu"
            className="border-white/12 inline-flex h-11 w-11 items-center justify-center rounded-full border text-white/85 transition-colors duration-300 hover:border-gold/60 hover:text-gold lg:hidden"
          >
            <Menu className="h-5 w-5" strokeWidth={1.6} />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-[60] lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <button
              type="button"
              tabIndex={-1}
              aria-label="Close navigation menu"
              onClick={() => setOpen(false)}
              className="absolute inset-0 h-full w-full cursor-default bg-ink/85 backdrop-blur-sm"
            />

            <motion.div
              id="mobile-navigation"
              role="dialog"
              aria-modal="true"
              aria-label="Site navigation"
              className="absolute inset-y-0 right-0 flex w-[86%] max-w-sm flex-col justify-between border-l border-gold/20 bg-[#0B0B0B] px-6 py-5 shadow-float"
              initial={reduceMotion ? { opacity: 0 } : { x: '100%' }}
              animate={reduceMotion ? { opacity: 1 } : { x: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { x: '100%' }}
              transition={{ type: 'tween', duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-start justify-between">
                <Wordmark size="sm" />
                <button
                  ref={closeRef}
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    toggleRef.current?.focus();
                  }}
                  aria-label="Close navigation menu"
                  className="border-white/12 inline-flex h-11 w-11 items-center justify-center rounded-full border text-white/80 transition-colors hover:border-gold/60 hover:text-gold"
                >
                  <X className="h-5 w-5" strokeWidth={1.6} />
                </button>
              </div>

              <ul className="flex flex-col gap-1 py-8">
                {NAV_LINKS.map((link, index) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      onClick={(event) => {
                        if (link.href === '#top') {
                          goHome(event);
                          return;
                        }
                        setOpen(false);
                      }}
                      className="flex items-baseline gap-4 border-b border-white/[0.06] py-4 font-display text-2xl text-white/85 transition-colors duration-300 hover:text-gold"
                    >
                      <span className="font-sans text-[0.65rem] tracking-[0.2em] text-gold/70">
                        0{index + 1}
                      </span>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>

              <div className="flex flex-col gap-3">
                <a href="#contact" onClick={() => setOpen(false)} className="btn-primary w-full">
                  Request a Quote
                </a>
                <a
                  href={CONTACT.whatsapp.primary.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary w-full text-[0.82rem]"
                >
                  WhatsApp {CONTACT.whatsapp.primary.display}
                  <ArrowUpRight className="h-4 w-4" strokeWidth={1.6} />
                </a>
                <p className="pt-1 text-center text-[0.7rem] uppercase tracking-[0.18em] text-white/50">
                  Lagos, Nigeria · Remote-first
                </p>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
