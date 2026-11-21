import Link from 'next/link';
import { isRecoveryToken } from '@/lib/recovery-token';
import { confirmRecovery } from '../actions';

export default async function RecoverPage({
  searchParams,
}: {
  searchParams: Promise<{ token_hash?: string | string[] }>;
}) {
  const { token_hash: token } = await searchParams;
  return (
    <section className="admin-panel admin-auth">
      <h1>Reset your dashboard password</h1>
      {isRecoveryToken(token) ? (
        <>
          <p>Continue to verify your one-time recovery link and choose a new password.</p>
          <form action={confirmRecovery.bind(null, token)}>
            <button type="submit">Continue to password reset</button>
          </form>
        </>
      ) : (
        <p>This recovery link is incomplete. Request a new one from Admin sign in.</p>
      )}
      <Link href="/admin/sign-in">Back to Admin sign in</Link>
    </section>
  );
}
