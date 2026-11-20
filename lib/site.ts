/**
 * Single source of truth for brand + contact details.
 *
 * IMPORTANT: the public brand name is always "FEMZYK ENTERPRISES" — no "LTD",
 * "Limited" or "LLC" suffix anywhere in the UI. (The Gmail handles legitimately
 * contain "ltd"; that is the email address, not the brand name.)
 */

export const BRAND = {
  name: 'FEMZYK ENTERPRISES',
  wordmark: 'FEMZYK',
  tagline: 'Precision-Engineered Digital Solutions',
  secondaryTagline: 'Where Innovation Meets Execution',
  registration: 'SMEDAN-Registered Digital Solutions Provider',
  registrationShort: 'SMEDAN-Registered',
  foundedYear: 2023,
  description:
    'FEMZYK ENTERPRISES is a SMEDAN-registered digital solutions company specialising in web development, custom software, WordPress, AI integration, ghostwriting, document editing, and technology tutoring. Serving clients in Nigeria and internationally.',
} as const;

/** Canonical origin used for metadata, OG tags and JSON-LD. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(
  /\/$/,
  '',
);

export const WEB3FORMS_ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY ?? '';

export const CONTACT = {
  email: {
    primary: 'femzykenterprisesltd@gmail.com',
    secondary: 'femzykentltd@gmail.com',
  },
  whatsapp: {
    primary: {
      display: '+234 902 115 6310',
      href: 'https://wa.me/2349021156310',
    },
    secondary: {
      display: '+234 904 990 3679',
      href: 'https://wa.me/2349049903679',
    },
  },
  social: {
    github: 'https://github.com/FEMZYKENTLTD',
    x: 'https://x.com/KeripeOluf1604',
  },
  location: 'Lagos, Nigeria',
  deliveryModel: 'Remote-First, Serving Clients Globally',
  responseTime: '24 hours',
} as const;

export const REGION_LABEL =
  'Nigeria · United Kingdom · United States · Canada · Europe · Middle East';

export const NAV_LINKS = [
  { label: 'Home', href: '#top' },
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Portfolio', href: '#portfolio' },
  { label: 'Process', href: '#process' },
  { label: 'Contact', href: '#contact' },
] as const;

/** Section ids observed by the nav for active-link highlighting. */
export const SECTION_IDS = [
  'top',
  'about',
  'services',
  'services-detail',
  'portfolio',
  'process',
  'contact',
] as const;

export const mailto = (address: string, subject?: string) =>
  `mailto:${address}${subject ? `?subject=${encodeURIComponent(subject)}` : ''}`;

/** Smooth-scroll helper for in-page anchors (also respects reduced motion). */
export const anchorId = (href: string) => href.replace('#', '');
