export const NOTIFICATION_STATUSES = [
  'accepted',
  'failed',
  'pending',
  'not_configured',
  'ambiguous',
] as const;

export type NotificationStatus = (typeof NOTIFICATION_STATUSES)[number];

export type NotificationCategory =
  | 'configuration'
  | 'authentication'
  | 'sender'
  | 'provider'
  | 'timeout'
  | 'ambiguous'
  | 'accepted';

export type DeliveryEvent =
  | 'unknown'
  | 'delivered'
  | 'hardBounce'
  | 'softBounce'
  | 'blocked'
  | 'spam'
  | 'invalid'
  | 'deferred'
  | 'error';

export type NotificationDetail = {
  status: NotificationStatus;
  category: NotificationCategory;
  httpStatus?: number;
  code?: string;
  message?: string;
  messageId?: string;
  keyFormat?: 'transactional' | 'smtp' | 'other';
  delivery?: DeliveryEvent;
  at: string;
};

export const NOTIFICATION_LABELS: Record<NotificationStatus, string> = {
  accepted: 'Email accepted by provider',
  failed: 'Email delivery failed',
  not_configured: 'Email not configured',
  pending: 'Notification status pending',
  ambiguous: 'Notification status could not be confirmed',
};

export const DELIVERY_LABELS: Record<DeliveryEvent, string> = {
  unknown: 'Inbox delivery is not confirmed',
  delivered: 'Provider reports the message was delivered',
  hardBounce: 'Provider reports a hard bounce',
  softBounce: 'Provider reports a soft bounce',
  blocked: 'Provider blocked the message',
  spam: 'Provider reports a spam complaint',
  invalid: 'Provider reports an invalid recipient',
  deferred: 'Provider deferred delivery',
  error: 'Provider reported a delivery error',
};

export function notificationLabel(status: string) {
  return NOTIFICATION_LABELS[status as NotificationStatus] ?? 'Notification status unknown';
}

export function looksLikeEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function classifyBrevoKey(key: string): NotificationDetail['keyFormat'] {
  if (key.startsWith('xkeysib-')) return 'transactional';
  if (key.startsWith('xsmtpsib-')) return 'smtp';
  return 'other';
}

export function sanitizeProviderMessage(input: string) {
  return input
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '[redacted-email]')
    .replace(/xkeysib-[a-z0-9._-]+/gi, '[redacted-key]')
    .replace(/xsmtpsib-[a-z0-9._-]+/gi, '[redacted-key]')
    .replace(/eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+/g, '[redacted-token]')
    .replace(/\+\d[\d\s()-]{6,}/g, '[redacted-phone]')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 240);
}

export function classifyFailure(input: {
  httpStatus?: number;
  code?: string;
  message?: string;
  timedOut?: boolean;
}): { status: NotificationStatus; category: NotificationCategory } {
  const blob = `${input.code ?? ''} ${input.message ?? ''}`.toLowerCase();
  if (input.timedOut) return { status: 'ambiguous', category: 'timeout' };
  if (
    input.httpStatus === 401 ||
    input.httpStatus === 403 ||
    /unauthor|api.?key|authentication/.test(blob)
  ) {
    return { status: 'failed', category: 'authentication' };
  }
  if (
    input.httpStatus === 400 &&
    /sender|from address|unrecognised|unrecognized sender|invalid_parameter/.test(blob)
  ) {
    return { status: 'failed', category: 'sender' };
  }
  if (!input.httpStatus) return { status: 'failed', category: 'provider' };
  return { status: 'failed', category: 'provider' };
}
