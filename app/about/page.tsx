import Image from 'next/image';
import { aboutContent, founderStudies } from '@/lib/about-content';
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
          <h2>{aboutContent.history.title}</h2>
          <Image
            className="mt-4 rounded"
            src="/brand/femzyk.webp"
            width={450}
            height={190}
            sizes="220px"
            style={{ width: 220, height: 'auto' }}
            alt="FEMZYK ENTERPRISES LTD legacy logo"
          />
          <p>{aboutContent.history.answer}</p>
        </section>
        <section>
          <p className="kv-label">TODAY / KERIFEM</p>
          <h2>{aboutContent.identity.title}</h2>
          <p>{aboutContent.identity.answer}</p>
        </section>
        <section>
          <p className="kv-label">FOUNDER</p>
          <h2>{aboutContent.founder.title}</h2>
          <h3 className="mt-3 text-xl">Olufemi Benua Keripe · Founder & Lead Developer</h3>
          <p>{aboutContent.founder.answer}</p>
          <ul className="mt-5 list-disc pl-5">
            {founderStudies.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
        <section>
          <p className="kv-label">ENGINEERING TOOLKIT</p>
          <h2>{aboutContent.toolkit.title}</h2>
          <p>{aboutContent.toolkit.answer}</p>
        </section>
        <section>
          <p className="kv-label">MISSION & VISION</p>
          <h2>{aboutContent.mission.title}</h2>
          <p>{aboutContent.mission.answer}</p>
        </section>
        <section>
          <p className="kv-label">HOW WE WORK</p>
          <h2>{aboutContent.approach.title}</h2>
          <p>{aboutContent.approach.answer}</p>
          <Quote />
        </section>
      </div>
    </div>
  );
}
