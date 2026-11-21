import Link from 'next/link';
import { notFound } from 'next/navigation';
import { services } from '@/lib/services';
import { serviceDetails } from '@/lib/service-details';
import { pageMetadata } from '@/lib/metadata';

type Props = { params: Promise<{ service: string }> };
export const generateStaticParams = () => services.map(([service]) => ({ service }));
function findService(slug: string) {
  const service = services.find(([id]) => id === slug);
  if (!service) notFound();
  return service;
}
export async function generateMetadata({ params }: Props) {
  const [id, , title, copy] = findService((await params).service);
  return pageMetadata(title, copy, `/services/${id}`);
}
export default async function ServiceDetail({ params }: Props) {
  const [id, label, title, copy, value, tools, items] = findService((await params).service);
  const [promise, discovery, delivery, output, example] = serviceDetails[id];
  return (
    <div className="kv-wrap kv-bottom">
      <header className="kv-intro kv-detail-hero">
        <Link className="kv-text-link" href="/services">
          ← All services
        </Link>
        <p className="kv-label mt-8">KERIFEM / {label}</p>
        <h1>{title}</h1>
        <p>{copy}</p>
        <Link className="kv-button mt-6" href={`/contact?service=${id}`}>
          Discuss your project →
        </Link>
      </header>
      <section className="kv-service">
        <div>
          <p className="kv-label">01 / WHAT THIS SOLVES</p>
          <h2>{promise}</h2>
          <p>{value}</p>
          <p>
            <strong>Example:</strong> {example}
          </p>
        </div>
        <div className="kv-card">
          <h3>What we can help with</h3>
          <ul>
            {items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="kv-stack">{tools}</p>
        </div>
      </section>
      <section className="kv-section">
        <p className="kv-label">02 / HOW WE COME IN</p>
        <h2>From brief to handover</h2>
        <div className="kv-grid mt-6">
          {[
            ['Understand the need', discovery],
            ['Do the work', delivery],
            ['What you receive', output],
          ].map(([heading, text]) => (
            <article key={heading} className="kv-card">
              <h3>{heading}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="kv-section kv-split">
        <div>
          <p className="kv-label">03 / NEXT STEP</p>
          <h2>Get a scoped quote</h2>
        </div>
        <div>
          <p>
            Tell us what you need, your timeline and your budget. Focused engagements start at $100
            USD; we quote based on the agreed scope.
          </p>
          <Link className="kv-button" href={`/contact?service=${id}`}>
            Request a Quote →
          </Link>
        </div>
      </section>
      <nav aria-label="Other services" className="kv-links mt-8">
        {services
          .filter(([slug]) => slug !== id)
          .map(([slug, name]) => (
            <Link key={slug} href={`/services/${slug}`}>
              {name}
            </Link>
          ))}
      </nav>
    </div>
  );
}
