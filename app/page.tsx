import { faq, processSteps } from '@/lib/commercial';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Globe2 } from 'lucide-react';
import { Capabilities, Quote, SectionTitle, Work } from '@/components/Corporate';
import Workstation from '@/components/Workstation';
import ImmersiveScene from '@/components/ImmersiveScene';

export default function HomePage() {
  return (
    <>
      <section className="kv-wrap kv-hero">
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
        <Workstation />
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
      <section className="kv-wrap studio-statement" aria-labelledby="studio-statement-title">
        <div className="studio-statement-orbit" aria-hidden="true">
          <span>✳</span>
        </div>
        <div>
          <p className="kv-label">THE KERIFEM STUDIO / BUILT WITH PURPOSE</p>
          <h2 id="studio-statement-title">
            Thoughtful by design.
            <br />
            <em>Made to move ideas forward.</em>
          </h2>
        </div>
        <div className="studio-statement-copy">
          <p>
            From the first conversation to the finished product, we bring design, development and
            practical thinking together.
          </p>
          <Link className="kv-text-link" href="/about">
            Get to know us <ArrowRight size={16} aria-hidden />
          </Link>
        </div>
      </section>
      <div className="studio-ticker" aria-hidden="true">
        <div>
          <span>
            SOFTWARE <i>✳</i> WEBSITES <i>✳</i> AUTOMATION <i>✳</i> DESIGN <i>✳</i>{' '}
          </span>
          <span>
            SOFTWARE <i>✳</i> WEBSITES <i>✳</i> AUTOMATION <i>✳</i> DESIGN <i>✳</i>{' '}
          </span>
        </div>
      </div>
      <section className="kv-wrap immersive-section" aria-labelledby="immersive-heading">
        <div className="immersive-copy">
          <p className="kv-label">THE DIGITAL STUDIO / AN INTERACTIVE STUDY</p>
          <h2 id="immersive-heading">
            Ideas are just the <em>beginning.</em>
          </h2>
          <p>
            We connect creative thinking with the technology to bring it to life — from a clear idea
            to a useful digital experience.
          </p>
          <div className="immersive-actions">
            <Link className="kv-button" href="/services">
              Explore our capabilities <ArrowRight size={16} aria-hidden />
            </Link>
            <Link className="kv-text-link" href="/portfolio">
              See the work <ArrowRight size={16} aria-hidden />
            </Link>
          </div>
          <div className="immersive-index" aria-hidden="true">
            <span>01 / THINK</span>
            <span>02 / BUILD</span>
            <span>03 / CONNECT</span>
          </div>
        </div>
        <div className="immersive-visual">
          <ImmersiveScene />
          <div className="immersive-visual-label" aria-hidden="true">
            <span>KERIFEM / DIGITAL FORM</span>
            <span>INTERACTIVE STUDY — 01</span>
          </div>
        </div>
      </section>
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
          <a
            className="kv-founder-inline"
            href="/founder/studio-portrait.webp"
            target="_blank"
            rel="noopener"
            aria-label="Open the full-size portrait of founder Olufemi Benua Keripe in a new tab"
          >
            <Image src="/founder/studio-portrait.webp" width={72} height={72} alt="" sizes="72px" />
            <span>
              <small>FOUNDER / KERIFEM</small>
              <strong>Olufemi Benua Keripe</strong>
              <span>View portrait ↗</span>
            </span>
          </a>
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
          {processSteps.map(([step, brief], index) => (
            <li className="kv-card" key={step}>
              <span className="kv-label">0{index + 1}</span>
              <h4 className="mb-2 mt-2 font-semibold">{step}</h4>
              <p>{brief}</p>
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
