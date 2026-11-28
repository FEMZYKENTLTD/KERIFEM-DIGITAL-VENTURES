'use server';
import { redirect } from 'next/navigation';
import { requireOwner } from '@/lib/admin-auth';
export async function disconnectGmail() {
  const db = await requireOwner();
  const result = await db.rpc('growth_disconnect_gmail');
  redirect(`/admin/growth-os/settings?gmail=${result.error || result.data !== true ? 'failed' : 'disconnected'}`);
}
