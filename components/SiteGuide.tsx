'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { MessageCircle, X } from 'lucide-react';
import { faq, processSteps } from '@/lib/commercial';
import { reviewedGuideAnswers, reviewedGuideMatch } from '@/lib/guide-answers';
import { searchGuide, type GuideResult } from '@/lib/guide-search';
import { serviceDetails } from '@/lib/service-details';
import { services } from '@/lib/services';

const serviceAliases = {
  software: 'desktop application internal tool approvals spreadsheet permissions',
  web: 'website wordpress wordpress site ecommerce storefront landing page responsive mobile publishing',
  ai: 'ai model prompt extraction evaluation human review',
  automation: 'api webhook integration sync synchronise synchronize retry duplicate reports',
  design: 'graphics canva branding banner slides campaign',
  writing: 'copywriting ghostwriting technical documentation handover writing',
  training: 'training lessons exercises teaching coaching learn',
} as const;

const serviceTopics = services.map(([slug, name, , summary, outcome, , examples]) => ({
  slug,
  terms: `${name} ${examples.join(' ')} ${serviceAliases[slug]}`,
  answer: `${summary} ${outcome} Examples: ${examples.slice(0, 3).join('; ')}.`,
  href: `/services/${slug}`,
  label: `Explore ${name}`,
}));

function serviceAnswer(question: string, href?: string): GuideAnswer | undefined {
  const service = serviceTopics.find((topic) => topic.href === href);
  if (!service) return;
  const [, discovery, method, deliverables, example] = serviceDetails[service.slug];
  const parts = [];
  if (/\b(deliverables?|receive|get|included|handover|provide)\b/i.test(question))
    parts.push(`What you receive: ${deliverables}`);
  if (/\b(discovery|require|requirements|need from me|prepare|start)\b/i.test(question))
    parts.push(`Getting started: ${discovery}`);
  if (/\b(how|approach|process|test|testing|work|handle|steps)\b/i.test(question))
    parts.push(method);
  if (/\b(examples?|use cases?|suitable)\b/i.test(question)) parts.push(`Example: ${example}`);
  return parts.length ? { ...service, answer: parts.join('\n\n') } : undefined;
}
const topics = [
  {
    terms: 'quote quotation request form walkthrough apply submit enquiry',
    answer:
      'Choose a service, describe what you want to achieve, select a timeline, and add your preferred contact method. Budget and reference link are optional. The site shows a private summary after your enquiry is saved.',
    href: '/contact',
    label: 'Open Request a Quote',
  },
  {
    terms: 'budget cost pricing price charge minimum rates dollar money usd',
    answer:
      'Focused engagements start at $100 USD. The published $100–$10,000+ range is indicative, not a cap or a quote. Scope, complexity, integrations, timing, and support affect the final price.',
    href: '/services',
    label: 'See services and pricing',
  },
  {
    terms: 'process steps how work stages engagement',
    answer: processSteps.map(([label], i) => `${i + 1}. ${label}`).join('\n'),
    href: '/',
    label: 'See how we work',
  },
  {
    terms: 'portfolio projects samples examples case studies',
    answer:
      'The portfolio contains screenshot-backed case studies with context about what each project demonstrates.',
    href: '/portfolio',
    label: 'View the portfolio',
  },
  ...serviceTopics,
  ...faq.map(([question, answer]) => ({
    terms: question,
    answer,
    href: '/contact',
    label: 'Request a Quote',
  })),
];
const stop = new Set([
  'a',
  'an',
  'the',
  'what',
  'how',
  'can',
  'do',
  'you',
  'your',
  'i',
  'we',
  'it',
  'to',
  'is',
  'for',
  'and',
  'about',
  'please',
  'me',
  'my',
  'in',
  'of',
  'this',
  'that',
  'with',
]);
function tokens(text: string) {
  return [...new Set(text.toLowerCase().match(/[a-z0-9]+/g) || [])].filter(
    (word) => !stop.has(word),
  );
}
function pick(question: string) {
  const words = tokens(question);
  const ranked = topics
    .map((topic) => {
      const keys = tokens(topic.terms);
      return { topic, score: words.filter((word) => keys.includes(word)).length };
    })
    .sort((a, b) => b.score - a.score);
  const [best, runnerUp] = ranked;
  return best?.score && best.score > (runnerUp?.score ?? 0) ? best.topic : undefined;
}

type GuideAnswer = { answer: string; href?: string; label?: string; related?: GuideResult[] };

