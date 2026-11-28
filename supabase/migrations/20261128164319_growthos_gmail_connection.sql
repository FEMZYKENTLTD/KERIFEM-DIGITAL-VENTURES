-- Additive Gmail credential storage; application OAuth flow remains unverified.
-- Only the authenticated owner can store an encrypted credential; the plaintext
-- refresh token and encryption key are never passed to Postgres.
create table public.growth_gmail_connection (
  singleton boolean primary key default true check (singleton),
  encrypted_refresh_token text not null check (length(encrypted_refresh_token) between 30 and 16000),
  connected_by uuid not null references auth.users(id),
  updated_at timestamptz not null default now()
);
create table public.growth_gmail_connection_audit (
  id bigint generated always as identity primary key,
  actor_id uuid not null references auth.users(id),
  action text not null check (action in ('connected','disconnected')),
  created_at timestamptz not null default now()
);
alter table public.growth_gmail_connection enable row level security;
alter table public.growth_gmail_connection_audit enable row level security;
revoke all on public.growth_gmail_connection, public.growth_gmail_connection_audit from public, anon, authenticated, service_role;
revoke all on sequence public.growth_gmail_connection_audit_id_seq from public, anon, authenticated, service_role;
create function public.growth_connect_gmail(p_encrypted text) returns boolean
language plpgsql security definer set search_path = '' as $$
begin
  if not public.growth_is_owner() then raise exception 'not authorized'; end if;
  if p_encrypted is null or length(p_encrypted) not between 30 and 16000 or p_encrypted !~ '^v1\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$' then raise exception 'invalid credential'; end if;
  insert into public.growth_gmail_connection(singleton,encrypted_refresh_token,connected_by) values(true,p_encrypted,auth.uid())
    on conflict(singleton) do update set encrypted_refresh_token=excluded.encrypted_refresh_token,connected_by=excluded.connected_by,updated_at=now();
  insert into public.growth_gmail_connection_audit(actor_id,action) values(auth.uid(),'connected');
  return true;
end; $$;
create function public.growth_disconnect_gmail() returns boolean
language plpgsql security definer set search_path = '' as $$
begin
  if not public.growth_is_owner() then raise exception 'not authorized'; end if;
  delete from public.growth_gmail_connection where singleton;
  insert into public.growth_gmail_connection_audit(actor_id,action) values(auth.uid(),'disconnected');
  return true;
end; $$;
revoke all on function public.growth_connect_gmail(text), public.growth_disconnect_gmail() from public, anon, authenticated, service_role;
grant execute on function public.growth_connect_gmail(text), public.growth_disconnect_gmail() to authenticated;
create function public.growth_gmail_status() returns boolean
language plpgsql stable security definer set search_path = '' as $$
begin
  if not public.growth_is_owner() then raise exception 'not authorized'; end if;
  return exists(select 1 from public.growth_gmail_connection where singleton);
end; $$;
revoke all on function public.growth_gmail_status() from public, anon, authenticated, service_role;
grant execute on function public.growth_gmail_status() to authenticated;
