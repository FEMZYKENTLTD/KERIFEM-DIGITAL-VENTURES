import { BRAND } from './site';

/**
 * LEGAL PLACEHOLDER COPY — not legal advice.
 *
 * Every page renders a visible notice telling the client these documents must be
 * reviewed and customised with a legal professional before launch. The wording is
 * standard boilerplate written to match how this site actually behaves (Web3Forms
 */

export const LEGAL_LAST_UPDATED = '20 November 2026';

export const LEGAL_DISCLAIMER =
  'This is a placeholder document. Please consult a legal professional for compliant policies.';

export type LegalSection = {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
};

export type LegalDoc = {
  slug: string;
  path: string;
  title: string;
  metaDescription: string;
  intro: string;
  sections: LegalSection[];
};

export const PRIVACY_POLICY: LegalDoc = {
  slug: 'privacy-policy',
  path: '/privacy-policy',
  title: 'Privacy Policy',
  metaDescription:
    'How KERIFEM DIGITAL VENTURES collects, uses, and protects the information you submit through the website enquiry form.',
  intro: `This Privacy Policy explains how ${BRAND.name} ("we", "us") handles personal information when you visit our website or send us a project enquiry. We keep data collection to the minimum required to answer enquiries and deliver agreed work.`,
  sections: [
    {
      heading: '1. Information we collect',
      paragraphs: [
        'We process information you submit and limited site usage and performance measurements. There are no advertising trackers, no profiling, and no sale of personal data.',
      ],
      bullets: [
        'Enquiry details submitted through the website form: full name, email address, phone or WhatsApp number, country, service required, optional project title and reference link, preferred timeline, project description, optional budget range, and preferred contact method.',
        'Messages you send us by email or WhatsApp, including any files you attach.',
        'Basic technical data recorded automatically by our hosting provider for security and diagnostics (IP address, user agent, referring URL, timestamp).',
      ],
    },
    {
      heading: '2. How we use your information',
      bullets: [
        'To respond to your enquiry, using your preferred contact method.',
        'To prepare a project scope, timeline, and quotation when you request one.',
        'To deliver, maintain, and support work you have engaged us for.',
        'To keep records of correspondence for administrative, legal, and accounting purposes.',
        'To improve the accuracy and performance of our website.',
      ],
      paragraphs: [
        'We do not use your information for automated decision-making, we do not operate marketing mailing lists, and we do not sell or rent your data to anyone.',
      ],
    },
    {
      heading: '3. Form processing and third-party services',
      paragraphs: [
        'The enquiry form on this website does not store submissions in our own database. Our server validates the submission and forwards it to Web3Forms (https://web3forms.com), a third-party form-handling service, which forwards the enquiry by email to the address shown on this site. Web3Forms processes that data under its own privacy notice and may retain submission metadata on its infrastructure for spam filtering and delivery logging.',
      ],
      bullets: [
        'Web3Forms — enquiry delivery and spam protection (including a hidden honeypot field).',
        'Vercel Web Analytics and Speed Insights — measure page visits and browser performance on the production deployment. The site removes query strings and fragments from event page URLs and does not send enquiry form contents to these services.',
        'Hosting provider (Vercel if deployed there) — content delivery and security logging.',
        'WhatsApp (Meta Platforms) and Gmail — communication channels you may choose to use with us.',
      ],
    },
    {
      heading: '4. Cookies',
      paragraphs: [
        'This website does not set advertising, analytics, or profiling cookies of its own. See our Cookie Policy for details about browser storage and cookieless measurement.',
      ],
    },
    {
      heading: '5. How long we keep your data',
      bullets: [
        'Enquiry correspondence: while we are in contact with you, and afterwards as needed for follow-up and applicable legal obligations.',
        'Project records (scope, files, invoices): as long as required by Nigerian tax and record-keeping obligations.',
        'Hosting security logs: according to our hosting provider\u2019s retention defaults.',
      ],
    },
    {
      heading: '6. Security',
      paragraphs: [
        'The website is served over HTTPS and the enquiry inbox is protected with strong credentials and two-factor authentication. No method of transmission or storage is completely secure, so please do not send passwords, payment credentials, or highly sensitive personal data in your enquiry — share those only over a channel we agree in writing.',
      ],
    },
    {
      heading: '7. Your rights and choices',
      bullets: [
        'Request a copy of the personal information we hold about you.',
        'Ask us to correct anything inaccurate or incomplete.',
        'Ask us to delete your data where we have no legal basis to retain it.',
        'Object to, or ask us to restrict, a particular use of your data.',
        'Withdraw consent at any time where consent is the basis for processing.',
      ],
      paragraphs: [
        'To exercise any of these rights, email us at the address at the bottom of this page. We aim to acknowledge requests within 72 hours and respond within 30 days.',
      ],
    },
    {
      heading: '8. International transfers',
      paragraphs: [
        'You may be located outside Nigeria. Sending an enquiry means your information is transmitted to and processed by the third-party services named above, which operate outside your jurisdiction. We use the providers\u2019 standard contractual and technical safeguards rather than transferring data for any other purpose.',
      ],
    },
    {
      heading: '9. Children',
      paragraphs: [
        'Our services are directed at businesses and adult learners. We do not knowingly collect personal information from children under 13. Tutoring enquiries for a minor should be submitted by a parent or guardian, and we will delete any data collected in error at their request.',
      ],
    },
    {
      heading: '10. Changes to this policy',
      paragraphs: [
        'We may update this policy to reflect changes in our tools or obligations. The revision date at the top of the page always reflects the latest version, and material changes will be announced on this website.',
      ],
    },
  ],
};

