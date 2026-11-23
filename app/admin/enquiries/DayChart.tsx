'use client';

import { useState } from 'react';

type DayRow = { day: string; count: number };

export function DayChart({ days }: { days: DayRow[] }) {
  const [selected, setSelected] = useState(days.at(-1)?.day ?? '');
  const max = Math.max(1, ...days.map(({ count }) => count));
  const current = days.find((row) => row.day === selected);
  return (
    <>
      <p className="admin-hint">Tap or select a day to read the count. A mouse is not required.</p>
      <div className="admin-columns" role="group" aria-label="Daily enquiry counts for 30 days">
        {days.map(({ day, count }) => (
          <button
            key={day}
            type="button"
            className="admin-day"
            aria-pressed={day === selected}
            aria-label={`${day}: ${count}`}
            onClick={() => setSelected(day)}
            style={{ height: `${Math.max(8, (100 * count) / max)}%` }}
          />
        ))}
      </div>
      <p className="admin-month-readout" role="status">
        {current
          ? `${current.day}: ${current.count} enquir${current.count === 1 ? 'y' : 'ies'}`
          : 'Select a day to see the count.'}
      </p>
    </>
  );
}
