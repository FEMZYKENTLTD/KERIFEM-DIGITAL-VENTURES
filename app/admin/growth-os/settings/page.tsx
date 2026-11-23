import Link from 'next/link';
import { Database, Mail, Sparkles, ShieldCheck } from 'lucide-react';
import { requireOwner } from '@/lib/admin-auth';
export default async function SettingsPage() {
  const db = await requireOwner();
  const [foundation, intelligence] = await Promise.all([
    db.from('growth_prospects').select('id', { count: 'exact', head: true }),
    db.from('growth_evidence').select('id', { count: 'exact', head: true }),
  ]);
  const error = foundation.error || intelligence.error;
  return (
    <div className="growth-content">
      <div className="page-heading">
        <div>
          <div className="kicker">
            <span /> CONFIGURATION
          </div>
          <h1>
            Connections & safety<span className="gold">.</span>
          </h1>
          <p>Know what is connected, what is not, and what needs attention.</p>
        </div>
      </div>
      <div className="settings-grid">
        <section className="growth-panel setting-card">
          <Database className="gold" size={22} />
          <div>
            <h2>GrowthOS database</h2>
            <span className={error ? 'status-warning' : 'status-good'}>
              {error ? 'Unavailable or migration needed' : 'Connected'}
            </span>
            <p>
              Uses the existing owner session and dedicated, row-level secured GrowthOS tables.
              Apply all GrowthOS migrations in a safe preview database first. This check does not
              verify the import function.
            </p>
          </div>
        </section>
        <section className="growth-panel setting-card">
          <Mail className="gold" size={22} />
          <div>
            <h2>Outbound email</h2>
            <span className="status-warning">Not implemented</span>
            <p>
              No mailbox or sending provider is connected. The website’s Brevo transactional
              integration is separate and is not used for outreach.
            </p>
          </div>
        </section>
        <section className="growth-panel setting-card">
          <Sparkles className="gold" size={22} />
          <div>
            <h2>AI & discovery</h2>
            <span className="status-warning">
              {process.env.OPENAI_API_KEY
                ? 'Key configured; connection untested'
                : 'OpenAI key not configured'}
            </span>
            <p>
              Service matching can use OpenAI after server-side setup. Prospects and evidence are
              entered manually; discovery, verification and reply classification are not
              implemented.
            </p>
          </div>
        </section>
        <section className="growth-panel setting-card">
          <ShieldCheck className="gold" size={22} />
          <div>
            <h2>Responsible outreach</h2>
            <span className="status-warning">Sending disabled</span>
            <p>
              Before enabling outbound email, implement approvals, opt-outs, suppression, bounce
              handling and a dedicated domain with SPF, DKIM and DMARC. Review local laws and
              provider policies.
            </p>
          </div>
        </section>
      </div>
      <p className="muted setup-note">
        See <code>docs/growthos-foundation.md</code> for deployment and limitations.{' '}
        <Link href="/admin/enquiries">Return to the existing enquiry workspace →</Link>
      </p>
    </div>
  );
}
