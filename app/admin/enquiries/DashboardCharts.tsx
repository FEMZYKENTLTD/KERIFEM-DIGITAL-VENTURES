import { BUDGET_OPTIONS, SERVICE_OPTIONS } from '@/lib/content';
import { enquiryMetrics } from '@/lib/enquiry-store';
import { WORKFLOW_STATUSES, workflowLabel } from '@/lib/workflow';

import { ChartDistribution, Distribution } from './ChartDistribution';
import { DayChart } from './DayChart';
import { MonthChart } from './MonthChart';

const monthLabel = new Intl.DateTimeFormat('en-GB', {
  month: 'short',
  year: '2-digit',
  timeZone: 'Africa/Lagos',
});

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
  const orders = WORKFLOW_STATUSES.map((status): [string, number] => [
    workflowLabel(status),
    data.orders?.[status] || 0,
  ]);
  const months = data.months ?? [];
  const leaders = services.filter(([, value]) => value > 0 && value === services[0]?.[1]);
  const zero = services.filter(([, value]) => value === 0);
  const total = data.days.reduce((sum, day) => sum + day.count, 0);
  const yearTotal = months.reduce((sum, month) => sum + month.count, 0);
  const leadingOrder = [...orders].sort((a, b) => b[1] - a[1])[0];
  return (
    <section className="admin-insights" aria-labelledby="insights-title">
      <h2 id="insights-title">Enquiry analytics</h2>
      <p className="admin-hint">
        Charts exclude the recycle bin. Budget bands are visitor estimates, not sales or revenue.
        Order status is the owner mark on each enquiry.
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
        <section className="admin-panel">
          <h3>Order status</h3>
          <p className="admin-hint">Active enquiries · pending, completed and cancelled</p>
          <Distribution rows={orders} showBars showPie unit="ORDERS" />
          <p className="admin-hint">
            {leadingOrder?.[1]
              ? `${leadingOrder[0]} is currently the largest share of the inbox.`
              : 'Mark enquiries pending, completed or cancelled to populate this chart.'}
          </p>
        </section>
        <section className="admin-panel admin-year">
          <h3>Twelve months</h3>
          <p className="admin-hint">
            {yearTotal} in the last 12 calendar months · Africa/Lagos, including this month
          </p>
          <MonthChart months={months} />
          <ul className="admin-month-key">
            <li>
              <i data-workflow="pending" /> Pending
            </li>
            <li>
              <i data-workflow="completed" /> Completed
            </li>
            <li>
              <i data-workflow="cancelled" /> Cancelled
            </li>
          </ul>
          <details>
            <summary>View monthly counts</summary>
            <ul className="admin-day-list">
              {months.map((row) => (
                <li key={row.month}>
                  {monthLabel.format(new Date(`${row.month}T00:00:00+01:00`))}: {row.count} (
                  {row.pending} pending, {row.completed} completed, {row.cancelled} cancelled)
                </li>
              ))}
            </ul>
          </details>
        </section>
      </div>
      <div className="admin-charts admin-trend-grid">
        <section className="admin-panel admin-trend">
          <h3>Enquiry activity</h3>
          <p className="admin-hint">
            {total} in the last 30 calendar days · Africa/Lagos, including today
          </p>
          <DayChart days={data.days} />
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
