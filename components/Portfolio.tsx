import Image from 'next/image';
import { ArrowUpRight, Github } from 'lucide-react';

import Section from '@/components/ui/Section';
import SectionHeading from '@/components/ui/SectionHeading';
import { Reveal, StaggerGroup, StaggerItem } from '@/components/ui/Reveal';
import { CONTACT } from '@/lib/site';
import { PORTFOLIO_NOTE, PROJECTS } from '@/lib/content';

export default function Portfolio() {
  return (
    <Section id="portfolio" divided className="bg-[#0A0A0A]">
      <SectionHeading
        id="portfolio-title"
        eyebrow="Selected projects"
        title="Selected Projects"
        lead="Real solutions we have designed, developed, and deployed."
      />

      <StaggerGroup className="mt-14 grid gap-6 lg:grid-cols-2">
        {PROJECTS.map((project) => (
          <StaggerItem key={project.name}>
            <article className="luxe-card group flex h-full flex-col">
              <div className="relative aspect-[16/9] overflow-hidden border-b border-white/[0.07]">
                {project.image ? (
                  <Image
                    src={project.image}
                    alt={
                      project.imageAlt ??
                      `${project.name} — project screenshot by FEMZYK ENTERPRISES`
                    }
                    fill
                    sizes="(min-width: 1024px) 46rem, 100vw"
                    className="object-cover transition-transform duration-700 ease-luxury group-hover:scale-[1.02]"
                  />
                ) : (
                  <>
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-br from-charcoal via-[#101010] to-ink"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 opacity-70 [background-image:linear-gradient(to_right,rgba(212,175,55,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(212,175,55,0.07)_1px,transparent_1px)] [background-size:36px_36px]"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <span className="font-display text-[4.5rem] font-semibold leading-none tracking-[0.08em] text-gold/70 transition-transform duration-700 ease-luxury group-hover:scale-105 sm:text-[5.5rem]">
                        {project.initials}
                      </span>
                    </div>
                    <span
                      aria-hidden="true"
                      className="absolute bottom-5 left-6 text-[0.6rem] uppercase tracking-[0.28em] text-white/50"
                    >
                      FEMZYK ENTERPRISES
                    </span>
                    <span className="sr-only">
                      Project artwork placeholder — {project.name}. Screenshots are shared on
                      request.
                    </span>
                  </>
                )}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold/45 to-transparent"
                />
              </div>

              <div className="flex flex-1 flex-col p-6 sm:p-8">
                <h3 className="font-display text-h3 font-semibold text-white">{project.name}</h3>
                <p className="mt-3 flex-1 text-pretty text-sm leading-[1.8] text-fog">
                  {project.description}
                </p>

                <ul
                  className="mt-6 flex flex-wrap gap-2"
                  aria-label={`${project.name} technology stack`}
                >
                  {project.tech.map((tech) => (
                    <li key={tech} className="list-none">
                      <span className="chip">{tech}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href={project.repo ?? CONTACT.social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-7 inline-flex items-center gap-2 self-start text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-gold transition-colors duration-300 hover:text-gold-light"
                >
                  <Github className="h-4 w-4" strokeWidth={1.6} />
                  View on GitHub
                  <ArrowUpRight
                    className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    strokeWidth={1.6}
                  />
                  <span className="sr-only">for {project.name} (opens in a new tab)</span>
                </a>
              </div>
            </article>
          </StaggerItem>
        ))}
      </StaggerGroup>

      <Reveal delay={0.1}>
        <p className="mx-auto mt-10 max-w-xl text-center text-sm text-white/55">{PORTFOLIO_NOTE}</p>
      </Reveal>
    </Section>
  );
}
