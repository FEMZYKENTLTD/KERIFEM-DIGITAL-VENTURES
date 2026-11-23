# GrowthOS connected infrastructure verification

## Project and database

The connected Supabase project named **Kerifem Enquiries** matches the project reference in this repository's example configuration. Its initial public schema contained the existing RLS-protected `enquiries` table and no GrowthOS tables. The existing confirmed owner account was present. The corresponding Vercel project is `kerifem-digital-ventures`, linked to this repository.

On explicit owner authorization, the following additive migrations were applied through the Supabase integration on 2026-11-23:

- `growthos_foundation` (remote version `20261123185421`)
- `growthos_intelligence` (remote version `20261123185452`)
- `growthos_csv_import` (remote version `20261123185503`)
- `growthos_function_privileges` (remote version `20261123185719`)

Repository migration filenames are ordered separately from the remote versions. The existing enquiry table was not altered. Before migration, there were four enquiry rows. GrowthOS policies were listed after migration and restrict authenticated access to the confirmed owner. An explicit fourth migration removed Supabase default anonymous function EXECUTE grants; metadata checks confirmed anonymous EXECUTE is now denied for all GrowthOS functions. The enquiry row count remained four afterwards.

A SQL transaction on the actual database exercised owner-claim prospect creation, editing and pipeline stage, evidence, task creation and completion, a failed agent run, atomic import and duplicate skipping, audit entries, and denial when the claim is empty. The transaction was rolled back to avoid test data. This is not an authenticated end-to-end browser session, a cross-request persistence test, a real AI call, or a test with a real non-owner account. Those require further verification.

## Preview configuration

The existing preview environment contains Supabase URL and enquiry/Brevo settings. Branch-scoped `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY` were configured for this branch, using the identified project and its publishable key. No OpenAI credential was available in the Vercel configuration. The OpenAI service-matching code therefore remains unconfigured and has not been tested against the real provider. Outbound email and inbox integrations are not implemented. No production deployment was requested or performed.

## Credential-handling incident

The connected Supabase configuration and API-key listing responses returned sensitive credential material in connector output. Values are deliberately not recorded here. Coordinate rotation of the affected SMTP credential and legacy service-role credential with corresponding Supabase and Vercel configuration updates; do not rotate blindly in a way that interrupts live enquiries or authentication. Review access/audit logs and consider the connector response history exposed to conversation participants.

## Remaining work

The full autonomous platform is not complete. Business discovery, contact verification, outreach, sending, suppression enforcement, inbox, campaigns, automation and advanced analytics remain unimplemented. Existing code and tests are documented in `growthos-intelligence.md` (which is historical about its original deployment status). No AI or email provider has been connected or verified in this work. End-to-end owner authentication, browser CRUD, real provider calls, the public enquiry-to-Brevo journey and mobile layouts remain to be verified on the deployed preview.
