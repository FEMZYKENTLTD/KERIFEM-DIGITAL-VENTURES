import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Github, Mail, MessageCircle } from 'lucide-react';
import { capabilities, work } from '@/lib/corporate';
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
    <header className="kv-nav">
      <div className="kv-wrap kv-nav-inner">
        <Link href="/" className="kv-brand">
          <span className="kv-mark" aria-hidden>
            K
          </span>
          <span>
            KERIFEM<small>DIGITAL VENTURES</small>
          </span>
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
        <Quote />
      </div>
    </header>
  );
}
export function CorporateFooter() {
  return (
    <footer className="kv-footer">
      <div className="kv-wrap">
        <div className="kv-footer-top">
          <div>
            <strong>{BRAND.name}</strong>
            <p>Digital solutions. Intelligent systems. Real-world impact.</p>
          </div>
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
export function Capabilities({ detailed = false }: { detailed?: boolean }) {
  return (
    <div className="kv-grid">
      {capabilities.map(({ icon: Icon, title, copy, details }, i) => (
        <article className="kv-card" key={title}>
          <div className="kv-card-head">
            <Icon size={24} strokeWidth={1.5} aria-hidden />
            <span>0{i + 1}</span>
          </div>
          <h3>{title}</h3>
          <p>{copy}</p>
          {detailed && (
            <>
              <ul>
                {details.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
              {i === 2 && <p className="kv-label">Scoped integration & prototyping</p>}
            </>
          )}
        </article>
      ))}
    </div>
  );
}
export function Work({ expanded = false }: { expanded?: boolean }) {
  return (
    <div className={expanded ? 'kv-gallery' : 'kv-grid'}>
      {work.slice(0, expanded ? work.length : 3).map((project) => (
        <article className="kv-card kv-project" key={project.title}>
          <div className="kv-project-content">
            <p className="kv-label">{project.category}</p>
            <h3>{project.title}</h3>
            <p>{project.copy}</p>
            <p className="kv-stack">{project.stack}</p>
            <a className="kv-text-link" href={project.repo}>
              View source <ArrowUpRight size={15} aria-hidden />
            </a>
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
