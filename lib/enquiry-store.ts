import type { FormValues } from './enquiry';
import type { NotificationDetail, NotificationStatus } from './notification';
import type { WorkflowStatus } from './workflow';
import { notifyOwner, type NotifyResult } from './brevo';

export type Enquiry = {
  id: string;
  created_at: string;
  payload: FormValues;
  notification: NotificationStatus | string;
  notification_detail?: NotificationDetail | Record<string, never> | null;
  notification_message_id?: string | null;
  workflow_status?: WorkflowStatus | string;
  deleted_at?: string | null;
};

export { notifyOwner, type NotifyResult };

function enquiryStoreConfig() {
  // Prefer the integration-managed pair, without combining credentials from different projects.
  const integrationUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const integrationKey = process.env.SUPABASE_SECRET_KEY;
  if (integrationUrl && integrationKey) return { url: integrationUrl, key: integrationKey };
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return url && key ? { url, key } : null;
}

export function enquiryStoreConfigured() {
  return Boolean(enquiryStoreConfig());
}

async function enquiryApi(path: string, init: RequestInit = {}) {
  const config = enquiryStoreConfig();
  if (!config) throw new Error('Enquiry storage is not configured');
  const response = await fetch(`${config.url.replace(/\/$/, '')}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: config.key,
      // New secret keys are not JWTs; legacy service-role JWTs still need a bearer header.
      ...(!config.key.startsWith('sb_secret_') ? { Authorization: `Bearer ${config.key}` } : {}),
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
    orders?: Record<string, number>;
    days: { day: string; count: number }[];
    months?: {
      month: string;
      count: number;
      pending: number;
      completed: number;
      cancelled: number;
    }[];
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
