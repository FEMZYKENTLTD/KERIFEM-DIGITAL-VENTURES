import type { FormValues } from './enquiry';
import { BRAND, CONTACT } from './site';

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
  const key = process.env.BREVO_API_KEY?.trim();
  const sender = process.env.BREVO_SENDER_EMAIL?.trim();
  if (!key || !sender) {
    console.warn('[enquiry-alert] Brevo is not configured');
    return 'not_configured';
  }
  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json', 'api-key': key },
      body: JSON.stringify({
        sender: { name: BRAND.name, email: sender },
        to: [{ email: CONTACT.email.primary }],
        subject: `New quote request — ${BRAND.name}`,
        textContent: `A new enquiry was saved. Reference: ${id}. Sign in at /admin/enquiries to view the details.`,
      }),
      signal: AbortSignal.timeout(5000),
      cache: 'no-store',
    });
    if (!response.ok) {
      console.warn('[enquiry-alert] Brevo HTTP rejection:', response.status);
      return 'failed';
    }
    const result = await response.json();
    if (typeof result?.messageId === 'string' && result.messageId.length > 0) return 'accepted';
    console.warn('[enquiry-alert] Brevo did not confirm acceptance');
    return 'failed';
  } catch (error) {
    console.warn(
      '[enquiry-alert]',
      error instanceof Error && error.name === 'TimeoutError'
        ? 'Brevo timed out'
        : 'Brevo transport or response error',
    );
    return 'failed';
  }
}
