'use client';

import { ArrowRight } from 'lucide-react';

import Section from '@/components/ui/Section';
import SectionHeading from '@/components/ui/SectionHeading';
import { StaggerGroup, StaggerItem } from '@/components/ui/Reveal';
import { SERVICES } from '@/lib/content';
import { requestServiceDetail } from '@/lib/utils';

export default function Services() {
  return (
    <Section id="services" divided>
      <SectionHeading
        id="services-title"
        eyebrow="Capabilities"
        title="Our Services"
        lead="Comprehensive digital solutions tailored to your unique requirements."
      />

      <StaggerGroup as="ul" className="mt-14 grid list-none gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map((service, index) => (
          <StaggerItem key={service.slug} as="li" className="list-none">
            <article className="luxe-card group flex h-full flex-col p-6 sm:p-7">
              <span className="flex h-12 w-12 items-center justify-center rounded-lg border border-gold/25 bg-gold/[0.07] text-gold transition-colors duration-500 group-hover:bg-gold/15">
                <service.icon className="h-6 w-6" strokeWidth={1.5} />
              </span>

              <h3 className="mt-6 text-h3 font-semibold text-white">{service.title}</h3>

              <p className="mt-3 flex-1 text-pretty text-sm leading-[1.75] text-fog">
                {service.blurb}
              </p>

              <a
                href="#services-detail"
                onClick={() => requestServiceDetail(service.slug)}
                className="mt-7 inline-flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-gold transition-colors duration-300 hover:text-gold-light"
                aria-label={`Learn more about ${service.title}`}
              >
                Learn More
                <ArrowRight
                  className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
                  strokeWidth={1.8}
                />
              </a>

              <span
                aria-hidden="true"
                className="pointer-events-none absolute bottom-0 left-0 h-px w-0 bg-gold/70 transition-all duration-500 ease-luxury group-hover:w-full"
              />
              <span className="sr-only">
                Service {index + 1} of {SERVICES.length}.
              </span>
            </article>
          </StaggerItem>
        ))}
      </StaggerGroup>

      <p className="mt-10 text-center text-[0.75rem] uppercase tracking-[0.2em] text-white/50">
        Every engagement is scoped individually — no off-the-shelf packages
      </p>
    </Section>
  );
}
