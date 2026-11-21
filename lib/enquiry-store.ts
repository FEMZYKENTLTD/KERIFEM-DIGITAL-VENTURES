import type { FormValues } from './enquiry';
import { BRAND } from './site';

export type Enquiry = { id: string; created_at: string; payload: FormValues; notification: string };

export function enquiryStoreConfigured() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

async function enquiryApi(path: string, init: RequestInit = {}) {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key || !process.env.SUPABASE_URL) throw new Error('Enquiry storage is not configured');
  const response = await fetch(`${process.env.SUPABASE_URL.replace(/\/$/, '')}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      ...init.headers,
    },
    cache: 'no-store',
    signal: AbortSignal.timeout(6000),
  });
  if (!response.ok) throw new Error(`Enquiry storage HTTP ${response.status}`);
  return response;
}

export function enquiryStore(query: string, init: RequestInit = {}) {
  return enquiryApi(`enquiries${query}`, init);
}

export async function enquiryMetrics() {
  const response = await enquiryApi('rpc/enquiry_metrics');
  return (await response.json()) as {
    services: Record<string, number>;
    budgets: Record<string, number>;
    days: { day: string; count: number }[];
  };
}

export async function notifyOwner(id: string) {
  const key = process.env.WEB3FORMS_ACCESS_KEY?.trim();
  if (!key) {
    console.warn('[enquiry-alert] Web3Forms is not configured');
    return 'not_configured';
  }
  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: key,
        subject: `New quote request — ${BRAND.name}`,
        from_name: BRAND.name,
        message: `A new enquiry was saved. Reference: ${id}. Sign in at /admin/enquiries to view the details.`,
      }),
      signal: AbortSignal.timeout(5000),
      cache: 'no-store',
    });
    if (!response.ok) {
      console.warn('[enquiry-alert] Web3Forms HTTP rejection:', response.status);
      return 'failed';
    }
    const result = await response.json();
    if (result?.success === true) return 'accepted';
    console.warn('[enquiry-alert] Web3Forms did not confirm acceptance');
    return 'failed';
  } catch (error) {
    console.warn(
      '[enquiry-alert]',
      error instanceof Error && error.name === 'TimeoutError'
        ? 'Web3Forms timed out'
        : 'Web3Forms transport or response error',
    );
    return 'failed';
  }
}
