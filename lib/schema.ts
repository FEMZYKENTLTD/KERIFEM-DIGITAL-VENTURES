import { FAQS, FOUNDER, SERVICES, WHY_US } from './content';
import { BRAND, CONTACT, SITE_URL } from './site';

/**
 * JSON-LD builders (schema.org). Rendered once in the root layout so every
 * search engine crawler sees entity data without executing JavaScript.
 */

const areaServed = [
  'Nigeria',
  'United Kingdom',
  'United States',
  'Canada',
  'Europe',
  'Middle East',
];

export function localBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    // `ProfessionalService` is the precise type; `LocalBusiness` is declared too so
    // parsers that only match the generic type still pick the entity up.
    '@type': ['ProfessionalService', 'LocalBusiness'],
    '@id': `${SITE_URL}/#business`,
    name: BRAND.name,
    description: BRAND.description,
    url: `${SITE_URL}/`,
    email: CONTACT.email.primary,
    telephone: CONTACT.whatsapp.primary.display.replace(/\s/g, ''),
    slogan: BRAND.tagline,
    foundingDate: String(BRAND.foundedYear),
    image: `${SITE_URL}/og.png`,
    logo: `${SITE_URL}/icon.svg`,
    priceRange: 'Project-based',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Lagos',
      addressCountry: 'NG',
      addressRegion: 'Lagos',
    },
    areaServed: areaServed.map((name) => ({ '@type': 'Place', name })),
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceUrl: `${SITE_URL}/#contact`,
      name: 'Remote delivery via digital channels',
    },
    sameAs: [CONTACT.social.github, CONTACT.social.x],
    knowsAbout: [
      'web development Nigeria',
      'custom software development',
      'WordPress developer',
      'API integration services',
      'ghostwriting services Nigeria',
      'document editing services',
      'technology tutoring',
      'AI integration services',
      'Next.js developer Nigeria',
    ],
  };
}

export function organisationWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: `${SITE_URL}/`,
    name: BRAND.name,
    description: BRAND.description,
    publisher: { '@id': `${SITE_URL}/#business` },
    inLanguage: 'en',
  };
}

export function serviceSchemas() {
  return SERVICES.map((service, index) => ({
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${SITE_URL}/#${service.slug}`,
    name: service.title,
    description: service.blurb,
    serviceType: service.title,
    areaServed,
    provider: { '@id': `${SITE_URL}/#business` },
    url: `${SITE_URL}/#services`,
    category: index < 4 ? 'Software & Web Development' : 'Professional & Educational Services',
  }));
}

export function faqSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${SITE_URL}/#faq`,
    mainEntity: FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function personSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${SITE_URL}/#founder`,
    name: FOUNDER.name,
    jobTitle: FOUNDER.title,
    description: FOUNDER.bio.join(' '),
    worksFor: { '@id': `${SITE_URL}/#business` },
    knowsAbout: [
      'Python',
      'Java',
      'C#',
      'PHP',
      'TypeScript',
      'JavaScript',
      'Go',
      'React',
      'Next.js',
      'Flask',
      'AI & Machine Learning',
      'Technical Writing',
    ],
    alumniOf: [
      {
        '@type': 'CollegeOrUniversity',
        name: 'Lagos State University (LASU)',
      },
      {
        '@type': 'CollegeOrUniversity',
        name: 'University of the People',
      },
      {
        '@type': 'EducationalOrganization',
        name: '3MTT — Artificial Intelligence & Machine Learning programme',
      },
    ],
    sameAs: [CONTACT.social.github, CONTACT.social.x],
    url: `${SITE_URL}/#founder`,
  };
}

export function breadcrumbSchema(items: { name: string; href: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.href}`,
    })),
  };
}

/** Convenience: everything the landing page needs, as one graph. */
export function landingPageSchema() {
  return [
    localBusinessSchema(),
    organisationWebSiteSchema(),
    personSchema(),
    faqSchema(),
    ...serviceSchemas(),
  ];
}

/** Sections that only exist for SEO/legal completeness, kept out of the copy. */
export const LEGAL_PAGE_NAMES = {
  '/privacy-policy': 'Privacy Policy',
  '/terms-of-service': 'Terms of Service',
  '/cookie-policy': 'Cookie Policy',
} as const;

export const WHY_US_TITLES = WHY_US.map((item) => item.title);
