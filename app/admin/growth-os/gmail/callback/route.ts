import { NextRequest, NextResponse } from 'next/server';
import { requireOwner } from '@/lib/admin-auth';
import { exchangeGmail, gmailConfig, validateGmailState } from '@/lib/growth/gmail-oauth';
export async function GET(request: NextRequest) {
  const db = await requireOwner();
  const config = gmailConfig();
  if (!config) return new Response('Gmail OAuth is not configured.', { status: 503, headers: { 'Cache-Control': 'no-store' } });
  const done = (status: string) => {
    const target = new URL('/admin/growth-os/settings', config.redirectUri);
    target.searchParams.set('gmail', status);
    const result = NextResponse.redirect(target);
    result.cookies.set('__Host-growthos-gmail-oauth', '', { httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 0 });
    result.headers.set('Cache-Control', 'no-store');
    result.headers.set('Referrer-Policy', 'no-referrer');
    return result;
  };
  try {
    const raw = request.cookies.get('__Host-growthos-gmail-oauth')?.value;
    const state = request.nextUrl.searchParams.get('state') || '';
    const code = request.nextUrl.searchParams.get('code') || '';
    const { data: { user } } = await db.auth.getUser();
    const verifier = validateGmailState(raw, state, user?.id, config.encryptionKey);
    if (!verifier || !code || code.length > 4096) return done('failed');
    const encrypted = await exchangeGmail(code, verifier, config);
    const result = await db.rpc('growth_connect_gmail', { p_encrypted: encrypted });
    if (result.error || result.data !== true) return done('failed');
    return done('connected');
  } catch {
    return done('failed');
  }
}
