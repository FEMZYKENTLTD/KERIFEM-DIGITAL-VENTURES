'use server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { requireOwner } from '@/lib/admin-auth';
import { prospectSchema, stages } from '@/lib/growthos';

export async function saveProspect(id: string, fields: FormData) {
  const client = await requireOwner();
  if (id !== 'new' && !z.string().uuid().safeParse(id).success)
    redirect('/admin/growth-os/prospects');
  const path = `/admin/growth-os/prospects/${id}`;
  const parsed = prospectSchema.safeParse(Object.fromEntries(fields));
  if (!parsed.success) redirect(`${path}?notice=invalid`);
  const result =
    id === 'new'
      ? await client.from('growth_prospects').insert(parsed.data).select('id').single()
      : await client
          .from('growth_prospects')
          .update(parsed.data)
          .eq('id', id)
          .select('id')
          .single();
  if (result.error || !result.data) redirect(`${path}?notice=failed`);
  revalidatePath('/admin/growth-os', 'layout');
  redirect(`/admin/growth-os/prospects/${result.data.id}?notice=saved`);
}
export async function changeStage(id: string, fields: FormData) {
  const client = await requireOwner();
  if (!z.string().uuid().safeParse(id).success) redirect('/admin/growth-os/prospects');
  const stage = String(fields.get('stage') || '');
  if (!stages.some(([value]) => value === stage))
    redirect(`/admin/growth-os/prospects/${id}?notice=invalid`);
  const { data, error } = await client
    .from('growth_prospects')
    .update({ stage })
    .eq('id', id)
    .select('id')
    .single();
  if (error || !data) redirect(`/admin/growth-os/prospects/${id}?notice=failed`);
  revalidatePath('/admin/growth-os', 'layout');
  redirect(`/admin/growth-os/prospects/${id}?notice=saved`);
}
