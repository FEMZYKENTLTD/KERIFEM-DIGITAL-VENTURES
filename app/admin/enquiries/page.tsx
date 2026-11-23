import { formatSubmissionTime } from '@/lib/submission-time';
import Link from 'next/link';
import { requireOwner, OWNER_EMAIL } from '@/lib/admin-auth';
import { brevoHealth } from '@/lib/brevo';
import { enquiryStore, type Enquiry } from '@/lib/enquiry-store';
import { SERVICE_OPTIONS } from '@/lib/content';
import { NOTIFICATION_STATUSES, notificationLabel } from '@/lib/notification';
import {
  ACTIVE_ENQUIRIES,
  WORKFLOW_STATUSES,
  isWorkflowStatus,
  workflowLabel,
} from '@/lib/workflow';
import { DashboardCharts } from './DashboardCharts';
import { signOut } from '../actions';

const PAGE_SIZE = 25;
const notifications = [...NOTIFICATION_STATUSES];
const single = (value: unknown) => (typeof value === 'string' ? value : '');

async function count(filter = '') {
  const response = await enquiryStore(`?select=id${filter}`, {
    method: 'HEAD',
    headers: { Prefer: 'count=exact' },
  });
  const total = response.headers.get('content-range')?.split('/').pop();
  if (!total || !/^\d+$/.test(total)) throw new Error('Count unavailable');
  return Number(total);
}

