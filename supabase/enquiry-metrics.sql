-- Run once in the dedicated enquiries project. No browser role can call this.
create or replace function public.enquiry_metrics()
returns jsonb language sql stable security invoker set search_path = '' as $$
  with counts as (
    select payload->>'service' as service,
           coalesce(nullif(payload->>'budget', ''), 'Not provided') as budget,
           coalesce(workflow_status, 'pending') as workflow_status,
           (created_at at time zone 'Africa/Lagos')::date as day,
           date_trunc('month', created_at at time zone 'Africa/Lagos')::date as month
    from public.enquiries
    where deleted_at is null
  ), days as (
    select (timezone('Africa/Lagos', now()))::date - n as day
    from generate_series(29, 0, -1) as n
  ), months as (
    select (date_trunc('month', timezone('Africa/Lagos', now())) - (n * interval '1 month'))::date as month
    from generate_series(11, 0, -1) as n
  )
  select jsonb_build_object(
    'services', (select coalesce(jsonb_object_agg(service, n), '{}'::jsonb) from (select service, count(*) n from counts where service is not null group by service) s),
    'budgets', (select coalesce(jsonb_object_agg(budget, n), '{}'::jsonb) from (select budget, count(*) n from counts group by budget) b),
    'orders', (select coalesce(jsonb_object_agg(workflow_status, n), '{}'::jsonb) from (select workflow_status, count(*) n from counts group by workflow_status) o),
    'days', (select jsonb_agg(jsonb_build_object('day', days.day, 'count', coalesce(d.n, 0)) order by days.day) from days left join (select day, count(*) n from counts where day >= (timezone('Africa/Lagos', now()))::date - 29 group by day) d using (day)),
    'months', (
      select jsonb_agg(jsonb_build_object(
        'month', months.month,
        'count', coalesce(m.total, 0),
        'pending', coalesce(m.pending, 0),
        'completed', coalesce(m.completed, 0),
        'cancelled', coalesce(m.cancelled, 0)
      ) order by months.month)
      from months
      left join (
        select month,
               count(*)::int as total,
               count(*) filter (where workflow_status = 'pending')::int as pending,
               count(*) filter (where workflow_status = 'completed')::int as completed,
               count(*) filter (where workflow_status = 'cancelled')::int as cancelled
        from counts
        where month >= (date_trunc('month', timezone('Africa/Lagos', now())) - interval '11 months')::date
        group by month
      ) m using (month)
    )
  );
$$;
revoke all on function public.enquiry_metrics() from public, anon, authenticated;
grant execute on function public.enquiry_metrics() to service_role;
