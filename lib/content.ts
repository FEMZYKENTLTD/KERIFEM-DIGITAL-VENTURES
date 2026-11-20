import type { LucideIcon } from 'lucide-react';
import {
  Blocks,
  BrainCircuit,
  Code2,
  FileText,
  Globe2,
  Layers,
  LayoutTemplate,
  Lightbulb,
  MessageSquare,
  PenLine,
  GraduationCap,
  Server,
  ShieldCheck,
  Target,
  Workflow,
} from 'lucide-react';

/* -------------------------------------------------------------------------- */
/* Services                                                                    */
/* -------------------------------------------------------------------------- */

export type Service = {
  slug: string;
  title: string;
  blurb: string;
  icon: LucideIcon;
  /** Long-form bullet list shown in the detailed category accordion. */
  details: string[];
};

export const SERVICES: Service[] = [
  {
    slug: 'web-development',
    title: 'Web Development & Custom Software',
    blurb:
      'Full-stack web applications, corporate websites, e-commerce platforms, and bespoke software solutions built with modern technologies.',
    icon: Code2,
    details: [
      'Business and corporate websites',
      'Portfolio and landing pages',
      'E-commerce storefronts',
      'Custom web applications',
      'Responsive, mobile-first development',
      'Frontend: React, Next.js, TypeScript, Tailwind CSS',
      'Backend: Python/Flask, PHP, Node.js',
      'Database-driven applications',
      'Maintenance and support',
      'Performance & SEO optimisation',
    ],
  },
  {
    slug: 'backend-apis',
    title: 'Backend Development & API Integration',
    blurb:
      'Robust server-side architecture, RESTful and GraphQL APIs, third-party integrations, and database engineering.',
    icon: Server,
    details: [
      'Custom API development',
      'RESTful and GraphQL endpoints',
      'Third-party software integration',
      'WhatsApp API integration',
      'Payment gateway integration',
      'Database design: MongoDB, Supabase, PostgreSQL',
      'Server-side business logic',
      'Authentication and authorisation systems',
      'Microservices architecture',
    ],
  },
  {
    slug: 'wordpress',
    title: 'WordPress & Theme Development',
    blurb:
      'Custom WordPress themes, WooCommerce stores, plugin integration, performance optimisation, and ongoing maintenance.',
    icon: LayoutTemplate,
    details: [
      'Custom WordPress themes built from scratch',
      'Theme customisation and configuration',
      'Website redesigns and migrations',
      'Installation and configuration',
      'Plugin integration',
      'WooCommerce storefronts',
      'Performance optimisation',
      'Security hardening',
      'Custom functionality and blocks',
      'Ongoing maintenance',
    ],
  },
  {
    slug: 'ai-automation',
    title: 'AI Integration & Automation',
    blurb:
      'AI tool integration, workflow automation, intelligent systems, and process optimisation for modern businesses.',
    icon: BrainCircuit,
    details: [
      'AI tool integration into existing workflows',
      'Business process automation',
      'Chatbot development',
      'Intelligent workflow systems',
      'Data processing automation',
      'AI-powered content solutions',
      'Custom automation scripts',
    ],
  },
  {
    slug: 'ghostwriting',
    title: 'Ghostwriting & Professional Writing',
    blurb:
      'Original, research-driven content including articles, e-books, business documents, website copy, and professional communications.',
    icon: PenLine,
    details: [
      'Articles and blog posts',
      'Business writing',
      'Website content',
      'Professional profiles',
      'Reports and proposals',
      'E-books and manuscripts',
      'Research-oriented writing',
      'Speeches',
      'Content strategy',
      'Every piece is original, researched, and tailored to your requirements',
    ],
  },
  {
    slug: 'document-editing',
    title: 'Document Editing & Formatting',
    blurb:
      'Professional document preparation, academic formatting, CV/resume design, proofreading, and presentation development.',
    icon: FileText,
    details: [
      'Microsoft Word editing',
      'Professional formatting',
      'Academic formatting: APA, MLA, Chicago',
      'Business documents, reports, proposals',
      'CV and résumé formatting',
      'PDF services',
      'Proofreading',
      'Tables and charts',
      'Presentation development',
    ],
  },
  {
    slug: 'tutoring',
    title: 'Tutoring & Technology Education',
    blurb:
      'One-on-one and group training in programming, web development, computer science fundamentals, and practical technology skills.',
    icon: GraduationCap,
    details: [
      'Computer Science tutoring',
      'Programming: Python, Java, JavaScript, TypeScript, C#',
      'Web development training',
      'WordPress training',
      'Database fundamentals',
      'Software development fundamentals',
      'Flexible remote learning',
      'One-on-one and group sessions',
    ],
  },
];

