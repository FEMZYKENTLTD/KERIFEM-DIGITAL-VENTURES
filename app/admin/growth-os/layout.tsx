import Link from 'next/link';
import {
  Activity,
  ArrowLeft,
  BarChart3,
  ContactRound,
  LayoutDashboard,
  ListTodo,
  Settings2,
  ShieldCheck,
  Workflow,
} from 'lucide-react';
import { requireOwner } from '@/lib/admin-auth';
import './growth.css';

export default async function GrowthLayout({ children }: { children: React.ReactNode }) {
  await requireOwner();
  const links = [
    ['/admin/growth-os', 'Overview', LayoutDashboard],
    ['/admin/growth-os/prospects', 'Prospects', ContactRound],
    ['/admin/growth-os/pipeline', 'Pipeline', Workflow],
    ['/admin/growth-os/tasks', 'Follow-up tasks', ListTodo],
    ['/admin/growth-os/analytics', 'Analytics', BarChart3],
    ['/admin/growth-os/settings', 'Connections & safety', Settings2],
  ] as const;
  return (
    <div className="growth-shell">
      <aside className="growth-sidebar">
        <Link href="/admin/growth-os" className="growth-brand">
          <span className="brand-mark">
            K<span>.</span>
          </span>
          <span>
            KERIFEM <b>GrowthOS</b>
            <small>OWNER WORKSPACE</small>
          </span>
        </Link>
        <div className="side-label">WORKSPACE</div>
        <nav aria-label="GrowthOS navigation">
          {links.map(([href, label, Icon]) => (
            <Link key={href} href={href}>
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </nav>
        <div className="side-bottom">
          <div className="side-note">
            <ShieldCheck size={19} />
            <div>
              <strong>Human-led growth</strong>
              <p>Research thoughtfully. Every relationship starts with trust.</p>
            </div>
          </div>
          <Link href="/admin/enquiries">
            <ArrowLeft size={16} /> Enquiry workspace
          </Link>
        </div>
      </aside>
      <div className="growth-main">
        <header className="growth-top">
          <span>
            <Activity size={15} /> GROWTH OPERATIONS <span className="top-separator">/</span>{' '}
            <strong>WORKSPACE</strong>
          </span>
          <span className="owner-chip">
            <i /> Owner access
          </span>
        </header>
        {children}
        <footer className="growth-footer">
          KERIFEM DIGITAL VENTURES <span>Built for intentional growth.</span>
        </footer>
      </div>
    </div>
  );
}
