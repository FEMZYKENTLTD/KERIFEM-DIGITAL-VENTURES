'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { adminAuth, OWNER_EMAIL, requireOwner } from '@/lib/admin-auth';
import { schema } from '@/lib/enquiry';
import { enquiryStore, notifyOwner } from '@/lib/enquiry-store';
import { SITE_URL } from '@/lib/site';

export async function signIn(fields: FormData) {
  const auth = await adminAuth();
  const password = String(fields.get('password') || '');
  if (!auth || !password || password.length > 128) redirect('/admin/sign-in?notice=invalid');
  const { data, error } = await auth.auth.signInWithPassword({ email: OWNER_EMAIL, password });
  if (error || !data.user?.email_confirmed_at) redirect('/admin/sign-in?notice=invalid');
  redirect('/admin/enquiries');
}

export async function requestReset() {
  const auth = await adminAuth();
  if (!auth) redirect('/admin/sign-in?notice=unavailable');
  const { error } = await auth.auth.resetPasswordForEmail(OWNER_EMAIL, {
    redirectTo: new URL('/admin/callback', SITE_URL).href,
  });
  if (error) redirect('/admin/sign-in?notice=unavailable');
  redirect('/admin/sign-in?notice=sent');
}

export async function changePassword(fields: FormData) {
  const auth = await requireOwner();
  const password = String(fields.get('password') || '');
  if (password.length < 16 || password.length > 128 || password !== fields.get('confirm'))
    redirect('/admin/account?notice=invalid');
  const { error } = await auth.auth.updateUser({ password });
  if (error) redirect('/admin/account?notice=failed');
  await auth.auth.signOut({ scope: 'global' });
  redirect('/admin/sign-in?notice=changed');
}

export async function signOut() {
  const auth = await requireOwner();
  await auth.auth.signOut({ scope: 'local' });
  redirect('/admin/sign-in');
}

export async function saveEnquiry(id: string, fields: FormData) {
  await requireOwner();
  const path = id === 'new' ? '/admin/enquiries/new' : `/admin/enquiries/${id}`;
  if (id !== 'new' && !z.string().uuid().safeParse(id).success) redirect('/admin/enquiries');
  const parsed = schema.safeParse(Object.fromEntries(fields));
  if (!parsed.success) redirect(`${path}?notice=invalid`);
  try {
    const result = await enquiryStore(id === 'new' ? '?select=id' : `?id=eq.${id}&select=id`, {
      method: id === 'new' ? 'POST' : 'PATCH',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify(
        id === 'new'
          ? { payload: parsed.data, notification: 'not_configured' }
          : { payload: parsed.data },
      ),
    });
    if (!(await result.json())[0]?.id) throw new Error('Save not confirmed');
  } catch {
    redirect(`${path}?notice=failed`);
  }
  redirect('/admin/enquiries?notice=saved');
}

export async function deleteEnquiry(id: string, fields: FormData) {
  await requireOwner();
  if (!z.string().uuid().safeParse(id).success) redirect('/admin/enquiries');
  if (fields.get('confirmDelete') !== 'yes') redirect(`/admin/enquiries/${id}?notice=confirm`);
  try {
    const response = await enquiryStore(`?id=eq.${id}&select=id`, {
      method: 'DELETE',
      headers: { Prefer: 'return=representation' },
    });
    if (!(await response.json())[0]?.id) throw new Error('Delete not confirmed');
  } catch {
    redirect(`/admin/enquiries/${id}?notice=failed`);
  }
  redirect('/admin/enquiries?notice=deleted');
}

export async function retryAlert(id: string) {
  await requireOwner();
  if (!z.string().uuid().safeParse(id).success) redirect('/admin/enquiries');
  const path = `/admin/enquiries/${id}`;
  let notice = 'alert-unavailable';
  try {
    // Claim atomically so two clicks cannot send the same retry concurrently.
    const result = await enquiryStore(
      `?id=eq.${id}&notification=in.(failed,not_configured)&select=id`,
      {
        method: 'PATCH',
        headers: { Prefer: 'return=representation' },
        body: JSON.stringify({ notification: 'pending' }),
      },
    );
    if ((await result.json())[0]?.id === id) {
      const notification = await notifyOwner(id);
      await enquiryStore(`?id=eq.${id}&notification=eq.pending`, {
        method: 'PATCH',
        body: JSON.stringify({ notification }),
      });
      notice = notification === 'accepted' ? 'alert-accepted' : 'alert-failed';
    }
  } catch {
    console.warn('[enquiry-alert] Could not confirm retry status');
  }
  redirect(`${path}?notice=${notice}`);
}