/* -------------------------------------------------------------------------- */
/* About                                                                       */
/* -------------------------------------------------------------------------- */

export const ABOUT_PARAGRAPHS = [
  'Founded in 2023, FEMZYK ENTERPRISES is a SMEDAN-registered digital solutions company built on a commitment to practical innovation, technical excellence, and measurable results.',
  'We specialise in web development, custom software engineering, WordPress solutions, AI integration, professional writing, document editing, and technology education. Our services are delivered remotely to clients across Nigeria, the United Kingdom, the United States, Canada, Europe, the Middle East, and beyond.',
  'Our philosophy is simple: leverage technology, creativity, and deep technical expertise to solve real-world problems, improve productivity, establish powerful digital presences, and help our clients achieve their objectives — with quality, accessibility, and affordability at the core of everything we do.',
];

export const ABOUT_HIGHLIGHTS: { label: string; icon: LucideIcon }[] = [
  { label: 'Multi-Disciplinary Expertise', icon: Layers },
  { label: 'Remote-First Global Delivery', icon: Globe2 },
  { label: 'Client-Centred Approach', icon: Target },
  { label: 'Continuous Innovation', icon: Lightbulb },
];

/* -------------------------------------------------------------------------- */
/* Why us                                                                      */
/* -------------------------------------------------------------------------- */

export const WHY_US: { title: string; body: string; icon: LucideIcon }[] = [
  {
    title: 'Multi-Disciplinary Expertise',
    body: 'From full-stack development to professional writing, we offer a rare combination of technical and creative services under one roof.',
    icon: Layers,
  },
  {
    title: 'Modern Technology Stack',
    body: 'We build with industry-leading technologies including React, Next.js, TypeScript, Python, and modern cloud platforms.',
    icon: Blocks,
  },
  {
    title: 'Remote-First, Globally Accessible',
    body: 'We serve clients across Nigeria, the UK, the US, Canada, Europe, the Middle East, and beyond — entirely through digital channels.',
    icon: Globe2,
  },
  {
    title: 'Quality-Driven Delivery',
    body: 'Every project receives meticulous attention to detail, thorough testing, and professional-grade output.',
    icon: ShieldCheck,
  },
  {
    title: 'Transparent Communication',
    body: 'Clear timelines, honest pricing, and consistent updates throughout every engagement.',
    icon: MessageSquare,
  },
  {
    title: 'Continuous Innovation',
    body: 'We stay current with emerging technologies, AI advancements, and industry best practices to deliver future-proof solutions.',
    icon: Workflow,
  },
];

/* -------------------------------------------------------------------------- */
/* Technologies                                                                */
/* -------------------------------------------------------------------------- */

export const TECHNOLOGY_GROUPS: { label: string; items: string[] }[] = [
  {
    label: 'Languages',
    items: ['Python', 'Java', 'C#', 'PHP', 'TypeScript', 'JavaScript', 'Go', 'HTML5', 'CSS3'],
  },
  {
    label: 'Frameworks & Libraries',
    items: ['React', 'Next.js', 'Tailwind CSS', 'Flask', 'JavaFX', 'Wails'],
  },
  {
    label: 'Databases & Platforms',
    items: ['Supabase', 'MongoDB', 'MySQL', 'PostgreSQL'],
  },
  {
    label: 'Tools & Integration',
    items: [
      'REST APIs',
      'GraphQL',
      'Maven',
      'Git',
      'Docker',
      'AI/ML Tools',
      'WhatsApp Business API',
    ],
  },
  {
    label: 'CMS',
    items: ['WordPress', 'WooCommerce'],
  },
];

/* -------------------------------------------------------------------------- */
/* Portfolio                                                                   */
/* -------------------------------------------------------------------------- */

