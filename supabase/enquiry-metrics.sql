-- Run once in the dedicated enquiries project. No browser role can call this.
create or replace function public.enquiry_metrics()
returns jsonb language sql stable security invoker set search_path = '' as $$
  with counts as (
    select payload->>'service' as service,
           coalesce(nullif(payload->>'budget', ''), 'Not provided') as budget,
           (created_at at time zone 'UTC')::date as day
    from public.enquiries
    where deleted_at is null
  ), days as (
    select (now() at time zone 'UTC')::date - n as day
    from generate_series(29, 0, -1) as n
  )
  select jsonb_build_object(
    'services', (select coalesce(jsonb_object_agg(service, n), '{}'::jsonb) from (select service, count(*) n from counts where service is not null group by service) s),
    'budgets', (select coalesce(jsonb_object_agg(budget, n), '{}'::jsonb) from (select budget, count(*) n from counts group by budget) b),
    'days', (select jsonb_agg(jsonb_build_object('day', days.day, 'count', coalesce(d.n, 0)) order by days.day) from days left join (select day, count(*) n from counts where day >= (now() at time zone 'UTC')::date - 29 group by day) d using (day))
  );
$$;
revoke all on function public.enquiry_metrics() from public, anon, authenticated;
grant execute on function public.enquiry_metrics() to service_role;
