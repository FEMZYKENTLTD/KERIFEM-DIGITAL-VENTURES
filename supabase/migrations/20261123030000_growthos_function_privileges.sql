-- Supabase can grant explicit EXECUTE privileges by default to anon/authenticated.
-- Revoking PUBLIC alone does not remove those grants.
revoke all on function public.growth_is_owner() from public, anon, authenticated;
revoke all on function public.growth_log_prospect() from public, anon, authenticated;
revoke all on function public.growth_touch_prospect() from public, anon, authenticated;
revoke all on function public.growth_log_intelligence() from public, anon, authenticated;
revoke all on function public.growth_begin_match(uuid,text) from public, anon, authenticated;
revoke all on function public.growth_finish_match(uuid,jsonb,text,integer,integer) from public, anon, authenticated;
revoke all on function public.growth_import_prospects(jsonb) from public, anon, authenticated;
grant execute on function public.growth_is_owner() to authenticated;
grant execute on function public.growth_begin_match(uuid,text) to authenticated;
grant execute on function public.growth_finish_match(uuid,jsonb,text,integer,integer) to authenticated;
grant execute on function public.growth_import_prospects(jsonb) to authenticated;
