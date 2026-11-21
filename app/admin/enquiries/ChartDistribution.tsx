'use client';

import { useId, useState, type ReactNode } from 'react';

const colors = [
  '#85adff',
  '#6de6cb',
  '#ffc784',
  '#d4b4ff',
  '#fb9fb3',
  '#a5e483',
  '#7dd8fa',
  '#ffac8f',
  '#d2dcec',
];
const modes = ['Bars', 'Pie', 'Both'] as const;
type Rows = [string, number][];
const format = new Intl.NumberFormat('en-GB');
const percent = new Intl.NumberFormat('en-GB', { style: 'percent', maximumFractionDigits: 1 });

function Distribution({
  rows,
  showBars,
  showPie,
}: {
  rows: Rows;
  showBars: boolean;
  showPie: boolean;
}) {
  const max = Math.max(1, ...rows.map(([, value]) => value));
  const total = rows.reduce((sum, [, value]) => sum + value, 0);
  let offset = 0;
  const slices = rows.flatMap(([, value], index) => {
    if (!value || !total) return [];
    const start = offset;
    offset += (value / total) * 100;
    return `${colors[index % colors.length]} ${start}% ${Math.min(100, offset)}%`;
  });
  return (
    <>
      {showPie &&
        (total ? (
          <div
            className="admin-pie"
            aria-hidden="true"
            style={{ background: `conic-gradient(${slices.join(', ')})` }}
          />
        ) : (
          <p className="admin-hint">No enquiries to chart yet.</p>
        ))}
      <ul className="admin-bars">
        {rows.map(([label, value], index) => (
          <li key={label}>
            <span>
              {showPie && (
                <i
                  className="admin-pie-key"
                  aria-hidden="true"
                  style={{ background: colors[index % colors.length] }}
                />
              )}
              {label}
            </span>
            <strong>
              {format.format(value)}
              {showPie && total > 0 ? ` · ${percent.format(value / total)}` : ''}
            </strong>
            {showBars && (
              <div aria-hidden="true">
                <i style={{ width: `${(100 * value) / max}%` }} />
              </div>
            )}
          </li>
        ))}
      </ul>
    </>
  );
}

export function ChartDistribution({
  services,
  budgets,
  children,
}: {
  services: Rows;
  budgets: Rows;
  children: ReactNode;
}) {
  const [mode, setMode] = useState<(typeof modes)[number]>('Both');
  const id = useId();
  return (
    <>
      <div className="admin-chart-toggle" role="group" aria-label="Distribution chart view">
        {modes.map((option) => (
          <button
            type="button"
            className="admin-secondary"
            key={option}
            aria-pressed={option === mode}
            aria-controls={id}
            onClick={() => setMode(option)}
          >
            {option}
          </button>
        ))}
      </div>
      <div id={id} className="admin-charts">
        <section className="admin-panel">
          <h3>Services requested</h3>
          <p className="admin-hint">All time · ranked by enquiry count</p>
          <Distribution rows={services} showBars={mode !== 'Pie'} showPie={mode !== 'Bars'} />
          {children}
        </section>
        <section className="admin-panel">
          <h3>Budget distribution</h3>
          <p className="admin-hint">All time · selected ranges in USD</p>
          <Distribution rows={budgets} showBars={mode !== 'Pie'} showPie={mode !== 'Bars'} />
        </section>
      </div>
    </>
  );
}
