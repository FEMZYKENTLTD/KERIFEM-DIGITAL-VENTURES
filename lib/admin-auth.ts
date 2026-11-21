import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const OWNER_EMAIL = 'femzykenterprisesltd@gmail.com';

export async function adminAuth() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;
  const jar = await cookies();
  return createServerClient(url, key, {
    cookies: {
      getAll: () => jar.getAll(),
      setAll: (entries) => {
        for (const { name, value, options } of entries) {
          try {
            jar.set(name, value, {
              ...options,
              httpOnly: true,
              sameSite: 'lax',
              secure: process.env.NODE_ENV === 'production',
            });
          } catch {
            // Server Components cannot set cookies; actions and route handlers can.
          }
        }
      },
    },
  });
}

export async function ownerSession() {
  const client = await adminAuth();
  if (!client) return null;
  const {
    data: { user },
  } = await client.auth.getUser();
  return user?.email_confirmed_at && user.email?.toLowerCase() === OWNER_EMAIL ? client : null;
}

export async function requireOwner() {
  const client = await ownerSession();
  if (!client) redirect('/admin/sign-in');
  return client;
}
