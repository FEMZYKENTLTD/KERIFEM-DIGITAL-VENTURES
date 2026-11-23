# GrowthOS intelligence milestone — delivery and setup

This report describes the original milestone; see [connected infrastructure verification](growthos-connected-preview.md) for subsequent database changes. This extends the Phase 1 owner-only CRM; it is **not** the complete autonomous platform. The public website, quote endpoint, enquiry storage and Brevo transactional notifications are unchanged. No production migration or deployment was performed.

## What is implemented

- **CSV import:** owner-only upload of up to 100 records / 64 KiB, header and field validation, atomic database import, conservative duplicate skipping by matching name/location, website or email, and no overwrites. It does not verify contacts. Variations can evade detection, shared contact details can cause false positives, and concurrent manual creation can still create duplicates. Review imports; only import data you are entitled to use.
- **Evidence library:** manually entered observations, provider-supplied information or inferences with timestamps and source links. Observations and provider claims require a source URL. An observation is owner-reported, not automatically verified. The app does not fetch or audit the source.
- **Service-matching agent:** a single, narrowly scoped OpenAI Chat Completions integration uses the published KERIFEM service catalogue and the latest 20 evidence records. Strict JSON output is validated server-side and recommendation evidence IDs must match the saved input snapshot. Confidence is qualitative; recommendations and citations require human review. Evidence, industry, location and business name are transmitted to OpenAI after the owner explicitly starts a run. Do not enter sensitive or unnecessary personal data. A prompt treats source content as untrusted, but prompting and ID validation cannot guarantee that prose is truthful or immune to prompt injection. There are no tools, sends or automatic CRM changes.
- **Run controls:** persisted input snapshot, status, model, timestamp, provider token usage when available, generic error code and audit event. Runs are limited in the database to one start per minute and 10 per rolling 24 hours per owner, with only one active at a time; stale runs are failed when another start is attempted after five minutes. Requests time out after 20 seconds. No automatic retries; the owner can try again after the limit allows it. Currency costs are not calculated because pricing can vary. The provider endpoint has been tested with a mock only, not with a real key.
- **Follow-up tasks:** create a prospect-linked task with optional due date, mark done or reopen, inspect recent tasks, and see an exact count of open tasks due today or earlier on the overview (UTC). These are reminders, not scheduled jobs or email automation. The list is limited to 100 tasks and prospect selector to the first 200 alphabetically.

## Routes

New routes: `/admin/growth-os/prospects/import`, `/admin/growth-os/prospects/[id]/intelligence`, and `/admin/growth-os/tasks`. The prospect profile links to its intelligence page and the sidebar links to tasks. Existing routes remain in place; see the [Phase 1 report](growthos-foundation.md) for the full list. All new pages and actions check the confirmed owner server-side.

## Database changes and setup

For a separate test project, apply in order:

1. `supabase/migrations/20261123000000_growthos_foundation.sql`
2. `supabase/migrations/20261123010000_growthos_intelligence.sql`
3. `supabase/migrations/20261123020000_growthos_csv_import.sql`
4. `supabase/migrations/20261123030000_growthos_function_privileges.sql`

The second adds `growth_evidence`, `growth_tasks`, `growth_agent_runs`, RLS, audit triggers and owner-only run functions. The third adds an owner-only atomic import function. Changes are independent of the enquiries table. Owner RLS checks the authoritative confirmed Supabase user matching the existing owner email. The owner-specific database functions and application auth checks must be updated together if the account changes. No migration is applied automatically by Next.js.

Existing `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY` are needed for the owner session and GrowthOS data. Existing service-role and Brevo variables remain required for their existing enquiry functions, not for GrowthOS. Optionally configure server-only `OPENAI_API_KEY` and `GROWTHOS_OPENAI_MODEL` (defaults to `gpt-4o-mini`) for the service-matching integration. A compatible model with structured JSON schema support and paid account access is needed. A configured key indicator is not a successful provider connection test. Keep keys out of browser bundles and repositories; configure separate preview credentials and control provider spending. Do not point test environments at production data.

Test all migrations, owner and non-owner access, import, task and research flows, actual provider behavior, privacy and costs in an isolated project. Obtain explicit authorization before applying production migrations or deploying to production. Back up the database and perform a security review first. Changes exist only on the working branch until separately committed/deployed.

## Discovery provider evaluation

No business-discovery API is implemented or configured. Google Places Text Search is a documented option with field-based billing and international coverage, but [Google's Places policies](https://developers.google.com/maps/documentation/places/web-service/policies) restrict storage, extraction and derived use of Places content; verify current terms and attribution before selecting it for a persistent CRM. The [Text Search documentation](https://developers.google.com/maps/documentation/places/web-service/text-search) explains field masks and pricing implications. Public Nominatim is not a suitable bulk prospect source: its [usage policy](https://operations.osmfoundation.org/policies/nominatim/) prohibits systematic POI downloads and restricts bulk requests. Select a provider with appropriate Nigeria and international coverage and explicit licensing for lead storage and commercial outreach; confirm current pricing and coverage with the provider. CSV and manual entry are the only discovery inputs currently available.

## Tests and security review

- `npm run build`, `npm run typecheck`, `npm run lint`, `npm run test:growthos`, `npm run test:guide`, and the unconfigured public-route/enquiry smoke test passed. Unauthenticated requests to the new routes redirected to sign-in.
- `test:growthos` tests validation, mock provider success and failure, evidence-ID and duplicate-service rejection, CSV parsing, and all three migrations against in-memory PGlite Postgres with simulated Supabase auth. It verifies owner access, non-owner RLS, audit events, one-running-job rate limiting, idempotent run completion and import rollback/deduplication. This is **not** a real Supabase integration test.
- Not yet tested: authenticated application flows in real Supabase, true provider calls, real email sending, browser responsiveness, live quote/Brevo delivery and production deployment. No screenshots of authenticated pages are available without an owner session.
- Security controls include server-side owner checks, RLS, limited grants, constrained inputs and file size, source scheme checks, bounded model responses, explicit provider consent, no AI tools, no sending and database-backed run limits. Supabase provider policies, server-action CSRF behavior, production rate limits outside the AI run, prompt injection defenses, secret management and the full threat model still need independent verification.
- `npm audit --omit=dev` reported 3 production advisories: one moderate and two high, involving the existing Next.js nested PostCSS and Zod dependencies. They remain release blockers for investigation; major upgrades may affect existing website behavior and were not made blindly. Check current advisories and test fixes before release.

## Remaining work

The other requested agents and orchestration, real prospect discovery and website research, contact discovery/verification, outreach drafting and approval, outbound provider connection and sending, scheduling, delivery events, suppression enforcement, connected inbox and replies, campaigns, configurable automation, meetings, proposals, opportunities/revenue and advanced conversion analytics are **not implemented**. There is no automatic email capability. A prospect's suppressed stage is not an enforceable suppression list. No claim of production readiness, successful provider connection or deployment is made.
