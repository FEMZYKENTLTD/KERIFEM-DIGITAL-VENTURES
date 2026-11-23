-- Run once on an existing enquiries database. Does not modify enquiry payloads.
alter table public.enquiries add column if not exists workflow_status text not null default 'pending';
alter table public.enquiries drop constraint if exists enquiries_workflow_status_check;
alter table public.enquiries add constraint enquiries_workflow_status_check
  check (workflow_status in ('pending', 'completed', 'cancelled'));
alter table public.enquiries add column if not exists deleted_at timestamptz;
create index if not exists enquiries_deleted_at_idx on public.enquiries (deleted_at);
create index if not exists enquiries_workflow_status_idx on public.enquiries (workflow_status);
