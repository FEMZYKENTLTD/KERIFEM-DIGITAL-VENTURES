import Link from 'next/link';
import { OWNER_EMAIL, requireOwner } from '@/lib/admin-auth';
import { changePassword } from '../actions';

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ notice?: string }>;
}) {
  await requireOwner();
  const { notice } = await searchParams;
  return (
    <section className="admin-panel admin-auth">
      <Link href="/admin/enquiries">← Back to enquiries</Link>
      <h1>Change password</h1>
      <p>{OWNER_EMAIL}</p>
      {notice && (
        <p className="admin-notice" role="alert">
          {notice === 'invalid'
            ? 'Use matching passwords, 16–128 characters long.'
            : 'Could not update the password. Try a new password or request a fresh recovery link.'}
        </p>
      )}
      <form action={changePassword}>
        <label>
          New password
          <input
            name="password"
            type="password"
            autoComplete="new-password"
            minLength={16}
            maxLength={128}
            required
          />
        </label>
        <label>
          Confirm new password
          <input
            name="confirm"
            type="password"
            autoComplete="new-password"
            minLength={16}
            maxLength={128}
            required
          />
        </label>
        <button>Update password</button>
      </form>
    </section>
  );
}
