import { formatSubmissionTime } from '@/lib/submission-time';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { z } from 'zod';
import { requireOwner } from '@/lib/admin-auth';
import { enquiryStore, type Enquiry } from '@/lib/enquiry-store';
import { BUDGET_OPTIONS, CONTACT_METHODS, SERVICE_OPTIONS, TIMELINES } from '@/lib/content';
import { deleteEnquiry, retryAlert, saveEnquiry } from '../../actions';

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
      const response = await enquiryStore(`?id=eq.${id}&select=id,created_at,payload,notification`);
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
      <Link href="/admin/enquiries">← Back to inbox</Link>
      <h1>{row ? row.payload.projectTitle || 'Enquiry details' : 'New enquiry'}</h1>
      {row && (
        <p>
          {row.id} · Alert: {row.notification.replaceAll('_', ' ')} ·{' '}
          <time dateTime={row.created_at}>{formatSubmissionTime(row.created_at)}</time>
        </p>
      )}
      {row && ['failed', 'not_configured'].includes(row.notification) && (
        <form action={retryAlert.bind(null, id)}>
          <button className="admin-secondary">Retry email alert</button>
          <p className="admin-hint">Only a reference is sent, not the customer’s details.</p>
        </form>
      )}
      {notice && (
        <p className="admin-notice" role="alert">
          {notice === 'alert-accepted'
            ? 'Brevo accepted the retry. Check the business inbox for delivery.'
            : notice === 'alert-failed'
              ? 'The alert was not accepted. The enquiry is still saved.'
              : notice === 'alert-unavailable'
                ? 'The retry could not be confirmed. Check the alert status and mailbox before retrying.'
                : notice === 'invalid'
                  ? 'Some fields did not meet the quote form requirements. Check the required fields and project description.'
                  : notice === 'confirm'
                    ? 'Confirm permanent deletion before continuing.'
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
      {row && (
        <details className="admin-danger">
          <summary>Delete this enquiry</summary>
          <form action={deleteEnquiry.bind(null, id)}>
            <label>
              <input name="confirmDelete" value="yes" type="checkbox" required /> I understand this
              permanently deletes the record.
            </label>
            <button>Delete permanently</button>
          </form>
        </details>
      )}
    </section>
  );
}
