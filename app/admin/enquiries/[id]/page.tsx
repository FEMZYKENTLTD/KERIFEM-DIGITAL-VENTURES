import { formatSubmissionTime } from '@/lib/submission-time';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { z } from 'zod';
import { requireOwner } from '@/lib/admin-auth';
import { categoryHint } from '@/lib/brevo';
import { enquiryStore, type Enquiry } from '@/lib/enquiry-store';
import { BUDGET_OPTIONS, CONTACT_METHODS, SERVICE_OPTIONS, TIMELINES } from '@/lib/content';
import {
  DELIVERY_LABELS,
  notificationLabel,
  type DeliveryEvent,
  type NotificationCategory,
  type NotificationDetail,
} from '@/lib/notification';
import {
  moveToBin,
  purgeEnquiry,
  refreshDelivery,
  restoreEnquiry,
  retryAlert,
  saveEnquiry,
  setWorkflowStatus,
} from '../../actions';
import { WORKFLOW_STATUSES, workflowLabel } from '@/lib/workflow';

const fields = [
  ['name', 'Full name', 120, true, 'text'],
  ['email', 'Email', 254, true, 'email'],
  ['phone', 'Phone or WhatsApp', 24, true, 'tel'],
  ['country', 'Country', 100, true, 'text'],
  ['projectTitle', 'Project title', 160, false, 'text'],
  ['reference', 'Reference URL', 500, false, 'url'],
] as const;
const choices = [
  ['service', 'Service', SERVICE_OPTIONS, true],
  ['timeline', 'Timeline', TIMELINES, true],
  ['budget', 'Budget (USD)', BUDGET_OPTIONS, false],
  ['contactMethod', 'Preferred contact', CONTACT_METHODS, true],
] as const;

