const stop = new Set(
  'a an and are about any could did do does for from had has have how i if in is it me my of on or our please say should tell than that the their them these they this to use was we what when where which who why will with would you your'.split(
    ' ',
  ),
);
const aliases: Record<string, string> = {
  fee: 'cost',
  pay: 'cost',
  payment: 'cost',
  payable: 'cost',
  spend: 'cost',
  rate: 'cost',
  rates: 'cost',
  baseline: 'minimum',
  least: 'minimum',
  floor: 'minimum',
  founder: 'founder',
  founded: 'founder',
  creators: 'founder',
  creator: 'founder',
  deliverable: 'deliverable',
  deliverables: 'deliverable',
  upkeep: 'maintenance',
  maintain: 'maintenance',
  maintainer: 'maintenance',
  redesigns: 'redesign',
  fees: 'cost',
  price: 'cost',
  pricing: 'cost',
  charge: 'cost',
  charges: 'cost',
  lowest: 'minimum',
  cheapest: 'minimum',
  starting: 'minimum',
  sites: 'website',
  websites: 'website',
  quotation: 'quote',
  quotations: 'quote',
  enquiries: 'enquiry',
  inquiry: 'enquiry',
  inquiries: 'enquiry',
  spreadsheet: 'spreadsheet',
  spreadsheets: 'spreadsheet',
  data: 'data',
};
export function guideTokens(text: string) {
  return [
    ...new Set(
      (
        text
          .normalize('NFKD')
          .replace(/\p{M}/gu, '')
          .toLowerCase()
          .match(/[a-z0-9]+/g) || []
      )
        .filter((token) => !stop.has(token))
        .map((token) => (Object.hasOwn(aliases, token) ? aliases[token] : token)),
    ),
  ];
}
export function isAccountOrEmploymentPricing(question: string) {
  return (
    /\b(?:wages?|salar(?:y|ies)|employees?|jobs?|hiring|hourly|internships?|stipends?|deposits?|instal{1,2}ments?|invoices?|refunds?|upfront)\b/i.test(
      question,
    ) && guideTokens(question).some((word) => ['cost', 'budget', 'minimum'].includes(word))
  );
}

export function isMinimumProjectPrice(question: string) {
  if (isAccountOrEmploymentPricing(question)) return false;
  const words = guideTokens(question);
  return words.includes('minimum') && words.some((word) => ['cost', 'budget'].includes(word));
}
