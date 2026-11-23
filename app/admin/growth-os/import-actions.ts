'use server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { requireOwner } from '@/lib/admin-auth';
import { parseProspectCsv } from '@/lib/growth/csv';
export async function importProspects(fields: FormData) {
  const db = await requireOwner();
  const file = fields.get('file');
  if (!(file instanceof File) || !file.size || file.size > 65536)
    redirect('/admin/growth-os/prospects/import?notice=invalid');
  let rows;
  try {
    rows = parseProspectCsv(await file.text());
  } catch {
    redirect('/admin/growth-os/prospects/import?notice=invalid');
  }
  const { data, error } = await db.rpc('growth_import_prospects', { p_rows: rows });
  if (error || !data || !Number.isSafeInteger(data.imported) || !Number.isSafeInteger(data.skipped))
    redirect('/admin/growth-os/prospects/import?notice=failed');
  revalidatePath('/admin/growth-os', 'layout');
  redirect(
    `/admin/growth-os/prospects/import?notice=done&imported=${data.imported}&skipped=${data.skipped}`,
  );
}
