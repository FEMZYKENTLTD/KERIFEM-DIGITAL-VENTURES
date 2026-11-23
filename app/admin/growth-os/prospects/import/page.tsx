import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { requireOwner } from '@/lib/admin-auth';
import { importProspects } from '../../import-actions';
export default async function ImportPage({
  searchParams,
}: {
  searchParams: Promise<{ notice?: string; imported?: string; skipped?: string }>;
}) {
  await requireOwner();
  const p = await searchParams;
  return (
    <div className="growth-content">
      <Link className="back-link" href="/admin/growth-os/prospects">
        <ArrowLeft size={16} /> All prospects
      </Link>
      <div className="page-heading">
        <div>
          <div className="kicker">
            <span /> ADD YOUR DATA
          </div>
          <h1>
            Import prospects<span className="gold">.</span>
          </h1>
          <p>Bring in business records you are permitted to use.</p>
        </div>
      </div>
      {p.notice && (
        <div role="status" className={p.notice === 'done' ? 'success-alert' : 'alert'}>
          {p.notice === 'done'
            ? `Import completed: ${Number(p.imported) || 0} added, ${Number(p.skipped) || 0} potential duplicates skipped.`
            : p.notice === 'invalid'
              ? 'Invalid CSV. Check the headers, values, file size and row limit; nothing was imported.'
              : 'Import failed. Check the migration and database connection; nothing was imported.'}
        </div>
      )}
      <div className="profile-grid">
        <section className="growth-panel">
          <div className="kicker">CSV IMPORT</div>
          <h2>Upload your file</h2>
          <p className="muted">
            Up to 100 records and 64 KB per upload. All rows are validated before an atomic import.
            Existing records are never overwritten.
          </p>
          <form className="profile-form" action={importProspects}>
            <label>
              CSV file
              <input type="file" name="file" accept=".csv,text/csv" required />
            </label>
            <button className="gold-button">Import prospects</button>
          </form>
        </section>
        <section className="growth-panel">
          <div className="kicker">FILE FORMAT</div>
          <h2>Before you import</h2>
          <p className="muted">
            Use a header row. Required column: <code>name</code>. Optional columns:{' '}
            <code>website, industry, location, email, email_source, notes</code>. URLs must include
            http:// or https://. Email addresses remain unverified.
          </p>
          <div className="mini-divider" />
          <p className="muted">
            A matching website, email, or name and location is skipped as a possible duplicate. This
            is conservative and may miss variants or skip similar businesses; review your records
            after import.
          </p>
        </section>
      </div>
    </div>
  );
}
