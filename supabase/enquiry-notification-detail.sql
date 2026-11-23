-- Run once on an existing enquiries database. Does not modify enquiry payloads.
alter table public.enquiries drop constraint if exists enquiries_notification_check;
alter table public.enquiries add constraint enquiries_notification_check
  check (notification in ('pending', 'accepted', 'failed', 'not_configured', 'ambiguous'));
alter table public.enquiries add column if not exists notification_detail jsonb not null default '{}'::jsonb;
alter table public.enquiries add column if not exists notification_message_id text;
