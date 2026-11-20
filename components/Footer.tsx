import { ArrowUpRight } from 'lucide-react';

import Wordmark from '@/components/ui/Wordmark';
import { GitHubIcon, XIcon } from '@/components/icons/SocialIcons';
import { NAV_LINKS, CONTACT, BRAND } from '@/lib/site';
import { SERVICES } from '@/lib/content';

const FOOTER_SERVICES = SERVICES.slice(0, 5);

const LEGAL_LINKS = [
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms of Service', href: '/terms-of-service' },
  { label: 'Cookie Policy', href: '/cookie-policy' },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer id="footer" className="relative border-t border-gold bg-ink">
      {/* 1px gold top rule, softened at the edges */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent opacity-70"
      />

      <div className="container-shell py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-4">
            <Wordmark size="md" withCaption={false} />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-fog">{BRAND.tagline}</p>
            <p className="mt-3 text-xs uppercase tracking-[0.18em] text-gold/80">
              {BRAND.registration}
            </p>
            <p className="mt-6 font-display text-base italic text-white/50">
              “{BRAND.secondaryTagline}”
            </p>
            <p className="mt-4 text-xs text-white/50">
              {CONTACT.location} · {CONTACT.deliveryModel}
            </p>
          </div>

          {/* Quick links */}
          <nav aria-labelledby="footer-quick-links" className="lg:col-span-2">
            <h2 id="footer-quick-links" className="footer-heading">
              Quick Links
            </h2>
            <ul className="mt-5 space-y-3">
              {NAV_LINKS.filter((link) => link.label !== 'Process').map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="link-underline text-sm text-white/60 transition-colors hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Services */}
          <nav aria-labelledby="footer-services" className="lg:col-span-3">
            <h2 id="footer-services" className="footer-heading">
              Services
            </h2>
            <ul className="mt-5 space-y-3">
              {FOOTER_SERVICES.map((service) => (
                <li key={service.slug}>
                  <a
                    href={`#${service.slug}`}
                    className="link-underline text-sm text-white/60 transition-colors hover:text-white"
                  >
                    {service.title.replace(/ &.*/, '')}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Legal + contact */}
          <div className="lg:col-span-3">
            <h2 className="footer-heading">Legal</h2>
            <ul className="mt-5 space-y-3">
              {LEGAL_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="link-underline text-sm text-white/60 transition-colors hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            <h2 className="footer-heading mt-9">Get in touch</h2>
            <ul className="mt-5 space-y-3">
              <li>
                <a
                  href={`mailto:${CONTACT.email.primary}`}
                  className="link-underline inline-flex items-center gap-1.5 text-sm text-white/60 hover:text-white"
                >
                  {CONTACT.email.primary}
                  <ArrowUpRight className="h-3 w-3" strokeWidth={1.8} aria-hidden="true" />
                </a>
              </li>
              <li>
                <a
                  href={CONTACT.whatsapp.primary.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline text-sm text-white/60 hover:text-white"
                >
                  WhatsApp {CONTACT.whatsapp.primary.display}
                </a>
              </li>
            </ul>

            <a href="#contact" className="btn-secondary mt-7 w-full text-xs sm:w-auto">
              Contact FEMZYK
            </a>
          </div>
        </div>

        <div className="mt-14 flex flex-col-reverse items-center justify-between gap-6 border-t border-white/[0.07] pt-7 sm:flex-row">
          <p className="text-center text-xs text-white/55 sm:text-left">
            © {year} {BRAND.name}. All rights reserved.
          </p>

          <ul className="flex items-center gap-3" aria-label="Social media">
            <li>
              <a
                href={CONTACT.social.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="FEMZYK ENTERPRISES on GitHub (opens in a new tab)"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/60 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/60 hover:text-gold"
              >
                <GitHubIcon className="h-5 w-5" />
              </a>
            </li>
            <li>
              <a
                href={CONTACT.social.x}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="FEMZYK ENTERPRISES on X, formerly Twitter (opens in a new tab)"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/60 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/60 hover:text-gold"
              >
                <XIcon className="h-5 w-5" />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
