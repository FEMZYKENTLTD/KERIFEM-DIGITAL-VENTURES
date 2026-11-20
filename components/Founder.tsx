import Image from 'next/image';

import Section from '@/components/ui/Section';
import SectionHeading from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { FOUNDER, FOUNDER_PHOTO } from '@/lib/content';

export default function Founder() {
  return (
    <Section id="founder" divided>
      <SectionHeading id="founder-title" eyebrow="Leadership" title="Meet the Founder" />

      <div className="mt-14 grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-4">
          <figure className="mx-auto w-full max-w-[19rem]">
            {FOUNDER_PHOTO ? (
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-gold/35 shadow-gold-ring">
                <Image
                  src={FOUNDER_PHOTO}
                  alt={`${FOUNDER.name}, ${FOUNDER.title} at FEMZYK ENTERPRISES`}
                  fill
                  sizes="(min-width: 1024px) 19rem, 90vw"
                  className="object-cover"
                />
              </div>
            ) : (
              <div
                aria-hidden="true"
                className="relative flex aspect-[4/5] items-center justify-center overflow-hidden rounded-2xl border border-gold/35 bg-gradient-to-br from-[#161616] via-[#0D0D0D] to-ink shadow-gold-ring"
              >
                <span className="absolute inset-0 opacity-60 [background-image:linear-gradient(to_right,rgba(212,175,55,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(212,175,55,0.06)_1px,transparent_1px)] [background-size:32px_32px]" />
                <span className="relative font-display text-6xl font-semibold tracking-[0.12em] text-gold">
                  {FOUNDER.initials}
                </span>
                <span className="absolute bottom-5 text-[0.58rem] uppercase tracking-[0.28em] text-white/50">
                  Portrait pending
                </span>
              </div>
            )}
            <figcaption className="mt-4 flex items-center gap-2 text-center text-[0.72rem] text-white/50">
              <span aria-hidden="true" className="mx-auto h-px w-6 bg-gold/50" />
              {FOUNDER.photoNote}
              <span aria-hidden="true" className="mx-auto h-px w-6 bg-gold/50" />
            </figcaption>
          </figure>
        </Reveal>

        <div className="lg:col-span-8">
          <Reveal>
            <h3 className="font-display text-[clamp(1.6rem,1.2rem+1.4vw,2.3rem)] font-semibold text-white">
              {FOUNDER.name}
            </h3>
            <p className="mt-2.5 text-[0.72rem] font-medium uppercase tracking-[0.22em] text-gold">
              {FOUNDER.title}
            </p>
          </Reveal>

          <div className="mt-8 space-y-5">
            {FOUNDER.bio.map((paragraph, index) => (
              <Reveal key={index} delay={index * 0.06}>
                <p className="text-pretty text-[0.95rem] leading-[1.85] text-fog">{paragraph}</p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.12}>
            <ul
              className="mt-9 flex flex-wrap gap-2.5 border-t border-white/[0.07] pt-8"
              aria-label={`${FOUNDER.name} — credentials and expertise`}
            >
              {FOUNDER.credentials.map((credential) => (
                <li key={credential} className="list-none">
                  <span className="chip rounded-full px-3.5 py-1.5">{credential}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
