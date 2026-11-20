import Section from '@/components/ui/Section';
import SectionHeading from '@/components/ui/SectionHeading';
import { Reveal, StaggerGroup, StaggerItem } from '@/components/ui/Reveal';
import { ABOUT_HIGHLIGHTS, ABOUT_PARAGRAPHS } from '@/lib/content';
import { BRAND } from '@/lib/site';

export default function About() {
  return (
    <Section id="about">
      <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <SectionHeading
              id="about-title"
              align="left"
              eyebrow="Who we are"
              title={`About ${BRAND.name}`}
            />
            <Reveal delay={0.1}>
              <p className="mt-8 border-l border-gold/45 pl-5 font-display text-xl italic leading-relaxed text-white/80 sm:text-2xl">
                “{BRAND.secondaryTagline}”
              </p>
            </Reveal>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="space-y-6">
            {ABOUT_PARAGRAPHS.map((paragraph, index) => (
              <Reveal key={index} delay={index * 0.07}>
                <p
                  className={
                    index === 0
                      ? 'text-pretty text-lede font-light text-white/90'
                      : 'text-pretty text-base leading-[1.85] text-fog'
                  }
                >
                  {paragraph}
                </p>
              </Reveal>
            ))}
          </div>

          <StaggerGroup className="mt-12 grid gap-px overflow-hidden rounded-xl border border-white/[0.07] bg-white/[0.07] sm:grid-cols-2">
            {ABOUT_HIGHLIGHTS.map((highlight) => (
              <StaggerItem
                key={highlight.label}
                className="group flex items-center gap-4 bg-[#0C0C0C] px-5 py-6 transition-colors duration-500 hover:bg-graphite"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-gold/25 bg-gold/[0.07] text-gold transition-transform duration-500 ease-luxury group-hover:-translate-y-0.5">
                  <highlight.icon className="h-5 w-5" strokeWidth={1.5} />
                </span>
                <span className="text-sm font-medium leading-snug text-white/85">
                  {highlight.label}
                </span>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </div>
    </Section>
  );
}
