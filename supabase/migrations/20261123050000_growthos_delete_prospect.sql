-- Prospect deletion is explicit, owner-only, and leaves a minimal audit record.
-- No existing records are modified by applying this migration.
create table public.growth_deletion_audit (
  id bigint generated always as identity primary key,
  prospect_id uuid not null,
  actor_id uuid not null references auth.users(id),
  deleted_at timestamptz not null default now()
);
alter table public.growth_deletion_audit enable row level security;
revoke all on public.growth_deletion_audit from public, anon, authenticated, service_role;
revoke all on sequence public.growth_deletion_audit_id_seq from public, anon, authenticated, service_role;
grant select on public.growth_deletion_audit to authenticated;
create policy growth_deletion_audit_owner on public.growth_deletion_audit
  for select to authenticated using (public.growth_is_owner());

create function public.growth_delete_prospect(p_prospect uuid) returns boolean
language plpgsql security definer set search_path = '' as $$
declare deleted_id uuid;
begin
  if not public.growth_is_owner() then raise exception 'not authorized'; end if;
  -- Keep manually suppressed records until a durable suppression system exists.
  delete from public.growth_prospects where id = p_prospect and stage <> 'suppressed'
    returning id into deleted_id;
  if deleted_id is null then return false; end if;
  insert into public.growth_deletion_audit(prospect_id, actor_id) values (deleted_id, auth.uid());
  return true;
end; $$;
revoke all on function public.growth_delete_prospect(uuid) from public, anon, authenticated, service_role;
grant execute on function public.growth_delete_prospect(uuid) to authenticated;
