import assert from 'node:assert/strict';
import { discoverCompanies, HunterError, hunterQuery } from '../lib/growth/hunter';

async function main() {
  assert.equal(hunterQuery.safeParse('abc').success, false);
  let seen = false;
  const mock: typeof fetch = async (url, options) => {
    seen = true;
    assert.equal(url, 'https://api.hunter.io/v2/discover');
    assert.equal(options?.redirect, 'error');
    assert.equal((options?.headers as Record<string, string>)['X-API-KEY'], 'secret-not-real');
    assert.equal(JSON.parse(options?.body as string).limit, 20);
    return Response.json({ data: [{ domain: 'Example.COM', organization: 'Example' }] });
  };
  assert.deepEqual(await discoverCompanies('Retail in Lagos', 'secret-not-real', mock), [{ domain: 'example.com', name: 'Example' }]);
  assert.ok(seen);
  await assert.rejects(() => discoverCompanies('Retail in Lagos', 'test-api-key', mock), (e: unknown) => e instanceof HunterError && e.code === 'configuration');
  await assert.rejects(() => discoverCompanies('Retail in Lagos', 'key', async () => Response.json({data: [{ domain: 'localhost', organization: 'x' }]})), (e: unknown) => e instanceof HunterError && e.code === 'invalid_response');
  await assert.rejects(() => discoverCompanies('Retail in Lagos', 'key', async () => new Response('denied', {status: 401})), (e: unknown) => e instanceof HunterError && e.code === 'denied');
  await assert.rejects(() => discoverCompanies('Retail in Lagos', 'key', async () => new Response('x'.repeat(131073))), (e: unknown) => e instanceof HunterError && e.code === 'invalid_response');
  console.log('Hunter adapter mock checks passed; no real Hunter connection or API request tested.');
}
main();
