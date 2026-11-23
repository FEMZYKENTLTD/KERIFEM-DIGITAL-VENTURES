import Link from 'next/link';
import {
  ArrowRight,
  ContactRound,
  ListChecks,
  Target,
  Workflow,
  Plus,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { requireOwner } from '@/lib/admin-auth';
import { stageLabel, type Activity, type Prospect } from '@/lib/growthos';

export default async function GrowthOverview() {
  const db = await requireOwner();
  const [total, qualified, review, won, recent, activity] = await Promise.all([
    db.from('growth_prospects').select('*', { count: 'exact', head: true }),
    db
      .from('growth_prospects')
      .select('*', { count: 'exact', head: true })
      .eq('stage', 'qualified'),
    db
      .from('growth_prospects')
      .select('*', { count: 'exact', head: true })
      .in('stage', ['new', 'researching']),
    db.from('growth_prospects').select('*', { count: 'exact', head: true }).eq('stage', 'won'),
    db.from('growth_prospects').select('*').order('created_at', { ascending: false }).limit(5),
    db
      .from('growth_activity')
      .select('id,prospect_id,event,detail,created_at,growth_prospects(name)')
      .order('created_at', { ascending: false })
      .limit(5),
  ]);
  const unavailable = [total, qualified, review, won, recent, activity].some((x) => x.error);
  const cards = [
    ['Total prospects', total.count, ContactRound, 'Your prospect universe'],
    ['Qualified prospects', qualified.count, Target, 'Marked qualified by you'],
    ['Needs research', review.count, ListChecks, 'New or researching'],
    ['Deals won', won.count, Workflow, 'Manually marked won'],
  ] as const;
  return (
    <div className="growth-content">
      <div className="page-heading">
        <div>
          <div className="kicker">
            <span /> YOUR COMMAND CENTRE
          </div>
          <h1>
            Growth, with intention<span className="gold">.</span>
          </h1>
          <p>Good to see you. Here’s your business development workspace.</p>
        </div>
        <Link className="gold-button" href="/admin/growth-os/prospects/new">
          <Plus size={17} /> Add prospect
        </Link>
      </div>
      {unavailable && (
        <div className="alert" role="alert">
          <strong>GrowthOS database unavailable.</strong> Apply the GrowthOS migration and check
          your Supabase configuration. Counts are unavailable, not zero.{' '}
          <Link href="/admin/growth-os/settings">View setup</Link>
        </div>
      )}
      <div className="metrics-grid">
        {cards.map(([label, value, Icon, help]) => (
          <div className="metric" key={label}>
            <div className="metric-top">
              <span>{label}</span>
              <Icon size={18} />
            </div>
            <strong>{unavailable ? '—' : value?.toLocaleString('en-GB')}</strong>
            <small>{help}</small>
          </div>
        ))}
      </div>
      <div className="section-heading">
        <div>
          <div className="kicker">YOUR WORKSPACE</div>
          <h2>Make your next move</h2>
          <p>Everything you need to keep opportunities moving.</p>
        </div>
      </div>
      <div className="action-grid">
        <Link href="/admin/growth-os/prospects/new" className="action-card">
          <span className="action-icon">
            <Plus size={20} />
          </span>
          <span>
            <b>Add a prospect</b>
            <small>Capture a business and its source</small>
          </span>
          <ArrowRight size={17} />
        </Link>
        <Link href="/admin/growth-os/prospects" className="action-card">
          <span className="action-icon">
            <ContactRound size={20} />
          </span>
          <span>
            <b>Review prospects</b>
            <small>Research and qualify your leads</small>
          </span>
          <ArrowRight size={17} />
        </Link>
        <Link href="/admin/growth-os/pipeline" className="action-card">
          <span className="action-icon">
            <Workflow size={20} />
          </span>
          <span>
            <b>Open pipeline</b>
            <small>See where opportunities stand</small>
          </span>
          <ArrowRight size={17} />
        </Link>
      </div>
      <div className="overview-grid">
        <section className="growth-panel">
          <div className="panel-heading">
            <div>
              <div className="kicker">YOUR RELATIONSHIPS</div>
              <h2>Recent prospects</h2>
            </div>
            <Link href="/admin/growth-os/prospects">
              View all <ArrowRight size={15} />
            </Link>
          </div>
          {!unavailable && (recent.data as Prospect[]).length ? (
            <div className="prospect-list">
              {(recent.data as Prospect[]).map((p) => (
                <Link key={p.id} href={`/admin/growth-os/prospects/${p.id}`}>
                  <span className="avatar">{p.name.slice(0, 1).toUpperCase()}</span>
                  <span className="prospect-name">
                    <b>{p.name}</b>
                    <small>
                      {[p.industry, p.location].filter(Boolean).join(' · ') || 'No details yet'}
                    </small>
                  </span>
                  <span className="badge">{stageLabel(p.stage)}</span>
                  <ArrowRight size={15} />
                </Link>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <ContactRound size={24} />
              <b>{unavailable ? 'Prospects unavailable' : 'Your next opportunity starts here'}</b>
              <p>
                {unavailable
                  ? 'Connect the database to view your prospects.'
                  : 'Add your first prospect to start building a thoughtful pipeline.'}
              </p>
              {!unavailable && <Link href="/admin/growth-os/prospects/new">Add a prospect →</Link>}
            </div>
          )}
        </section>
        <section className="growth-panel">
          <div className="panel-heading">
            <div>
              <div className="kicker">THE LATEST</div>
              <h2>Activity</h2>
            </div>
            <Sparkles size={18} className="gold" />
          </div>
          {!unavailable && activity.data?.length ? (
            <div className="timeline">
              {(activity.data as unknown as Activity[]).map((a) => (
                <div key={a.id}>
                  <span className="timeline-dot" />
                  <p>
                    <b>{a.growth_prospects?.name || 'Prospect'}</b>
                    <br />
                    {a.detail.replaceAll('_', ' ')}
                    <small>
                      {new Date(a.created_at).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </small>
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <ShieldCheck size={24} />
              <b>{unavailable ? 'Activity unavailable' : 'A clear record of progress'}</b>
              <p>Prospect changes will appear here as you work.</p>
            </div>
          )}
        </section>
      </div>
      <div className="safety-banner">
        <ShieldCheck size={21} />
        <div>
          <b>Built around responsible outreach</b>
          <p>
            Email sending, discovery and AI are not connected in this foundation. No outreach is
            sent automatically.
          </p>
        </div>
        <Link href="/admin/growth-os/settings">
          Connection details <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
}
