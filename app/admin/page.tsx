import Link from 'next/link';
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  ContactRound,
  Inbox,
  ListTodo,
  LockKeyhole,
  Plus,
  Sparkles,
  Workflow,
} from 'lucide-react';
import { requireOwner } from '@/lib/admin-auth';
import { enquiryStore } from '@/lib/enquiry-store';
import { ACTIVE_ENQUIRIES } from '@/lib/workflow';

async function enquiryCount() {
  const response = await enquiryStore(`?select=id&${ACTIVE_ENQUIRIES}`, {
    method: 'HEAD',
    headers: { Prefer: 'count=exact' },
  });
  const value = response.headers.get('content-range')?.split('/').pop();
  if (!value || !/^\d+$/.test(value)) throw new Error('Count unavailable');
  return Number(value);
}

export default async function AdminPage() {
  const db = await requireOwner();
  const [enquiries, prospects, tasks] = await Promise.allSettled([
    enquiryCount(),
    db.from('growth_prospects').select('*', { count: 'exact', head: true }),
    db.from('growth_tasks').select('*', { count: 'exact', head: true }).eq('status', 'open'),
  ]);
  const enquiriesValue = enquiries.status === 'fulfilled' ? enquiries.value : null;
  const prospectsValue =
    prospects.status === 'fulfilled' && !prospects.value.error ? prospects.value.count : null;
  const tasksValue = tasks.status === 'fulfilled' && !tasks.value.error ? tasks.value.count : null;
  const cards = [
    {
      title: 'Active enquiries',
      value: enquiriesValue,
      description: 'Excludes the recycle bin',
      icon: Inbox,
      href: '/admin/enquiries',
    },
    {
      title: 'Prospects',
      value: prospectsValue,
      description: 'Recorded in GrowthOS',
      icon: ContactRound,
      href: '/admin/growth-os/prospects',
    },
    {
      title: 'Open tasks',
      value: tasksValue,
      description: 'Follow-ups in GrowthOS',
      icon: ListTodo,
      href: '/admin/growth-os/tasks',
    },
  ];
  return (
    <div className="admin-home">
      <section className="admin-command">
        <div className="admin-command-orbit" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div className="admin-command-copy">
          <p className="admin-command-kicker">
            <span /> OWNER COMMAND CENTRE
          </p>
          <h1>
            Everything you’re building,
            <br />
            <em>in one place.</em>
          </h1>
          <p>
            Your enquiries, relationships and next steps — a clearer view of the work that moves
            your business forward.
          </p>
          <div className="admin-command-actions">
            <Link href="/admin/growth-os" className="admin-home-primary">
              <Sparkles size={17} /> Open GrowthOS <ArrowUpRight size={16} />
            </Link>
            <Link href="/admin/enquiries" className="admin-home-secondary">
              View enquiries <ArrowRight size={16} />
            </Link>
          </div>
        </div>
        <div className="admin-command-illustration" aria-hidden="true">
          <div className="command-ring command-ring-one" />
          <div className="command-ring command-ring-two" />
          <div className="command-core">
            <span>
              K<span>.</span>
            </span>
          </div>
          <span className="command-node command-node-one">
            <Inbox size={19} />
          </span>
          <span className="command-node command-node-two">
            <Workflow size={19} />
          </span>
          <span className="command-node command-node-three">
            <Activity size={19} />
          </span>
        </div>
      </section>
      <div className="admin-home-heading">
        <div>
          <p className="admin-command-kicker">YOUR WORK AT A GLANCE</p>
          <h2>Today’s workspace</h2>
        </div>
        <span>LIVE COUNTS WHERE AVAILABLE</span>
      </div>
      <div className="admin-home-metrics">
        {cards.map(({ title, value, description, icon: Icon, href }) => (
          <Link href={href} className="admin-home-metric" key={title}>
            <div>
              <span>{title}</span>
              <Icon size={18} />
            </div>
            <strong>{value === null ? '—' : value.toLocaleString('en-GB')}</strong>
            <small>{value === null ? 'Unavailable — check configuration' : description}</small>
          </Link>
        ))}
      </div>
      <div className="admin-home-heading">
        <div>
          <p className="admin-command-kicker">CHOOSE YOUR WORKSPACE</p>
          <h2>Pick up where you left off</h2>
        </div>
      </div>
      <div className="admin-home-grid">
        <Link href="/admin/growth-os" className="admin-destination admin-destination-growth">
          <span className="admin-destination-icon">
            <Sparkles size={23} />
          </span>
          <span className="admin-destination-arrow">
            <ArrowUpRight size={20} />
          </span>
          <p className="admin-command-kicker">ACQUISITION & SALES</p>
          <h3>GrowthOS</h3>
          <p>Research prospects, manage your pipeline and stay on top of follow-ups.</p>
          <span className="admin-destination-cta">
            Enter GrowthOS <ArrowRight size={16} />
          </span>
        </Link>
        <Link href="/admin/enquiries" className="admin-destination">
          <span className="admin-destination-icon">
            <Inbox size={23} />
          </span>
          <span className="admin-destination-arrow">
            <ArrowUpRight size={20} />
          </span>
          <p className="admin-command-kicker">CLIENT REQUESTS</p>
          <h3>Enquiry inbox</h3>
          <p>Review submissions, track their status and check notification activity.</p>
          <span className="admin-destination-cta">
            Open enquiries <ArrowRight size={16} />
          </span>
        </Link>
      </div>
      <div className="admin-quicklinks">
        <span>QUICK ACTIONS</span>
        <Link href="/admin/enquiries/new">
          <Plus size={15} /> New enquiry
        </Link>
        <Link href="/admin/growth-os/prospects/new">
          <Plus size={15} /> Add prospect
        </Link>
        <Link href="/admin/growth-os/pipeline">
          <Workflow size={15} /> View pipeline
        </Link>
        <Link href="/admin/growth-os/settings">
          <CheckCircle2 size={15} /> Connections & safety
        </Link>
      </div>
      <p className="admin-home-note">
        <LockKeyhole size={15} /> Owner-only workspace. GrowthOS discovery and automated outreach
        are not yet implemented.
      </p>
    </div>
  );
}
