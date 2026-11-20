import Section from '@/components/ui/Section';
import SectionHeading from '@/components/ui/SectionHeading';
import { Reveal, StaggerGroup, StaggerItem } from '@/components/ui/Reveal';
import { TECHNOLOGY_GROUPS } from '@/lib/content';
import { REGION_LABEL } from '@/lib/site';

export default function Technologies() {
  return (
    <Section id="technologies">
      <SectionHeading
        id="technologies-title"
        eyebrow="Stack"
        title="Technologies We Work With"
        lead="Chosen for the job, not for the logo. Every project gets the stack that fits its scale, budget, and maintenance reality."
      />

      <div className="mt-14 space-y-5">
        {TECHNOLOGY_GROUPS.map((group, groupIndex) => (
          <Reveal key={group.label} delay={groupIndex * 0.05}>
            <div className="rounded-xl border border-white/[0.07] bg-[#0B0B0B] p-6 sm:p-7">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-5">
                <h3 className="shrink-0 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-gold">
                  {group.label}
                </h3>
                <span aria-hidden="true" className="hidden h-px flex-1 bg-white/[0.07] sm:block" />
              </div>

              <StaggerGroup stagger={0.035} className="mt-5 flex flex-wrap gap-2.5">
                {group.items.map((item) => (
                  <StaggerItem key={item}>
                    <span className="chip transition-colors duration-300 hover:border-gold/60 hover:text-white">
                      {item}
                    </span>
                  </StaggerItem>
                ))}
              </StaggerGroup>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.15}>
        <p className="mt-8 text-center text-[0.72rem] uppercase tracking-[0.2em] text-white/50">
          Delivery across {REGION_LABEL}
        </p>
      </Reveal>
    </Section>
  );
}
