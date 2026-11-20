import Link from 'next/link';
import { Intro } from '@/components/Corporate';
import { services } from '@/lib/services';
import { pageMetadata } from '@/lib/metadata';
export const metadata = pageMetadata(
  'Services & USD Pricing',
  'Custom software, WordPress, AI integrations, API automation, graphics, documentation and technical training.',
  '/services',
);
export default function ServicesPage() {
  return (
    <div className="kv-wrap">
      <Intro
        label="CAPABILITIES / SEVEN OFFERINGS"
        title="Technology that moves businesses forward"
        copy="From custom business software to the design, documentation and training that support it."
      />
      <nav className="kv-links kv-bottom" aria-label="Service sections">
        {services.map(([id, label]) => (
          <Link key={id} href={`#${id}`}>
            {label}
          </Link>
        ))}
        <Link href="#pricing">USD pricing</Link>
      </nav>
      {services.map(([id, label, title, copy, value, tools, items], index) => (
        <section key={id} id={id} className="kv-service">
          <div>
            <p className="kv-label">
              0{index + 1} / {label}
            </p>
            <h2>{title}</h2>
            <p>{copy}</p>
            <p>{value}</p>
            <Link className="kv-button" href={`/contact?service=${id}`}>
              Request a Quote
            </Link>
          </div>
          <div className="kv-card">
            <h3>What we can deliver</h3>
            <ul>
              {items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="kv-stack">{tools}</p>
            <p>
              Focused engagements start at the $100 USD business minimum. This is not a package
              price; scope is quoted individually.
            </p>
          </div>
        </section>
      ))}
      <section className="kv-section" id="pricing">
        <p className="kv-label">INDICATIVE PRICING / USD</p>
        <h2>$100–$10,000+</h2>
        <p className="mt-5 max-w-2xl">
          Entry-level engagements start at $100 USD. Complexity, integrations, delivery requirements
          and support shape the quote. Enterprise work can exceed $10,000; there is no fixed
          maximum.
        </p>
      </section>
    </div>
  );
}
