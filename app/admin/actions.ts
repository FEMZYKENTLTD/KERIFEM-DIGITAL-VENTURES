'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { adminAuth, OWNER_EMAIL, requireOwner } from '@/lib/admin-auth';
import { lookupDelivery } from '@/lib/brevo';
import { schema } from '@/lib/enquiry';
import { enquiryStore, notifyOwner, recordNotification } from '@/lib/enquiry-store';
import { isRecoveryToken } from '@/lib/recovery-token';
import { SITE_URL } from '@/lib/site';
import { isWorkflowStatus } from '@/lib/workflow';

export async function signIn(fields: FormData) {
  const auth = await adminAuth();
  const password = String(fields.get('password') || '');
  if (!auth || !password || password.length > 128) redirect('/admin/sign-in?notice=invalid');
  const { data, error } = await auth.auth.signInWithPassword({ email: OWNER_EMAIL, password });
  if (error || !data.user?.email_confirmed_at) redirect('/admin/sign-in?notice=invalid');
  redirect('/admin');
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

export async function confirmRecovery(token: string) {
  if (!isRecoveryToken(token)) redirect('/admin/sign-in?notice=expired');
  const auth = await adminAuth();
  if (!auth) redirect('/admin/sign-in?notice=unavailable');
  const { data, error } = await auth.auth.verifyOtp({ token_hash: token, type: 'recovery' });
  if (error) redirect('/admin/sign-in?notice=expired');
  if (!data.user?.email_confirmed_at || data.user.email?.toLowerCase() !== OWNER_EMAIL) {
    await auth.auth.signOut({ scope: 'local' });
    redirect('/admin/sign-in?notice=expired');
  }
  redirect('/admin/account');
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

export async function setWorkflowStatus(id: string, fields: FormData) {
  await requireOwner();
  if (!z.string().uuid().safeParse(id).success) redirect('/admin/enquiries');
  const status = String(fields.get('workflow') || '');
  if (!isWorkflowStatus(status)) redirect(`/admin/enquiries/${id}?notice=invalid`);
  try {
    const response = await enquiryStore(`?id=eq.${id}&select=id`, {
      method: 'PATCH',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify({ workflow_status: status }),
    });
    if (!(await response.json())[0]?.id) throw new Error('Status not confirmed');
  } catch {
    redirect(`/admin/enquiries/${id}?notice=failed`);
  }
  redirect(`/admin/enquiries/${id}?notice=status`);
}

export async function moveToBin(id: string, fields: FormData) {
  await requireOwner();
  if (!z.string().uuid().safeParse(id).success) redirect('/admin/enquiries');
  if (fields.get('confirmDelete') !== 'yes') redirect(`/admin/enquiries/${id}?notice=confirm`);
  try {
    const response = await enquiryStore(`?id=eq.${id}&deleted_at=is.null&select=id`, {
      method: 'PATCH',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify({ deleted_at: new Date().toISOString() }),
    });
    if (!(await response.json())[0]?.id) throw new Error('Move not confirmed');
  } catch {
    redirect(`/admin/enquiries/${id}?notice=failed`);
  }
  redirect('/admin/enquiries?notice=binned');
}

export async function restoreEnquiry(id: string) {
  await requireOwner();
  if (!z.string().uuid().safeParse(id).success) redirect('/admin/enquiries/bin');
  try {
    const response = await enquiryStore(`?id=eq.${id}&deleted_at=not.is.null&select=id`, {
      method: 'PATCH',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify({ deleted_at: null }),
    });
    if (!(await response.json())[0]?.id) throw new Error('Restore not confirmed');
  } catch {
    redirect(`/admin/enquiries/${id}?notice=failed`);
  }
  redirect(`/admin/enquiries/${id}?notice=restored`);
}

export async function purgeEnquiry(id: string, fields: FormData) {
  await requireOwner();
  if (!z.string().uuid().safeParse(id).success) redirect('/admin/enquiries/bin');
  if (fields.get('confirmDelete') !== 'yes') redirect(`/admin/enquiries/${id}?notice=confirm`);
  try {
    const response = await enquiryStore(`?id=eq.${id}&deleted_at=not.is.null&select=id`, {
      method: 'DELETE',
      headers: { Prefer: 'return=representation' },
    });
    if (!(await response.json())[0]?.id) throw new Error('Delete not confirmed');
  } catch {
    redirect(`/admin/enquiries/${id}?notice=failed`);
  }
  redirect('/admin/enquiries/bin?notice=purged');
}

export async function retryAlert(id: string) {
  await requireOwner();
  if (!z.string().uuid().safeParse(id).success) redirect('/admin/enquiries');
  const path = `/admin/enquiries/${id}`;
  let notice = 'alert-unavailable';
  try {
    // Claim atomically so two clicks cannot send the same retry concurrently.
    const result = await enquiryStore(
      `?id=eq.${id}&notification=in.(failed,not_configured,ambiguous)&select=id`,
      {
        method: 'PATCH',
        headers: { Prefer: 'return=representation' },
        body: JSON.stringify({ notification: 'pending' }),
      },
    );
    if ((await result.json())[0]?.id === id) {
      const notification = await notifyOwner(id);
      await recordNotification(id, notification);
      notice =
        notification.status === 'accepted'
          ? 'alert-accepted'
          : notification.status === 'ambiguous'
            ? 'alert-ambiguous'
            : 'alert-failed';
    }
  } catch {
    console.warn('[enquiry-alert] Could not confirm retry status');
  }
  redirect(`${path}?notice=${notice}`);
}

export async function refreshDelivery(id: string) {
  await requireOwner();
  if (!z.string().uuid().safeParse(id).success) redirect('/admin/enquiries');
  const path = `/admin/enquiries/${id}`;
  let notice = 'delivery-unknown';
  try {
    const response = await enquiryStore(
      `?id=eq.${id}&select=id,notification,notification_detail,notification_message_id`,
    );
    const [row] = (await response.json()) as {
      id: string;
      notification: string;
      notification_detail?: { delivery?: string; messageId?: string } | null;
      notification_message_id?: string | null;
    }[];
    const messageId = row?.notification_message_id || row?.notification_detail?.messageId;
    if (row?.id === id && messageId) {
      const delivery = await lookupDelivery(messageId);
      await enquiryStore(`?id=eq.${id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          notification_detail: { ...(row.notification_detail ?? {}), delivery },
        }),
      });
      notice = delivery === 'delivered' ? 'delivery-reported' : 'delivery-unknown';
    }
  } catch {
    console.warn('[enquiry-alert] Could not confirm delivery status');
  }
  redirect(`${path}?notice=${notice}`);
}