export type Project = {
  name: string;
  initials: string;
  description: string;
  tech: string[];
  /** Only real, verified repositories are linked. */
  repo?: string;
  /**
   * Optional screenshot served from /public (e.g. '/projects/femzyk-market.png').
   * When unset the card renders the branded initials placeholder instead of a
   * fabricated screenshot.
   */
  image?: string;
  imageAlt?: string;
};

export const PROJECTS: Project[] = [
  {
    name: 'FEMZYK MARKET',
    initials: 'FM',
    description:
      'An e-commerce platform designed for an international audience, featuring product management, cart functionality, and secure checkout flows.',
    tech: ['Next.js', 'React', 'Tailwind CSS', 'Supabase'],
    repo: 'https://github.com/FEMZYKENTLTD/FeMzYK-MARKET',
  },
  {
    name: 'Knowledge Land CBT Suite',
    initials: 'KL',
    description:
      'A computer-based testing and examination management platform for educational institutions, supporting timed assessments, question banks, and result analytics.',
    tech: ['React', 'TypeScript', 'Node.js', 'MongoDB'],
    repo: 'https://github.com/FEMZYKENTLTD/klc-exam-portal',
  },
  {
    name: 'FEMZYK Vehicle Management System',
    initials: 'VM',
    description:
      'A comprehensive vehicle management software solution for fleet tracking, maintenance scheduling, and operational reporting.',
    tech: ['Python', 'Flask', 'React', 'PostgreSQL'],
    repo: 'https://github.com/FEMZYKENTLTD/FEMZYK-Enterprise-Fleet-and-Transport-Management-System',
  },
  {
    name: 'Vantera',
    initials: 'VT',
    description:
      'A membership and digital gift-card platform developed as a paid client project, featuring user authentication, subscription tiers, and digital card generation.',
    tech: ['Next.js', 'TypeScript', 'Supabase', 'Tailwind CSS'],
    repo: 'https://github.com/FEMZYKENTLTD/vantera-membership-platform',
  },
  {
    name: 'WhatsApp Automation & API Integration',
    initials: 'WA',
    description:
      'Custom WhatsApp Business API integrations for automated messaging, customer support workflows, and business communication systems.',
    tech: ['Node.js', 'WhatsApp Business API', 'Python'],
    repo: 'https://github.com/FEMZYKENTLTD/AIRLINE-SCRAPING-WHATSAPP-BOT',
  },
  {
    name: 'Custom Web Applications & Backend Systems',
    initials: 'CW',
    description:
      'A range of database-driven web applications, RESTful API services, and backend architectures built for diverse client requirements.',
    tech: ['Python', 'Flask', 'React', 'MongoDB', 'Supabase'],
    repo: 'https://github.com/FEMZYKENTLTD',
  },
];

export const PORTFOLIO_NOTE =
  'Additional project screenshots and live demos available upon request.';

/* -------------------------------------------------------------------------- */
/* Process                                                                     */
/* -------------------------------------------------------------------------- */

export const PROCESS_STEPS: { title: string; body: string }[] = [
  {
    title: 'Discovery & Consultation',
    body: 'We begin by understanding your goals, requirements, target audience, and project scope through a detailed discussion.',
  },
  {
    title: 'Strategy & Planning',
    body: 'We develop a clear project roadmap, technology stack recommendation, timeline, and transparent proposal.',
  },
  {
    title: 'Design & Development',
    body: 'Our team designs and builds your solution iteratively, with regular check-ins and progress updates.',
  },
  {
    title: 'Testing & Refinement',
    body: 'Rigorous testing across devices and browsers, performance optimisation, and client feedback integration.',
  },
  {
    title: 'Launch & Ongoing Support',
    body: 'Seamless deployment, documentation handover, and optional ongoing maintenance and support.',
  },
];

/* -------------------------------------------------------------------------- */
/* Founder                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Set this to a path inside /public (e.g. '/founder/olufemi-keripe.png') once a
 * real photograph is available. `null` keeps the branded placeholder — the site
 * never ships a generated or stock portrait.
 */
export const FOUNDER_PHOTO: string | null = null;

