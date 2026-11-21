'use client';

import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

function stripUrlParameters<T extends { url: string }>(event: T): T {
  return { ...event, url: event.url.replace(/[?#].*$/, '') };
}

export default function SiteTelemetry() {
  return (
    <>
      <Analytics beforeSend={stripUrlParameters} />
      <SpeedInsights beforeSend={stripUrlParameters} />
    </>
  );
}
