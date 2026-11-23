import assert from 'node:assert/strict';
import { supabaseAuthConfig } from '../lib/supabase-auth-config';
import { enquiryStore, enquiryStoreConfigured } from '../lib/enquiry-store';

async function main() {
  const variables = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_URL',
    'SUPABASE_PUBLISHABLE_KEY',
    'SUPABASE_SECRET_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
  ];
  for (const name of variables) delete process.env[name];
  assert.equal(supabaseAuthConfig(), null);
  assert.equal(enquiryStoreConfigured(), false);

  process.env.SUPABASE_URL = 'https://manual.example';
  process.env.SUPABASE_PUBLISHABLE_KEY = 'manual-public-test';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'manual-legacy-test';
  assert.deepEqual(supabaseAuthConfig(), {
    url: 'https://manual.example',
    key: 'manual-public-test',
  });

  let observed: { url: string; headers: Headers } | undefined;
  globalThis.fetch = async (input, init) => {
    observed = { url: String(input), headers: new Headers(init?.headers) };
    return new Response('{}');
  };
  await enquiryStore('?select=id');
  assert.equal(observed?.url, 'https://manual.example/rest/v1/enquiries?select=id');
  assert.equal(observed?.headers.get('authorization'), 'Bearer manual-legacy-test');

  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://integration.example';
  // A partial integration must not mix credentials and URLs from different projects.
  assert.equal(supabaseAuthConfig()?.url, 'https://manual.example');
  await enquiryStore('?select=id');
  assert.equal(observed?.url, 'https://manual.example/rest/v1/enquiries?select=id');
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'integration-legacy-anon-test';
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = 'integration-public-test';
  process.env.SUPABASE_SECRET_KEY = 'sb_secret_test_only';
  assert.deepEqual(supabaseAuthConfig(), {
    url: 'https://integration.example',
    key: 'integration-public-test',
  });
  await enquiryStore('?select=id');
  assert.equal(observed?.url, 'https://integration.example/rest/v1/enquiries?select=id');
  assert.equal(observed?.headers.get('apikey'), 'sb_secret_test_only');
  assert.equal(observed?.headers.has('authorization'), false);
  delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  assert.equal(supabaseAuthConfig()?.key, 'integration-legacy-anon-test');
  console.log(
    'Supabase integration and manual configuration selection, request headers: passed (mock only).',
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
