import Link from 'next/link';
import { requireOwner } from '@/lib/admin-auth';
import { createTask, toggleTask } from '../task-actions';
type Task = {
  id: string;
  title: string;
  due_date: string | null;
  status: string;
  growth_prospects: { id: string; name: string } | null;
};
export default async function TasksPage({
  searchParams,
}: {
  searchParams: Promise<{ notice?: string }>;
}) {
  const db = await requireOwner();
  const { notice } = await searchParams;
  const [tasks, prospects] = await Promise.all([
    db
      .from('growth_tasks')
      .select('id,title,due_date,status,growth_prospects(id,name)')
      .order('status', { ascending: false })
      .order('due_date', { ascending: true, nullsFirst: false })
      .order('created_at', { ascending: false })
      .limit(100),
    db.from('growth_prospects').select('id,name').order('name').limit(200),
  ]);
  return (
    <div className="growth-content">
      <div className="page-heading">
        <div>
          <div className="kicker">
            <span /> STAY ON TRACK
          </div>
          <h1>
            Follow-up tasks<span className="gold">.</span>
          </h1>
          <p>Keep next steps visible. Tasks are reminders only; they never send emails.</p>
        </div>
      </div>
      {notice && (
        <div
          role="status"
          className={['created', 'updated'].includes(notice) ? 'success-alert' : 'alert'}
        >
          {['created', 'updated'].includes(notice)
            ? 'Task saved.'
            : notice === 'invalid'
              ? 'Select a prospect and enter a valid title and date.'
              : 'Task could not be saved. Check database setup.'}
        </div>
      )}
      {(tasks.error || prospects.error) && (
        <div className="alert" role="alert">
          Tasks are unavailable. Check the GrowthOS intelligence migration and database connection.
        </div>
      )}
      <div className="profile-grid">
        <section className="growth-panel">
          <div className="kicker">NEXT STEPS</div>
          <h2>Your tasks</h2>
          <p className="muted">Showing up to 100 tasks, with open tasks first.</p>
          {(tasks.data as unknown as Task[] | null)?.length ? (
            <div className="task-list">
              {(tasks.data as unknown as Task[]).map((t) => (
                <div className="task-row" key={t.id}>
                  <div>
                    <b>{t.title}</b>
                    <p>
                      <Link href={`/admin/growth-os/prospects/${t.growth_prospects?.id}`}>
                        {t.growth_prospects?.name || 'Prospect'}
                      </Link>{' '}
                      · {t.due_date ? `Due ${t.due_date}` : 'No due date'} ·{' '}
                      {t.status === 'done' ? 'Complete' : 'Open'}
                    </p>
                  </div>
                  <form action={toggleTask.bind(null, t.id)}>
                    <input
                      type="hidden"
                      name="status"
                      value={t.status === 'open' ? 'done' : 'open'}
                    />
                    <button className="outline-button">
                      {t.status === 'open' ? 'Mark done' : 'Reopen'}
                    </button>
                  </form>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <b>{tasks.error ? 'Tasks unavailable' : 'No tasks yet'}</b>
              <p>Create a reminder for a prospect to keep your follow-up intentional.</p>
            </div>
          )}
        </section>
        <section className="growth-panel">
          <div className="kicker">CREATE A REMINDER</div>
          <h2>New task</h2>
          <form action={createTask} className="profile-form">
            <label>
              Prospect
              <select name="prospect_id" required defaultValue="">
                <option value="" disabled>
                  Select a prospect
                </option>
                {prospects.data?.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </label>
            <p className="field-hint">The first 200 businesses alphabetically are shown.</p>
            <label>
              Next step
              <input name="title" required maxLength={180} placeholder="e.g. Review research" />
            </label>
            <label>
              Due date (optional)
              <input name="due_date" type="date" />
            </label>
            <button className="gold-button">Create task</button>
          </form>
        </section>
      </div>
    </div>
  );
}
