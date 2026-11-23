import { BRAND, CONTACT } from './site';
import {
  classifyBrevoKey,
  classifyFailure,
  looksLikeEmail,
  sanitizeProviderMessage,
  type DeliveryEvent,
  type NotificationCategory,
  type NotificationDetail,
  type NotificationStatus,
} from './notification';

const SEND_URL = 'https://api.brevo.com/v3/smtp/email';
const EVENTS_URL = 'https://api.brevo.com/v3/smtp/statistics/events';
const SEND_TIMEOUT_MS = 12000;
const PRODUCTION_ORIGIN = 'https://kerifem-digital-ventures.vercel.app';

export type NotifyResult = {
  status: NotificationStatus;
  detail: NotificationDetail;
};

export type BrevoHealth = {
  keyPresent: boolean;
  keyLooksTransactional: boolean;
  keyLooksLikeSmtp: boolean;
  senderPresent: boolean;
  senderLooksLikeEmail: boolean;
};

function nowIso() {
  return new Date().toISOString();
}

function adminOrigin() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '');
  if (configured && !/localhost|127\.0\.0\.1/i.test(configured)) return configured;
  if (process.env.VERCEL_ENV === 'production') return PRODUCTION_ORIGIN;
  return PRODUCTION_ORIGIN;
}

function notificationRecipient() {
  const override = process.env.ENQUIRY_TO_EMAIL?.trim();
  if (override && looksLikeEmail(override)) return override;
  return CONTACT.email.primary;
}

function detail(partial: Omit<NotificationDetail, 'at'> & { at?: string }): NotificationDetail {
  return { ...partial, at: partial.at ?? nowIso() };
}

export function brevoHealth(): BrevoHealth {
  const key = process.env.BREVO_API_KEY?.trim() ?? '';
  const sender = process.env.BREVO_SENDER_EMAIL?.trim() ?? '';
  return {
    keyPresent: Boolean(key),
    keyLooksTransactional: classifyBrevoKey(key) === 'transactional',
    keyLooksLikeSmtp: classifyBrevoKey(key) === 'smtp',
    senderPresent: Boolean(sender),
    senderLooksLikeEmail: looksLikeEmail(sender),
  };
}

function logSafe(message: string, extra?: Record<string, string | number | undefined>) {
  const parts = Object.entries(extra ?? {})
    .filter(([, value]) => value !== undefined && value !== '')
    .map(([key, value]) => `${key}=${value}`);
  console.warn('[enquiry-alert]', message, ...parts);
}

function parseBrevoBody(text: string) {
  try {
    return JSON.parse(text) as {
      messageId?: unknown;
      code?: unknown;
      message?: unknown;
    };
  } catch {
    return {};
  }
}

function readString(value: unknown) {
  return typeof value === 'string' && value.trim() ? value.trim() : '';
}

