import ThemeToggle from './ThemeToggle';
import { cases } from '@/lib/cases';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Github, Mail, MessageCircle } from 'lucide-react';
import { services } from '@/lib/services';
import { work } from '@/lib/corporate';
import { BRAND, CONTACT } from '@/lib/site';

export function Quote() {
  return (
    <Link className="kv-button" href="/contact">
      Request a Quote <ArrowUpRight size={16} aria-hidden />
    </Link>
  );
}
export function Intro({ label, title, copy }: { label: string; title: string; copy: string }) {
  return (
    <header className="kv-intro">
      <p className="kv-label">{label}</p>
      <h1>{title}</h1>
      <p>{copy}</p>
    </header>
  );
}
export function CorporateNav() {
  return (
    <header className="kv-nav" id="top">
      <div className="kv-wrap kv-nav-inner">
        <Link href="/" className="kv-brand">
          <Image
            className="kv-brand-logo"
            src="/brand/kerifem.webp"
            width={438}
            height={150}
            sizes="(max-width: 760px) 156px, 180px"
            alt="KERIFEM DIGITAL VENTURES"
          />
        </Link>
        <nav aria-label="Main navigation">
          {[
            ['Home', '/'],
            ['About', '/about'],
            ['Services', '/services'],
            ['Portfolio', '/portfolio'],
            ['Contact', '/contact'],
          ].map(([label, href]) => (
            <Link key={href} href={href}>
              {label}
            </Link>
          ))}
        </nav>
        <div className="kv-nav-actions">
          <ThemeToggle />
          <Quote />
        </div>
      </div>
    </header>
  );
}
export function CorporateFooter() {
  return (
    <footer className="kv-footer">
      <div className="kv-wrap">
        <div className="kv-footer-top">
          <a href="#top" className="kv-footer-brand" aria-label="Back to top">
            <Image src="/brand/kerifem-mark.webp" width={144} height={136} sizes="44px" alt="" />
            <div>
              <strong>{BRAND.name}</strong>
              <p>Digital solutions. Intelligent systems. Real-world impact.</p>
            </div>
          </a>
          <div className="kv-links">
            <a href={CONTACT.social.github}>
              <Github size={16} aria-hidden />
              GitHub
            </a>
            <a href={CONTACT.social.x}>X</a>
            <a href={`mailto:${CONTACT.email.primary}`}>
              <Mail size={16} aria-hidden />
              Email
            </a>
            <a href={CONTACT.whatsapp.primary.href}>
              <MessageCircle size={16} aria-hidden />
              WhatsApp
            </a>
          </div>
        </div>
        <div className="kv-footer-bottom">
          <Link href="/admin/sign-in">Admin sign in</Link>
          <span>
            © {new Date().getFullYear()} {BRAND.name}
          </span>
          <div className="kv-links">
            <Link href="/privacy-policy">Privacy</Link>
            <Link href="/terms-of-service">Terms</Link>
            <Link href="/cookie-policy">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
export function Capabilities() {
  return (
    <div className="kv-grid">
      {services.map(([id, label, , copy], index) => (
        <article className="kv-card" key={id}>
          <p className="kv-label">0{index + 1} / SERVICE</p>
          <h3>{label}</h3>
          <p>{copy}</p>
          <Link className="kv-text-link mt-4" href={`/services/${id}`}>
            Explore {label} <ArrowUpRight size={14} aria-hidden />
          </Link>
        </article>
      ))}
    </div>
  );
}
export function Work({ expanded = false }: { expanded?: boolean }) {
  return (
    <div className={expanded ? 'kv-gallery' : 'kv-grid'}>
      {work.slice(0, expanded ? work.length : 3).map((project, index) => (
        <article className="kv-card kv-project" key={project.title}>
          <div className="kv-project-content">
            <p className="kv-label">{project.category}</p>
            <h3>{project.title}</h3>
            <p>{project.copy}</p>
            <p className="kv-stack">{project.stack}</p>
            <a className="kv-text-link" href={project.repo}>
              View source <ArrowUpRight size={15} aria-hidden />
            </a>
            <Link className="kv-text-link ml-4" href={`/portfolio/${cases[index].id}`}>
              Case study <ArrowUpRight size={15} aria-hidden />
            </Link>
          </div>
          <div className={expanded ? 'kv-shot-grid' : ''}>
            {project.shots.slice(0, expanded ? project.shots.length : 1).map(([src, caption]) => (
              <figure key={src}>
                <a
                  className="kv-project-image"
                  href={src}
                  aria-label={`Open screenshot: ${caption}`}
                >
                  <Image src={src} alt={caption} fill sizes="(max-width: 760px) 90vw, 390px" />
                </a>
                <figcaption>{caption}</figcaption>
              </figure>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}
export function SectionTitle({
  label,
  title,
  href,
  link,
}: {
  label: string;
  title: string;
  href?: string;
  link?: string;
}) {
  return (
    <div className="kv-section-title">
      <div>
        <p className="kv-label">{label}</p>
        <h2>{title}</h2>
      </div>
      {href && (
        <Link className="kv-text-link" href={href}>
          {link}
          <ArrowRight size={16} aria-hidden />
        </Link>
      )}
    </div>
  );
}
