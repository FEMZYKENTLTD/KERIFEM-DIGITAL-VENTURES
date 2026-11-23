import Link from 'next/link';
import { notFound } from 'next/navigation';
import { z } from 'zod';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { requireOwner } from '@/lib/admin-auth';
import { stageLabel, stages, type Prospect } from '@/lib/growthos';
import { changeStage, saveProspect } from '../../actions';

type Entry = { detail: string; id: number; created_at: string };
export default async function ProspectPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ notice?: string }>;
}) {
  const db = await requireOwner();
  const { id } = await params;
  const { notice } = await searchParams;
  if (id !== 'new' && !z.string().uuid().safeParse(id).success) notFound();
  let prospect: Prospect | null = null;
  let events: Entry[] = [];
  let activityError = false;
  if (id !== 'new') {
    const result = await db.from('growth_prospects').select('*').eq('id', id).maybeSingle();
    if (result.error)
      return (
        <div className="growth-content">
          <div className="alert">
            Prospect details are unavailable. Check the database connection.
          </div>
        </div>
      );
    if (!result.data) notFound();
    prospect = result.data as Prospect;
    const log = await db
      .from('growth_activity')
      .select('id,detail,created_at')
      .eq('prospect_id', id)
      .order('created_at', { ascending: false })
      .limit(20);
    events = (log.data || []) as Entry[];
    activityError = Boolean(log.error);
  }
  return (
    <div className="growth-content">
      <Link href="/admin/growth-os/prospects" className="back-link">
        <ArrowLeft size={16} /> All prospects
      </Link>
      <div className="page-heading">
        <div>
          <div className="kicker">
            <span /> PROSPECT PROFILE
          </div>
          <h1>
            {prospect?.name || 'Add a prospect'}
            <span className="gold">.</span>
          </h1>
          <p>
            {prospect
              ? 'Research, context and pipeline stage in one place.'
              : 'Start with what you know. You can add more detail later.'}
          </p>
        </div>
        {prospect && <span className="badge large">{stageLabel(prospect.stage)}</span>}
      </div>
      {notice && (
        <div role="status" className={notice === 'saved' ? 'success-alert' : 'alert'}>
          {notice === 'saved'
            ? 'Your changes were saved.'
            : notice === 'invalid'
              ? 'Please check your entries. URLs must start with http:// or https:// and email addresses must be valid.'
              : 'Could not save. Check the database connection and try again.'}
        </div>
      )}
      <div className="profile-grid">
        <section className="growth-panel">
          <div className="panel-heading">
            <div>
              <div className="kicker">BUSINESS DETAILS</div>
              <h2>{prospect ? 'Edit profile' : 'New business'}</h2>
            </div>
          </div>
          <form action={saveProspect.bind(null, id)} className="profile-form">
            <label>
              Business name <span>*</span>
              <input name="name" required maxLength={160} defaultValue={prospect?.name} />
            </label>
            <div className="form-row">
              <label>
                Industry
                <input name="industry" maxLength={120} defaultValue={prospect?.industry} />
              </label>
              <label>
                City / country
                <input name="location" maxLength={160} defaultValue={prospect?.location} />
              </label>
            </div>
            <label>
              Website
              <input
                name="website"
                type="url"
                maxLength={500}
                placeholder="https://example.com"
                defaultValue={prospect?.website}
              />
            </label>
            <div className="form-row">
              <label>
                Business email
                <input name="email" type="email" maxLength={254} defaultValue={prospect?.email} />
              </label>
              <label>
                Email source URL
                <input
                  name="email_source"
                  type="url"
                  maxLength={500}
                  placeholder="https://..."
                  defaultValue={prospect?.email_source}
                />
              </label>
            </div>
            <p className="field-hint">
              Manually entered contacts are unverified. Record the public source and confirm
              permission before outreach.
            </p>
            <label>
              Research notes
              <textarea
                name="notes"
                maxLength={5000}
                rows={7}
                defaultValue={prospect?.notes}
                placeholder="Record observations, sources, and distinguish facts from assumptions."
              />
            </label>
            <button className="gold-button">{prospect ? 'Save changes' : 'Create prospect'}</button>
          </form>
        </section>
        <div className="profile-aside">
          {prospect && (
            <section className="growth-panel">
              <div className="kicker">WORKFLOW</div>
              <h2>Pipeline stage</h2>
              <p className="muted">Update this manually as your relationship progresses.</p>
              <form action={changeStage.bind(null, id)} className="stage-form">
                <select name="stage" defaultValue={prospect.stage}>
                  {stages.map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
                <button className="outline-button">Update stage</button>
              </form>
              {prospect.website && (
                <a
                  className="external-link"
                  href={prospect.website}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit business website <ExternalLink size={14} />
                </a>
              )}
            </section>
          )}
          <section className="growth-panel">
            <div className="kicker">RESEARCH PRINCIPLES</div>
            <h2>Lead with context</h2>
            <p className="muted">
              Record the source of your findings. Don’t present assumptions as facts, or an
              unverified email as verified.
            </p>
            <div className="mini-divider" />
            <p className="muted">
              Outreach, verification and AI research are not yet connected. This workspace will not
              send email.
            </p>
          </section>
          {prospect && (
            <section className="growth-panel">
              <div className="kicker">AUDIT TRAIL</div>
              <h2>Recent activity</h2>
              {events.length ? (
                <div className="timeline">
                  {events.map((e) => (
                    <div key={e.id}>
                      <span className="timeline-dot" />
                      <p>
                        {e.detail.replaceAll('_', ' ')}
                        <small>{new Date(e.created_at).toLocaleString('en-GB')}</small>
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="muted">
                  {activityError ? 'Activity could not be loaded.' : 'No activity yet.'}
                </p>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
