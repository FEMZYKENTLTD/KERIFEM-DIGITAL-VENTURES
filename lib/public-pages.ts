import { cases } from './cases';
import { ALL_LEGAL_DOCS } from './legal';
import { services } from './services';

/** Public information routes only; private and submission-specific routes stay out. */
export const publicPages = [
  '/',
  '/about',
  '/services',
  ...services.map(([slug]) => `/services/${slug}`),
  '/portfolio',
  ...cases.map(({ id }) => `/portfolio/${id}`),
  '/contact',
  ...ALL_LEGAL_DOCS.map(({ path }) => path),
];
