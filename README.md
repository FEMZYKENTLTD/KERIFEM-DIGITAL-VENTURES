# FEMZYK ENTERPRISES — Website

Premium single-page landing site for **FEMZYK ENTERPRISES**, a SMEDAN-registered Nigerian
digital solutions company working remotely with clients worldwide.

Built with **Next.js 15 (App Router) + TypeScript (strict) + Tailwind CSS + Framer Motion**,
with a **Web3Forms**-powered enquiry form, full Open Graph / Twitter Card / JSON-LD SEO,
auto-generated `sitemap.xml` and `robots.txt`, and placeholder legal pages.

The site is a static-prerendered page (every route compiles to HTML at build time), so it is
fast on any host and works even before the form key is configured.

---

## Table of contents

1. [Quick start](#1-quick-start)
2. [Environment variables](#2-environment-variables)
3. [Web3Forms configuration guide](#3-web3forms-configuration-guide)
4. [Deploying to Vercel](#4-deploying-to-vercel)
5. [Editing content](#5-editing-content)
6. [Adding real project screenshots](#6-adding-real-project-screenshots)
7. [Adding the founder photograph](#7-adding-the-founder-photograph)
8. [Adding real testimonials](#8-adding-real-testimonials)
9. [Brand rules enforced by this codebase](#9-brand-rules-enforced-by-this-codebase)
10. [Project structure](#10-project-structure)
11. [Fonts (self-hosting option)](#11-fonts-self-hosting-option)
12. [Performance, SEO and accessibility notes](#12-performance-seo-and-accessibility-notes)
13. [Pre-launch checklist](#13-pre-launch-checklist)

---

## 1. Quick start

Requires **Node.js 18.18+** (Node 20/22 recommended).

```bash
npm install
cp .env.example .env.local     # then paste your Web3Forms key into it
npm run dev                    # http://localhost:3000
```

Other scripts:

| Command                 | What it does                                        |
| ----------------------- | --------------------------------------------------- |
| `npm run dev`           | Dev server with fast refresh                        |
| `npm run build`         | Production build (also runs ESLint + type checks)   |
| `npm run start`         | Serves the production build locally                 |
| `npm run lint`          | ESLint only                                         |
| `npm run typecheck`     | `tsc --noEmit` only                                 |
| `npm run format`        | Prettier (with Tailwind class sorting)               |

The site works with no `.env.local` at all — the form simply shows a "not connected yet"
notice with WhatsApp/email fallbacks instead of sending.

---

## 2. Environment variables

| Variable                            | Required | Purpose                                                                 |
| ----------------------------------- | -------- | ----------------------------------------------------------------------- |
| `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY`  | yes\*    | Delivers enquiries to `femzykenterprisesltd@gmail.com` (\*only for sending) |
| `NEXT_PUBLIC_SITE_URL`              | yes      | Canonical origin used for `<link rel="canonical">`, Open Graph URLs, `sitemap.xml`, `robots.txt`, JSON-LD. Falls back to `http://localhost:3000`. |

Only these two are used. Set them in `.env.local` for local work and in the host's environment
for production. `.env*` files (other than `.env.example`) are git-ignored.

> **About the `NEXT_PUBLIC_` prefix:** Web3Forms is called directly from the browser, so the key
> is necessarily visible in the client bundle — this is how Web3Forms is designed to work and it
> cannot be used to send mail to anyone but the address you verified. **If the key is ever abused
> (spam volume, unexpected submissions), regenerate it in the Web3Forms dashboard** and update the
> environment variable. No secret keys, tokens, or database credentials exist on this site.

---

## 3. Web3Forms configuration guide

1. Go to <https://web3forms.com> and create a free form.
2. Set the **"Send to"** recipient to `femzykenterprisesltd@gmail.com`
   (add `femzykentltd@gmail.com` as a CC/secondary recipient if you want both inboxes).
3. Copy the generated **Access Key**.
4. Add it to `.env.local`:
   ```
   NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY=1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d
   ```
5. Restart `npm run dev` (Next.js inlines `NEXT_PUBLIC_*` values at build time — a restart is
   mandatory after changing it).
6. Submit the form once and confirm the email arrives; then submit with the honeypot filled
   (`?botcheck=test` in the payload) to confirm spam filtering.

**What the code already handles** (`components/ContactForm.tsx`):

- `access_key`, `subject` ("New Project Enquiry — FEMZYK ENTERPRISES"), `from_name`
  ("FEMZYK ENTERPRISES Website") and the hidden `botcheck` honeypot are sent with every submission.
- `replyto` is set to the visitor's email so the enquiry can be answered from the inbox.
- Zod + React Hook Form validation with per-field error messages, `onTouched` mode, focus jump to
  the first invalid field, disabled submit button while sending, spinner + "Sending…", green success
  message, red error message with a WhatsApp fallback, and a full form reset after success.

**Optional hardening** (recommended later, not required to launch):

- In the Web3Forms dashboard you can enable their captcha/reCAPTCHA protection and a custom
  auto-reply. If you turn on reCAPTCHA v2/v3, add the site key here and pass it as an extra
  payload field (`recaptcha`) in `submitToWeb3Forms()`.
- Restrict the key to your production domain in the Web3Forms settings (allowed-domains list).

---

## 4. Deploying to Vercel

```bash
npm i -g vercel          # once
vercel                   # preview deployment
vercel --prod            # production deployment
```

Or via the dashboard: **Import Project → select this GitHub repo → Framework "Next.js" (detected
automatically) → add the two environment variables for Production/Preview → Deploy.**

Notes:

- Build command `next build`, output directory `.next` — Vercel's Next.js defaults need no changes.
- No server functions, no database, no API routes: everything is static HTML + the third-party form
  API, so cold starts and function limits are irrelevant.
- After the first deploy, set `NEXT_PUBLIC_SITE_URL` to the real domain (e.g. `https://femzyk.com`)
  and redeploy so canonical URLs, OG tags and `sitemap.xml` point at production.
- Add your custom domain in **Settings → Domains**; Vercel provisions TLS automatically.

---

## 5. Editing content

All copy lives in three files — no JSX editing needed for routine updates:

| File             | Contains                                                                     |
| ---------------- | ---------------------------------------------------------------------------- |
| `lib/site.ts`    | Brand name, taglines, emails, WhatsApp numbers, socials, nav links, env reads |
| `lib/content.ts` | Services + detailed scope bullets, why-us, technologies, **projects**, process, founder, testimonials, FAQ, form dropdown options |
| `lib/legal.ts`   | Placeholder privacy / terms / cookie documents                                |

Structured data (JSON-LD for `LocalBusiness`, `Service`, `FAQPage`, `Person`) is **generated from
those same files** by `lib/schema.ts`, so editing copy automatically updates what search engines
read. Contact details appear in the footer, contact section, `mailto:`/`wa.me` links and the
floating WhatsApp button from `lib/site.ts` alone — change it once there.

To change the budget ranges or the "Service Required" options, edit `SERVICE_OPTIONS`,
`BUDGET_OPTIONS` and `CONTACT_METHODS` in `lib/content.ts`; the form, its validation and the
JSON-LD stay in sync.

---

## 6. Adding real project screenshots

Placeholders are deliberate: the site never ships fabricated screenshots or stock imagery.

1. Export a real screenshot, optimise it, and drop it in `public/projects/`:
   ```bash
   mkdir -p public/projects
   # 1600×900 recommended; keep it under ~250 KB
   ```
   Recommended formats: `.webp` (or `.avif`), e.g. `public/projects/femzyk-market.webp`.
2. Reference it in `lib/content.ts` on the matching project:
   ```ts
   {
     name: 'FEMZYK MARKET',
     initials: 'FM',
     image: '/projects/femzyk-market.webp',
     imageAlt: 'FEMZYK MARKET product listing page on a desktop browser',
     description: '…',
     tech: ['Next.js', 'React', 'Tailwind CSS', 'Supabase'],
     repo: 'https://github.com/FEMZYKENTLTD/FeMzYK-MARKET',
   }
   ```
3. That is all. `components/Portfolio.tsx` swaps the initials panel for
   `next/image` (AVIF/WebP-optimised, lazy-loaded, `sizes` set for the 2-column grid) the moment
   `image` is present, and omits the "artwork placeholder" screen-reader note.

Keep `imageAlt` descriptive — it is the only text search engines and screen readers get for the
image. Do not add mockups of features the product does not have.

---

## 7. Adding the founder photograph

The founder section currently renders an "OBK" monogram panel with the caption
*“Professional photograph to be added.”* No AI or stock portrait is used.

1. Save the real photo as `public/founder/olufemi-keripe.webp` (portrait, roughly 4:5,
   1200×1500, under ~200 KB).
2. In `lib/content.ts` change one line:
   ```ts
   export const FOUNDER_PHOTO = '/founder/olufemi-keripe.webp'; // was: null
   ```
3. `components/Founder.tsx` renders it with `next/image`, keeps the gold frame, and drops both the
   monogram and the caption automatically. Update `FOUNDER.photoNote` if you want a credit line.

Alt text is generated from `FOUNDER.name` and `FOUNDER.title` — edit those in the same file if the
title changes.

---

## 8. Adding real testimonials

`TESTIMONIAL_PLACEHOLDERS` in `lib/content.ts` intentionally contains bracketed placeholders —
invented quotes, client names, star ratings and logos are forbidden on this site.

To publish a real one: obtain written permission from the client, then replace an entry with
`{ quote, name, role }`. Quotes longer than ~2 lines read better here; keep the published note
("Testimonials are published with client permission…") in place.

---

## 9. Brand rules enforced by this codebase

Written into the components and content so regressions are visible in review:

- **No corporate suffix.** The UI always renders `FEMZYK ENTERPRISES` (or the `FEMZYK` wordmark).
  "LTD"/"Limited"/"LLC" never appear as part of the brand name — the only `ltd` strings on the site
  are inside the real Gmail addresses.
- **No invented registration numbers, no CAC incorporation claims.** Only
  "SMEDAN-Registered Digital Solutions Provider".
- **Approved CTAs only:** Request a Quote · Start a Project · Start Your Project ·
  Discuss Your Project · Contact FEMZYK · Explore Our Services · Send Enquiry.
  There is no "free consultation / free quote / free assessment" language anywhere; the
  "What happens next" panel states explicitly that scoping discussions are part of the paid project.
- **Software and professional services only.** Hardware sales, repairs and device servicing appear
  only as explicit exclusions (FAQ #1, #5, Terms §1).
- **No fabricated proof.** No invented client names, logos, star ratings, trust badges, awards, or
  statistics ("500+ projects", "99% satisfaction", "10+ years"). Portfolio items describe real
  repositories under <https://github.com/FEMZYKENTLTD> (each `repo` link points at a repository that
  exists), and the "screenshots and demos on request" note stays.
- **Quiet luxury, not gold flood.** Gold (`#D4AF37`) is limited to CTAs, icon accents, hairlines,
  hover states and small highlights on `#080808` / `#1C1C1C` surfaces. No gold gradients, no
  gold-filled blocks, no cartoon or stock imagery.
- **Global positioning** (Nigeria + UK/US/Canada/Europe/Middle East), never "Africa-only".

---

## 10. Project structure

```
app/
  layout.tsx              # metadata (title/OG/Twitter/canonical/robots), fonts, JSON-LD, skip link
  page.tsx                # the 12 landing sections, in order
  globals.css             # Tailwind layers + brand component classes (.btn-primary, .luxe-card, .chip…)
  icon.svg                # favicon (gold F monogram)
  not-found.tsx           # 404
  robots.ts               # → /robots.txt
  sitemap.ts              # → /sitemap.xml
  privacy-policy/page.tsx ├─ each sets its own metadata + canonical
  terms-of-service/page.tsx
  cookie-policy/page.tsx
components/
  Navbar.tsx              # sticky, transparent → blurred solid on scroll, mobile slide-in drawer
  Hero.tsx                # full-height hero, badge, H1, CTAs, animated code panel
  About.tsx  Services.tsx  ServiceDetails.tsx  WhyUs.tsx  Technologies.tsx
  Portfolio.tsx  Process.tsx  Founder.tsx  Testimonials.tsx  Faq.tsx
  Contact.tsx             # two-column contact block
  ContactForm.tsx         # React Hook Form + Zod + Web3Forms
  Footer.tsx  WhatsAppFloat.tsx
  ui/                     # Section, SectionHeading, Reveal (motion), Wordmark, LegalPage
  icons/SocialIcons.tsx   # Lucide social icons + inline WhatsApp/X glyphs
  seo/JsonLd.tsx
lib/
  site.ts  content.ts  schema.ts  legal.ts  utils.ts
public/
  og.png (1200×630)  apple-icon.png  projects/  founder/
tailwind.config.ts        # brand colours, type scale, keyframes, custom utilities
```

Section anchors — `#top`, `#hero`, `#about`, `#services`, `#services-detail`, `#why-us`,
`#technologies`, `#portfolio`, `#process`, `#founder`, `#testimonials`, `#faq`, `#contact`,
`#footer` — are stable and used by the nav, the footer and the JSON-LD. Each service also has its own
deep link (`#wordpress`, `#ai-automation`, …) that opens the matching accordion panel, so you can
share a link straight to one capability.

---

## 11. Fonts

Playfair Display (headings) and Poppins (body) are loaded from the Google Fonts CDN with
`display=swap` in `app/layout.tsx`, with fallbacks declared in `app/globals.css`
(`Georgia, serif` and `Inter, Lato, system-ui, sans-serif`), so first paint never blocks and the
layout still looks right if the CDN is unreachable.

For a self-hosted, zero-third-party-request setup (recommended once you deploy), replace those
`<link>` tags with `next/font`:

```tsx
// app/layout.tsx
import { Playfair_Display, Poppins } from 'next/font/google';

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair', display: 'swap' });
const poppins = Poppins({ subsets: ['latin'], weight: ['300', '400', '500', '600'], variable: '--font-poppins', display: 'swap' });
```

then set `--font-display: var(--font-playfair)` / `--font-sans: var(--font-poppins)` in
`globals.css`, and add `className={`${playfair.variable} ${poppins.variable}`}` to `<html>`.
`next/font` downloads and self-hosts the files at build time — no runtime request to Google, no
layout shift, and it removes the one third-party request from the privacy table.

---

## 12. Performance, SEO and accessibility notes

- **Static prerender.** `npm run build` shows every route as `○ (Static)`; HTML ships complete, so
  Lighthouse/SEO crawlers see full content with no JS.
- **Budget.** One shared JS chunk set (~103 kB) + ~45 kB for the page. Framer Motion and Lucide are
  trimmed with `experimental.optimizePackageImports`; only icons used are bundled.
- **Animations** are `transform`/`opacity` only, `viewport={{ once: true }}`, and fully neutralised by
  `prefers-reduced-motion` (both a CSS guard and `useReducedMotion()` in the components).
- **Images**: `next/image` with AVIF/WebP negotiation; hero and section backdrops are pure CSS (grid +
  one radial wash + a 120-byte inline SVG noise pattern) — no image requests at all.
- **Metadata**: one H1, ordered H2/H3 nesting, Open Graph + Twitter Card, canonical, `en_NG` locale,
  `sitemap.xml`, `robots.txt`, `theme-color`, and JSON-LD (`LocalBusiness`/`ProfessionalService`,
  `WebSite`, 7 × `Service`, `FAQPage`, `Person`, plus `BreadcrumbList` on legal pages).
- **Accessibility**: skip link, semantic `header/nav/main/section/footer`, `aria-labelledby` on every
  section, labelled form controls with `aria-invalid` + `aria-describedby`, `role="status"`/`role="alert"`
  on submission feedback, visible gold focus rings, 48px minimum tap targets, all
  `target="_blank"` links carry `rel="noopener noreferrer"` plus "(opens in a new tab)" in their
  accessible name, and body copy is contrast-checked to ≥ 4.5:1 on `#080808`.
- Run `npx lighthouse http://localhost:3000 --view` after deploy; targets are 90+ Performance,
  95+ Accessibility, 90+ SEO. Nothing in this build blocks those numbers.

---

## 13. Pre-launch checklist

- [ ] `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` set on Vercel, test submission received at
      `femzykenterprisesltd@gmail.com`
- [ ] `NEXT_PUBLIC_SITE_URL` set to the production domain, then redeploy
- [ ] Legal pages reviewed and personalised with a legal professional (all three are placeholders
      by design and say so on-page)
- [ ] Portfolio screenshots and the founder photograph added (§6, §7)
- [ ] At least one real testimonial with written client permission (§8)
- [ ] Optional: self-host the fonts (§11)
- [ ] Optional: enable Web3Forms domain restriction + captcha (§3)
- [ ] Verify in [Google Rich Results Test](https://search.google.com/test/rich-results) and submit
      `https://yourdomain/sitemap.xml` in Search Console