export default function SiteGuide() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const [history, setHistory] = useState<{ question: string; response: GuideAnswer }[]>([]);
  const [lastTopic, setLastTopic] = useState<GuideAnswer>();
  const trigger = useRef<HTMLButtonElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const log = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (open) input.current?.focus();
  }, [open]);
  useEffect(() => {
    if (log.current) log.current.scrollTop = log.current.scrollHeight;
  }, [history]);
  if (pathname.startsWith('/admin') || pathname.startsWith('/contact/thank-you')) return null;

  function ask(question: string) {
    const query = question.trim();
    if (!query) return;
    const sensitive =
      /\b[^\s@]+@[^\s@]+\.[^\s@]+\b|(?:\d[\s().+-]*){7,}|\b(?:password|passcode|secret key|api key)\b/i.test(
        query,
      );
    const reviewed = sensitive ? undefined : reviewedGuideMatch(query);
    const results = sensitive || reviewed ? [] : searchGuide(query);
    const [primary, ...related] = results;
    const match = sensitive ? undefined : reviewed || pick(query);
    const indexed = primary
      ? { answer: primary.answer, href: primary.href, label: `Source: ${primary.title}`, related }
      : undefined;
    const contextual =
      !sensitive && (!match || match.href.startsWith('/services/'))
        ? serviceAnswer(query, match?.href ?? lastTopic?.href ?? pathname)
        : undefined;
    const topic = reviewed || contextual || indexed || match;
    const followUp =
      !sensitive && !topic && /\b(more|next|start|proceed|details)\b/i.test(query)
        ? lastTopic
        : undefined;
    const response: GuideAnswer = sensitive
      ? {
          answer:
            'Please don’t enter contact details, passwords, or sensitive information here. Use the quote form for project enquiries.',
          href: '/contact',
          label: 'Open private enquiry form',
        }
      : topic ||
        (followUp
          ? {
              answer:
                'Start with the page for the topic we were discussing. When you’re ready, share your goal, timeline, and relevant requirements through Request a Quote.',
              href: followUp.href,
              label: followUp.label,
            }
          : {
              answer:
                'I couldn’t find a reliable answer in the website guide. Try asking about pricing, WordPress, software, automation, timelines, or the quote process.',
              href: '/contact',
              label: 'Ask Kerifem directly',
            });
    if (topic) setLastTopic(topic);
    setHistory((previous) => [
      ...previous.slice(-11),
      { question: sensitive ? 'Sensitive details omitted' : query, response },
    ]);
    setDraft('');
  }
  function submit(event: FormEvent) {
    event.preventDefault();
    ask(draft);
  }
  function close() {
    setOpen(false);
    trigger.current?.focus();
  }

  return (
    <aside className="kv-guide" aria-label="Website help">
      {open && (
        <section
          id="kv-guide-panel"
          className="kv-guide-panel"
          aria-labelledby="kv-guide-title"
          onKeyDown={(event) => {
            if (event.key === 'Escape') close();
          }}
        >
          <header>
            <div>
              <strong id="kv-guide-title">Kerifem site guide</strong>
              <p>Instant answers from the website</p>
            </div>
            <button type="button" onClick={close} aria-label="Close site guide">
              <X size={20} />
            </button>
          </header>
          <div className="kv-guide-log" role="log" aria-live="polite" ref={log}>
            <p>
              Ask about services, pricing, or how to request a quote. Please don’t share personal or
              confidential details.
            </p>
            {history.map(({ question, response }, index) => (
              <div key={index}>
                <p className="kv-guide-question">{question}</p>
                <p>{response.answer}</p>
                {response.href && (
                  <Link href={response.href} onClick={() => setOpen(false)}>
                    {response.label}
                  </Link>
                )}
                {Boolean(response.related?.length) && (
                  <details>
                    <summary>Other matching pages</summary>
                    <ul>
                      {response.related?.map((result) => (
                        <li key={result.href}>
                          <Link href={result.href} onClick={() => setOpen(false)}>
                            {result.title}
                          </Link>
                          <p>{result.answer}</p>
                        </li>
                      ))}
                    </ul>
                  </details>
                )}
              </div>
            ))}
          </div>
          {history.length === 0 && (
            <div className="kv-guide-prompts">
              {[
                'How do I request a quote?',
                ...reviewedGuideAnswers.slice(0, 2).map(({ question }) => question),
              ].map((question) => (
                <button type="button" key={question} onClick={() => ask(question)}>
                  {question}
                </button>
              ))}
            </div>
          )}
          <form onSubmit={submit}>
            <input
              ref={input}
              value={draft}
              maxLength={240}
              onChange={(event) => setDraft(event.target.value)}
              aria-label="Your question"
              placeholder="Ask about Kerifem…"
            />
            <button disabled={!draft.trim()}>Send</button>
          </form>
          <footer>
            <small>Website guide · chat stays in this tab</small>
            <button
              type="button"
              onClick={() => {
                setHistory([]);
                setLastTopic(undefined);
                setDraft('');
                input.current?.focus();
              }}
            >
              Clear chat
            </button>
          </footer>
        </section>
      )}
      <button
        type="button"
        ref={trigger}
        className="kv-guide-toggle"
        aria-expanded={open}
        aria-controls={open ? 'kv-guide-panel' : undefined}
        onClick={() => (open ? close() : setOpen(true))}
      >
        <MessageCircle size={20} aria-hidden="true" /> Site help
      </button>
    </aside>
  );
}
