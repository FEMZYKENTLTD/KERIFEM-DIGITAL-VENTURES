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
        title="From FEMZYK to Kerifem"
        copy="We build practical digital systems for teams in Nigeria and internationally."
      />
      <section className="kv-credentials" aria-labelledby="registration-title">
        <p className="kv-label">BUSINESS RECORDS / NIGERIA</p>
        <h2 id="registration-title">Two separate registrations</h2>
        <div className="kv-credential-grid">
          <article>
            <p className="kv-label">CAC / BUSINESS NAME</p>
            <h3>KERIFEM DIGITAL VENTURES</h3>
            <p>Name shown on the CAC certificate and status report.</p>
          </article>
          <article>
            <p className="kv-label">SMEDAN / REGISTERED NAME</p>
            <h3>FEMZYK ENTERPRISES LTD</h3>
            <p>Name shown on the separate SMEDAN ID.</p>
          </article>
        </div>
        <p className="kv-credential-note">
          Registration summaries only. Original documents and personal details are not published.
        </p>
      </section>
      <div className="kv-story">
        <section>
          <p className="kv-label">2023 / FEMZYK</p>
          <h2>Where the work began</h2>
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
          <h2>Olufemi Benua Keripe</h2>
          <p>
            Olufemi Benua Keripe is the founder and is credited as lead developer of the Knowledge
            Land CBT Suite. The direction for Kerifem is to pair hands-on engineering with
            documentation and support so the people who rely on a system can understand and maintain
            it.
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
