import { services } from './services';
export const SERVICE_OPTIONS = services.map(([, label]) => label);
export const BUDGET_OPTIONS = [
  '$100 – $250',
  '$251 – $500',
  '$501 – $1,000',
  '$1,001 – $2,500',
  '$2,501 – $5,000',
  '$5,001 – $10,000',
  '$10,000+',
  'Not sure yet',
] as const;
export const CONTACT_METHODS = ['Email', 'WhatsApp', 'Phone'] as const;
export const TIMELINES = [
  'Within 2 weeks',
  'Within 1 month',
  '1–3 months',
  'More than 3 months',
  'Flexible',
] as const;
