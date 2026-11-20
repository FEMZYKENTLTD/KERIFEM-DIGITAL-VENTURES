import Section from '@/components/ui/Section';
import SectionHeading from '@/components/ui/SectionHeading';
import { StaggerGroup, StaggerItem } from '@/components/ui/Reveal';
import { WHY_US } from '@/lib/content';
import { BRAND } from '@/lib/site';

export default function WhyUs() {
  return (
    <Section id="why-us" divided className="bg-[#0A0A0A]">
      <SectionHeading
        id="why-us-title"
        eyebrow="The difference"
        title={`Why Choose ${BRAND.name}`}
        lead="A senior-level partner across the disciplines that usually require three separate vendors."
      />

      <StaggerGroup className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.07] sm:grid-cols-2 lg:grid-cols-3">
        {WHY_US.map((item) => (
          <StaggerItem
            key={item.title}
            className="group relative bg-[#0B0B0B] p-7 transition-colors duration-500 hover:bg-graphite sm:p-8"
          >
            <span className="text-gold transition-transform duration-500 ease-luxury group-hover:-translate-y-0.5">
              <item.icon className="h-7 w-7" strokeWidth={1.3} />
            </span>
            <h3 className="mt-6 font-display text-h3 font-semibold text-white">{item.title}</h3>
            <p className="mt-3 text-pretty text-sm leading-[1.8] text-fog">{item.body}</p>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 h-px w-0 bg-gold/60 transition-all duration-500 ease-luxury group-hover:w-full"
            />
          </StaggerItem>
        ))}
      </StaggerGroup>
    </Section>
  );
}
