import { schema } from '@/lib/enquiry';
import {
  enquiryStore,
  enquiryStoreConfigured,
  notifyOwner,
  type Enquiry,
} from '@/lib/enquiry-store';

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
    if (!enquiryStoreConfigured()) return error(503, 'FORM_NOT_CONFIGURED');
    const { botcheck, ...payload } = parsed.data;
    void botcheck;
    let id: string;
    try {
      const response = await enquiryStore('?select=id', {
        method: 'POST',
        headers: { Prefer: 'return=representation' },
        body: JSON.stringify({ payload }),
      });
      const rows = (await response.json()) as Pick<Enquiry, 'id'>[];
      if (!rows[0]?.id) return error(502, 'PROVIDER_UNAVAILABLE');
      id = rows[0].id;
    } catch {
      console.warn('[enquiry] Could not confirm the submission was saved');
      return error(502, 'PROVIDER_UNAVAILABLE');
    }
    const notification = await notifyOwner(id);
    try {
      await enquiryStore(`?id=eq.${encodeURIComponent(id)}`, {
        method: 'PATCH',
        body: JSON.stringify({ notification }),
      });
    } catch {
      console.warn('[enquiry] Notification status could not be recorded');
    }
    return Response.json({ success: true });
  } catch {
    return error(400);
  }
}
