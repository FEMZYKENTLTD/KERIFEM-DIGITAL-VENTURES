import { Intro, Work } from '@/components/Corporate';
import { ArrowUpRight } from 'lucide-react';
import { pageMetadata } from '@/lib/metadata';
export const metadata = pageMetadata(
  'Portfolio',
  'Explore the public source behind selected software and automation projects.',
  '/portfolio',
);
export default function PortfolioPage() {
  return (
    <div className="kv-wrap">
      <aside className="kv-portfolio-origin" aria-label="Our portfolio beginnings">
        <div>
          <p className="kv-label">WHERE WE STARTED</p>
          <h2>The FEMZYK portfolio</h2>
          <p>
            Explore the earlier portfolio that helped begin our journey to KERIFEM DIGITAL VENTURES.
          </p>
        </div>
        <a
          href="https://femzyk.my.canva.site/femzyk"
          target="_blank"
          rel="noopener noreferrer"
          className="kv-secondary"
        >
          Visit the original portfolio <ArrowUpRight size={16} aria-hidden />
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </aside>
      <Intro
        label="SELECTED WORK"
        title="Explore the work behind the claims"
        copy="Explore education software, fleet operations, document processing and desktop applications through real project captures and case studies."
      />
      <div className="kv-bottom">
        <Work expanded />
      </div>
    </div>
  );
}
