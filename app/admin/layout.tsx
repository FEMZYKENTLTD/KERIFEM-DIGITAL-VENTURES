import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './workspace.css';

export const metadata: Metadata = {
  title: 'Owner workspace',
  robots: { index: false, follow: false },
};
export const dynamic = 'force-dynamic';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="admin-wrap">
      <p className="admin-eyebrow">KERIFEM DIGITAL VENTURES / OWNER WORKSPACE</p>
      {children}
    </div>
  );
}
