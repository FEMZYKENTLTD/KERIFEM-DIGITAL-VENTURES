import { faq, processSteps } from '@/lib/commercial';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Globe2 } from 'lucide-react';
import { Capabilities, Quote, SectionTitle, Work } from '@/components/Corporate';

export default function HomePage() {
  return (
    <>
      <section className="kv-wrap kv-hero" id="top">
        <div className="kv-hero-copy">
          <p className="kv-label">
            <span className="kv-dot" /> TECHNOLOGY & DIGITAL SOLUTIONS
          </p>
          <h1>
            Digital solutions.
            <br />
            <em>Intelligent systems.</em>
          </h1>
          <p>
            KERIFEM DIGITAL VENTURES builds software, websites and connected workflows that help
            teams work better and serve their customers.
          </p>
          <div className="kv-actions">
            <Quote />
            <Link className="kv-secondary" href="/portfolio">
              Explore Our Work <ArrowRight size={16} aria-hidden />
            </Link>
          </div>
        </div>
        <figure className="kv-hero-figure">
          <div className="kv-portrait-board">
            <Image
              src="/founder/obsidian-portrait.webp"
              width={1458}
              height={1114}
              alt="Portrait of Olufemi Benua Keripe in a brass-edged obsidian frame on a slate platform"
              priority
              sizes="(max-width: 760px) 94vw, (max-width: 1300px) 48vw, 600px"
            />
          </div>
          <figcaption>
            <span>FIG. 01 / KERIFEM</span>
            <span>OLUFEMI BENUA KERIPE / FOUNDER</span>
          </figcaption>
        </figure>
      </section>
      <div className="kv-strip">
        <div className="kv-wrap">
          <span>
            <Globe2 size={16} aria-hidden /> Available to US, European and international clients
          </span>
          <span>
            Software <i /> Web <i /> AI & Automation
          </span>
        </div>
      </div>
      <section className="kv-wrap kv-section" id="services">
        <SectionTitle
          label="01 / CAPABILITIES"
          title="What we build"
          href="/services"
          link="Explore services"
        />
        <Capabilities />
      </section>
      <section className="kv-wrap kv-section" id="portfolio">
        <SectionTitle
          label="02 / SELECTED WORK"
          title="Built for real problems"
          href="/portfolio"
          link="View portfolio"
        />
        <Work />
      </section>
      <section className="kv-wrap kv-section kv-split" id="about">
        <div>
          <p className="kv-label">03 / COMPANY</p>
          <h2>From FEMZYK to KERIFEM DIGITAL VENTURES</h2>
        </div>
        <div>
          <p>
            Our story began with FEMZYK in 2023. Today, KERIFEM DIGITAL VENTURES is our primary
            CAC-registered business name. Founder Olufemi Benua Keripe leads the work. The separate
            SMEDAN record uses FEMZYK ENTERPRISES LTD.
          </p>
          <Link className="kv-text-link" href="/about">
            Read our story <ArrowRight size={16} aria-hidden />
          </Link>
        </div>
      </section>
      <section className="kv-wrap kv-section">
        <SectionTitle label="DELIVERY" title="Why work with us?" />
        <p className="mb-6 max-w-3xl text-white/75">
          We design around your workflow, build for the right platform, and document what you
          receive. From Java and Go desktop apps to Next.js web applications, Python APIs and
          relational databases, the tooling follows the problem.
        </p>
        <h3 className="mb-4 text-xl">How we work</h3>
        <ol className="kv-grid">
          {processSteps.map((step, index) => (
            <li className="kv-card" key={step}>
              <span className="kv-label">0{index + 1}</span>
              <p>{step}</p>
            </li>
          ))}
        </ol>
      </section>
      <section className="kv-wrap kv-section kv-faq">
        <SectionTitle label="ANSWERS" title="Frequently asked questions" />
        {faq.map(([question, answer]) => (
          <details key={question}>
            <summary>{question}</summary>
            <p>{answer}</p>
          </details>
        ))}
      </section>
      <section className="kv-wrap kv-section kv-split" id="contact">
        <div>
          <p className="kv-label">04 / ENQUIRIES</p>
          <h2>What are you building?</h2>
        </div>
        <div>
          <p>
            Tell us what you need and where you’re starting. We’ll use your brief to discuss scope,
            timing and a quote.
          </p>
          <Quote />
        </div>
      </section>
    </>
  );
}
