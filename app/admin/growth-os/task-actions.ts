'use server';
import { z } from 'zod';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { requireOwner } from '@/lib/admin-auth';

const uuid = z.string().uuid();
const date = z
  .string()
  .refine(
    (v) =>
      !v ||
      (/^\d{4}-\d{2}-\d{2}$/.test(v) &&
        !Number.isNaN(Date.parse(v)) &&
        new Date(v).toISOString().slice(0, 10) === v),
  );
export async function createTask(fields: FormData) {
  const db = await requireOwner();
  const parsed = z
    .object({ prospect_id: uuid, title: z.string().trim().min(1).max(180), due_date: date })
    .safeParse(Object.fromEntries(fields));
  if (!parsed.success) redirect('/admin/growth-os/tasks?notice=invalid');
  const { error } = await db
    .from('growth_tasks')
    .insert({ ...parsed.data, due_date: parsed.data.due_date || null });
  if (error) redirect('/admin/growth-os/tasks?notice=failed');
  revalidatePath('/admin/growth-os', 'layout');
  redirect('/admin/growth-os/tasks?notice=created');
}
export async function toggleTask(id: string, fields: FormData) {
  const db = await requireOwner();
  const status = z.enum(['open', 'done']).safeParse(fields.get('status'));
  if (!uuid.safeParse(id).success || !status.success)
    redirect('/admin/growth-os/tasks?notice=invalid');
  const { data, error } = await db
    .from('growth_tasks')
    .update({ status: status.data })
    .eq('id', id)
    .select('id')
    .maybeSingle();
  if (error || !data) redirect('/admin/growth-os/tasks?notice=failed');
  revalidatePath('/admin/growth-os', 'layout');
  redirect('/admin/growth-os/tasks?notice=updated');
}
