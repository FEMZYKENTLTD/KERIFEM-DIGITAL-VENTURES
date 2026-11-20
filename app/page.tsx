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
          <div className="kv-hero-image">
            <Image
              src="/kerifem-hero.jpg"
              alt=""
              fill
              priority
              sizes="(max-width: 760px) 100vw, 52vw"
            />
          </div>
          <figcaption>
            <span>FIG. 01 / KERIFEM</span>
            <span>ENGINEERED FOR IMPACT</span>
          </figcaption>
        </figure>
      </section>
      <div className="kv-strip">
        <div className="kv-wrap">
          <span>
            <Globe2 size={16} aria-hidden /> Nigeria · Available internationally
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
          <h2>From FEMZYK to Kerifem</h2>
        </div>
        <div>
          <p>
            Our story began with FEMZYK in 2023. Today, KERIFEM DIGITAL VENTURES is our primary
            business identity, with a focus on practical engineering and systems people can
            maintain.
          </p>
          <Link className="kv-text-link" href="/about">
            Read our story <ArrowRight size={16} aria-hidden />
          </Link>
        </div>
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
