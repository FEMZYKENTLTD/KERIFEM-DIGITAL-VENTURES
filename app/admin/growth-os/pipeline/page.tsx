import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { requireOwner } from '@/lib/admin-auth';
import { stages, type Prospect } from '@/lib/growthos';
export default async function PipelinePage() {
  const db = await requireOwner();
  const results = await Promise.all(
    stages.map(async ([key, label]) => {
      const [count, rows] = await Promise.all([
        db.from('growth_prospects').select('*', { count: 'exact', head: true }).eq('stage', key),
        db
          .from('growth_prospects')
          .select('id,name,industry,location')
          .eq('stage', key)
          .order('updated_at', { ascending: false })
          .limit(5),
      ]);
      return {
        key,
        label,
        count: count.count,
        rows: rows.data as Pick<Prospect, 'id' | 'name' | 'industry' | 'location'>[] | null,
        error: count.error || rows.error,
      };
    }),
  );
  return (
    <div className="growth-content">
      <div className="page-heading">
        <div>
          <div className="kicker">
            <span /> OPPORTUNITY TRACKING
          </div>
          <h1>
            Your pipeline<span className="gold">.</span>
          </h1>
          <p>Follow every relationship, from first research to a meaningful outcome.</p>
        </div>
        <Link href="/admin/growth-os/prospects" className="outline-button">
          View all prospects <ArrowRight size={16} />
        </Link>
      </div>
      {results.some((r) => r.error) && (
        <div className="alert" role="alert">
          Pipeline data is unavailable. Check the GrowthOS database setup.
        </div>
      )}
      <div className="pipeline-grid">
        {results.map((r) => (
          <section className="pipeline-column" key={r.key}>
            <div className="pipeline-title">
              <b>{r.label}</b>
              <span>{r.error ? '—' : r.count}</span>
            </div>
            {r.rows?.map((p) => (
              <Link
                className="pipeline-item"
                key={p.id}
                href={`/admin/growth-os/prospects/${p.id}`}
              >
                <b>{p.name}</b>
                <small>
                  {[p.industry, p.location].filter(Boolean).join(' · ') || 'No details yet'}
                </small>
                <span>Open profile →</span>
              </Link>
            ))}
            {!r.error && !r.rows?.length && (
              <p className="pipeline-empty">No prospects in this stage</p>
            )}
            {!r.error && (r.count ?? 0) > 5 && (
              <Link href={`/admin/growth-os/prospects?stage=${r.key}`}>View all {r.count} →</Link>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
