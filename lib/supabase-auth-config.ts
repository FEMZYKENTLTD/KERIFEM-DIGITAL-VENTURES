// Keep the URL and key from the same configuration source: a preview may point at
// a different project than the production integration.
export function supabaseAuthConfig() {
  const integrationUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const integrationKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (integrationUrl && integrationKey) return { url: integrationUrl, key: integrationKey };

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  return url && key ? { url, key } : null;
}
