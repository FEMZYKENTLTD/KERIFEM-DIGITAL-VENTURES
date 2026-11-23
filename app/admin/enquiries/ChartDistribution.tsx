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
const modes = ['Bars', 'Pie', 'Premium'] as const;
type Rows = [string, number][];
const format = new Intl.NumberFormat('en-GB');
const percent = new Intl.NumberFormat('en-GB', { style: 'percent', maximumFractionDigits: 1 });

export function Distribution({
  rows,
  showBars,
  showPie,
  unit = 'ENQUIRIES',
}: {
  rows: Rows;
  showBars: boolean;
  showPie: boolean;
  unit?: string;
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
    <div className="admin-distribution" data-ring={showPie && total > 0}>
      {showPie &&
        (total ? (
          <div
            className="admin-pie"
            aria-hidden="true"
            style={{ background: `conic-gradient(${slices.join(', ')})` }}
          >
            <div className="admin-pie-center">
              <strong>{format.format(total)}</strong>
              <small>{unit}</small>
            </div>
          </div>
        ) : (
          <p className="admin-hint">No enquiries to chart yet.</p>
        ))}
      <ul className="admin-bars">
        {rows.map(([label, value], index) => (
          <li key={label}>
            <span className="admin-chart-name">
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
              <div className="admin-chart-track" aria-hidden="true">
                <i
                  style={{
                    width: `${(100 * value) / max}%`,
                    background: colors[index % colors.length],
                  }}
                />
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
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
  const [mode, setMode] = useState<(typeof modes)[number]>('Premium');
  const id = useId();
  return (
    <>
      <div className="admin-chart-toggle" role="group" aria-label="Distribution chart view">
        {modes.map((option) => (
          <button
            type="button"
            className="admin-secondary"
            key={option === 'Pie' ? 'Donut' : option}
            aria-pressed={option === mode}
            aria-controls={id}
            onClick={() => setMode(option)}
          >
            {option === 'Pie' ? 'Donut' : option}
          </button>
        ))}
      </div>
      {mode === 'Premium' && (
        <p className="admin-hint">
          Premium overview · share of enquiries and count comparison in one view.
        </p>
      )}
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
