-- GrowthOS foundation. Independent of the public enquiries table.
create table public.growth_prospects (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 1 and 160),
  website text not null default '' check (char_length(website) <= 500),
  industry text not null default '' check (char_length(industry) <= 120),
  location text not null default '' check (char_length(location) <= 160),
  email text not null default '' check (char_length(email) <= 254),
  email_source text not null default '' check (char_length(email_source) <= 500),
  notes text not null default '' check (char_length(notes) <= 5000),
  stage text not null default 'new' check (stage in ('new','researching','qualified','contact_identified','draft_ready','awaiting_approval','contacted','replied','meeting_booked','proposal_sent','negotiation','won','lost','not_a_fit','suppressed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index growth_prospects_stage_idx on public.growth_prospects(stage);
create index growth_prospects_created_idx on public.growth_prospects(created_at desc);
create table public.growth_activity (
  id bigint generated always as identity primary key,
  prospect_id uuid not null references public.growth_prospects(id) on delete cascade,
  actor_id uuid not null references auth.users(id),
  event text not null check (event in ('created','updated','stage_changed')),
  detail text not null default '',
  created_at timestamptz not null default now()
);
create index growth_activity_created_idx on public.growth_activity(created_at desc);
create index growth_activity_prospect_idx on public.growth_activity(prospect_id, created_at desc);

-- Check the authoritative user record, not user-editable metadata.
create function public.growth_is_owner() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from auth.users where id = auth.uid()
    and lower(email) = 'femzykenterprisesltd@gmail.com' and email_confirmed_at is not null);
$$;
revoke all on function public.growth_is_owner() from public;
grant execute on function public.growth_is_owner() to authenticated;
alter table public.growth_prospects enable row level security;
alter table public.growth_activity enable row level security;
revoke all on public.growth_prospects, public.growth_activity from public, anon, authenticated;
grant select, insert, update on public.growth_prospects to authenticated;
grant select on public.growth_activity to authenticated;
create policy growth_prospects_owner on public.growth_prospects for all to authenticated
  using (public.growth_is_owner()) with check (public.growth_is_owner());
create policy growth_activity_owner on public.growth_activity for select to authenticated
  using (public.growth_is_owner());

-- Transactional audit entries cannot be forged through the client role.
create function public.growth_log_prospect() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if tg_op = 'INSERT' then
    insert into public.growth_activity(prospect_id, actor_id, event, detail)
      values (new.id, auth.uid(), 'created', 'Prospect added');
  else
    if old.stage is distinct from new.stage then
      insert into public.growth_activity(prospect_id, actor_id, event, detail)
        values (new.id, auth.uid(), 'stage_changed', old.stage || ' → ' || new.stage);
    else
      insert into public.growth_activity(prospect_id, actor_id, event, detail)
        values (new.id, auth.uid(), 'updated', 'Prospect details updated');
    end if;
  end if;
  return new;
end; $$;
revoke all on function public.growth_log_prospect() from public;
create trigger growth_prospect_audit after insert or update on public.growth_prospects
for each row execute function public.growth_log_prospect();

create function public.growth_touch_prospect() returns trigger
language plpgsql set search_path = '' as $$
begin new.updated_at := now(); return new; end; $$;
create trigger growth_prospect_touch before update on public.growth_prospects
for each row execute function public.growth_touch_prospect();
