-- STAGED ONLY: not a deployable migration; app authorization and invitation flows are incomplete.
-- Do not apply to any shared database until the full preview security regression is ready.
-- Server-managed access, keyed by immutable Auth user ID, never user-editable metadata.
create table public.workspace_managers (
  user_id uuid primary key references auth.users(id),
  enabled boolean not null default true,
  changed_by uuid not null references auth.users(id),
  changed_at timestamptz not null default now()
);
create table public.workspace_manager_audit (
  id bigint generated always as identity primary key,
  actor_id uuid not null references auth.users(id),
  subject_id uuid not null references auth.users(id),
  enabled boolean not null,
  created_at timestamptz not null default now()
);
alter table public.workspace_managers enable row level security;
alter table public.workspace_manager_audit enable row level security;
revoke all on public.workspace_managers, public.workspace_manager_audit from public, anon, authenticated, service_role;
revoke all on sequence public.workspace_manager_audit_id_seq from public, anon, authenticated, service_role;

create function public.workspace_role() returns text
language sql stable security definer set search_path = '' as $$
  select case
    when public.growth_is_owner() then 'owner'
    when exists (select 1 from public.workspace_managers m join auth.users u on u.id=m.user_id
      where m.user_id=auth.uid() and m.enabled and u.email_confirmed_at is not null
        and (u.banned_until is null or u.banned_until <= now())) then 'manager'
    else null end;
$$;
create function public.workspace_is_staff() returns boolean
language sql stable security definer set search_path = '' as $$
  select coalesce(public.workspace_role() in ('owner','manager'), false);
$$;
create function public.workspace_set_manager(p_user uuid, p_enabled boolean) returns boolean
language plpgsql security definer set search_path = '' as $$
begin
  if not public.growth_is_owner() then raise exception 'not authorized'; end if;
  if p_user is null or p_enabled is null or p_user=auth.uid() or not exists
    (select 1 from auth.users u where u.id=p_user and lower(u.email) <> 'femzykenterprisesltd@gmail.com')
    then raise exception 'invalid manager'; end if;
  insert into public.workspace_managers(user_id,enabled,changed_by) values (p_user,p_enabled,auth.uid())
    on conflict(user_id) do update set enabled=excluded.enabled,changed_by=excluded.changed_by,changed_at=now();
  insert into public.workspace_manager_audit(actor_id,subject_id,enabled) values(auth.uid(),p_user,p_enabled);
  return true;
end; $$;
revoke all on function public.workspace_role(), public.workspace_is_staff(), public.workspace_set_manager(uuid,boolean) from public, anon, authenticated, service_role;
grant execute on function public.workspace_role(), public.workspace_is_staff(), public.workspace_set_manager(uuid,boolean) to authenticated;

-- The manager can read and edit operational data, but cannot directly delete prospects,
-- audit logs, or administrative membership. Deletion RPC remains owner-only.
drop policy growth_prospects_owner on public.growth_prospects;
create policy growth_prospects_staff_select on public.growth_prospects for select to authenticated using (public.workspace_is_staff());
create policy growth_prospects_staff_insert on public.growth_prospects for insert to authenticated with check (public.workspace_is_staff());
create policy growth_prospects_staff_update on public.growth_prospects for update to authenticated using (public.workspace_is_staff()) with check (public.workspace_is_staff());
drop policy growth_activity_owner on public.growth_activity;
create policy growth_activity_staff on public.growth_activity for select to authenticated using (public.workspace_is_staff());
drop policy growth_evidence_read on public.growth_evidence;
create policy growth_evidence_read on public.growth_evidence for select to authenticated using (public.workspace_is_staff());
drop policy growth_evidence_insert on public.growth_evidence;
create policy growth_evidence_insert on public.growth_evidence for insert to authenticated with check (public.workspace_is_staff() and created_by=auth.uid());
drop policy growth_tasks_owner on public.growth_tasks;
create policy growth_tasks_staff on public.growth_tasks for select to authenticated using (public.workspace_is_staff());
create policy growth_tasks_insert on public.growth_tasks for insert to authenticated with check (public.workspace_is_staff() and created_by=auth.uid());
create policy growth_tasks_update on public.growth_tasks for update to authenticated using (public.workspace_is_staff()) with check (public.workspace_is_staff());
drop policy growth_agent_runs_read on public.growth_agent_runs;
create policy growth_agent_runs_read on public.growth_agent_runs for select to authenticated using (public.workspace_is_staff());
-- Do not allow a task editor to forge ownership or transfer the task to another prospect.
create function public.workspace_guard_task_identity() returns trigger
language plpgsql set search_path = '' as $$
begin
  if new.id is distinct from old.id or new.created_at is distinct from old.created_at
    or new.created_by is distinct from old.created_by or new.prospect_id is distinct from old.prospect_id
    then raise exception 'immutable task identity'; end if;
  return new;
end; $$;
revoke all on function public.workspace_guard_task_identity() from public, anon, authenticated, service_role;
create trigger workspace_guard_task_identity before update on public.growth_tasks for each row execute function public.workspace_guard_task_identity();

