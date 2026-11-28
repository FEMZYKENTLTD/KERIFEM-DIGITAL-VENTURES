# Manager access: staged design, not yet enabled

The current application and GrowthOS database remain owner-only. `lib/admin-permissions.ts` records the proposed fail-closed permission matrix, but is **not** an authorization mechanism until it is connected to verified server sessions and enforced by RLS/RPCs. No manager account or invitation has been created and no migration for manager access has been applied. A **non-deployable draft**, `supabase/staged/manager_access.sql`, and local PGlite test `npm run test:manager-db` model ID-keyed membership, role revocation, audit, and GrowthOS policies. It is intentionally outside the migration directory. These are not connected Auth/PostgREST tests and do not enable managers in the application.

## Intended access

- The current confirmed owner remains the owner. Only the owner can invite, suspend, or remove managers; alter administrator permissions; manage provider connections; delete orders or prospects; or access the owner's account. Managers may work with enquiries, prospects, tasks and research, and manage only their own login credentials. Sending still requires explicit human approval and suppression controls when implemented.
- For orders, both moving an enquiry into the recycle bin and permanent deletion must be owner-only. Managers must not be able to overwrite a protected deletion field through another update, call a privileged action directly, impersonate the owner, change roles, or reveal credentials. The manager's ability to change ordinary workflow status remains distinct from deleting an order.
- Prospect deletion remains owner-only, via the audited deletion RPC, including protection against direct PostgREST deletion. Review all related cascading and task operations and any new destructive actions.
- Never permit owner deactivation or deletion through a manager-facing flow. Self-deletion of the owner requires a separately designed and explicitly confirmed recovery/ownership-transfer process.

## Requirements before enabling

1. Complete the previously requested connected-preview regression, including owner sign-in, enquiries and notifications, and authorization testing. The existing owner session cannot substitute for an independent non-owner test.
2. Create a server-controlled role/membership store tied to stable Supabase user IDs. Do not trust editable user metadata, a role submitted by the client, or unvalidated JWT claims. Deny missing, disabled, unconfirmed and unknown users; revocation must take effect without waiting for stale role claims to expire.
3. Implement an owner-authorized, audited and rate-limited invitation flow, secure invitation acceptance, separate credentials and self-service recovery. Public signup stays disabled. Fail safely if invitation email fails, and never leak the privileged Auth credential to a browser.
4. Refactor server actions and pages to check the authenticated principal and required capability. Enquiry operations currently use a privileged server key, so every privileged read/write must be explicitly authorized server-side and narrow its allowed fields; a manager must not gain deletion or user-management capability through that client.
5. Update every GrowthOS RLS policy and owner-checked RPC deliberately for manager operations while retaining owner-only deletion. Audit actors and permission changes. Preserve existing data and owner access. Stage and review migration history first: local and remote migration version identifiers differ.
6. Test owner, manager, unprivileged and anonymous principals against all relevant routes, server actions, tables and RPCs, including crafted requests, self-escalation, cross-account changes, delete attempts, revocation and session expiry. Use an isolated preview database where possible; the currently connected database is shared with production.
7. Deploy only to preview and test the real invitation and access flows. Production release still needs explicit approval after full regression.

## Provider selection

The user selected Hunter Free and `kerifemdigitalventures@gmail.com` for the business mailbox. The Arena Gmail connector is enabled and its profile confirmed that address as the connected, primary mailbox. This only connects Gmail to this conversation; it does **not** give the deployed GrowthOS application an OAuth connection. Hunter has no supported Arena connector. The user has authorized connection, but application-specific Google OAuth consent and secure Hunter credential setup still need to be completed; use least-privilege scopes. Local staged Hunter company discovery and Gmail OAuth foundations exist, but neither provider is connected or end-to-end tested in GrowthOS. Approval/suppression, sending and durable reply handling are not implemented; see `docs/growthos-provider-setup.md`. Provider credentials must be entered into server-side environment configuration by the user, never chat or frontend code. The user requested a zero-dollar budget; verify actual plan entitlements and data-use restrictions before any credit use, and do not start a trial or paid plan automatically.

## Draft limitations

- The SQL draft covers GrowthOS policies and membership only. It does not implement invitations, sign-in, privileged enquiry authorization, an administrator UI, account deletion/recovery, or production-safe rollout. The owner is still identified using the existing authoritative confirmed-email check; ownership transfer and ID-pinned recovery need design.
- Auth user foreign keys in membership/audit can block deletion of users with history. An owner-only deletion and retention policy must be designed and tested before account deletion is offered.
- Test with the real Supabase default privileges, Auth sessions, API, ban/revocation behavior, RLS and triggers against an isolated environment before converting the draft into a reviewed migration. The connected project is shared with production; do not run this draft there as a preview shortcut.
