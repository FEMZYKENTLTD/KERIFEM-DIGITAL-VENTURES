import { z } from 'zod';

// Only the documented, currently free Discover endpoint is exposed here. Search
// results are untrusted provider claims, not verified contacts or permission to email.
export const hunterQuery = z.string().trim().min(4).max(200);
const domain = z.string().max(253).regex(/^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/i);
const responseSchema = z.object({
  data: z.array(z.object({ domain, organization: z.string().trim().min(1).max(200).nullable().optional() })).max(100),
});
export type HunterCompany = { domain: string; name: string };
export class HunterError extends Error {
  constructor(public code: 'configuration' | 'denied' | 'limited' | 'unavailable' | 'invalid_response') {
    super(code);
  }
}
export async function discoverCompanies(query: string, key: string, request: typeof fetch = fetch): Promise<HunterCompany[]> {
  if (!key || key === 'test-api-key' || /[\r\n]/.test(key)) throw new HunterError('configuration');
  const checked = hunterQuery.safeParse(query);
  if (!checked.success) throw new HunterError('invalid_response');
  let response: Response;
  try {
    response = await request('https://api.hunter.io/v2/discover', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-API-KEY': key },
      body: JSON.stringify({ query: checked.data, limit: 20 }),
      cache: 'no-store',
      redirect: 'error',
      signal: AbortSignal.timeout(10000),
    });
  } catch {
    throw new HunterError('unavailable');
  }
  if (response.status === 401 || response.status === 403) throw new HunterError('denied');
  if (response.status === 429) throw new HunterError('limited');
  if (!response.ok) throw new HunterError('unavailable');
  // Reject large responses instead of trusting the provider's declared length.
  if (!response.body) throw new HunterError('invalid_response');
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 131072) { await reader.cancel(); throw new HunterError('invalid_response'); }
      chunks.push(value);
    }
    const bytes = new Uint8Array(size);
    let position = 0;
    for (const chunk of chunks) { bytes.set(chunk, position); position += chunk.byteLength; }
    const result = responseSchema.safeParse(JSON.parse(new TextDecoder().decode(bytes)));
    if (!result.success) throw new HunterError('invalid_response');
    return result.data.data.slice(0, 20).map((company) => ({ domain: company.domain.toLowerCase(), name: company.organization || company.domain }));
  } catch {
    throw new HunterError('invalid_response');
  }
}