export default async function InboxPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireOwner();
  const params = await searchParams;
  const search = single(params.q)
    .replace(/[^\p{L}\p{N}@. \-+]/gu, ' ')
    .trim()
    .slice(0, 100);
  const requestedStatus = single(params.status);
  const status = notifications.includes(requestedStatus as (typeof notifications)[number])
    ? requestedStatus
    : '';
  const service = SERVICE_OPTIONS.find((item) => item === params.service) || '';
  const requestedWorkflow = single(params.workflow);
  const workflow = isWorkflowStatus(requestedWorkflow) ? requestedWorkflow : '';
  const page = Math.max(1, Math.min(10000, Number.parseInt(single(params.page), 10) || 1));
  const filters = new URLSearchParams();
  filters.set('deleted_at', 'is.null');
  if (status) filters.set('notification', `eq.${status}`);
  if (workflow) filters.set('workflow_status', `eq.${workflow}`);
  if (service) filters.set('payload->>service', `eq.${service}`);
  if (search)
    filters.set(
      'or',
      `(${['name', 'email', 'projectTitle'].map((key) => `payload->>${key}.ilike.*${search}*`).join(',')})`,
    );
  const filter = filters.size ? `&${filters}` : '';
  let data;
  try {
    const recent = new Date(Date.now() - 7 * 86400000).toISOString();
    const active = `&${ACTIVE_ENQUIRIES}`;
    const [
      total,
      lastWeek,
      accepted,
      failed,
      waiting,
      pending,
      completed,
      cancelled,
      bin,
      matched,
    ] = await Promise.all([
      count(active),
      count(`${active}&created_at=gte.${recent}`),
      count(`${active}&notification=eq.accepted`),
      count(`${active}&notification=eq.failed`),
      count(`${active}&notification=in.(pending,not_configured,ambiguous)`),
      count(`${active}&workflow_status=eq.pending`),
      count(`${active}&workflow_status=eq.completed`),
      count(`${active}&workflow_status=eq.cancelled`),
      count('&deleted_at=not.is.null'),
      count(filter),
    ]);
    const last = Math.max(1, Math.ceil(matched / PAGE_SIZE));
    const current = Math.min(page, last);
    const response = await enquiryStore(
      `?select=id,created_at,payload,notification,workflow_status,deleted_at&order=created_at.desc,id.desc&limit=${PAGE_SIZE}&offset=${(current - 1) * PAGE_SIZE}${filter}`,
    );
    data = {
      total,
      lastWeek,
      accepted,
      failed,
      waiting,
      pending,
      completed,
      cancelled,
      bin,
      matched,
      last,
      current,
      rows: (await response.json()) as Enquiry[],
    };
  } catch {
    return (
      <section className="admin-panel">
        <h1>Enquiry inbox</h1>
        <p role="alert">
          The database is temporarily unavailable. Check the server configuration and try again.
        </p>
        <Link href="/admin/growth-os">Open GrowthOS</Link>
      </section>
    );
  }
  const link = (number: number) =>
    `/admin/enquiries?${new URLSearchParams({ page: String(number), q: search, service, status, workflow })}`;
  return (
    <>
      <header className="admin-header">
        <div>
          <h1>Enquiry inbox</h1>
          <p>{OWNER_EMAIL} · Owner access</p>
        </div>
        <nav aria-label="Workspace actions">
          <Link href="/admin/growth-os">✦ GrowthOS</Link>
          <Link href="/admin/enquiries/new">+ New enquiry</Link>
          <Link href="/admin/enquiries/bin">Recycle bin ({data.bin})</Link>
          <Link href="/admin/account">Change password</Link>
          <form action={signOut}>
            <button className="admin-secondary">Sign out</button>
          </form>
        </nav>
      </header>
      <dl className="admin-metrics">
        {[
          ['Active enquiries', data.total],
          ['Last 7 days', data.lastWeek],
          ['Pending', data.pending],
          ['Completed', data.completed],
          ['Cancelled', data.cancelled],
          ['Alerts accepted', data.accepted],
          ['Alerts failed', data.failed],
          ['Pending / no alert', data.waiting],
        ].map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{Number(value).toLocaleString('en-GB')}</dd>
          </div>
        ))}
      </dl>
      <p className="admin-hint">
        Metrics exclude the recycle bin. “Accepted” means the email provider accepted the request,
        not that the business inbox received it.
      </p>
      <BrevoHealth />
      <DashboardCharts />
      <section className="admin-panel" aria-labelledby="submissions">
        <h2 id="submissions">Submissions</h2>
        {['saved', 'binned'].includes(single(params.notice)) && (
          <p className="admin-notice" role="status">
            {params.notice === 'saved'
              ? 'Enquiry saved.'
              : 'Enquiry moved to the recycle bin. Restore it from Recycle bin if needed.'}
          </p>
        )}
        <form className="admin-filters">
          <label>
            Search
            <input
              name="q"
              defaultValue={search}
              maxLength={100}
              placeholder="Name, email, or project"
            />
          </label>
          <label>
            Service
            <select name="service" defaultValue={service}>
              <option value="">All services</option>
              {SERVICE_OPTIONS.map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
          </label>
          <label>
            Order status
            <select name="workflow" defaultValue={workflow}>
              <option value="">All orders</option>
              {WORKFLOW_STATUSES.map((value) => (
                <option key={value} value={value}>
                  {workflowLabel(value)}
                </option>
              ))}
            </select>
          </label>
          <label>
            Alert status
            <select name="status" defaultValue={status}>
              <option value="">All alerts</option>
              {notifications.map((value) => (
                <option key={value} value={value}>
                  {notificationLabel(value)}
                </option>
              ))}
            </select>
          </label>
          <button>Apply filters</button>
          <Link href="/admin/enquiries">Clear</Link>
        </form>
        <p>
          {data.matched.toLocaleString('en-GB')} matching · Page {data.current} of {data.last}
        </p>
        {data.rows.length > 0 ? (
          <div className="admin-table" tabIndex={0} role="region" aria-label="Enquiry results">
            <table>
              <thead>
                <tr>
                  <th scope="col">Project / contact</th>
                  <th scope="col">Service</th>
                  <th scope="col">Budget</th>
                  <th scope="col">Submitted (WAT)</th>
                  <th scope="col">Order</th>
                  <th scope="col">Alert</th>
                </tr>
              </thead>
              <tbody>
                {data.rows.map((row) => (
                  <tr key={row.id}>
                    <td>
                      <Link href={`/admin/enquiries/${row.id}`} prefetch={false}>
                        {row.payload.projectTitle || row.payload.name}
                      </Link>
                      <small>{row.payload.name}</small>
                    </td>
                    <td>{row.payload.service}</td>
                    <td>{row.payload.budget || '—'}</td>
                    <td>
                      <time dateTime={row.created_at}>{formatSubmissionTime(row.created_at)}</time>
                    </td>
                    <td>
                      <span className="admin-chip" data-workflow={row.workflow_status || 'pending'}>
                        {workflowLabel(row.workflow_status || 'pending')}
                      </span>
                    </td>
                    <td>
                      <span className="admin-chip" data-status={row.notification}>
                        {notificationLabel(row.notification)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No enquiries match these filters.</p>
        )}
        <nav className="admin-pagination" aria-label="Enquiry result pages">
          {data.current > 1 && <Link href={link(data.current - 1)}>← Previous</Link>}
          {data.current < data.last && <Link href={link(data.current + 1)}>Next →</Link>}
        </nav>
      </section>
    </>
  );
}

function BrevoHealth() {
  const health = brevoHealth();
  const ready =
    health.keyPresent &&
    health.keyLooksTransactional &&
    health.senderPresent &&
    health.senderLooksLikeEmail;
  return (
    <section className="admin-panel admin-health" aria-labelledby="alert-config">
      <h2 id="alert-config">Email alert configuration</h2>
      <ul>
        <li>{health.keyPresent ? 'Brevo API key is present.' : 'Brevo API key is missing.'}</li>
        <li>
          {health.keyLooksTransactional
            ? 'The key looks like a transactional API key.'
            : health.keyLooksLikeSmtp
              ? 'The key looks like an SMTP key. Transactional sending needs an API key from Brevo → SMTP & API → API keys.'
              : health.keyPresent
                ? 'The key does not look like a Brevo transactional API key (xkeysib-).'
                : 'No key format could be checked.'}
        </li>
        <li>
          {health.senderPresent
            ? health.senderLooksLikeEmail
              ? 'A sender address is present.'
              : 'The sender value is not a valid email address.'
            : 'BREVO_SENDER_EMAIL is missing.'}
        </li>
      </ul>
      <p className="admin-hint">
        {ready
          ? 'Configuration looks complete. If alerts still fail with HTTP 401 and an unrecognised IP, turn off authorised IPs in Brevo. Vercel does not use a fixed IP on this plan. Provider acceptance is still not the same as inbox delivery.'
          : 'Fix the items above in Vercel for both Preview and Production, then redeploy before retrying alerts.'}
      </p>
    </section>
  );
}
