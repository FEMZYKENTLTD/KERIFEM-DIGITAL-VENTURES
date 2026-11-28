# GrowthOS provider setup: staged, not connected

The Arena Gmail connector is connected to `kerifemdigitalventures@gmail.com` for this conversation. It does not provide OAuth credentials or tokens to the deployed application. Hunter has no Arena connector. Neither provider has been connected to GrowthOS or tested against its real API by this change. The application implementation is local only; no release has been made. The additive Gmail credential-storage migration has been applied to the shared database.

## Gmail authorization foundation

The staged application flow requests `openid`, `email` and `gmail.send` only. It does not request inbox read access and does not send messages, read replies or provide campaigns. Starting it is owner-only; the callback uses a short-lived, HttpOnly state/PKCE cookie bound to the signed-in owner, verifies the requested send scope and the expected Google account, and encrypts the refresh token with AES-256-GCM before an owner-only database RPC stores it. Disconnect deletes the local ciphertext, but **does not revoke the Google grant**: use Google account security to revoke that grant separately. The database status means ciphertext is stored, not that Google still accepts the grant.

The owner authorized production setup and testing along the way. The additive Gmail storage migration `supabase/migrations/20261128164319_growthos_gmail_connection.sql` has been applied to the connected shared database. The SQL was checked in a rolled-back transaction against the real database with simulated owner and unknown-user claims, including privileges and owner-only write, status and disconnect; this is not a real Auth or PostgREST session test. No credential is stored yet. OAuth routes and the application have not been deployed or tested with real Google consent. Before enabling use, complete real Auth/RLS and callback attack tests, preferably against an isolated environment. A Google Cloud OAuth client and consent screen under the authorised account must be created in Google Cloud. Register the exact HTTPS preview callback `/admin/growth-os/gmail/callback` on the same host as the site; Google Testing mode may require test users and refresh tokens may expire. Google scopes can require verification or other compliance steps. Set these in the appropriate *server environment* through a secure configuration interface, never in chat or browser code:

- `GROWTHOS_GOOGLE_CLIENT_ID`
- `GROWTHOS_GOOGLE_CLIENT_SECRET`
- `GROWTHOS_GMAIL_REDIRECT_URI` (the exact registered HTTPS callback)
- `GROWTHOS_GMAIL_ENCRYPTION_KEY` (base64-encoded 32 cryptographically random bytes)

Protect and back up the encryption key appropriately. Changing or losing it makes existing stored credentials unreadable; reconnect and revoke obsolete grants after rotation. Do not use this draft as a production credential store until independent review, key lifecycle, disconnect/revocation and real integration testing are complete. Never print keys or tokens.

Even with a successful connection, no sending may be enabled until durable suppression, human approval, opt-out and bounce handling, audit, idempotency, quota and legal/provider-policy checks have been implemented and tested. Inbox/reply integration requires separate scope and review; do not quietly expand access.

## Hunter company discovery

The staged owner-only Discovery page uses Hunter's documented Discover endpoint, described by Hunter as free, to display up to 20 provider-reported companies. The user must confirm every request. It does not save records, find email addresses, verify contacts or send messages. Provider results are untrusted and are not consent. The fixed provider endpoint uses a server-only key header, bounded response, timeout and no redirects. A staged database function records request starts without search terms and enforces one per minute and twenty per rolling day per owner; the action fails closed if the limiter is missing. No credit-consuming endpoint has been implemented. Verify the account's plan, access and current terms before enabling.

For isolated preview only, after reviewing and testing `supabase/staged/hunter_discovery.sql`, set `HUNTER_API_KEY` and `HUNTER_FREE_DISCOVERY_ENABLED=true` in the server environment. Obtain the key from the Hunter dashboard and enter it directly in the secure environment configuration, not chat. Never use Hunter's dummy `test-api-key` as a real connection. A configured key is not evidence of a successful connection.

## Test evidence and remaining gates

`npm run test:hunter` and `npm run test:gmail-oauth` use mock HTTP responses. `npm run test:manager-db` uses local PGlite and exercises the staged provider SQL with simulated identities. These are not Google, Hunter, real Supabase Auth, browser or PostgREST tests. Test owner and unauthorised principals, state tampering, replay, wrong Google mailbox, consent cancellation, account revocation, rate limits and provider failure on an isolated preview. The manager access design, invitation flow, secure account deletion/recovery and real connected preview regression remain incomplete. The owner authorized production setup and testing along the way; full real integration testing and a safe release are still outstanding.
