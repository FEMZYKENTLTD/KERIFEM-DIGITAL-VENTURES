'use client';

import { useState } from 'react';

const monthLabel = new Intl.DateTimeFormat('en-GB', {
  month: 'short',
  year: '2-digit',
  timeZone: 'Africa/Lagos',
});

type MonthRow = {
  month: string;
  count: number;
  pending: number;
  completed: number;
  cancelled: number;
};

function labelFor(month: string) {
  return monthLabel.format(new Date(`${month}T00:00:00+01:00`));
}

function breakdown(row: MonthRow) {
  return `${labelFor(row.month)}: ${row.count} total · ${row.pending} pending · ${row.completed} completed · ${row.cancelled} cancelled`;
}

export function MonthChart({ months }: { months: MonthRow[] }) {
  const [selected, setSelected] = useState(months.at(-1)?.month ?? '');
  const monthMax = Math.max(1, ...months.map(({ count }) => count));
  const current = months.find((row) => row.month === selected);
  return (
    <>
      <p className="admin-hint">
        Tap or select a month to read the counts. A mouse is not required.
      </p>
      <div
        className="admin-months"
        role="group"
        aria-label="Monthly enquiry counts for twelve months"
      >
        {months.map((row) => {
          const height = Math.max(8, (100 * row.count) / monthMax);
          const pressed = row.month === selected;
          return (
            <button
              key={row.month}
              type="button"
              className="admin-month"
              aria-pressed={pressed}
              aria-label={breakdown(row)}
              onClick={() => setSelected(row.month)}
            >
              <span className="admin-month-count">{row.count}</span>
              <div className="admin-month-stack" style={{ height: `${height}%` }}>
                {row.count === 0 ? (
                  <i className="admin-month-empty" />
                ) : (
                  <>
                    <i data-workflow="cancelled" style={{ flexGrow: row.cancelled || 0 }} />
                    <i data-workflow="completed" style={{ flexGrow: row.completed || 0 }} />
                    <i data-workflow="pending" style={{ flexGrow: row.pending || 0 }} />
                  </>
                )}
              </div>
              <span>{labelFor(row.month)}</span>
            </button>
          );
        })}
      </div>
      <p className="admin-month-readout" role="status">
        {current
          ? breakdown(current)
          : 'Select a month to see pending, completed and cancelled counts.'}
      </p>
    </>
  );
}
