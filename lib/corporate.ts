import { screenshots } from './screenshots';
import { BrainCircuit, Code2, Globe2, GraduationCap, Server, Workflow } from 'lucide-react';

export const capabilities = [
  {
    icon: Code2,
    title: 'Software Development',
    copy: 'Custom applications and business systems that fit the way your team works.',
    details: [
      'Web applications and internal tools',
      'Database-backed business systems',
      'Application maintenance and integrations',
    ],
  },
  {
    icon: Globe2,
    title: 'Web Development',
    copy: 'Fast, accessible websites and storefronts built around the customer journey.',
    details: [
      'Corporate websites and e-commerce',
      'WordPress themes and improvements',
      'Responsive development and technical SEO',
    ],
  },
  {
    icon: BrainCircuit,
    title: 'AI Integration',
    copy: 'Add model-assisted features where they can save time and people can review the output.',
    details: [
      'Prototype AI-assisted reporting and review',
      'Integrate model APIs into existing applications',
      'Scope evaluation, costs and human review before rollout',
    ],
  },
  {
    icon: Workflow,
    title: 'Business Automation',
    copy: 'Replace repetitive handoffs and manual data processing with connected workflows.',
    details: [
      'API-driven workflow and reporting automation',
      'Data transformation and scheduled tasks',
      'Messaging integrations subject to provider access and scope',
    ],
  },
  {
    icon: Server,
    title: 'API & Backend Engineering',
    copy: 'Connect systems and give applications a dependable data and authentication layer.',
    details: [
      'REST APIs and third-party integrations',
      'Relational database design',
      'Authentication and application connectivity',
    ],
  },
  {
    icon: GraduationCap,
    title: 'Digital & Educational Services',
    copy: 'Help people build technical skills and use their tools with confidence.',
    details: [
      'Programming and web development tutoring',
      'Technical documentation and writing',
      'Digital skills and productivity support',
    ],
  },
];

const github = 'https://github.com/FEMZYKENTLTD/';
type Project = {
  title: string;
  category: string;
  copy: string;
  stack: string;
  repo: string;
  shots: readonly (readonly [string, string])[];
};
export const work: Project[] = [
  {
    title: 'Knowledge Land CBT Suite',
    category: 'Education software',
    copy: 'A computer-based examination suite with student exam screens, scoring and exam administration.',
    stack: 'Java · JavaFX · Supabase',
    repo: `${github}klc-exam-portal`,
    shots: [['/projects/klc-splash.png', 'CBT Suite startup screen'], ...screenshots.klc],
  },
  {
    title: 'FEMZYK Fleet & Transport Management',
    category: 'Operations software',
    copy: 'Desktop fleet operations software covering vehicles, assignments, trips, fuel, maintenance and reporting.',
    stack: 'Java 17 · Swing · SQLite',
    repo: `${github}FEMZYK-Enterprise-Fleet-and-Transport-Management-System`,
    shots: screenshots.fleet,
  },
  {
    title: 'ResumeRank',
    category: 'Document workflow capstone',
    copy: 'Extracts PDF and DOCX text and compares keywords against a job description for human review. Scores do not make hiring decisions.',
    stack: 'Python · FastAPI · Streamlit · Celery',
    repo: `${github}Resume-Screening-Classifier`,
    shots: [
      [
        '/projects/resumerank.webp',
        'Document screening dashboard with job description and upload controls',
      ],
    ],
  },
  {
    title: 'Contact Book Pro',
    category: 'Desktop productivity',
    copy: 'A desktop address book with search, input validation and a recycle bin for restoring deleted contacts.',
    stack: 'Go · Wails',
    repo: `${github}Contact_Book_Pro`,
    shots: screenshots.contacts,
  },
  {
    title: 'Stock Analysis JavaFX App',
    category: 'Desktop data utilities',
    copy: 'An educational desktop tool that calculates averages, maxima, occurrence counts and cumulative sums from manually entered prices.',
    stack: 'Java · JavaFX · Maven',
    repo: `${github}stock-analysis-javafx`,
    shots: screenshots.stock,
  },
];
