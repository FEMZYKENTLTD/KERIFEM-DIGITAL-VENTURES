import { formatSubmissionTime } from '@/lib/submission-time';
import Link from 'next/link';
import { requireOwner } from '@/lib/admin-auth';
import { enquiryStore, type Enquiry } from '@/lib/enquiry-store';
import { workflowLabel } from '@/lib/workflow';
import { restoreEnquiry } from '../../actions';

const PAGE_SIZE = 25;
const single = (value: unknown) => (typeof value === 'string' ? value : '');

async function count() {
  const response = await enquiryStore('?select=id&deleted_at=not.is.null', {
    method: 'HEAD',
    headers: { Prefer: 'count=exact' },
  });
  const total = response.headers.get('content-range')?.split('/').pop();
  if (!total || !/^\d+$/.test(total)) throw new Error('Count unavailable');
  return Number(total);
}

export default async function RecycleBinPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireOwner();
  const params = await searchParams;
  const page = Math.max(1, Math.min(10000, Number.parseInt(single(params.page), 10) || 1));
  let data;
  try {
    const matched = await count();
    const last = Math.max(1, Math.ceil(matched / PAGE_SIZE));
    const current = Math.min(page, last);
    const response = await enquiryStore(
      `?select=id,created_at,payload,workflow_status,deleted_at&deleted_at=not.is.null&order=deleted_at.desc,id.desc&limit=${PAGE_SIZE}&offset=${(current - 1) * PAGE_SIZE}`,
    );
    data = { matched, last, current, rows: (await response.json()) as Enquiry[] };
  } catch {
    return (
      <section className="admin-panel">
        <h1>Recycle bin</h1>
        <p role="alert">The database could not be reached.</p>
        <Link href="/admin/enquiries">Back to inbox</Link>
      </section>
    );
  }
  return (
    <section className="admin-panel">
      <Link href="/admin/enquiries">← Back to inbox</Link>
      <h1>Recycle bin</h1>
      <p className="admin-hint">
        Deleted enquiries stay here until you restore them or delete them permanently. Permanent
        deletion cannot be undone.
      </p>
      {single(params.notice) === 'purged' && (
        <p className="admin-notice" role="status">
          Enquiry permanently deleted.
        </p>
      )}
      <p>
        {data.matched.toLocaleString('en-GB')} in the bin · Page {data.current} of {data.last}
      </p>
      {data.rows.length > 0 ? (
        <div className="admin-table" tabIndex={0} role="region" aria-label="Recycle bin">
          <table>
            <thead>
              <tr>
                <th scope="col">Project / contact</th>
                <th scope="col">Service</th>
                <th scope="col">Order</th>
                <th scope="col">Moved (WAT)</th>
                <th scope="col">Actions</th>
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
                  <td>
                    <span className="admin-chip" data-workflow={row.workflow_status || 'pending'}>
                      {workflowLabel(row.workflow_status || 'pending')}
                    </span>
                  </td>
                  <td>
                    <time dateTime={row.deleted_at || row.created_at}>
                      {formatSubmissionTime(row.deleted_at || row.created_at)}
                    </time>
                  </td>
                  <td>
                    <form action={restoreEnquiry.bind(null, row.id)}>
                      <button className="admin-secondary" type="submit">
                        Restore
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>The recycle bin is empty.</p>
      )}
      <nav className="admin-pagination" aria-label="Recycle bin pages">
        {data.current > 1 && (
          <Link href={`/admin/enquiries/bin?page=${data.current - 1}`}>← Previous</Link>
        )}
        {data.current < data.last && (
          <Link href={`/admin/enquiries/bin?page=${data.current + 1}`}>Next →</Link>
        )}
      </nav>
    </section>
  );
}
