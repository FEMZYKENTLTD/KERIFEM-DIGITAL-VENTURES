'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion';

import { WhatsAppGlyph } from '@/components/icons/SocialIcons';
import { CONTACT } from '@/lib/site';

/**
 * Site-wide floating WhatsApp button (bottom-right, every page).
 * Tooltip is hover/focus only on pointer-fine devices; the accessible name is
 * always present for screen readers and touch users.
 */
export default function WhatsAppFloat() {
  const [visible, setVisible] = useState(true);
  const reduceMotion = usePrefersReducedMotion();

  if (!visible) return null;

  return (
    <motion.div
      data-reveal=""
      className="fixed bottom-5 right-4 z-[70] sm:bottom-7 sm:right-6"
      initial={reduceMotion ? false : { opacity: 0, y: 18, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'tween', duration: 0.5, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="group relative">
        {/* tooltip */}
        <span
          className="pointer-events-none absolute bottom-full right-0 mb-3 hidden whitespace-nowrap rounded-full border border-gold/25 bg-[#0B0B0B]/95 px-3.5 py-2 text-xs font-medium text-white/85 opacity-0 shadow-float backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100 md:block"
          role="tooltip"
          id="whatsapp-tooltip"
        >
          Chat with us on WhatsApp
        </span>

        <a
          href={CONTACT.whatsapp.primary.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-describedby="whatsapp-tooltip"
          aria-label="Chat with us on WhatsApp: +234 902 115 6310 (opens in a new tab)"
          className="relative flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-[#062C17] shadow-[0_16px_40px_-14px_rgba(37,211,102,0.65)] transition-transform duration-300 ease-luxury hover:scale-105 focus-visible:scale-105"
        >
          {!reduceMotion ? (
            <span
              aria-hidden="true"
              className="absolute inset-0 animate-pulse-ring rounded-full border-2 border-whatsapp/60"
            />
          ) : null}
          <WhatsAppGlyph className="relative h-7 w-7" />
        </a>

        <button
          type="button"
          onClick={() => setVisible(false)}
          aria-label="Dismiss WhatsApp button"
          className="absolute -right-1 -top-1 hidden h-5 w-5 items-center justify-center rounded-full border border-white/15 bg-[#0B0B0B] text-[0.6rem] text-white/55 transition-colors hover:border-gold/60 hover:text-gold group-focus-within:flex group-hover:flex"
        >
          ✕
        </button>
      </div>
    </motion.div>
  );
}
