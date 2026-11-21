'use client';

import { useEffect, useRef, type CSSProperties } from 'react';
import Link from 'next/link';
import {
  ArrowUpRight,
  Check,
  Compass,
  Layers3,
  Map,
  Orbit,
  PenTool,
  Route,
  Sparkles,
  Telescope,
} from 'lucide-react';
import { quoteEditionIndex } from '@/lib/quote-editions';
import type { FormValues } from '@/lib/enquiry';

const editions = [
  [
    'First step',
    'Start with the essentials',
    'We’ll look for a focused deliverable that fits the range you selected.',
    '#f6cb84',
    PenTool,
  ],
  [
    'Focused brief',
    'Make the next step count',
    'We’ll review which priorities can be grouped into a clear first scope.',
    '#a4dcc2',
    Compass,
  ],
  [
    'Clear foundation',
    'Give the project a strong foundation',
    'We’ll review the core requirements and identify what belongs in the first delivery.',
    '#a7cfff',
    Layers3,
  ],
  [
    'Planned build',
    'Turn the brief into a plan',
    'We’ll look at the milestones, dependencies, and decisions that may shape your quote.',
    '#c7b7ff',
    Map,
  ],
  [
    'Connected work',
    'Bring the moving parts together',
    'We’ll review where workflows, integrations, or handover needs could affect the scope.',
    '#9ce5e7',
    Orbit,
  ],
  [
    'Phased delivery',
    'Plan the work in stages',
    'We’ll consider whether phased delivery makes the scope and trade-offs easier to evaluate.',
    '#ffc0a6',
    Route,
  ],
  [
    'Extended scope',
    'Make room for the bigger picture',
    'We’ll review the brief for dependencies, delivery risks, and longer-term support needs.',
    '#e9b5e4',
    Telescope,
  ],
  [
    'Budget discovery',
    'Explore what fits',
    'It’s fine not to have a figure yet. We’ll use your priorities to guide the budget conversation.',
    '#e8de9f',
    Sparkles,
  ],
  [
    'Open brief',
    'Start with the goal',
    'You left the budget open. We’ll review the brief before suggesting how to scope the work.',
    '#c0d1e6',
    ArrowUpRight,
  ],
] as const;

export type Receipt = { values: FormValues; reference: string };

export default function QuoteReceipt({
  receipt,
  onClose,
}: {
  receipt: Receipt;
  onClose: () => void;
}) {
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    heading.current?.focus();
    heading.current?.scrollIntoView({ block: 'start' });
  }, []);
  const { values, reference } = receipt;
  const edition = quoteEditionIndex(values.budget);
  const [label, title, guidance, accent, Icon] = editions[edition];
  const fields = [
    ['Full name', values.name],
    ['Email', values.email],
    ['Phone / WhatsApp', values.phone],
    ['Country', values.country],
    ['Preferred contact', values.contactMethod],
    ['Service', values.service],
    ['Budget (USD)', values.budget],
    ['Timeline', values.timeline],
    ['Project title', values.projectTitle],
    ['Reference link', values.reference],
    ['Project description', values.message],
  ];
  return (
    <section
      aria-labelledby="receipt-title"
      className="kv-receipt"
      style={
        {
          '--receipt-accent': accent,
          '--receipt-angle': `${105 + edition * 17}deg`,
        } as CSSProperties
      }
    >
      <header className="kv-receipt-hero">
        <div className="kv-receipt-mark" aria-hidden="true">
          <Icon size={36} />
        </div>
        <p className="kv-receipt-kicker">
          <Check size={16} aria-hidden="true" /> Quote request received · {label}
        </p>
        <h2 id="receipt-title" tabIndex={-1} ref={heading}>
          Thank you, {values.name}.
        </h2>
        <p>
          {title}. {guidance}
        </p>
        {reference && <p className="kv-receipt-reference">Reference: {reference}</p>}
      </header>
      <div className="kv-receipt-body">
        <h3>Your submission</h3>
        <dl>
          {fields.map(([key, value]) => (
            <div
              key={key}
              className={key === 'Project description' ? 'kv-receipt-wide' : undefined}
            >
              <dt>{key}</dt>
              <dd>{value || 'Not provided'}</dd>
            </div>
          ))}
        </dl>
        <p>
          We’ll review your brief and follow up using your preferred contact method. Your budget
          selection is not a quote or a payment.
        </p>
        <p>
          For your privacy, this summary is only shown here and isn’t kept after you refresh or
          leave this page.
        </p>
        <div className="kv-receipt-actions">
          <button type="button" className="kv-btn" onClick={onClose}>
            Close summary
          </button>
          <Link href="/services">
            Explore services <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
