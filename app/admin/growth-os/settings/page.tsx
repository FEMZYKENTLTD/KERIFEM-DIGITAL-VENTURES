import Link from 'next/link';
import { Database, Mail, Sparkles, ShieldCheck } from 'lucide-react';
import { requireOwner } from '@/lib/admin-auth';
import { gmailConfig } from '@/lib/growth/gmail-oauth';
import { disconnectGmail } from '../gmail/actions';
export default async function SettingsPage({ searchParams }: { searchParams: Promise<{ gmail?: string }> }) {
  const db = await requireOwner();
  const { gmail: notice } = await searchParams;
  const [foundation, intelligence, gmail] = await Promise.all([
    db.from('growth_prospects').select('id', { count: 'exact', head: true }),
    db.from('growth_evidence').select('id', { count: 'exact', head: true }),
    db.rpc('growth_gmail_status'),
  ]);
  const gmailReady = !!gmailConfig() && !gmail.error;
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
      {notice && <div role="status" className={notice === 'connected' || notice === 'disconnected' ? 'success-alert' : 'alert'}>{notice === 'connected' ? 'Gmail authorization stored. Sending is not implemented.' : notice === 'disconnected' ? 'The local Gmail credential was removed. Revoke access in Google account security to revoke the provider grant.' : 'Gmail authorization could not be completed. Check setup and try again.'}</div>}
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
            <h2>Gmail for GrowthOS</h2>
            <span className={gmail.error ? 'status-warning' : gmail.data ? 'status-good' : 'status-warning'}>
              {gmail.error ? 'Connection storage unavailable' : gmail.data ? 'Authorization stored; sending disabled' : 'Not connected'}
            </span>
            <p>
              Connect only kerifemdigitalventures@gmail.com. Google consent requests email identity and Gmail send permission; it does not grant inbox reading. The application cannot send yet: approval, suppression and delivery controls must come first. The Arena Gmail connector and Brevo are separate.
            </p>
            {gmailReady ? <Link className="gold-button" prefetch={false} href="/admin/growth-os/gmail/connect">{gmail.data ? 'Reconnect Gmail' : 'Connect Gmail'}</Link> : <p className="field-hint">Google OAuth server settings and the reviewed database storage are required before connecting.</p>}
            {!gmail.error && gmail.data && <form action={disconnectGmail}><button className="outline-button">Remove local credential</button></form>}
            <p className="field-hint">Removing the local credential does not revoke Google’s grant; revoke it in your Google account security settings too.</p>
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
              Service matching can use OpenAI after server-side setup. Hunter company discovery
              requires its server key, explicit enablement and a reviewed database limiter; access
              remains unverified until tested. Email finding, verification and reply classification
              are not implemented.
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
