-- STAGED ONLY. Review and test on an isolated Supabase project before using.
-- Stores no search term or provider result; protects quota across application instances.
create table public.growth_discovery_requests (
  id bigint generated always as identity primary key,
  actor_id uuid not null references auth.users(id),
  created_at timestamptz not null default now()
);
create index growth_discovery_actor_time_idx on public.growth_discovery_requests(actor_id, created_at desc);
alter table public.growth_discovery_requests enable row level security;
revoke all on public.growth_discovery_requests from public, anon, authenticated, service_role;
revoke all on sequence public.growth_discovery_requests_id_seq from public, anon, authenticated, service_role;
create policy growth_discovery_audit_owner on public.growth_discovery_requests for select to authenticated using (public.growth_is_owner());
grant select on public.growth_discovery_requests to authenticated;
create function public.growth_begin_discovery() returns boolean
language plpgsql security definer set search_path = '' as $$
begin
  if not public.growth_is_owner() then raise exception 'not authorized'; end if;
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtext('growth_discovery'), pg_catalog.hashtext(auth.uid()::text));
  if exists(select 1 from public.growth_discovery_requests where actor_id=auth.uid() and created_at > now() - interval '1 minute')
     or (select count(*) from public.growth_discovery_requests where actor_id=auth.uid() and created_at > now() - interval '24 hours') >= 20 then
    raise exception 'rate limited';
  end if;
  insert into public.growth_discovery_requests(actor_id) values (auth.uid());
  return true;
end; $$;
revoke all on function public.growth_begin_discovery() from public, anon, authenticated, service_role;
grant execute on function public.growth_begin_discovery() to authenticated;
