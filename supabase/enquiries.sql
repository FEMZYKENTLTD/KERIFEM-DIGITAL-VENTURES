-- Run once in the project's SQL editor. No browser role can access enquiries.
create table public.enquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  payload jsonb not null,
  notification text not null default 'pending' check (notification in ('pending', 'accepted', 'failed', 'not_configured', 'ambiguous')),
  notification_detail jsonb not null default '{}'::jsonb,
  notification_message_id text
);
create index enquiries_created_at_idx on public.enquiries (created_at desc);
alter table public.enquiries enable row level security;
revoke all on public.enquiries from public, anon, authenticated;
grant select, insert, update, delete on public.enquiries to service_role;
