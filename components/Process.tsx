import Section from '@/components/ui/Section';
import SectionHeading from '@/components/ui/SectionHeading';
import { StaggerGroup, StaggerItem } from '@/components/ui/Reveal';
import { PROCESS_STEPS } from '@/lib/content';

export default function Process() {
  return (
    <Section id="process">
      <SectionHeading
        id="process-title"
        eyebrow="Method"
        title="How We Work"
        lead="A five-stage engagement model built for remote delivery: clear checkpoints, no surprises, documented handover."
      />

      {/*
        A <ol> may only contain <li>, so the decorative timeline rails live on a
        wrapper element: vertical on mobile, horizontal from `lg` up.
      */}
      <div className="relative mt-16">
        <span
          aria-hidden="true"
          className="absolute bottom-6 left-[1.375rem] top-6 w-px bg-gradient-to-b from-gold/55 via-white/[0.12] to-transparent lg:hidden"
        />
        <span
          aria-hidden="true"
          className="absolute left-0 right-0 top-[1.375rem] hidden h-px bg-gradient-to-r from-gold/55 via-white/[0.12] to-transparent lg:block"
        />

        <ol className="grid gap-12 lg:grid-cols-5 lg:gap-7">
          {PROCESS_STEPS.map((step, index) => (
            <StaggerItem key={step.title} as="li" className="relative list-none pl-16 lg:pl-0">
              <span className="relative z-10 flex h-11 w-11 items-center justify-center rounded-full border border-gold/45 bg-ink font-display text-base font-semibold text-gold lg:mb-8">
                {index + 1}
              </span>
              <h3 className="font-display text-lg font-semibold leading-snug text-white">
                <span className="mr-2 text-[0.62rem] uppercase tracking-[0.24em] text-gold/70">
                  Step {String(index + 1).padStart(2, '0')}
                </span>
                <span className="block">{step.title}</span>
              </h3>
              <p className="mt-3 text-pretty text-sm leading-[1.8] text-fog">{step.body}</p>
            </StaggerItem>
          ))}
        </ol>
      </div>

      <StaggerGroup className="mt-16">
        <StaggerItem>
          <div className="flex flex-col items-center gap-4 rounded-xl border border-gold/20 bg-gold/[0.04] px-6 py-7 text-center sm:flex-row sm:justify-between sm:text-left">
            <p className="text-sm text-white/80 sm:text-base">
              Ready to scope your project? Start with a discovery discussion.
            </p>
            <a href="#contact" className="btn-primary shrink-0 px-7">
              Start a Project
            </a>
          </div>
        </StaggerItem>
      </StaggerGroup>
    </Section>
  );
}
