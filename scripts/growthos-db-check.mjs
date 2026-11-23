import { PGlite } from '@electric-sql/pglite';
import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
const db = new PGlite();
try {
  // Emulate the relevant Supabase auth claims locally. This is not a substitute for testing real Supabase.
  await db.exec(`create role anon; create role authenticated; create role service_role; create schema auth;
    create table auth.users(id uuid primary key,email text,email_confirmed_at timestamptz);
    create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub', true),'')::uuid $$;
    grant usage on schema auth to authenticated,anon; grant execute on function auth.uid() to authenticated,anon;
    insert into auth.users values ('11111111-1111-4111-8111-111111111111','femzykenterprisesltd@gmail.com',now()),('22222222-2222-4222-8222-222222222222','other@example.com',now());`);
  await db.exec(
    `alter default privileges in schema public grant execute on functions to anon, authenticated, service_role;
     alter default privileges in schema public grant all on tables to service_role;
     alter default privileges in schema public grant all on sequences to service_role;`,
  );
  for (const file of [
    '20261123000000_growthos_foundation.sql',
    '20261123010000_growthos_intelligence.sql',
    '20261123020000_growthos_csv_import.sql',
    '20261123030000_growthos_function_privileges.sql',
    '20261123040000_growthos_restrict_service_role.sql',
    '20261123050000_growthos_delete_prospect.sql',
  ])
    await db.exec(await readFile(`supabase/migrations/${file}`, 'utf8'));
  const grants = await db.query(
    `select has_function_privilege('anon','public.growth_import_prospects(jsonb)','execute') as anon_execute, has_function_privilege('authenticated','public.growth_import_prospects(jsonb)','execute') as owner_role_execute`,
  );
  assert.equal(grants.rows[0].anon_execute, false);
  assert.equal(grants.rows[0].owner_role_execute, true);
  const serviceRoleGrants = await db.query(`
    select count(*)::integer as remaining from (
      select p.oid from pg_proc p join pg_namespace n on n.oid = p.pronamespace
       where n.nspname = 'public' and p.proname like 'growth_%'
         and has_function_privilege('service_role', p.oid, 'execute')
      union all
      select c.oid from pg_class c join pg_namespace n on n.oid = c.relnamespace
       cross join unnest(array['SELECT','INSERT','UPDATE','DELETE','TRUNCATE','REFERENCES','TRIGGER']) priv
       where n.nspname = 'public' and c.relname in ('growth_prospects','growth_activity','growth_evidence','growth_tasks','growth_agent_runs','growth_deletion_audit')
         and has_table_privilege('service_role', c.oid, priv)
      union all
      select c.oid from pg_class c join pg_namespace n on n.oid = c.relnamespace
       cross join unnest(array['USAGE','SELECT','UPDATE']) priv
       where n.nspname = 'public' and c.relname in ('growth_activity_id_seq','growth_deletion_audit_id_seq')
         and has_sequence_privilege('service_role', c.oid, priv)
    ) remaining_grants`);
  assert.equal(serviceRoleGrants.rows[0].remaining, 0);
  await db.exec(
    `set role authenticated; select set_config('request.jwt.claim.sub','11111111-1111-4111-8111-111111111111',false)`,
  );
  const prospect = await db.query(
    `insert into public.growth_prospects(name) values ('Example') returning id`,
  );
  const id = prospect.rows[0].id;
  await db.query(
    `insert into public.growth_evidence(prospect_id,kind,claim,source_url) values ($1,'observed','Example evidence','https://example.com')`,
    [id],
  );
  await assert.rejects(() =>
    db.query(
      `insert into public.growth_evidence(prospect_id,kind,claim) values ($1,'observed','No source')`,
      [id],
    ),
  );
  const task = await db.query(
    `insert into public.growth_tasks(prospect_id,title) values ($1,'Review') returning id`,
    [id],
  );
  await db.query(`update public.growth_tasks set status='done' where id=$1`, [task.rows[0].id]);
  const start = await db.query(`select public.growth_begin_match($1,'gpt-4o-mini') as run`, [id]);
  const run = start.rows[0].run;
  assert.equal(run.input.evidence.length, 1);
  await assert.rejects(() => db.query(`select public.growth_begin_match($1,'gpt-4o-mini')`, [id]));
  assert.equal(
    (
      await db.query(`select public.growth_finish_match($1,$2,null,10,5) as ok`, [
        run.id,
        JSON.stringify({ recommendations: [], unknowns: [] }),
      ])
    ).rows[0].ok,
    true,
  );
  assert.equal(
    (
      await db.query(`select public.growth_finish_match($1,$2,null,10,5) as ok`, [
        run.id,
        JSON.stringify({ recommendations: [], unknowns: [] }),
      ])
    ).rows[0].ok,
    false,
  );
  const rows = [
    { name: 'First', location: 'Lagos', website: 'https://first.example' },
    { name: 'First', location: 'Lagos', website: 'https://first.example' },
  ];
  const imported = await db.query(`select public.growth_import_prospects($1) as result`, [
    JSON.stringify(rows),
  ]);
  assert.deepEqual(imported.rows[0].result, { imported: 1, skipped: 1 });
  await assert.rejects(() =>
    db.query(`select public.growth_import_prospects($1)`, [
      JSON.stringify([{ name: 'Should rollback' }, { name: '' }]),
    ]),
  );
  assert.equal(
    (
      await db.query(
        `select count(*)::integer as n from public.growth_prospects where name='Should rollback'`,
      )
    ).rows[0].n,
    0,
  );
  const logs = await db.query(`select event from public.growth_activity order by id`);
  assert.deepEqual(
    logs.rows.map((x) => x.event),
    ['created', 'research_added', 'task_created', 'task_updated', 'agent_completed', 'created'],
  );
  await db.exec(
    `select set_config('request.jwt.claim.sub','22222222-2222-4222-8222-222222222222',false)`,
  );
  for (const table of [
    'growth_prospects',
    'growth_evidence',
    'growth_tasks',
    'growth_agent_runs',
    'growth_activity',
  ])
    assert.equal((await db.query(`select * from public.${table}`)).rows.length, 0);
  await assert.rejects(() => db.query(`select public.growth_begin_match($1,'gpt-4o-mini')`, [id]));
  await assert.rejects(() =>
    db.query(`select public.growth_import_prospects($1)`, [JSON.stringify(rows)]),
  );
  await assert.rejects(() => db.query(`select public.growth_delete_prospect($1)`, [id]));
  assert.equal((await db.query(`select * from public.growth_deletion_audit`)).rows.length, 0);
  await db.exec(
    `select set_config('request.jwt.claim.sub','11111111-1111-4111-8111-111111111111',false)`,
  );
  await assert.rejects(() => db.query(`delete from public.growth_prospects where id=$1`, [id]));
  await db.query(`update public.growth_prospects set stage='suppressed' where id=$1`, [id]);
  assert.equal(
    (await db.query(`select public.growth_delete_prospect($1) as ok`, [id])).rows[0].ok,
    false,
  );
  await db.query(`update public.growth_prospects set stage='new' where id=$1`, [id]);
  assert.equal(
    (await db.query(`select public.growth_delete_prospect($1) as ok`, [id])).rows[0].ok,
    true,
  );
  assert.equal(
    (await db.query(`select public.growth_delete_prospect($1) as ok`, [id])).rows[0].ok,
    false,
  );
  for (const table of [
    'growth_prospects',
    'growth_evidence',
    'growth_tasks',
    'growth_agent_runs',
    'growth_activity',
  ]) {
    const column = table === 'growth_prospects' ? 'id' : 'prospect_id';
    assert.equal(
      (
        await db.query(`select count(*)::integer as n from public.${table} where ${column}=$1`, [
          id,
        ])
      ).rows[0].n,
      0,
    );
  }
  assert.equal(
    (
      await db.query(
        `select count(*)::integer as n from public.growth_deletion_audit where prospect_id=$1`,
        [id],
      )
    ).rows[0].n,
    1,
  );
  assert.equal(
    (
      await db.query(
        `select has_function_privilege('anon','public.growth_delete_prospect(uuid)','execute') as permitted`,
      )
    ).rows[0].permitted,
    false,
  );
  console.log(
    'In-memory Postgres: migrations, owner access, RLS, audit, deletion, rate limit, idempotent finish and atomic import passed.',
  );
} finally {
  await db.close();
}
