import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import {
  ArrowUpRight,
  Home,
  Inbox,
  LayoutDashboard,
  LockKeyhole,
  Sparkles,
  UserRound,
} from 'lucide-react';
import { ownerSession } from '@/lib/admin-auth';
import { signOut } from './actions';
import './workspace.css';

export const metadata: Metadata = {
  title: 'Owner workspace',
  robots: { index: false, follow: false },
};
export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  let isOwner = false;
  try {
    isOwner = Boolean(await ownerSession());
  } catch {
    // A failed auth check never reveals the owner navigation.
  }
  return (
    <div className="admin-wrap">
      <header className="admin-shellbar">
        <Link href={isOwner ? '/admin' : '/'} className="admin-shellbrand">
          <span className="admin-shellmark">
            K<span>.</span>
          </span>
          <span>
            KERIFEM <small>OWNER WORKSPACE</small>
          </span>
        </Link>
        {isOwner ? (
          <>
            <nav className="admin-shellnav" aria-label="Owner workspace navigation">
              <Link href="/admin">
                <LayoutDashboard size={16} /> Overview
              </Link>
              <Link href="/admin/enquiries">
                <Inbox size={16} /> Enquiries
              </Link>
              <Link href="/admin/growth-os" className="admin-growth-link">
                <Sparkles size={16} /> GrowthOS <ArrowUpRight size={14} />
              </Link>
              <Link href="/admin/account">
                <UserRound size={16} /> Account
              </Link>
            </nav>
            <form action={signOut}>
              <button className="admin-shell-signout">Sign out</button>
            </form>
          </>
        ) : (
          <Link href="/" className="admin-return">
            <Home size={15} /> Back to website
          </Link>
        )}
      </header>
      <div className="admin-shell-content">
        {!isOwner && (
          <p className="admin-eyebrow">
            <LockKeyhole size={13} /> PRIVATE OWNER ACCESS
          </p>
        )}
        {children}
      </div>
    </div>
  );
}
