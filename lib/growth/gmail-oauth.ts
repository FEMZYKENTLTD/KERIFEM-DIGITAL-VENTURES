import { createCipheriv, createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { z } from 'zod';

const oauthResponse = z.object({ access_token: z.string().min(1).max(8192), refresh_token: z.string().min(1).max(8192), scope: z.string().max(2048) });
const identity = z.object({ email: z.string().email(), email_verified: z.literal(true) });
export const expectedGmail = 'kerifemdigitalventures@gmail.com';
const stateCookie = z.object({
  state: z.string().regex(/^[A-Za-z0-9_-]{43}$/),
  verifier: z.string().regex(/^[A-Za-z0-9_-]{43}$/),
  user: z.string().uuid(),
  issued: z.number().int().nonnegative(),
});
function signState(payload: string, key: Buffer) {
  const signingKey = createHmac('sha256', key).update('growthos:gmail:oauth-state:v1').digest();
  return createHmac('sha256', signingKey).update(payload).digest('base64url');
}
export function createGmailState(user: string, key: Buffer, now = Date.now()) {
  const state = randomBytes(32).toString('base64url');
  const verifier = randomBytes(32).toString('base64url');
  const payload = Buffer.from(JSON.stringify({ state, verifier, user, issued: now })).toString('base64url');
  return { state, verifier, cookie: `${payload}.${signState(payload, key)}` };
}
// Verify authenticity, age, principal, and state even if a stale cookie is replayed.
export function validateGmailState(raw: string | undefined, state: string, userId: string | undefined, key: Buffer, now = Date.now()): string | null {
  try {
    if (!raw || raw.length > 2048) return null;
    const [payload, signature, extra] = raw.split('.');
    if (extra || !payload || !/^[A-Za-z0-9_-]{43}$/.test(signature || '')) return null;
    const expected = signState(payload, key);
    if (!timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
    const stored = stateCookie.safeParse(JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')));
    if (!stored.success || !userId || userId !== stored.data.user || !/^[A-Za-z0-9_-]{43}$/.test(state)) return null;
    if (stored.data.issued > now || now - stored.data.issued > 600000) return null;
    return timingSafeEqual(Buffer.from(state), Buffer.from(stored.data.state)) ? stored.data.verifier : null;
  } catch {
    return null;
  }
}
export function gmailConfig() {
  const clientId = process.env.GROWTHOS_GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GROWTHOS_GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GROWTHOS_GMAIL_REDIRECT_URI;
  const key = process.env.GROWTHOS_GMAIL_ENCRYPTION_KEY;
  if (!clientId || !clientSecret || !redirectUri || !key || !/^[A-Za-z0-9+/]{43}=$/.test(key)) return null;
  const encryptionKey = Buffer.from(key, 'base64');
  if (encryptionKey.length !== 32 || encryptionKey.toString('base64') !== key) return null;
  try {
    const url = new URL(redirectUri);
    if (url.protocol !== 'https:' || url.pathname !== '/admin/growth-os/gmail/callback' || url.search || url.hash || url.username || url.password) return null;
  } catch { return null; }
  return { clientId, clientSecret, redirectUri, encryptionKey };
}
export function encryptRefreshToken(token: string, key: Buffer) {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  cipher.setAAD(Buffer.from('growthos:gmail:refresh:v1'));
  const encrypted = Buffer.concat([cipher.update(token, 'utf8'), cipher.final()]);
  return `v1.${iv.toString('base64url')}.${cipher.getAuthTag().toString('base64url')}.${encrypted.toString('base64url')}`;
}
export async function exchangeGmail(code: string, verifier: string, config: NonNullable<ReturnType<typeof gmailConfig>>, request: typeof fetch = fetch) {
  const token = await request('https://oauth2.googleapis.com/token', {
    method: 'POST', cache: 'no-store', redirect: 'error', signal: AbortSignal.timeout(10000),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ code, client_id: config.clientId, client_secret: config.clientSecret, redirect_uri: config.redirectUri, grant_type: 'authorization_code', code_verifier: verifier }),
  });
  if (!token.ok) throw new Error('token_exchange_failed');
  const tokens = oauthResponse.parse(await token.json());
  if (!tokens.scope.split(/\s+/).includes('https://www.googleapis.com/auth/gmail.send')) throw new Error('scope_missing');
  const profile = await request('https://openidconnect.googleapis.com/v1/userinfo', {
    headers: { Authorization: `Bearer ${tokens.access_token}` }, cache: 'no-store', redirect: 'error', signal: AbortSignal.timeout(10000),
  });
  if (!profile.ok) throw new Error('identity_failed');
  const account = identity.parse(await profile.json());
  if (account.email.toLowerCase() !== expectedGmail) throw new Error('wrong_mailbox');
  return encryptRefreshToken(tokens.refresh_token, config.encryptionKey);
}
