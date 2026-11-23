import { redirect } from 'next/navigation';
import { requireOwner } from '@/lib/admin-auth';
export default async function AdminPage() {
  await requireOwner();
  redirect('/admin/enquiries');
}
