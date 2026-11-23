import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Sparkles, ExternalLink } from 'lucide-react';
import { z } from 'zod';
import { requireOwner } from '@/lib/admin-auth';
import { services } from '@/lib/services';
import { snapshotSchema, validateMatch } from '@/lib/growth/service-match';
import { addEvidence, matchService } from '../../../intelligence-actions';

type Evidence = { id: string; kind: string; claim: string; source_url: string; created_at: string };
type Run = {
  id: string;
  status: string;
  input: unknown;
  output: unknown;
  model: string;
  created_at: string;
  error_code: string | null;
  input_tokens: number | null;
  output_tokens: number | null;
};
const notices: Record<string, string> = {
  evidence: 'Evidence saved.',
  matched: 'Service match generated. Review every claim before acting.',
  invalid:
    'Check your entries. Observed and provider claims need a valid http or https source URL.',
  failed: 'Unable to save evidence. Check database setup and try again.',
  not_configured:
    'The AI provider is not configured. Set the server-only OpenAI key before requesting a match.',
  begin_failed:
    'Could not start a run. Add evidence, check the migration, or wait: runs are limited to one per minute and ten per day.',
  agent_failed:
    'The provider failed or returned an invalid response. No recommendations were accepted; see the run history.',
  finish_failed:
    'The run could not be finalized. Its result was not saved; a stale run will time out before another can start.',
};
export default async function IntelligencePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ notice?: string }>;
}) {
  const db = await requireOwner();
  const { id } = await params;
  if (!z.string().uuid().safeParse(id).success) notFound();
  const { notice } = await searchParams;
  const prospect = await db.from('growth_prospects').select('id,name').eq('id', id).maybeSingle();
  if (prospect.error)
    return (
      <div className="growth-content">
        <div role="alert" className="alert">
          Prospect unavailable. Check database configuration.
        </div>
      </div>
    );
  if (!prospect.data) notFound();
  const [research, runs] = await Promise.all([
    db
      .from('growth_evidence')
      .select('id,kind,claim,source_url,created_at')
      .eq('prospect_id', id)
      .order('created_at', { ascending: false })
      .limit(50),
    db
      .from('growth_agent_runs')
      .select('id,status,input,output,model,created_at,error_code,input_tokens,output_tokens')
      .eq('prospect_id', id)
      .order('created_at', { ascending: false })
      .limit(10),
  ]);
  const evidence = (research.data || []) as Evidence[];
  const history = (runs.data || []) as Run[];
  const latest = history.find((r) => r.status === 'completed');
  let matched: ReturnType<typeof validateMatch> | null = null;
  let snap: z.infer<typeof snapshotSchema> | null = null;
  if (latest) {
    try {
      snap = snapshotSchema.parse(latest.input);
      matched = validateMatch(latest.output, snap);
    } catch {
      matched = null;
    }
  }
  return (
    <div className="growth-content">
      <Link href={`/admin/growth-os/prospects/${id}`} className="back-link">
        <ArrowLeft size={16} /> Back to {prospect.data.name}
      </Link>
      <div className="page-heading">
        <div>
          <div className="kicker">
            <span /> EVIDENCE &amp; INTELLIGENCE
          </div>
          <h1>
            Research workspace<span className="gold">.</span>
          </h1>
          <p>Record what you know, preserve its source, and request a reviewable service match.</p>
        </div>
      </div>
      {notice && notices[notice] && (
        <div
          className={['matched', 'evidence'].includes(notice) ? 'success-alert' : 'alert'}
          role="status"
        >
          {notices[notice]}
        </div>
      )}
      {(research.error || runs.error) && (
        <div className="alert" role="alert">
          Research or run history is unavailable. Apply both GrowthOS migrations in an isolated
          environment and check the connection.
        </div>
      )}
      <div className="profile-grid">
        <div className="profile-aside">
          <section className="growth-panel">
            <div className="kicker">RESEARCH RECORD</div>
            <h2>Add evidence</h2>
            <p className="muted">
              Only enter information you are entitled to use. A source link is required for
              observations and provider information.
            </p>
            <form className="profile-form" action={addEvidence.bind(null, id)}>
              <label>
                Evidence type
                <select name="kind" defaultValue="observed">
                  <option value="observed">Observed — owner-reported</option>
                  <option value="provider">Provider-supplied — unverified</option>
                  <option value="inference">Inference — not a fact</option>
                </select>
              </label>
              <label>
                Observation or inference
                <textarea
                  name="claim"
                  required
                  maxLength={800}
                  rows={4}
                  placeholder="Describe one specific finding or assumption."
                />
              </label>
              <label>
                Source URL
                <input
                  name="source_url"
                  type="url"
                  maxLength={500}
                  placeholder="https://example.com/page"
                />
              </label>
              <button className="gold-button">Save evidence</button>
            </form>
          </section>
          <section className="growth-panel">
            <div className="panel-heading">
              <div>
                <div className="kicker">SOURCE LIBRARY</div>
                <h2>Evidence</h2>
              </div>
              <span className="muted">Latest 50</span>
            </div>
            {evidence.length ? (
              <div className="timeline">
                {evidence.map((e) => (
                  <div key={e.id}>
                    <span className="timeline-dot" />
                    <p>
                      <b>
                        {e.kind === 'observed'
                          ? 'Owner-reported observation'
                          : e.kind === 'provider'
                            ? 'Provider-supplied'
                            : 'Inference'}
                      </b>
                      <br />
                      {e.claim}
                      {e.source_url && (
                        <a
                          className="external-link"
                          href={e.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Open source <ExternalLink size={13} />
                        </a>
                      )}
                      <small>{new Date(e.created_at).toLocaleString('en-GB')}</small>
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="muted">
                {research.error ? 'Evidence unavailable.' : 'No evidence recorded yet.'}
              </p>
            )}
          </section>
        </div>
        <div className="profile-aside">
          <section className="growth-panel">
            <div className="kicker">SERVICE-MATCHING AGENT</div>
            <h2>Find a relevant fit</h2>
            <p className="muted">
              The agent uses your latest 20 evidence records and the published KERIFEM service
              catalogue. It cannot browse, send emails or change pipeline stages. Results are
              suggestions, not verified facts.
            </p>
            <p className="field-hint">
              Submitting shares this business name, industry, location, and evidence with OpenAI. Do
              not include sensitive or unnecessary personal data. A request may incur provider
              charges.
            </p>
            <form action={matchService.bind(null, id)}>
              <button
                className="gold-button"
                disabled={!evidence.length || !!research.error || !process.env.OPENAI_API_KEY}
              >
                <Sparkles size={16} /> Generate service match
              </button>
            </form>
            <p className="field-hint">
              {process.env.OPENAI_API_KEY
                ? 'Configured key detected; provider connectivity not yet verified.'
                : 'OpenAI key not configured.'}{' '}
              Limit: one run per minute, ten per 24 hours.
            </p>
          </section>
          <section className="growth-panel">
            <div className="kicker">REVIEW REQUIRED</div>
            <h2>Latest recommendations</h2>
            {matched && snap ? (
              <>
                <p className="muted">
                  Generated {latest && new Date(latest.created_at).toLocaleString('en-GB')} ·{' '}
                  {latest?.model}. Evidence is a snapshot; newer research may not be included.
                </p>
                {matched.recommendations.length ? (
                  matched.recommendations.map((r) => (
                    <div className="recommendation" key={r.service}>
                      <div className="panel-heading">
                        <b>{services.find(([slug]) => slug === r.service)?.[1] || r.service}</b>
                        <span className="badge">{r.confidence} confidence</span>
                      </div>
                      <p>{r.rationale}</p>
                      <p>
                        <b>Opportunity:</b> {r.opportunity}
                      </p>
                      <p>
                        <b>Suggested angle:</b> {r.outreach_angle}
                      </p>
                      <b className="muted">Cited evidence</b>
                      <ul>
                        {r.evidence_ids.map((eid) => {
                          const e = snap?.evidence.find((x) => x.id === eid);
                          return (
                            <li key={eid}>
                              <span className="badge">{e?.kind}</span> {e?.claim}
                              {e?.source_url && (
                                <>
                                  {' '}
                                  ·{' '}
                                  <a href={e.source_url} target="_blank" rel="noopener noreferrer">
                                    Source ↗
                                  </a>
                                </>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ))
                ) : (
                  <p className="muted">
                    The agent found insufficient evidence for a recommendation.
                  </p>
                )}
                {matched.unknowns.length > 0 && (
                  <>
                    <h3>Unknowns to check</h3>
                    <ul className="unknown-list">
                      {matched.unknowns.map((u) => (
                        <li key={u}>{u}</li>
                      ))}
                    </ul>
                  </>
                )}
              </>
            ) : (
              <p className="muted">
                {latest
                  ? 'The saved output could not be validated.'
                  : 'No completed match yet. Add evidence, configure the provider, and request a match.'}
              </p>
            )}
          </section>
          <section className="growth-panel">
            <div className="kicker">EXECUTION HISTORY</div>
            <h2>Agent runs</h2>
            {history.length ? (
              <div className="timeline">
                {history.map((r) => (
                  <div key={r.id}>
                    <span className="timeline-dot" />
                    <p>
                      <b>{r.status}</b> · {r.model}
                      {r.error_code && <> · {r.error_code.replaceAll('_', ' ')}</>}
                      <small>
                        {new Date(r.created_at).toLocaleString('en-GB')}
                        {r.input_tokens !== null &&
                          ` · ${r.input_tokens} input / ${r.output_tokens ?? '—'} output tokens`}
                      </small>
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="muted">{runs.error ? 'Run history unavailable.' : 'No runs yet.'}</p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
