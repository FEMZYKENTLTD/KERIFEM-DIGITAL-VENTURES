import Image from 'next/image';
import { Intro, Quote } from '@/components/Corporate';
import { pageMetadata } from '@/lib/metadata';
export const metadata = pageMetadata(
  'About',
  'The FEMZYK story and the direction of KERIFEM DIGITAL VENTURES.',
  '/about',
);
export default function AboutPage() {
  return (
    <div className="kv-wrap">
      <Intro
        label="COMPANY / OUR STORY"
        title="The story behind KERIFEM DIGITAL VENTURES"
        copy="We build practical digital systems for teams worldwide."
      />
      <section className="kv-credentials" aria-labelledby="registration-title">
        <p className="kv-label">BUSINESS RECORDS</p>
        <h2 id="registration-title">Business Registration & Official Credentials</h2>
        <div className="kv-credential-grid">
          <article>
            <p className="kv-label">Corporate Affairs Commission (CAC)</p>
            <h3>KERIFEM DIGITAL VENTURES</h3>
            <p>Registered business name</p>
            <a href="/credentials/cac.webp" className="kv-certificate">
              <Image
                src="/credentials/cac.webp"
                width={1041}
                height={1347}
                alt="CAC business name certificate, with sensitive details redacted"
              />
            </a>
          </article>
          <article>
            <p className="kv-label">
              Small and Medium Enterprises Development Agency of Nigeria (SMEDAN)
            </p>
            <h3>FEMZYK ENTERPRISES LTD</h3>
            <p>Registered name · separate registration</p>
            <a href="/credentials/smedan.webp" className="kv-certificate">
              <Image
                src="/credentials/smedan.webp"
                width={2025}
                height={1432}
                alt="SMEDAN registration certificate, with QR codes redacted"
              />
            </a>
          </article>
        </div>
        <p className="kv-credential-note">
          These are separately issued records. Click either certificate to enlarge the public copy.
          Sensitive fields and QR codes are redacted; original PDFs are not published.
        </p>
      </section>
      <div className="kv-story">
        <section>
          <p className="kv-label">2023 / FEMZYK</p>
          <h2>Where the work began</h2>
          <Image
            className="mt-4 rounded"
            src="/brand/femzyk.webp"
            width={450}
            height={190}
            sizes="220px"
            style={{ width: 220, height: 'auto' }}
            alt="FEMZYK ENTERPRISES LTD legacy logo"
          />
          <p>
            FEMZYK originated in 2023. The name still appears in public repositories and projects,
            including FEMZYK MARKET and the Knowledge Land CBT Suite. Those projects show an early
            focus on turning specific operational needs into usable software.
          </p>
        </section>
        <section>
          <p className="kv-label">TODAY / KERIFEM</p>
          <h2>Our primary business identity</h2>
          <p>
            KERIFEM DIGITAL VENTURES is the CAC-registered business name. The separate SMEDAN record
            uses FEMZYK ENTERPRISES LTD. FEMZYK remains part of our brand history and portfolio.
            Formal wording about the relationship between the names should be reviewed before use in
            legal documents.
          </p>
        </section>
        <section>
          <p className="kv-label">FOUNDER</p>
          <h2>Meet the Founder</h2>
          <h3 className="mt-3 text-xl">Olufemi Benua Keripe · Founder & Lead Developer</h3>
          <p>
            Olufemi Benua Keripe is the founder and is credited as lead developer of the Knowledge
            Land CBT Suite. The direction for KERIFEM DIGITAL VENTURES is to pair hands-on
            engineering with documentation and support so the people who rely on a system can
            understand and maintain it.
          </p>
          <ul className="mt-5 list-disc pl-5">
            <li>
              Lagos State University: Computer Science, final-year undergraduate studies in
              progress.
            </li>
            <li>University of the People: Bachelor of Computer Science studies in progress.</li>
            <li>3MTT AI & Machine Learning Programme: Graduate.</li>
          </ul>
        </section>
        <section>
          <p className="kv-label">ENGINEERING TOOLKIT</p>
          <h2>Technologies we work with</h2>
          <p>
            Java, Python, Go, C#, PHP and TypeScript · React, Next.js and Tailwind CSS · FastAPI,
            Flask and REST APIs · PostgreSQL, SQLite, MongoDB and Supabase · Git, GitHub, Maven and
            Docker.
          </p>
        </section>
        <section>
          <p className="kv-label">MISSION & VISION</p>
          <h2>Make useful technology easier to adopt</h2>
          <p>
            Our mission is to build maintainable software that removes friction from day-to-day
            work. We aim to become a trusted technology partner for businesses, education providers
            and teams modernising manual processes or building a new digital product.
          </p>
        </section>
        <section>
          <p className="kv-label">HOW WE WORK</p>
          <h2>Clarity, care and accountability</h2>
          <p>
            Start with the workflow and the people using it. Agree on scope before building, make
            trade-offs visible and document what is delivered. We’re developing deeper AI
            integration capabilities around scoped prototypes, with human review where the output
            matters.
          </p>
          <Quote />
        </section>
      </div>
    </div>
  );
}
