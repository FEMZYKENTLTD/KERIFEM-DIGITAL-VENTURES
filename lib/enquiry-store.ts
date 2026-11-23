import type { FormValues } from './enquiry';
import type { NotificationDetail, NotificationStatus } from './notification';
import { notifyOwner, type NotifyResult } from './brevo';

export type Enquiry = {
  id: string;
  created_at: string;
  payload: FormValues;
  notification: NotificationStatus | string;
  notification_detail?: NotificationDetail | Record<string, never> | null;
  notification_message_id?: string | null;
};

export { notifyOwner, type NotifyResult };

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

export async function recordNotification(id: string, result: NotifyResult) {
  const body = {
    notification: result.status,
    notification_detail: result.detail,
    notification_message_id: result.detail.messageId ?? null,
  };
  try {
    await enquiryStore(`?id=eq.${encodeURIComponent(id)}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  } catch {
    try {
      await enquiryStore(`?id=eq.${encodeURIComponent(id)}`, {
        method: 'PATCH',
        body: JSON.stringify({ notification: result.status }),
      });
    } catch {
      console.warn('[enquiry] Notification status could not be recorded');
    }
  }
}
