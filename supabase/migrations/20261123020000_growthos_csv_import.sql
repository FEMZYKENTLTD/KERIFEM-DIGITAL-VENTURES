-- Atomic, owner-only CSV import. Never overwrites existing records.
create function public.growth_import_prospects(p_rows jsonb) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare row jsonb; new_count integer := 0; skipped_count integer := 0; n text; loc text; site text; mail text;
begin
  if not public.growth_is_owner() then raise exception 'not authorized'; end if;
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
revoke all on function public.growth_import_prospects(jsonb) from public;
grant execute on function public.growth_import_prospects(jsonb) to authenticated;
