import { schema } from '@/lib/enquiry';
import { BRAND } from '@/lib/site';

export async function POST(request: Request) {
  const error = (status: number, code = 'INVALID_REQUEST') =>
    Response.json({ success: false, code }, { status });
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
    const key = process.env.WEB3FORMS_ACCESS_KEY?.trim();
    if (!key) return error(503, 'FORM_NOT_CONFIGURED');
    const {
      name,
      email,
      phone,
      service,
      message,
      budget,
      contactMethod,
      country,
      projectTitle,
      timeline,
      reference,
    } = parsed.data;
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
          country,
          projectTitle,
          timeline,
          reference,
        }),
        signal: AbortSignal.timeout(10000),
        cache: 'no-store',
      });
      if (!upstream.ok) {
        console.warn('[enquiry] Web3Forms returned HTTP', upstream.status);
        if (upstream.status === 429) return error(503, 'PROVIDER_RATE_LIMITED');
        return error(502, 'PROVIDER_REJECTED');
      }
      if ((await upstream.json())?.success !== true) {
        console.warn('[enquiry] Web3Forms did not confirm acceptance');
        return error(502, 'PROVIDER_REJECTED');
      }
      return Response.json({ success: true });
    } catch (cause) {
      const timedOut = cause instanceof Error && cause.name === 'TimeoutError';
      console.warn(
        timedOut
          ? '[enquiry] Web3Forms timed out'
          : '[enquiry] Web3Forms request or response failed',
      );
      return error(timedOut ? 504 : 502, 'PROVIDER_UNAVAILABLE');
    }
  } catch {
    return error(400);
  }
}
