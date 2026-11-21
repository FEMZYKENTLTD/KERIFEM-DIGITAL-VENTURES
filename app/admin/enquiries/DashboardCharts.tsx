import { BUDGET_OPTIONS, SERVICE_OPTIONS } from '@/lib/content';
import { enquiryMetrics } from '@/lib/enquiry-store';

import { ChartDistribution } from './ChartDistribution';

export async function DashboardCharts() {
  let data;
  try {
    data = await enquiryMetrics();
  } catch {
    return (
      <section className="admin-panel admin-insights">
        <h2>Enquiry analytics</h2>
        <p>
          Charts are temporarily unavailable. Check that the analytics migration has been applied.
        </p>
      </section>
    );
  }
  const services = SERVICE_OPTIONS.map((label): [string, number] => [
    label,
    data.services[label] || 0,
  ]).sort((a, b) => b[1] - a[1]);
  const budgets = [...BUDGET_OPTIONS, 'Not provided'].map((label): [string, number] => [
    label,
    data.budgets[label] || 0,
  ]);
  const max = Math.max(1, ...data.days.map(({ count }) => count));
  const leaders = services.filter(([, value]) => value > 0 && value === services[0]?.[1]);
  const zero = services.filter(([, value]) => value === 0);
  const total = data.days.reduce((sum, day) => sum + day.count, 0);
  return (
    <section className="admin-insights" aria-labelledby="insights-title">
      <h2 id="insights-title">Enquiry analytics</h2>
      <p className="admin-hint">
        Charts include the whole inbox. Budget bands are visitor estimates, not sales or revenue.
      </p>
      <ChartDistribution services={services} budgets={budgets}>
        <p className="admin-hint">
          {leaders.length
            ? `Most requested: ${leaders.map(([label]) => label).join(', ')}.`
            : 'No service demand recorded yet.'}{' '}
          {zero.length > 0 &&
            leaders.length > 0 &&
            `${zero.length} service${zero.length === 1 ? ' has' : 's have'} no enquiries yet. Check visibility and positioning before drawing conclusions.`}
        </p>
      </ChartDistribution>
      <div className="admin-charts admin-trend-grid">
        <section className="admin-panel admin-trend">
          <h3>Enquiry activity</h3>
          <p className="admin-hint">{total} in the last 30 calendar days · UTC, including today</p>
          <div className="admin-columns" aria-hidden="true">
            {data.days.map(({ day, count }) => (
              <div
                key={day}
                title={`${day}: ${count}`}
                style={{ height: `${Math.max(2, (100 * count) / max)}%` }}
              />
            ))}
          </div>
          <div className="admin-trend-axis">
            <span>{data.days[0]?.day}</span>
            <span>{data.days.at(-1)?.day}</span>
          </div>
          <details>
            <summary>View daily counts</summary>
            <ul className="admin-day-list">
              {data.days.map(({ day, count }) => (
                <li key={day}>
                  {day}: {count}
                </li>
              ))}
            </ul>
          </details>
        </section>
      </div>
    </section>
  );
}