export async function notifyOwner(id: string, submittedAt?: string): Promise<NotifyResult> {
  const key = process.env.BREVO_API_KEY?.trim() ?? '';
  const sender = process.env.BREVO_SENDER_EMAIL?.trim() ?? '';
  if (!key || !sender) {
    logSafe('Brevo is not configured', {
      key: key ? 'present' : 'missing',
      sender: sender ? 'present' : 'missing',
    });
    return {
      status: 'not_configured',
      detail: detail({
        status: 'not_configured',
        category: 'configuration',
        message: 'Brevo API key or verified sender is missing for this deployment.',
      }),
    };
  }

  const keyFormat = classifyBrevoKey(key);
  if (!looksLikeEmail(sender)) {
    logSafe('Sender is not a valid email address');
    return {
      status: 'failed',
      detail: detail({
        status: 'failed',
        category: 'sender',
        keyFormat,
        message: 'BREVO_SENDER_EMAIL is not a valid email address.',
      }),
    };
  }

  const recipient = notificationRecipient();
  const adminUrl = `${adminOrigin()}/admin/enquiries/${encodeURIComponent(id)}`;
  const submitted = submittedAt ? new Date(submittedAt).toISOString() : nowIso();
  const textContent = [
    'A new quote request was saved for KERIFEM DIGITAL VENTURES.',
    '',
    `Reference: ${id}`,
    `Submitted: ${submitted}`,
    '',
    `Open the enquiry: ${adminUrl}`,
    '',
    'This alert contains a reference only. Customer details stay in the private inbox.',
  ].join('\n');
  const htmlContent = `<p>A new quote request was saved for <strong>KERIFEM DIGITAL VENTURES</strong>.</p>
<p>Reference: <code>${id}</code><br />Submitted: ${submitted}</p>
<p><a href="${adminUrl}">Open this enquiry in the owner workspace</a></p>
<p>This alert contains a reference only. Customer details stay in the private inbox.</p>`;

  try {
    const response = await fetch(SEND_URL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'api-key': key,
      },
      body: JSON.stringify({
        sender: { name: BRAND.name, email: sender },
        to: [{ email: recipient }],
        subject: `New Quote Request - ${BRAND.name}`,
        textContent,
        htmlContent,
        tags: ['quote-enquiry'],
      }),
      signal: AbortSignal.timeout(SEND_TIMEOUT_MS),
      cache: 'no-store',
    });
    const raw = await response.text();
    const body = parseBrevoBody(raw);
    const code = sanitizeProviderMessage(readString(body.code));
    const message = sanitizeProviderMessage(readString(body.message) || raw.slice(0, 180));
    const messageId = readString(body.messageId);

    if (!response.ok) {
      const classified = classifyFailure({
        httpStatus: response.status,
        code,
        message,
      });
      const hint =
        keyFormat === 'smtp'
          ? ' The configured key looks like a Brevo SMTP key, not a transactional API key.'
          : keyFormat === 'other'
            ? ' The configured key does not look like a Brevo transactional API key (xkeysib-).'
            : classified.category === 'sender'
              ? ' Confirm BREVO_SENDER_EMAIL is a verified transactional sender in Brevo.'
              : '';
      logSafe('Brevo HTTP rejection', {
        httpStatus: response.status,
        code,
        category: classified.category,
        keyFormat,
      });
      return {
        status: classified.status,
        detail: detail({
          status: classified.status,
          category: classified.category,
          httpStatus: response.status,
          code: code || undefined,
          message: `${message || 'Provider rejected the request.'}${hint}`.trim(),
          keyFormat,
        }),
      };
    }

    if (!messageId) {
      logSafe('Brevo did not confirm acceptance', { httpStatus: response.status });
      return {
        status: 'ambiguous',
        detail: detail({
          status: 'ambiguous',
          category: 'ambiguous',
          httpStatus: response.status,
          message: 'The provider responded without a message id, so acceptance is unconfirmed.',
          keyFormat,
        }),
      };
    }

    return {
      status: 'accepted',
      detail: detail({
        status: 'accepted',
        category: 'accepted',
        httpStatus: response.status,
        messageId,
        delivery: 'unknown',
        keyFormat,
        message: 'Brevo accepted the request. This is not confirmation of inbox delivery.',
      }),
    };
  } catch (error) {
    const timedOut = error instanceof Error && error.name === 'TimeoutError';
    const classified = classifyFailure({ timedOut });
    logSafe(timedOut ? 'Brevo timed out' : 'Brevo transport or response error', {
      category: classified.category,
    });
    return {
      status: classified.status,
      detail: detail({
        status: classified.status,
        category: classified.category,
        message: timedOut
          ? 'The provider did not respond in time. The enquiry is saved; a message may or may not have been accepted.'
          : 'The notification request did not complete.',
        keyFormat,
      }),
    };
  }
}

const DELIVERY_EVENTS: DeliveryEvent[] = [
  'delivered',
  'hardBounce',
  'softBounce',
  'blocked',
  'spam',
  'invalid',
  'deferred',
  'error',
];

export async function lookupDelivery(messageId: string): Promise<DeliveryEvent> {
  const key = process.env.BREVO_API_KEY?.trim();
  if (!key || !messageId) return 'unknown';
  try {
    const url = new URL(EVENTS_URL);
    url.searchParams.set('messageId', messageId);
    url.searchParams.set('limit', '20');
    const response = await fetch(url, {
      headers: { Accept: 'application/json', 'api-key': key },
      signal: AbortSignal.timeout(8000),
      cache: 'no-store',
    });
    if (!response.ok) return 'unknown';
    const payload = (await response.json()) as { events?: { event?: string }[] };
    const events = new Set((payload.events ?? []).map((item) => item.event));
    return DELIVERY_EVENTS.find((event) => events.has(event)) ?? 'unknown';
  } catch {
    logSafe('Could not read Brevo delivery events');
    return 'unknown';
  }
}

export function categoryHint(category: NotificationCategory) {
  switch (category) {
    case 'configuration':
      return 'Add BREVO_API_KEY and BREVO_SENDER_EMAIL for this environment, then retry.';
    case 'authentication':
      return 'Use a Brevo transactional API key (SMTP & API → API keys), not an SMTP key.';
    case 'sender':
      return 'Verify the sender in Brevo and confirm it is allowed for transactional email.';
    case 'timeout':
      return 'The previous attempt timed out. Check the inbox before retrying to avoid a duplicate.';
    case 'ambiguous':
      return 'Acceptance was not confirmed. Check the inbox before retrying.';
    case 'provider':
      return 'The email provider rejected or failed the request. Check Brevo transactional logs.';
    default:
      return 'Provider acceptance is not the same as inbox delivery.';
  }
}