export const TERMS_OF_SERVICE: LegalDoc = {
  slug: 'terms-of-service',
  path: '/terms-of-service',
  title: 'Terms of Service',
  metaDescription:
    'The terms that govern engagements with KERIFEM DIGITAL VENTURES for web development, software, writing, and tutoring services.',
  intro: `These Terms of Service govern your use of this website and any engagement with ${BRAND.name}. By submitting an enquiry or instructing us for a project, you agree to these terms.`,
  sections: [
    {
      heading: '1. About us and scope of services',
      bullets: [
        'Web development and custom software engineering.',
        'Backend development, APIs, and third-party integrations.',
        'WordPress theme development, WooCommerce, and maintenance.',
        'AI tool integration and business process automation.',
        'Ghostwriting and professional writing.',
        'Document editing, formatting, and presentation preparation.',
        'Tutoring and technology education.',
      ],
      paragraphs: [
        'We do not sell, repair, or service physical hardware or devices. Any request of that kind is outside the scope of our engagement, and we will tell you so rather than accept work we cannot perform properly.',
      ],
    },
    {
      heading: '2. Enquiries and proposals',
      paragraphs: [
        'Enquiries submitted through the website, email, or WhatsApp are requests for information and do not create a binding agreement. Every project is quoted individually: pricing reflects scope, complexity, and timeline, and is stated in a written proposal.',
        'Sending an enquiry does not start a paid engagement. Any chargeable discovery work, project scope, fees and payment schedule are agreed separately in writing.',
      ],
    },
    {
      heading: '3. Client responsibilities',
      bullets: [
        'Provide accurate content, credentials, and access to the accounts and systems a project needs.',
        'Nominate one point of contact with authority to approve work.',
        'Give feedback and approvals within the response times agreed in the proposal.',
        'Ensure you hold the rights to any material you supply for publication.',
      ],
      paragraphs: [
        'Delays caused by unavailable content, approvals, or third-party account access extend the timeline correspondingly and may be chargeable where they cost us rework.',
      ],
    },
    {
      heading: '4. Fees, deposits, and payment terms',
      paragraphs: [
        'Invoicing follows the schedule in the accepted proposal — commonly a deposit before work begins, milestone invoices during delivery, and a balance before final handover or launch. Prices are quoted for the stated scope; changes of scope are quoted separately before they are actioned.',
        'Where a proposal does not state otherwise, invoices are payable within the period stated on the invoice. We may pause active work on accounts with overdue invoices. Taxes, bank, or processor charges are the client\u2019s responsibility where applicable.',
      ],
    },
    {
      heading: '5. Timelines, revisions, and acceptance',
      paragraphs: [
        'Timelines assume the client responsibilities above are met and that third-party services (hosting, payment gateways, WhatsApp Business API, domain registrars) behave as documented. Revisions included in a proposal cover the agreed scope; additional rounds are quoted. Deliverables are considered accepted once approved in writing, or seven days after delivery if no objection is raised.',
      ],
    },
    {
      heading: '6. Intellectual property',
      paragraphs: [
        'On receipt of full payment, ownership of the bespoke code, designs, and written content produced for your project passes to you. We retain the right to describe the project in our portfolio and to reuse generic, non-confidential techniques, components, and know-how developed before or independently of your project.',
        'Third-party materials (fonts, libraries, plugins, stock assets) remain governed by their own licences, which we will identify so you can confirm the terms. Client-supplied content, brand assets, and data stay yours, and you are responsible for the lawfulness of what you publish.',
      ],
    },
    {
      heading: '7. Confidentiality',
      paragraphs: [
        'Each party will keep the other\u2019s non-public business information confidential, use it only for the engagement, and disclose it only where legally required. Nothing here prevents us from telling you that we work with a sector, unless a separate non-disclosure agreement says otherwise.',
      ],
    },
    {
      heading: '8. Maintenance and support',
      paragraphs: [
        'Delivery includes documentation handover and the support period stated in the proposal. Ongoing maintenance — updates, monitoring, content changes, new features — is available under a separate written agreement and is not implied by this engagement.',
      ],
    },
    {
      heading: '9. Third-party platforms',
      paragraphs: [
        'Work that depends on platforms we do not control (Google, Meta/WhatsApp, Vercel, Supabase, payment processors, WordPress.org, domain registrars) is delivered as integration work. Their availability, policies, review processes, fees, and account decisions are theirs to make, and we are not responsible for changes, suspensions, or outages they impose.',
      ],
    },
    {
      heading: '10. Disclaimers',
      paragraphs: [
        'The website is provided "as is" without warranties of any kind, to the fullest extent permitted by law. We do not warrant specific commercial outcomes, search rankings, traffic, or that any platform will approve your account or listing.',
      ],
    },
    {
      heading: '11. Limitation of liability',
      paragraphs: [
        'To the maximum extent permitted by law, our total liability for an engagement is limited to the fees you actually paid us for the work giving rise to the claim, and we are not liable for lost profits, lost revenue, lost data, goodwill, or other indirect or consequential loss. Nothing in these terms limits liability that cannot lawfully be limited, including for fraud or wilful misconduct.',
      ],
    },
    {
      heading: '12. Termination',
      paragraphs: [
        'Either party may end an engagement by written notice. On termination, you pay for work completed and non-cancellable commitments up to the notice date, and we hand over materials paid for, including work in progress where practical. Deposits for work already commenced are non-refundable.',
      ],
    },
    {
      heading: '13. Governing law and disputes',
      paragraphs: [
        'These terms are governed by the laws of the Federal Republic of Nigeria. The parties will first attempt resolution in good faith through written negotiation; unresolved disputes may be referred to the courts of Lagos State, Nigeria, unless the proposal states otherwise.',
      ],
    },
    {
      heading: '14. General',
      paragraphs: [
        'These terms, together with your accepted proposal, form the whole agreement for an engagement. If a clause is unenforceable, the rest continue to apply. We may update these terms; the version published on this website at the time an enquiry is submitted governs that engagement unless a signed agreement says otherwise.',
      ],
    },
  ],
};

