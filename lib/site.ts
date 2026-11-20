export const BRAND = {
  name: 'KERIFEM DIGITAL VENTURES',
  wordmark: 'KERIFEM',
  tagline: 'Digital solutions. Intelligent systems.',
  secondaryTagline: 'Engineering for real-world impact',
  registration: 'CAC registered business name',
  registrationShort: 'CAC registered business name',
  foundedYear: 2023,
  description:
    'KERIFEM DIGITAL VENTURES builds software, websites and connected workflows for businesses and teams in Nigeria and internationally.',
} as const;

/** Canonical origin used for metadata, OG tags and JSON-LD. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(
  /\/$/,
  '',
);

export const INDEXABLE =
  Boolean(process.env.NEXT_PUBLIC_SITE_URL) &&
  (!process.env.VERCEL_ENV || process.env.VERCEL_ENV === 'production');

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
