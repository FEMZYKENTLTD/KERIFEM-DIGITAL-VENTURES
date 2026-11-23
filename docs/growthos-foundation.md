# GrowthOS foundation: audit and deployment

## Audit baseline

Next.js 15 / React 19 App Router. Public pages include home, about, services and service details, portfolio and project details, contact and thank-you, legal pages, robots and sitemap. The quote API validates the request, saves to `enquiries` using a server-only service-role key, then records the Brevo notification result; a failed notification does not remove the enquiry. The owner workspace uses Supabase Auth and `requireOwner`, which verifies the confirmed owner email server-side. Existing admin routes include sign-in, recovery, account, enquiries, enquiry detail and bin. Middleware refreshes sessions; individual pages and actions enforce authorization. The live Supabase schema inspected on 2026-11-23 contained `public.enquiries` with RLS enabled. Vercel is connected to the existing Next.js project; production is on main. No production changes or deployment were made by this work.

## Setup

1. Back up the database and test `supabase/migrations/20261123000000_growthos_foundation.sql` in an isolated Supabase project first. It creates independent prospects and audit tables; it does not alter enquiries. It is not applied automatically by Next.js.
2. Configure the existing server-only `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY` for owner authentication. Keep the existing `SUPABASE_SERVICE_ROLE_KEY`, `BREVO_API_KEY`, `BREVO_SENDER_EMAIL`, and other enquiry settings unchanged. GrowthOS uses the authenticated owner client, not the service-role key. No new environment variables are required.
3. Verify the confirmed owner account specified in `lib/admin-auth.ts` matches the migration's owner policy. The database policy checks the authoritative `auth.users` record. Existing owner credentials are managed outside this repository.
4. In preview, confirm unauthenticated redirects, owner access, creation/editing/stage changes, audit records and RLS using a non-owner account. Then apply the reviewed migration through the deployment process and deploy the current branch as appropriate. Do not point preview tests at production data.

## Current capability and limitations

The foundation supports manual prospect entry and editing, unverified business email and source recording, search, stage filters, pagination, manual pipeline changes, a transactional activity log and current-stage analytics. Counts are exact database counts; errors are shown as unavailable. It is a single-owner system, not multi-user RBAC. Audit entries capture the authenticated user ID and timestamp; the UI does not yet display the actor. There is no deletion UI.

This is **not** the complete GrowthOS requested. Discovery providers, email verification, AI, service matching, CSV import, tasks, campaigns, sending, scheduling, suppression enforcement, inbox/reply processing, conversion intelligence, and revenue tracking are not implemented. A suppressed stage is a manual CRM label only, not an enforceable suppression list. No email can be sent by GrowthOS. Do not use the existing transactional Brevo sender for outreach. Before implementing sending, choose a compliant dedicated provider, configure a separate sending identity and SPF/DKIM/DMARC, build explicit review and approval, enforce opt-outs, suppression and bounce handling, rate limits and idempotency, and verify provider acceptance semantics. Treat external content as untrusted and retain evidence for any AI-generated claims. No provider credentials should be placed in client code.

Production validation of quote storage, Brevo delivery, authenticated CRUD and RLS requires an appropriately isolated configured environment and has not been performed by the local unconfigured tests. A successful build is not proof of live integrations.

## Delivery report

### Routes

- New: `/admin` (owner-only redirect to the existing enquiry inbox); `/admin/growth-os`; `/admin/growth-os/prospects`; `/admin/growth-os/prospects/new`; `/admin/growth-os/prospects/[id]`; `/admin/growth-os/pipeline`; `/admin/growth-os/analytics`; `/admin/growth-os/settings`.
- Existing public and admin routes remain in place, including `/`, `/about`, `/services`, `/services/[service]`, `/portfolio`, `/portfolio/[project]`, `/contact`, `/contact/thank-you/[edition]`, the legal pages, `/api/enquiry`, `/admin/enquiries`, `/admin/enquiries/[id]`, `/admin/enquiries/bin`, `/admin/sign-in`, `/admin/recover`, `/admin/callback`, and `/admin/account`.
- There are no inbox, campaign, outreach, or intelligence routes in this foundation because their workflows do not yet exist.

### Verification performed

- Baseline: TypeScript, ESLint and site-guide checks passed before changes.
- After changes: production build, TypeScript, ESLint, guide checks, and `node --experimental-strip-types scripts/growthos-check.mjs` passed. The latter checks valid input, empty names, non-HTTP URLs, invalid email, length limits, and unique stage keys.
- On an unconfigured local production server, the existing smoke test passed public-route, 404, enquiry validation and unconfigured-enquiry checks. Unauthenticated requests to `/admin`, `/admin/enquiries`, and every new GrowthOS page tested redirected to sign-in. A TypeScript check run concurrently with the production build encountered transient missing `.next/types` files; the subsequent sequential check passed.
- Not tested: actual enquiry persistence or Brevo delivery, authenticated GrowthOS CRUD, RLS against a second user, migration execution, responsive browser layouts, configured provider integrations or production deployment. These require an isolated configured environment and further testing before release. The local preview has no owner credentials or database configuration and therefore only shows the sign-in flow.
- Security review covered server-side owner checks in layouts, pages and actions, RLS and restricted grants in the proposed migration, bounded validated fields, safe URL schemes, React's default text escaping, no browser service-role key, and no sending capability. It is not a complete security audit; rate limiting, CSRF review beyond Next.js Server Action origin protections, broader abuse testing, and database policy verification remain necessary.

### Files changed

- `app/admin/enquiries/page.tsx` — adds the GrowthOS entry point, including the enquiry error state.
- `app/admin/page.tsx` — owner-only redirect to the existing admin inbox.
- `app/admin/growth-os/layout.tsx`, `growth.css`, `page.tsx`, `actions.ts` — isolated shell, dashboard and server actions.
- `app/admin/growth-os/prospects/page.tsx`, `prospects/[id]/page.tsx`, `pipeline/page.tsx`, `analytics/page.tsx`, `settings/page.tsx` — prospect, pipeline, analytics and setup pages.
- `lib/growthos.ts` — bounded prospect validation, types and pipeline stages.
- `supabase/migrations/20261123000000_growthos_foundation.sql` — new tables, owner policies and activity triggers, not yet applied.
- `scripts/growthos-check.mjs` — validation checks.
- `docs/growthos-foundation.md` — audit, setup, limitations and this report.
