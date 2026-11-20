/** Tiny dependency-free class name joiner (avoids pulling in clsx). */
export function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(' ');
}

/** Opens an in-page section with smooth scrolling that respects reduced motion. */
export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  // Keep the URL shareable without triggering a second jump from :target.
  window.history.replaceState(null, '', `#${id}`);
}

/** Cross-component signal: Services card -> detail accordion. */
export const SELECT_SERVICE_EVENT = 'femzyk:select-service';

export function requestServiceDetail(slug: string) {
  window.dispatchEvent(new CustomEvent(SELECT_SERVICE_EVENT, { detail: slug }));
}
