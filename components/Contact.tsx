import { ArrowUpRight, Github, Mail, MapPin, MessageCircle } from 'lucide-react';

import ContactForm from '@/components/ContactForm';
import Section from '@/components/ui/Section';
import SectionHeading from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { GitHubIcon, WhatsAppGlyph, XIcon } from '@/components/icons/SocialIcons';
import { BRAND, CONTACT } from '@/lib/site';

const NEXT_STEPS = [
  {
    label: 'We review your brief',
    body: 'Every enquiry is read by the founder — not routed to a sales queue.',
  },
  {
    label: 'We reply within 24 hours',
    body: 'With clarifying questions and an honest view on fit and feasibility.',
  },
  {
    label: 'You get a written scope',
    body: 'Deliverables, timeline, and project-based pricing before anything starts.',
  },
];

export default function Contact() {
  return (
    <Section id="contact" divided className="bg-[#0A0A0A]">
      <SectionHeading
        id="contact-title"
        eyebrow="Start your project"
        title="Start Your Project"
        lead="Tell us about your requirements and we will respond within 24 hours."
      />

      <div className="mt-14 grid gap-6 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-7">
          <ContactForm />
        </div>

        <div className="lg:col-span-5">
          <div className="flex h-full flex-col gap-5">
            <Reveal>
              <div className="rounded-xl border border-white/[0.07] bg-[#0B0B0B] p-6 sm:p-7">
                <h3 className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-gold">
                  Direct contact
                </h3>

                <ul className="mt-6 space-y-5">
                  <li>
                    <a
                      href={`mailto:${CONTACT.email.primary}`}
                      className="group flex items-start gap-4 rounded-lg p-1 transition-colors"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gold/25 bg-gold/[0.06] text-gold">
                        <Mail className="h-4 w-4" strokeWidth={1.6} />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[0.68rem] uppercase tracking-[0.16em] text-white/50">
                          Email (primary)
                        </span>
                        <span className="block truncate text-sm text-white/90 group-hover:text-gold">
                          {CONTACT.email.primary}
                        </span>
                        <span className="block text-xs text-white/55">
                          {CONTACT.email.secondary}
                        </span>
                      </span>
                    </a>
                  </li>

                  <li>
                    <a
                      href={CONTACT.whatsapp.primary.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-start gap-4 rounded-lg p-1"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gold/25 bg-gold/[0.06] text-gold">
                        <WhatsAppGlyph className="h-4 w-4" />
                      </span>
                      <span>
                        <span className="block text-[0.68rem] uppercase tracking-[0.16em] text-white/50">
                          WhatsApp (primary)
                        </span>
                        <span className="block text-sm text-white/90 group-hover:text-gold">
                          {CONTACT.whatsapp.primary.display}
                        </span>
                        <span className="block text-xs text-white/55">
                          Alternative: {CONTACT.whatsapp.secondary.display}
                        </span>
                      </span>
                      <ArrowUpRight
                        className="ml-auto mt-1 h-4 w-4 shrink-0 text-white/50 transition-colors group-hover:text-gold"
                        strokeWidth={1.6}
                      />
                    </a>
                  </li>

                  <li className="flex items-start gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gold/25 bg-gold/[0.06] text-gold">
                      <MapPin className="h-4 w-4" strokeWidth={1.6} />
                    </span>
                    <span>
                      <span className="block text-[0.68rem] uppercase tracking-[0.16em] text-white/50">
                        Location
                      </span>
                      <span className="block text-sm text-white/90">{CONTACT.location}</span>
                      <span className="block text-xs text-white/55">{CONTACT.deliveryModel}</span>
                    </span>
                  </li>
                </ul>

                <div className="mt-6 flex items-center justify-between gap-4 border-t border-white/[0.07] pt-5">
                  <p className="flex items-center gap-2 text-xs text-white/55">
                    <MessageCircle className="h-3.5 w-3.5 text-gold/70" strokeWidth={1.6} />
                    Alternative line: {CONTACT.whatsapp.secondary.display}
                  </p>
                  <a
                    href={CONTACT.whatsapp.secondary.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-gold transition-colors hover:text-gold-light"
                  >
                    Open chat
                  </a>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="rounded-xl border border-white/[0.07] bg-[#0B0B0B] p-6 sm:p-7">
                <h3 className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-gold">
                  What happens next
                </h3>
                <ol className="mt-5 space-y-4">
                  {NEXT_STEPS.map((step, index) => (
                    <li key={step.label} className="flex gap-4">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-gold/35 font-display text-[0.7rem] text-gold">
                        {index + 1}
                      </span>
                      <span>
                        <span className="block text-sm font-medium text-white/90">
                          {step.label}
                        </span>
                        <span className="mt-0.5 block text-xs leading-relaxed text-white/55">
                          {step.body}
                        </span>
                      </span>
                    </li>
                  ))}
                </ol>
                <p className="mt-6 text-xs leading-relaxed text-white/50">
                  All engagements are scoped and priced individually. {BRAND.name} does not offer
                  free consultations, quotes, or assessments — the discovery discussion is part of
                  the scoped project.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.14}>
              <div className="flex flex-col gap-4 rounded-xl border border-gold/20 bg-gold/[0.04] p-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-white">Prefer to see the code first?</p>
                  <p className="mt-1 text-xs text-white/50">
                    Browse public repositories from recent projects.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <a
                    href={CONTACT.social.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary !min-h-[44px] !px-4 !py-2 text-xs"
                    aria-label="FEMZYK ENTERPRISES on GitHub (opens in a new tab)"
                  >
                    <GitHubIcon className="h-4 w-4" />
                    GitHub
                  </a>
                  <a
                    href={CONTACT.social.x}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary !min-h-[44px] !px-4 !py-2 text-xs"
                    aria-label="FEMZYK ENTERPRISES on X, formerly Twitter (opens in a new tab)"
                  >
                    <XIcon className="h-4 w-4" />X
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      <Reveal delay={0.1}>
        <p className="mt-8 flex flex-wrap items-center justify-center gap-2 text-center text-xs text-white/50">
          <Github className="h-3.5 w-3.5" strokeWidth={1.6} aria-hidden="true" />
          Public work: {CONTACT.social.github.replace('https://', '')}
        </p>
      </Reveal>
    </Section>
  );
}
