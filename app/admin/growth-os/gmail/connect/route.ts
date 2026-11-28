import { createHash } from 'node:crypto';
import { NextResponse } from 'next/server';
import { requireOwner } from '@/lib/admin-auth';
import { createGmailState, expectedGmail, gmailConfig } from '@/lib/growth/gmail-oauth';

export async function GET() {
  const db = await requireOwner();
  const { data: { user } } = await db.auth.getUser();
  const config = gmailConfig();
  if (!config || !user) return new Response('Gmail OAuth is not configured.', { status: 503, headers: { 'Cache-Control': 'no-store' } });
  const availability = await db.rpc('growth_gmail_status');
  if (availability.error) return new Response('Gmail storage is unavailable.', { status: 503, headers: { 'Cache-Control': 'no-store' } });
  const { state, verifier, cookie } = createGmailState(user.id, config.encryptionKey);
  const challenge = createHash('sha256').update(verifier).digest('base64url');
  const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  url.search = new URLSearchParams({ client_id: config.clientId, redirect_uri: config.redirectUri, response_type: 'code', scope: 'openid email https://www.googleapis.com/auth/gmail.send', access_type: 'offline', prompt: 'consent', login_hint: expectedGmail, state, code_challenge: challenge, code_challenge_method: 'S256' }).toString();
  const response = NextResponse.redirect(url);
  response.cookies.set('__Host-growthos-gmail-oauth', cookie, { httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 600 });
  response.headers.set('Cache-Control', 'no-store');
  response.headers.set('Referrer-Policy', 'no-referrer');
  return response;
}
