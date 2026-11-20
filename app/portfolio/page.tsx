import { Intro, Work } from '@/components/Corporate';
import { pageMetadata } from '@/lib/metadata';
export const metadata = pageMetadata(
  'Portfolio',
  'Explore the public source behind selected software and automation projects.',
  '/portfolio',
);
export default function PortfolioPage() {
  return (
    <div className="kv-wrap">
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
