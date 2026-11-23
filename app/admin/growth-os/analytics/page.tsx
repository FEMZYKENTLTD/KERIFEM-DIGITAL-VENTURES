import Link from 'next/link';
import { requireOwner } from '@/lib/admin-auth';
import { stages } from '@/lib/growthos';
export default async function AnalyticsPage() {
  const db = await requireOwner();
  const results = await Promise.all(
    stages.map(async ([key, label]) => {
      const { count, error } = await db
        .from('growth_prospects')
        .select('*', { count: 'exact', head: true })
        .eq('stage', key);
      return { key, label, count, error };
    }),
  );
  const error = results.some((r) => r.error);
  const total = results.reduce((n, r) => n + (r.count ?? 0), 0);
  return (
    <div className="growth-content">
      <div className="page-heading">
        <div>
          <div className="kicker">
            <span /> PERFORMANCE & INSIGHT
          </div>
          <h1>
            Analytics<span className="gold">.</span>
          </h1>
          <p>A clear view of the information you’ve recorded, without invented numbers.</p>
        </div>
      </div>
      {error && (
        <div className="alert">Analytics are unavailable. Check the GrowthOS database setup.</div>
      )}
      <section className="growth-panel analytics-panel">
        <div className="panel-heading">
          <div>
            <div className="kicker">PIPELINE SNAPSHOT</div>
            <h2>Prospects by stage</h2>
            <p>Current manually assigned stages · {error ? 'Unavailable' : `${total} total`}</p>
          </div>
        </div>
        <div className="analytics-list">
          {results.map((r) => (
            <div key={r.key}>
              <Link href={`/admin/growth-os/prospects?stage=${r.key}`}>{r.label}</Link>
              <div className="bar-track">
                <div
                  style={{ width: `${!error && total ? ((r.count ?? 0) / total) * 100 : 0}%` }}
                />
              </div>
              <b>{error ? '—' : r.count}</b>
            </div>
          ))}
        </div>
      </section>
      <div className="safety-banner">
        <div>
          <b>More insight requires more data</b>
          <p>
            Email delivery, replies, conversion rates and revenue are not tracked in this
            foundation.
          </p>
        </div>
      </div>
    </div>
  );
}
