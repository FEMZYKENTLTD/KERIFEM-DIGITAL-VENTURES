import { createHash, timingSafeEqual } from 'node:crypto';
import { enquiryStore, type Enquiry } from '@/lib/enquiry-store';

const headers = {
  'Cache-Control': 'private, no-store',
  'X-Robots-Tag': 'noindex, nofollow',
  'X-Content-Type-Options': 'nosniff',
  'Content-Security-Policy':
    "default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; frame-ancestors 'none'",
};
const text = (value: unknown) =>
  String(value ?? '').replace(
    /[&<>"']/g,
    (char) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char] ?? char,
  );
const hash = (value: string) => createHash('sha256').update(value).digest();

export async function GET(request: Request) {
  const password = process.env.ENQUIRY_ADMIN_PASSWORD;
  if (!password || password.length < 24) return new Response('Not found', { status: 404, headers });
  const credential = request.headers.get('authorization') || '';
  const expected = `Basic ${Buffer.from(`owner:${password}`).toString('base64')}`;
  if (!timingSafeEqual(hash(credential), hash(expected))) {
    return new Response('Sign in to view enquiries.', {
      status: 401,
      headers: {
        ...headers,
        'WWW-Authenticate': 'Basic realm="Kerifem enquiries", charset="UTF-8"',
      },
    });
  }
  const page = Math.min(
    10000,
    Math.max(0, Number.parseInt(new URL(request.url).searchParams.get('page') || '0', 10) || 0),
  );
  try {
    const result = await enquiryStore(
      `?select=id,created_at,payload,notification&order=created_at.desc,id.desc&limit=26&offset=${page * 25}`,
    );
    const rows = (await result.json()) as Enquiry[];
    const cards = rows
      .slice(0, 25)
      .map(
        (row) =>
          `<article><h2>${text(row.payload.projectTitle || row.payload.service)}</h2><p>${text(row.created_at)} · Notification: ${text(row.notification)} · ${text(row.id)}</p><dl>${Object.entries(
            row.payload,
          )
            .map(([label, value]) => `<dt>${text(label)}</dt><dd>${text(value)}</dd>`)
            .join('')}</dl></article>`,
      )
      .join('');
    return new Response(
      `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Enquiry inbox • Kerifem</title><style>body{margin:30px auto;padding:0 16px;max-width:860px;background:#0b1321;color:#eef3fc;font:16px/1.5 system-ui}article{background:#17253a;border:1px solid #445775;padding:16px;margin:16px 0;border-radius:8px}a{color:#bad5ff}dt{font-weight:700}dd{margin:0 0 10px;white-space:pre-wrap;overflow-wrap:anywhere}</style><main><h1>Kerifem enquiry inbox</h1><p>Newest first · Page ${page + 1}</p>${cards || '<p>No enquiries on this page.</p>'}<nav aria-label="Inbox pages">${page > 0 ? `<a href="?page=${page - 1}">Previous</a> ` : ''}${rows.length > 25 && page < 10000 ? `<a href="?page=${page + 1}">Next</a>` : ''}</nav></main></html>`,
      { headers: { ...headers, 'Content-Type': 'text/html; charset=utf-8' } },
    );
  } catch {
    return new Response('The enquiry inbox is temporarily unavailable.', { status: 503, headers });
  }
}
