// Supabase supplies an opaque URL-safe hash, not the user's password or a session token.
export function isRecoveryToken(value: unknown): value is string {
  return typeof value === 'string' && /^[A-Za-z0-9_-]{32,256}$/.test(value);
}
