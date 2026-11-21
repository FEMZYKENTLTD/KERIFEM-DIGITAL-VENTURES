'use client';

import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [midnight, setMidnight] = useState(true);

  useEffect(() => {
    setMidnight(document.documentElement.dataset.palette === 'midnight');
  }, []);

  function toggle() {
    const next = !midnight;
    document.documentElement.dataset.palette = next ? 'midnight' : 'obsidian';
    setMidnight(next);
    try {
      localStorage.setItem('kerifem-palette', next ? 'midnight' : 'obsidian');
    } catch {
      // The palette remains available when storage is blocked.
    }
  }

  return (
    <button
      type="button"
      className="kv-palette"
      aria-label="Midnight blue theme"
      aria-pressed={midnight}
      onClick={toggle}
    >
      <span className="kv-palette-swatch" aria-hidden="true" />
      <span>Midnight</span>
    </button>
  );
}