create or replace function public.growth_begin_match(p_prospect uuid, p_model text) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare snapshot jsonb; run_id uuid;
begin
  if not public.workspace_is_staff() then raise exception 'not authorized'; end if;
  if length(p_model) < 1 or length(p_model) > 100 then raise exception 'invalid model'; end if;
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtext('growth_service_match'), pg_catalog.hashtext(auth.uid()::text));
  update public.growth_agent_runs set status='failed', error_code='timed_out', finished_at=now()
    where actor_id=auth.uid() and status='running' and created_at < now() - interval '5 minutes';
  if exists(select 1 from public.growth_agent_runs where actor_id=auth.uid() and (status='running' or created_at > now() - interval '1 minute'))
    or (select count(*) from public.growth_agent_runs where actor_id=auth.uid() and created_at > now() - interval '24 hours') >= 10 then
    raise exception 'rate limited';
  end if;
  select jsonb_build_object('name', p.name, 'industry', p.industry, 'location', p.location,
    'evidence', coalesce((select jsonb_agg(jsonb_build_object('id', e.id, 'kind', e.kind, 'claim', e.claim, 'source_url', e.source_url, 'created_at', e.created_at) order by e.created_at desc)
      from (select * from public.growth_evidence where prospect_id = p.id order by created_at desc limit 20) e), '[]'::jsonb))
    into snapshot from public.growth_prospects p where p.id = p_prospect;
  if snapshot is null or jsonb_array_length(snapshot->'evidence') = 0 then raise exception 'prospect or evidence missing'; end if;
  insert into public.growth_agent_runs(prospect_id,actor_id,model,input) values(p_prospect,auth.uid(),p_model,snapshot) returning id into run_id;
  return jsonb_build_object('id',run_id,'input',snapshot);
end; $$;

create or replace function public.growth_finish_match(p_run uuid, p_output jsonb, p_error text, p_input_tokens integer, p_output_tokens integer) returns boolean
language plpgsql security definer set search_path = '' as $$
declare target uuid; final_status text;
begin
  if not public.workspace_is_staff() then raise exception 'not authorized'; end if;
  if p_output is not null and (jsonb_typeof(p_output) <> 'object' or pg_column_size(p_output) > 30000) then raise exception 'invalid output'; end if;
  if p_output is null and (p_error is null or p_error not in ('provider_error','invalid_response','timeout')) then raise exception 'invalid error'; end if;
  final_status := case when p_output is null then 'failed' else 'completed' end;
  update public.growth_agent_runs set status=final_status, output=p_output, error_code=case when p_output is null then p_error else null end,
    input_tokens=p_input_tokens, output_tokens=p_output_tokens, finished_at=now()
    where id=p_run and actor_id=auth.uid() and status='running' returning prospect_id into target;
  if target is null then return false; end if;
  insert into public.growth_activity(prospect_id,actor_id,event,detail) values(target,auth.uid(),case when final_status='completed' then 'agent_completed' else 'agent_failed' end,case when final_status='completed' then 'Service match generated for review' else 'Service match failed' end);
  return true;
end; $$;

create or replace function public.growth_import_prospects(p_rows jsonb) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare row jsonb; new_count integer := 0; skipped_count integer := 0; n text; loc text; site text; mail text;
begin
  if not public.workspace_is_staff() then raise exception 'not authorized'; end if;
  if p_rows is null or jsonb_typeof(p_rows) <> 'array' or jsonb_array_length(p_rows) < 1 or jsonb_array_length(p_rows) > 100 or pg_column_size(p_rows) > 200000 then raise exception 'invalid batch'; end if;
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtext('growth_csv_import'));
  for row in select value from jsonb_array_elements(p_rows) loop
    if jsonb_typeof(row) <> 'object' then raise exception 'invalid row'; end if;
    n := trim(coalesce(row->>'name','')); loc := trim(coalesce(row->>'location',''));
    site := trim(coalesce(row->>'website','')); mail := trim(coalesce(row->>'email',''));
    if n = '' or length(n)>160 or length(loc)>160 or length(site)>500 or length(mail)>254
      or (site <> '' and site !~* '^https?://') or (mail <> '' and mail !~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$')
      or (coalesce(row->>'email_source','') <> '' and coalesce(row->>'email_source','') !~* '^https?://') then raise exception 'invalid row'; end if;
    if exists(select 1 from public.growth_prospects p where
      (lower(trim(p.name)) = lower(n) and lower(trim(p.location)) = lower(loc)) or
      (site <> '' and lower(trim(p.website)) = lower(site)) or
      (mail <> '' and lower(trim(p.email)) = lower(mail))) then
      skipped_count := skipped_count + 1;
    else
      insert into public.growth_prospects(name,website,industry,location,email,email_source,notes)
      values(n,site,coalesce(row->>'industry',''),loc,mail,coalesce(row->>'email_source',''),coalesce(row->>'notes',''));
      new_count := new_count + 1;
    end if;
  end loop;
  return jsonb_build_object('imported',new_count,'skipped',skipped_count);
end; $$;