export const FOUNDER = {
  name: 'Olufemi Benua Keripe',
  initials: 'OBK',
  title: 'Founder & Lead Technology Consultant',
  photoNote: 'Professional photograph to be added.',
  bio: [
    'Olufemi Benua Keripe is a Computer Science student at Lagos State University (LASU) and the University of the People, and a graduate of the 3MTT Artificial Intelligence and Machine Learning programme.',
    'As the founder of FEMZYK ENTERPRISES, he leads a multidisciplinary practice spanning full-stack web development, backend engineering, API integration, AI tool development, professional writing, and technology education.',
    'His technical expertise covers Python, Java, C#, PHP, TypeScript, JavaScript, Go, React, Next.js, Flask, and modern database and cloud platforms. He is driven by a passion for building practical, high-quality digital solutions that solve real problems.',
  ],
  credentials: [
    'BSc Computer Science — LASU (In Progress)',
    'BSc Computer Science — UoPeople (In Progress)',
    '3MTT AI & Machine Learning Graduate',
    'Full-Stack Developer',
    'Technical Writer',
  ],
} as const;

/* -------------------------------------------------------------------------- */
/* Testimonials (placeholders — never fabricated)                              */
/* -------------------------------------------------------------------------- */

export const TESTIMONIAL_PLACEHOLDERS = [
  {
    quote: '[Your testimonial will appear here]',
    name: '[Client Name]',
    role: '[Client Role / Project Type]',
  },
  {
    quote: '[Your testimonial will appear here]',
    name: '[Client Name]',
    role: '[Client Role / Project Type]',
  },
  {
    quote: '[Your testimonial will appear here]',
    name: '[Client Name]',
    role: '[Client Role / Project Type]',
  },
];

export const TESTIMONIAL_NOTE =
  'Testimonials are published with client permission. Contact us to share your experience.';

/* -------------------------------------------------------------------------- */
/* FAQ                                                                         */
/* -------------------------------------------------------------------------- */

export type Faq = { question: string; answer: string };

export const FAQS: Faq[] = [
  {
    question: 'What services does FEMZYK ENTERPRISES offer?',
    answer:
      'We offer web development, custom software development, WordPress and theme development, backend and API integration, AI tool integration, ghostwriting, document editing, and technology tutoring. We do not offer hardware sales, repairs, or physical device servicing.',
  },
  {
    question: 'Do you work with international clients?',
    answer:
      'Yes. While based in Nigeria, we serve clients across the UK, US, Canada, Europe, the Middle East, and other international markets. All services are delivered remotely through digital channels.',
  },
  {
    question: 'How do I start a project with FEMZYK?',
    answer:
      'Fill out our contact form, email us at femzykenterprisesltd@gmail.com, or reach out via WhatsApp at +234 902 115 6310. We will discuss your requirements, timeline, and budget before providing a custom proposal.',
  },
  {
    question: 'What technologies do you use?',
    answer:
      'We work with modern technologies including React, Next.js, TypeScript, Python, Flask, PHP, Java, Go, Tailwind CSS, MongoDB, Supabase, and WordPress, among others. We select the best stack for each project\u2019s specific needs.',
  },
  {
    question: 'Do you offer hardware repairs or computer servicing?',
    answer:
      'No. FEMZYK ENTERPRISES specialises exclusively in software, digital, and professional services. We do not sell, repair, or service physical hardware or devices.',
  },
  {
    question: 'How is pricing determined?',
    answer:
      'Pricing is project-based and depends on scope, complexity, and timeline. Contact us with your project details for a custom quote.',
  },
  {
    question: 'Is FEMZYK ENTERPRISES a registered business?',
    answer: 'Yes. FEMZYK ENTERPRISES is a SMEDAN-registered enterprise in Nigeria.',
  },
];

/* -------------------------------------------------------------------------- */
/* Contact form option sets                                                    */
/* -------------------------------------------------------------------------- */

export const SERVICE_OPTIONS = [
  'Web Development',
  'Software Development',
  'WordPress & Theme Development',
  'AI Integration & Automation',
  'Ghostwriting & Writing',
  'Document Editing & Formatting',
  'Tutoring & Education',
  'Other',
] as const;

export const BUDGET_OPTIONS = [
  'Under \u20A6100,000',
  '\u20A6100,000 \u2013 \u20A6500,000',
  '\u20A6500,000 \u2013 \u20A61,000,000',
  '\u20A61,000,000+',
  '$500 \u2013 $2,000',
  '$2,000 \u2013 $5,000',
  '$5,000+',
  'Not Sure Yet',
] as const;

export const CONTACT_METHODS = ['Email', 'WhatsApp', 'Phone'] as const;
