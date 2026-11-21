import assert from 'node:assert/strict';

if (process.env.SUPABASE_SERVICE_ROLE_KEY)
  throw new Error('Run only against an unconfigured local server.');

// Run against a local production server WITHOUT enquiry database credentials.
const origin = 'http://localhost:3000';
for (const path of [
  '/',
  '/about',
  '/services',
  '/portfolio',
  '/portfolio/knowledge-land-cbt',
  '/portfolio/femzyk-fleet',
  '/portfolio/resumerank',
  '/portfolio/contact-book-pro',
  '/portfolio/stock-analysis',
  '/credentials/cac.webp',
  '/credentials/smedan.webp',
  '/contact',
  '/privacy-policy',
  '/terms-of-service',
  '/cookie-policy',
  '/robots.txt',
  '/sitemap.xml',
  '/og.png',
]) {
  assert.equal((await fetch(origin + path)).status, 200, path);
}
assert.equal((await fetch(origin + '/not-a-route')).status, 404);
const payload = {
  name: 'Smoke Test',
  email: 'test@example.com',
  phone: '+2349020000000',
  service: 'Web Development',
  country: 'Nigeria',
  timeline: 'Flexible',
  message: 'A synthetic enquiry that must not send.',
  contactMethod: 'Email',
};
const post = (data, headers = {}) =>
  fetch(`${origin}/api/enquiry`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(data),
  });
assert.equal((await post({})).status, 400);
assert.equal((await post({ ...payload, botcheck: 'spam' })).status, 400);
assert.equal((await post({ ...payload, message: 'x'.repeat(40000) })).status, 413);
assert.equal((await post(payload, { 'Sec-Fetch-Site': 'cross-site' })).status, 403);
if (process.argv.includes('--unconfigured')) {
  const unavailable = await post(payload);
  assert.equal(unavailable.status, 503);
  assert.deepEqual(await unavailable.json(), { success: false, code: 'FORM_NOT_CONFIGURED' });
}
console.log('Public routes, 404 and enquiry rejection paths passed.');
