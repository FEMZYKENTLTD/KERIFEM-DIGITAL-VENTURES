import { Quote } from 'lucide-react';

import Section from '@/components/ui/Section';
import SectionHeading from '@/components/ui/SectionHeading';
import { StaggerGroup, StaggerItem } from '@/components/ui/Reveal';
import { TESTIMONIAL_NOTE, TESTIMONIAL_PLACEHOLDERS } from '@/lib/content';

/**
 * Placeholder cards only — nothing here is invented. Real quotes are added to
 * `lib/content.ts` after we have written client permission (see README).
 */
export default function Testimonials() {
  return (
    <Section id="testimonials" className="bg-[#0A0A0A]">
      <SectionHeading id="testimonials-title" eyebrow="Client feedback" title="Client Feedback" />

      <StaggerGroup className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {TESTIMONIAL_PLACEHOLDERS.map((testimonial, index) => (
          <StaggerItem key={index}>
            <figure className="luxe-card flex h-full flex-col p-7">
              <Quote
                className="h-7 w-7 shrink-0 text-gold/70"
                strokeWidth={1.3}
                aria-hidden="true"
              />
              <blockquote className="mt-6 flex-1 font-display text-lg italic leading-relaxed text-white/70">
                {testimonial.quote}
              </blockquote>
              <figcaption className="mt-7 border-t border-white/[0.07] pt-5">
                <span className="block text-sm font-medium text-white/85">{testimonial.name}</span>
                <span className="mt-1 block text-xs text-white/50">{testimonial.role}</span>
              </figcaption>
            </figure>
          </StaggerItem>
        ))}
      </StaggerGroup>

      <p className="mt-10 text-center text-sm text-white/50">{TESTIMONIAL_NOTE}</p>
    </Section>
  );
}