export const COOKIE_POLICY: LegalDoc = {
  slug: 'cookie-policy',
  path: '/cookie-policy',
  title: 'Cookie Policy',
  metaDescription:
    'Which cookies and similar technologies KERIFEM DIGITAL VENTURES uses on its website, and how to control them.',
  intro:
    'This policy describes the cookies and similar technologies used on this website and how you can control them.',
  sections: [
    {
      heading: '1. What cookies are',
      paragraphs: [
        'Cookies are small text files stored by your browser. Similar technologies include localStorage, session storage, and pixels. They can remember preferences, keep you signed in, or measure how a site is used.',
      ],
    },
    {
      heading: '2. What we use today',
      paragraphs: ['This website does not set advertising, remarketing, or profiling cookies.'],
      bullets: [
        'Strictly necessary: nothing persistent is required for the site to work; the enquiry form operates without cookies from our own servers.',
        'Functional: the site saves your colour palette preference in browser local storage.',
        'Analytics: Vercel Web Analytics and Speed Insights measure traffic and performance on production without setting analytics cookies.',
        'Advertising: none, now or by plan.',
      ],
    },
    {
      heading: '3. Third-party technologies on this page',
      bullets: [
        'Web3Forms receives validated requests from our server; the enquiry form does not load Web3Forms in your browser.',
        'Vercel — hosting may use security cookies (for example DDoS and bot mitigation) on the site origin as configured by the platform.',
        'WhatsApp click-to-chat links — once you follow a link to wa.me, WhatsApp\u2019s own cookie policy applies to that page.',
      ],
    },
    {
      heading: '4. Managing cookies',
      paragraphs: [
        'You can block or delete cookies in your browser settings (Chrome, Firefox, Safari, and Edge all provide per-site controls). Blocking strictly necessary or platform security cookies may stop the enquiry form or the page itself from working correctly.',
      ],
    },
    {
      heading: '5. Do not sell my personal information',
      paragraphs: [
        'We do not sell or share personal information for cross-context behavioural advertising, and we have no such plans for this website.',
      ],
    },
    {
      heading: '6. Changes to this policy',
      paragraphs: [
        'If the technology on this site changes, this policy is updated and the revision date at the top of the page is amended. Material changes affecting cookies that require consent will be introduced alongside a consent prompt.',
      ],
    },
  ],
};

export const LEGAL_DOCS: Record<LegalDoc['slug'], LegalDoc> = {
  [PRIVACY_POLICY.slug]: PRIVACY_POLICY,
  [TERMS_OF_SERVICE.slug]: TERMS_OF_SERVICE,
  [COOKIE_POLICY.slug]: COOKIE_POLICY,
};

export const ALL_LEGAL_DOCS: LegalDoc[] = [PRIVACY_POLICY, TERMS_OF_SERVICE, COOKIE_POLICY];
