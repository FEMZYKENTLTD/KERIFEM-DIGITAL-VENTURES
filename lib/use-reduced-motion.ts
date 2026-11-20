'use client';

import { useEffect, useState } from 'react';

/**
 * SSR-safe `prefers-reduced-motion` reader.
 *
 * The media query cannot be evaluated on the server, so a hook that returns the
 * real value on the *first* render would make hydration markup differ from the
 * server HTML (React would report a mismatch and framer-motion would re-mount its
 * initial styles). This hook deliberately reports `false` for the server render and
 * the first client render, then updates after mount — markup matches, and visitors
 * who prefer reduced motion still get the static layout.
 *
 * `app/globals.css` additionally neutralises all CSS animations/transitions under
 * the same media query, so decorative loops (float, pulse ring, caret) stop even
 * before hydration completes.
 */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setReduced(query.matches);

    apply();
    query.addEventListener('change', apply);
    return () => query.removeEventListener('change', apply);
  }, []);

  return reduced;
}

/** Scroll behaviour helper that respects the same preference. */
export function smoothBehaviour(reduced: boolean): ScrollBehavior {
  return reduced ? 'auto' : 'smooth';
}
