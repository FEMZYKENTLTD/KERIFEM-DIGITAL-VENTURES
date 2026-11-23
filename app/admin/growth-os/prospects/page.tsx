import Link from 'next/link';
import { ArrowRight, Plus, Search } from 'lucide-react';
import { requireOwner } from '@/lib/admin-auth';
import { stageLabel, stages, type Prospect } from '@/lib/growthos';

export default async function ProspectsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const db = await requireOwner();
  const params = await searchParams;
  const q =
    typeof params.q === 'string'
      ? params.q
          .replace(/[^\p{L}\p{N} .@-]/gu, ' ')
          .trim()
          .slice(0, 100)
      : '';
  const stage =
    typeof params.stage === 'string' && stages.some(([key]) => key === params.stage)
      ? params.stage
      : '';
  const page = Math.max(
    1,
    Math.min(10000, Number.parseInt(typeof params.page === 'string' ? params.page : '1', 10) || 1),
  );
  let query = db
    .from('growth_prospects')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .order('id', { ascending: false })
    .range((page - 1) * 20, page * 20 - 1);
  if (q) query = query.ilike('name', `%${q}%`);
  if (stage) query = query.eq('stage', stage);
  const { data, count, error } = await query;
  const pageLink = (n: number) =>
    `/admin/growth-os/prospects?${new URLSearchParams({ q, stage, page: String(n) })}`;
  return (
    <div className="growth-content">
      <div className="page-heading">
        <div>
          <div className="kicker">
            <span /> RELATIONSHIP INTELLIGENCE
          </div>
          <h1>
            Prospects<span className="gold">.</span>
          </h1>
          <p>Build a considered list of businesses worth getting to know.</p>
        </div>
        <Link href="/admin/growth-os/prospects/new" className="gold-button">
          <Plus size={17} /> Add prospect
        </Link>
      </div>
      {params.notice === 'deleted' && (
        <div className="success-alert" role="status">
          Prospect deleted.
        </div>
      )}
      <section className="growth-panel">
        <div className="panel-heading">
          <div>
            <div className="kicker">YOUR PROSPECTS</div>
            <h2>All businesses</h2>
            <Link href="/admin/growth-os/prospects/import">Import CSV →</Link>
          </div>
          <span className="muted">{error ? 'Unavailable' : `${count ?? 0} records`}</span>
        </div>
        <form className="growth-filters">
          <label>
            <span>Search by business name</span>
            <div className="search-input">
              <Search size={16} />
              <input name="q" defaultValue={q} placeholder="Search prospects" maxLength={100} />
            </div>
          </label>
          <label>
            <span>Pipeline stage</span>
            <select name="stage" defaultValue={stage}>
              <option value="">All stages</option>
              {stages.map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <button className="outline-button">Apply filters</button>
          <Link href="/admin/growth-os/prospects">Clear</Link>
        </form>
        {error ? (
          <div className="alert" role="alert">
            Could not load prospects. Check the GrowthOS migration and database connection.
          </div>
        ) : data?.length ? (
          <div className="table-wrap">
            <table className="growth-table">
              <thead>
                <tr>
                  <th>BUSINESS</th>
                  <th>INDUSTRY</th>
                  <th>LOCATION</th>
                  <th>STAGE</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {(data as Prospect[]).map((p) => (
                  <tr key={p.id}>
                    <td>
                      <Link href={`/admin/growth-os/prospects/${p.id}`}>
                        <b>{p.name}</b>
                        <small>{p.website || 'Website not added'}</small>
                      </Link>
                    </td>
                    <td>{p.industry || '—'}</td>
                    <td>{p.location || '—'}</td>
                    <td>
                      <span className="badge">{stageLabel(p.stage)}</span>
                    </td>
                    <td>
                      <Link
                        aria-label={`Open ${p.name}`}
                        href={`/admin/growth-os/prospects/${p.id}`}
                      >
                        <ArrowRight size={17} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <b>No prospects found</b>
            <p>Try another filter or add a business to your workspace.</p>
            <Link href="/admin/growth-os/prospects/new">Add a prospect →</Link>
          </div>
        )}
        {!error && (
          <div className="pagination">
            <span>
              Page {page} · {count ?? 0} matching
            </span>
            <div>
              {page > 1 && <Link href={pageLink(page - 1)}>← Previous</Link>}
              {count !== null && page * 20 < count && <Link href={pageLink(page + 1)}>Next →</Link>}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
