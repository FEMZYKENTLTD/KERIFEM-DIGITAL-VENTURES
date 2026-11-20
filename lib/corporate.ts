import { screenshots } from './screenshots';
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
    copy: 'Fleet operations software covering vehicles, assignments, trips, fuel and reporting, with desktop and web editions.',
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