export default async function EnquiryPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ notice?: string }>;
}) {
  await requireOwner();
  const { id } = await params;
  const { notice } = await searchParams;
  let row: Enquiry | undefined;
  if (id !== 'new') {
    if (!z.string().uuid().safeParse(id).success) notFound();
    try {
      const response = await enquiryStore(
        `?id=eq.${id}&select=id,created_at,payload,notification,notification_detail,notification_message_id,workflow_status,deleted_at`,
      );
      [row] = (await response.json()) as Enquiry[];
    } catch {
      return (
        <section className="admin-panel">
          <h1>Enquiry unavailable</h1>
          <p role="alert">The database could not be reached.</p>
          <Link href="/admin/enquiries">Back to inbox</Link>
        </section>
      );
    }
    if (!row) notFound();
  }
  return (
    <section className="admin-panel">
      <Link href={row?.deleted_at ? '/admin/enquiries/bin' : '/admin/enquiries'}>
        {row?.deleted_at ? '← Back to recycle bin' : '← Back to inbox'}
      </Link>
      <h1>{row ? row.payload.projectTitle || 'Enquiry details' : 'New enquiry'}</h1>
      {row && (
        <p>
          {row.id} · Order: {workflowLabel(row.workflow_status || 'pending')} · Alert:{' '}
          {notificationLabel(row.notification)} ·{' '}
          <time dateTime={row.created_at}>{formatSubmissionTime(row.created_at)}</time>
        </p>
      )}
      {row?.deleted_at && (
        <p className="admin-notice" role="status">
          This enquiry is in the recycle bin. Restore it to return it to the inbox, or delete it
          permanently.
        </p>
      )}
      {row && !row.deleted_at && (
        <form action={setWorkflowStatus.bind(null, id)} className="admin-workflow">
          <p className="admin-hint">Mark this order:</p>
          {WORKFLOW_STATUSES.map((status) => (
            <button
              key={status}
              name="workflow"
              value={status}
              className={row.workflow_status === status ? undefined : 'admin-secondary'}
              aria-pressed={row.workflow_status === status}
            >
              {workflowLabel(status)}
            </button>
          ))}
        </form>
      )}
      {row && <AlertDiagnostics enquiry={row} />}
      {row && ['failed', 'not_configured', 'ambiguous'].includes(row.notification) && (
        <form action={retryAlert.bind(null, id)}>
          <button className="admin-secondary">Retry email alert</button>
          <p className="admin-hint">
            Only a reference is sent, not the customer’s details.
            {row.notification === 'ambiguous'
              ? ' The previous attempt was unconfirmed, so check the inbox before retrying.'
              : ''}
          </p>
        </form>
      )}
      {row && (row.notification_message_id || row.notification_detail?.messageId) && (
        <form action={refreshDelivery.bind(null, id)}>
          <button className="admin-secondary">Check delivery status</button>
          <p className="admin-hint">
            This asks Brevo whether the accepted message was delivered, bounced or blocked. It does
            not send another email.
          </p>
        </form>
      )}
      {notice && (
        <p className="admin-notice" role="alert">
          {notice === 'alert-accepted'
            ? 'Brevo accepted the retry. Check the business inbox for delivery.'
            : notice === 'alert-failed'
              ? 'The alert was not accepted. The enquiry is still saved.'
              : notice === 'alert-ambiguous'
                ? 'The retry did not confirm acceptance. Check the inbox before sending again.'
                : notice === 'alert-unavailable'
                  ? 'The retry could not be confirmed. Check the alert status and mailbox before retrying.'
                  : notice === 'delivery-reported'
                    ? 'Brevo reports that the message was delivered to the mailbox provider. Confirm the inbox separately.'
                    : notice === 'delivery-unknown'
                      ? 'Delivery could not be confirmed yet. Check Brevo logs and the business inbox.'
                      : notice === 'status'
                        ? 'Order status updated.'
                        : notice === 'restored'
                          ? 'Enquiry restored to the inbox.'
                          : notice === 'invalid'
                            ? 'Some fields did not meet the quote form requirements. Check the required fields and project description.'
                            : notice === 'confirm'
                              ? 'Confirm the recycle bin or permanent deletion step before continuing.'
                              : 'The change could not be confirmed. Check the inbox before retrying.'}
        </p>
      )}
      <form action={saveEnquiry.bind(null, id)} className="admin-editor">
        {fields.map(([key, label, maxLength, required, type]) => (
          <label key={key}>
            {label}
            <input
              name={key}
              type={type}
              required={required}
              maxLength={maxLength}
              defaultValue={row?.payload[key]}
            />
          </label>
        ))}
        {choices.map(([key, label, options, required]) => (
          <label key={key}>
            {label}
            <select name={key} required={required} defaultValue={row?.payload[key] || ''}>
              <option value="">{required ? 'Select an option' : 'Not specified'}</option>
              {options.map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
          </label>
        ))}
        <label className="admin-span">
          Project description
          <textarea
            name="message"
            required
            minLength={20}
            maxLength={4000}
            rows={7}
            defaultValue={row?.payload.message}
          />
        </label>
        <div className="admin-span">
          <button>Save enquiry</button>
          <p className="admin-hint">Manual edits and new records do not send an email alert.</p>
        </div>
      </form>
      {row && !row.deleted_at && (
        <details className="admin-danger">
          <summary>Move to recycle bin</summary>
          <form action={moveToBin.bind(null, id)}>
            <label>
              <input name="confirmDelete" value="yes" type="checkbox" required /> Move this enquiry
              to the recycle bin. It can be restored later.
            </label>
            <button>Move to recycle bin</button>
          </form>
        </details>
      )}
      {row?.deleted_at && (
        <>
          <form action={restoreEnquiry.bind(null, id)}>
            <button className="admin-secondary">Restore to inbox</button>
          </form>
          <details className="admin-danger">
            <summary>Delete permanently</summary>
            <form action={purgeEnquiry.bind(null, id)}>
              <label>
                <input name="confirmDelete" value="yes" type="checkbox" required /> I understand
                this permanently deletes the record. This cannot be undone.
              </label>
              <button>Delete permanently</button>
            </form>
          </details>
        </>
      )}
    </section>
  );
}

function AlertDiagnostics({ enquiry }: { enquiry: Enquiry }) {
  const detail = (enquiry.notification_detail ?? {}) as Partial<NotificationDetail>;
  const category = detail.category as NotificationCategory | undefined;
  const delivery = (detail.delivery as DeliveryEvent | undefined) ?? 'unknown';
  const items = [
    ['Status', notificationLabel(enquiry.notification)],
    category ? ['Category', category.replaceAll('_', ' ')] : null,
    detail.httpStatus ? ['HTTP status', String(detail.httpStatus)] : null,
    detail.code ? ['Provider code', detail.code] : null,
    detail.keyFormat ? ['Key format', detail.keyFormat] : null,
    enquiry.notification_message_id || detail.messageId
      ? ['Provider reference', 'Recorded (not shown in full in the list)']
      : null,
    enquiry.notification === 'accepted' || detail.messageId
      ? ['Delivery', DELIVERY_LABELS[delivery]]
      : null,
    detail.message ? ['Diagnostic', detail.message] : null,
    detail.at ? ['Checked', formatSubmissionTime(detail.at)] : null,
  ].filter(Boolean) as [string, string][];
  return (
    <div className="admin-diagnostics">
      <h2>Notification diagnostics</h2>
      <dl>
        {items.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
      {category ? <p className="admin-hint">{categoryHint(category)}</p> : null}
    </div>
  );
}
