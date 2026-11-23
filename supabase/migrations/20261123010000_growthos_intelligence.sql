-- Apply only after the foundation migration in an isolated, reviewed environment.
create table public.growth_evidence (
  id uuid primary key default gen_random_uuid(),
  prospect_id uuid not null references public.growth_prospects(id) on delete cascade,
  kind text not null check (kind in ('observed','provider','inference')),
  claim text not null check (char_length(trim(claim)) between 1 and 800),
  source_url text not null default '' check (char_length(source_url) <= 500 and (source_url = '' or source_url ~* '^https?://')),
  created_at timestamptz not null default now(),
  created_by uuid not null default auth.uid() references auth.users(id),
  check (kind = 'inference' or source_url <> '')
);
create index growth_evidence_prospect_idx on public.growth_evidence(prospect_id, created_at desc);

create table public.growth_tasks (
  id uuid primary key default gen_random_uuid(),
  prospect_id uuid not null references public.growth_prospects(id) on delete cascade,
  title text not null check (char_length(trim(title)) between 1 and 180),
  due_date date,
  status text not null default 'open' check (status in ('open','done')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid not null default auth.uid() references auth.users(id)
);
create index growth_tasks_due_idx on public.growth_tasks(status, due_date);
create index growth_tasks_prospect_idx on public.growth_tasks(prospect_id, created_at desc);

create table public.growth_agent_runs (
  id uuid primary key default gen_random_uuid(),
  prospect_id uuid not null references public.growth_prospects(id) on delete cascade,
  actor_id uuid not null references auth.users(id),
  agent text not null default 'service_match' check (agent = 'service_match'),
  status text not null default 'running' check (status in ('running','completed','failed')),
  input jsonb not null,
  output jsonb,
  error_code text,
  model text not null,
  input_tokens integer check (input_tokens is null or input_tokens >= 0),
  output_tokens integer check (output_tokens is null or output_tokens >= 0),
  created_at timestamptz not null default now(),
  finished_at timestamptz
);
create index growth_agent_runs_prospect_idx on public.growth_agent_runs(prospect_id, created_at desc);
create index growth_agent_runs_created_idx on public.growth_agent_runs(created_at desc);

alter table public.growth_evidence enable row level security;
alter table public.growth_tasks enable row level security;
alter table public.growth_agent_runs enable row level security;
revoke all on public.growth_evidence, public.growth_tasks, public.growth_agent_runs from public, anon, authenticated;
grant select, insert on public.growth_evidence to authenticated;
grant select, insert, update on public.growth_tasks to authenticated;
grant select on public.growth_agent_runs to authenticated;
create policy growth_evidence_read on public.growth_evidence for select to authenticated using (public.growth_is_owner());
create policy growth_evidence_insert on public.growth_evidence for insert to authenticated with check (public.growth_is_owner() and created_by = auth.uid());
create policy growth_tasks_owner on public.growth_tasks for all to authenticated using (public.growth_is_owner()) with check (public.growth_is_owner() and created_by = auth.uid());
create policy growth_agent_runs_read on public.growth_agent_runs for select to authenticated using (public.growth_is_owner());

alter table public.growth_activity drop constraint growth_activity_event_check;
alter table public.growth_activity add constraint growth_activity_event_check check (event in ('created','updated','stage_changed','research_added','task_created','task_updated','agent_completed','agent_failed'));
create function public.growth_log_intelligence() returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if tg_table_name = 'growth_evidence' then
    insert into public.growth_activity(prospect_id, actor_id, event, detail) values (new.prospect_id, auth.uid(), 'research_added', 'Research evidence added');
  elsif tg_op = 'INSERT' then
    insert into public.growth_activity(prospect_id, actor_id, event, detail) values (new.prospect_id, auth.uid(), 'task_created', 'Follow-up task created');
  else
    insert into public.growth_activity(prospect_id, actor_id, event, detail) values (new.prospect_id, auth.uid(), 'task_updated', 'Follow-up task updated');
  end if;
  return new;
end; $$;
revoke all on function public.growth_log_intelligence() from public;
create trigger growth_evidence_audit after insert on public.growth_evidence for each row execute function public.growth_log_intelligence();
create trigger growth_tasks_audit after insert or update on public.growth_tasks for each row execute function public.growth_log_intelligence();
create trigger growth_tasks_touch before update on public.growth_tasks for each row execute function public.growth_touch_prospect();

-- Serialize starts per owner across instances. A stale job is failed before a new one starts.
create function public.growth_begin_match(p_prospect uuid, p_model text) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare snapshot jsonb; run_id uuid;
begin
  if not public.growth_is_owner() then raise exception 'not authorized'; end if;
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
revoke all on function public.growth_begin_match(uuid,text) from public;
grant execute on function public.growth_begin_match(uuid,text) to authenticated;

create function public.growth_finish_match(p_run uuid, p_output jsonb, p_error text, p_input_tokens integer, p_output_tokens integer) returns boolean
language plpgsql security definer set search_path = '' as $$
declare target uuid; final_status text;
begin
  if not public.growth_is_owner() then raise exception 'not authorized'; end if;
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
revoke all on function public.growth_finish_match(uuid,jsonb,text,integer,integer) from public;
grant execute on function public.growth_finish_match(uuid,jsonb,text,integer,integer) to authenticated;
