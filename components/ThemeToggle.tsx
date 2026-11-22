'use client';

import { useEffect, useState } from 'react';

const PALETTES = ['midnight', 'obsidian', 'champagne'] as const;
type Palette = (typeof PALETTES)[number];

const LABELS: Record<Palette, string> = {
  midnight: 'Midnight',
  obsidian: 'Obsidian',
  champagne: 'Champagne',
};

export default function ThemeToggle() {
  const [palette, setPalette] = useState<Palette>('midnight');

  useEffect(() => {
    const current = document.documentElement.dataset.palette;
    if (current === 'obsidian' || current === 'champagne') {
      setPalette(current);
    }
  }, []);

  function cycle() {
    const next = PALETTES[(PALETTES.indexOf(palette) + 1) % PALETTES.length];
    document.documentElement.dataset.palette = next;
    setPalette(next);
    try {
      localStorage.setItem('kerifem-palette-v2', next);
    } catch {
      // The palette remains available when storage is blocked.
    }
  }

  return (
    <button
      type="button"
      className="kv-palette"
      aria-label={`Switch colour palette. Current theme: ${LABELS[palette]}.`}
      title={`Theme: ${LABELS[palette]} — click to switch`}
      onClick={cycle}
    >
      <span className="kv-palette-swatch" aria-hidden="true" />
      <span>{LABELS[palette]}</span>
    </button>
  );
}
