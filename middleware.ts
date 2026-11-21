import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key || request.nextUrl.pathname === '/admin/callback') return NextResponse.next();

  let response = NextResponse.next({ request });
  const client = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (entries) => {
        for (const { name, value } of entries) request.cookies.set(name, value);
        response = NextResponse.next({ request });
        for (const { name, value, options } of entries) {
          response.cookies.set(name, value, {
            ...options,
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
          });
        }
      },
    },
  });
  if (request.method === 'GET') await client.auth.getUser();
  return response;
}

export const config = { matcher: '/admin/:path*' };
