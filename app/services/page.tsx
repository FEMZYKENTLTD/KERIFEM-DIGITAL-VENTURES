import { Capabilities, Intro, Quote } from '@/components/Corporate';
import { pageMetadata } from '@/lib/metadata';
export const metadata = pageMetadata(
  'Services',
  'Software engineering, websites, AI integration, automation and technical education.',
  '/services',
);
export default function ServicesPage() {
  return (
    <div className="kv-wrap">
      <Intro
        label="CAPABILITIES"
        title="Technology that fits your work"
        copy="From customer-facing websites to the workflows and APIs behind them. We agree on scope, integrations and handover before development."
      />
      <Capabilities detailed />
      <div className="kv-section">
        <Quote />
      </div>
    </div>
  );
}
