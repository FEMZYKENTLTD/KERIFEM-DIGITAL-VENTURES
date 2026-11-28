import { requireOwner } from '@/lib/admin-auth';
import { DiscoveryForm } from './DiscoveryForm';

export default async function DiscoveryPage() {
  await requireOwner();
  const configured = !!process.env.HUNTER_API_KEY && process.env.HUNTER_FREE_DISCOVERY_ENABLED === 'true';
  return <div className="growth-content">
    <div className="page-heading"><div><div className="kicker"><span /> COMPANY DISCOVERY</div><h1>Find a starting point<span className="gold">.</span></h1><p>Discover companies, then independently review their fit and sources.</p></div></div>
    <section className="growth-panel">
      <h2>Hunter Discover</h2>
      <p className="muted">{configured ? 'Server configuration detected; provider and database access are not verified until a search succeeds.' : 'Not configured. Add the server-only Hunter key and enable free discovery after verifying the plan.'} The application also requires the reviewed discovery audit and rate-limit database function.</p>
      <p className="field-hint">This is company discovery only. It does not find or verify email addresses, save prospects, grant consent, or send messages. Only an owner can request a search. Limit: one request per minute and twenty per day.</p>
      <DiscoveryForm configured={configured} />
    </section>
  </div>;
}
