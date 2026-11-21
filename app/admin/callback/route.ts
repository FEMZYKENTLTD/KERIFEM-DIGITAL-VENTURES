import { NextResponse } from 'next/server';
import { adminAuth, OWNER_EMAIL } from '@/lib/admin-auth';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const auth = await adminAuth();
  if (code && auth) {
    const { data, error } = await auth.auth.exchangeCodeForSession(code);
    if (!error && data.user?.email_confirmed_at && data.user.email?.toLowerCase() === OWNER_EMAIL) {
      return NextResponse.redirect(new URL('/admin/account', url));
    }
    if (!error) await auth.auth.signOut({ scope: 'local' });
  }
  return NextResponse.redirect(new URL('/admin/sign-in?notice=expired', url));
}
