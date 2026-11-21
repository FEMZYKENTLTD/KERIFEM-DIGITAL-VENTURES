/** Publish only answers checked against the public site. Never copy chat transcripts here. */
export const reviewedGuideAnswers = [
  {
    question: 'Can I request a quote without a budget?',
    phrases: [
      'without a budget',
      'no budget yet',
      'budget blank',
      'budget required',
      'not sure about budget',
    ],
    answer:
      'Yes. Budget is optional. Leave it blank or select “Not sure yet.” Share your goal, the work you need, and your preferred timeline so Kerifem can review the scope.',
    href: '/contact',
    label: 'Open the quote form',
  },
  {
    question: 'Can you update an existing website?',
    phrases: [
      'existing website',
      'redesign my site',
      'fix my website',
      'update wordpress',
      'website maintenance',
    ],
    answer:
      'Yes. Kerifem can scope redesigns, updates, accessibility improvements, and maintenance. In your enquiry, share what needs to change and an optional public link. Don’t include sign-in credentials.',
    href: '/services/web',
    label: 'Explore web development',
  },
  {
    question: 'What happens after I send a quote request?',
    phrases: [
      'after i submit',
      'after i send',
      'what happens next',
      'quote confirmation',
      'submitted my quote',
    ],
    answer:
      'After your enquiry is saved, the site shows a private summary with a reference number. Kerifem can review the brief and follow up via your preferred contact method. The summary is not a final quote or payment, and the guide cannot look up submissions.',
    href: '/contact',
    label: 'Go to the enquiry page',
  },
  {
    question: 'Can you work with international clients?',
    phrases: [
      'international clients',
      'work remotely',
      'outside nigeria',
      'united states',
      'europe',
    ],
    answer:
      'Yes. Kerifem works remotely with clients in the United States, Europe, and other markets. Project quotes are in USD; scope and timelines are agreed during planning.',
    href: '/contact',
    label: 'Request a quote',
  },
] as const;

export function reviewedGuideMatch(question: string) {
  const normalized = ` ${question
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()} `;
  const matches = reviewedGuideAnswers.filter((entry) =>
    entry.phrases.some((phrase) => normalized.includes(` ${phrase} `)),
  );
  return matches.length === 1 ? matches[0] : undefined;
}
