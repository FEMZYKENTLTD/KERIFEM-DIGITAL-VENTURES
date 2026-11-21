import { aboutContent, founderStudies } from './about-content';
import { cases } from './cases';
import { faq, processSteps } from './commercial';
import { ALL_LEGAL_DOCS, LEGAL_DISCLAIMER } from './legal';
import { serviceDetails } from './service-details';
import { services } from './services';
import { BRAND, CONTACT } from './site';

export type GuideResult = { title: string; answer: string; href: string };

const documents: GuideResult[] = [
  ...faq.map(([title, answer]) => ({ title, answer, href: '/' })),
  ...processSteps.map(([title, answer]) => ({ title, answer, href: '/' })),
  ...services.flatMap(([slug, name, title, summary, outcome, stack, examples]) => {
    const [, discovery, approach, deliverables, example] = serviceDetails[slug];
    const href = `/services/${slug}`;
    return [
      { title, href, answer: `${summary} ${outcome} ${examples.join('; ')}. Tools: ${stack}.` },
      { title: `${name}: planning and implementation`, href, answer: `${discovery} ${approach}` },
      {
        title: `${name}: deliverables and use cases`,
        href,
        answer: `${deliverables} Example: ${example}`,
      },
    ];
  }),
  ...cases.map(({ id, status, solution, problem, features, contribution }) => ({
    title: `${id.replaceAll('-', ' ')} case study`,
    href: `/portfolio/${id}`,
    answer: `${status}. ${problem} ${solution} ${features.join('; ')}. ${contribution}`,
  })),
  ...ALL_LEGAL_DOCS.flatMap(({ title, path, sections }) =>
    sections.map((section) => ({
      title: `${title}: ${section.heading}`,
      href: path,
      answer: `${[...(section.paragraphs || []), ...(section.bullets || [])].join(' ')} ${LEGAL_DISCLAIMER}`,
    })),
  ),
  {
    title: 'Contact Kerifem: email, phone and WhatsApp',
    href: '/contact',
    answer: `Email ${CONTACT.email.primary} or message ${CONTACT.whatsapp.primary.display} on WhatsApp. For project details use Request a Quote.`,
  },
  ...Object.values(aboutContent).map((section) => ({ ...section, href: '/about' })),
  {
    title: 'Founder education, university and training',
    href: '/about',
    answer: founderStudies.join(' '),
  },
  {
    title: 'Official credentials, business registration certificates, CAC and SMEDAN',
    href: '/about',
    answer: `${aboutContent.identity.answer} The About page shows redacted public copies of the separately issued records.`,
  },
  {
    title: 'Services overview and capabilities',
    href: '/services',
    answer: `Explore ${services.map(([, name]) => name).join(', ')}. Each service page describes the approach and deliverables.`,
  },
  {
    title: 'Portfolio overview and selected work',
    href: '/portfolio',
    answer:
      'Browse case studies showing the problem, implementation, and real application screenshots. Each case study describes the project context and status.',
  },
  { title: 'Home: Kerifem Digital Ventures', href: '/', answer: BRAND.description },
  {
    title: 'Request a Quote: submit a project enquiry',
    href: '/contact',
    answer:
      'Share the problem you want to solve, who will use the solution and any timeline you have in mind. Budget and a reference link are optional.',
  },
];
const stop = new Set(
  'a an and are about any could did do does for from had has have how i if in is it me my of on or our please say should tell than that the their them these they this to use was we what when where which who why will with would you your'.split(
    ' ',
  ),
);
const aliases: Record<string, string> = {
  fee: 'cost',
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
function tokens(text: string) {
  return [
    ...new Set(
      (text.toLowerCase().match(/[a-z0-9]+/g) || [])
        .filter((token) => !stop.has(token))
        .map((token) => (Object.hasOwn(aliases, token) ? aliases[token] : token)),
    ),
  ];
}
export const indexedGuidePaths = [...new Set(documents.map(({ href }) => href))];

const index = documents.map((document) => ({
  document,
  title: tokens(document.title),
  body: tokens(document.answer),
}));

export function searchGuide(question: string): GuideResult[] {
  const query = tokens(question);
  if (!query.length) return [];
  const ranked = index
    .map((entry) => {
      const matches = query.map((token) =>
        entry.title.includes(token) ? 3 : entry.body.includes(token) ? 1 : 0,
      );
      const covered = matches.filter(Boolean).length;
      return {
        ...entry,
        covered,
        score: matches.reduce<number>((sum, match) => sum + match, 0) + covered / query.length,
      };
    })
    .filter((entry) => entry.covered >= Math.ceil(query.length / 2))
    .sort((a, b) => b.score - a.score);
  const unique = new Set<string>();
  return ranked
    .filter(({ document }) => {
      if (unique.has(document.href)) return false;
      unique.add(document.href);
      return true;
    })
    .slice(0, 3)
    .map(({ document }) => document);
}
