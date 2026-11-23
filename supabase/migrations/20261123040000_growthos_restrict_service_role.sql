-- GrowthOS uses confirmed owner sessions, not the server service-role key.
-- This limits exposure of GrowthOS tables while a compromised legacy service role is rotated.
-- It does not revoke the key or change existing enquiry table grants.
revoke all on function public.growth_is_owner() from service_role;
revoke all on function public.growth_log_prospect() from service_role;
revoke all on function public.growth_touch_prospect() from service_role;
revoke all on function public.growth_log_intelligence() from service_role;
revoke all on function public.growth_begin_match(uuid,text) from service_role;
revoke all on function public.growth_finish_match(uuid,jsonb,text,integer,integer) from service_role;
revoke all on function public.growth_import_prospects(jsonb) from service_role;
revoke all on public.growth_prospects, public.growth_activity, public.growth_evidence, public.growth_tasks, public.growth_agent_runs from service_role;
revoke all on sequence public.growth_activity_id_seq from service_role;
