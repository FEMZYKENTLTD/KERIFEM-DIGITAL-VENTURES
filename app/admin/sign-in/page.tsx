import { redirect } from 'next/navigation';
import { OWNER_EMAIL, ownerSession } from '@/lib/admin-auth';
import { requestReset, signIn } from '../actions';

const messages: Record<string, string> = {
  invalid: 'Could not sign in. Check your password and confirm the owner account is active.',
  sent: 'Recovery requested. Check the linked mailbox and open the email in this same browser.',
  unavailable:
    'Password recovery is temporarily unavailable. Check the recovery email configuration or try again later.',
  expired:
    'That recovery link could not be used. Request a fresh link and open it in the same browser.',
  changed: 'Password updated. Sign in again with your new password.',
};

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ notice?: string }>;
}) {
  if (await ownerSession()) redirect('/admin/enquiries');
  const { notice } = await searchParams;
  return (
    <section className="admin-panel admin-auth">
      <h1>Admin sign in</h1>
      <p>Manage enquiries and review email notification activity.</p>
      {notice && Object.hasOwn(messages, notice) && (
        <p role="status" className="admin-notice">
          {messages[notice]}
        </p>
      )}
      <form action={signIn}>
        <label>
          Owner email
          <input type="email" autoComplete="username" readOnly value={OWNER_EMAIL} />
        </label>
        <label>
          Password
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            required
            maxLength={128}
          />
        </label>
        <button>Sign in</button>
      </form>
      <form action={requestReset}>
        <button className="admin-secondary">Forgot password?</button>
      </form>
    </section>
  );
}
