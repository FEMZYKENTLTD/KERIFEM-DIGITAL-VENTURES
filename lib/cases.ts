export const cases = [
  {
    id: 'knowledge-land-cbt',
    status: 'Implemented education software',
    problem:
      'Schools need a repeatable examination workflow instead of disconnected paper questions and marks.',
    solution:
      'The suite gives administrators tools to prepare assessments and students an interface to sit them.',
    contribution: 'Olufemi Benua Keripe is credited as lead developer.',
    features: [
      'Question import and administration',
      'Timed student exam interface',
      'Practice sessions and grading configuration',
    ],
  },
  {
    id: 'femzyk-fleet',
    status: 'Desktop implementation and separate web edition',
    problem:
      'Vehicle records, assignments and operating costs are difficult to reconcile when managed separately.',
    solution:
      'The desktop edition combines fleet records and reporting in a local database; a separate Next.js web edition is available at the project’s listed URL.',
    contribution: 'Olufemi Benua Keripe developed the fleet system as a SIWES project.',
    features: [
      'Vehicle and driver records',
      'Trips, assignments and maintenance',
      'Fuel, expenses and reporting',
    ],
    live: 'https://femzyk-fleet.vercel.app',
  },
  {
    id: 'resumerank',
    status: 'Post-training demonstration · 3MTT AI and ML',
    problem:
      'Reviewers need a way to extract and compare candidate documents without delegating hiring decisions to software.',
    solution:
      'A Python document pipeline extracts text from PDF and DOCX files and scores matches against a job description for human review.',
    contribution:
      'Olufemi Benua Keripe built the project as a demonstration after 3MTT AI and ML training.',
    features: [
      'PDF and DOCX ingestion',
      'FastAPI and background processing',
      'Keyword comparison with manual review',
    ],
  },
  {
    id: 'contact-book-pro',
    status: 'Implemented desktop application',
    problem: 'Contacts need to be searchable and accidental deletions recoverable.',
    solution: 'A Wails interface connects contact entry and search to Go data and recovery logic.',
    contribution: 'Published under the FEMZYK GitHub profile as portfolio work.',
    features: [
      'Create and edit contact records',
      'Search and input validation',
      'Recycle bin and restore',
    ],
  },
  {
    id: 'stock-analysis',
    status: 'Educational desktop project',
    problem: 'Learners need a way to visualize basic calculations on lists of prices.',
    solution:
      'A JavaFX interface exposes array and list operations using manually entered data, not a market feed.',
    contribution: 'Published under the FEMZYK GitHub profile as an educational project.',
    features: ['Average and maximum calculations', 'Occurrence counting', 'Cumulative sums'],
  },
] as const;
