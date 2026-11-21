import { BUDGET_OPTIONS } from './content';

export const QUOTE_EDITION_SLUGS = [
  'first-step',
  'focused-brief',
  'clear-foundation',
  'planned-build',
  'connected-work',
  'phased-delivery',
  'extended-scope',
  'budget-discovery',
  'open-brief',
] as const;

export function quoteEditionIndex(budget?: string) {
  const index = BUDGET_OPTIONS.findIndex((option) => option === budget);
  return index < 0 ? BUDGET_OPTIONS.length : index;
}

export function quoteReceiptPath(budget?: string) {
  return `/contact/thank-you/${QUOTE_EDITION_SLUGS[quoteEditionIndex(budget)]}`;
}
