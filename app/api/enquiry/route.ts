import { schema } from '@/lib/enquiry';
import { BRAND } from '@/lib/site';

export async function POST(request: Request) {
  const error = (status: number) => Response.json({ success: false }, { status });
  if (request.headers.get('sec-fetch-site') === 'cross-site') return error(403);
  if (request.headers.get('content-type')?.split(';')[0] !== 'application/json') return error(415);
  const reader = request.body?.getReader();
  if (!reader) return error(400);
  const decoder = new TextDecoder();
  let bytes = 0;
  let text = '';
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > 32768) {
        await reader.cancel();
        return error(413);
      }
      text += decoder.decode(value, { stream: true });
    }
    text += decoder.decode();
    const parsed = schema.safeParse(JSON.parse(text));
    if (!parsed.success) return error(400);
    const key = process.env.WEB3FORMS_ACCESS_KEY;
    if (!key) return error(503);
    const { name, email, phone, service, message, budget, contactMethod } = parsed.data;
    try {
      const upstream = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: key,
          subject: `New quote request — ${BRAND.name}`,
          from_name: BRAND.name,
          name,
          email,
          replyto: email,
          phone,
          service,
          message,
          budget,
          contactMethod,
        }),
        signal: AbortSignal.timeout(10000),
        cache: 'no-store',
      });
      if (!upstream.ok || (await upstream.json()).success !== true) return error(502);
      return Response.json({ success: true });
    } catch {
      return error(502);
    }
  } catch {
    return error(400);
  }
}
