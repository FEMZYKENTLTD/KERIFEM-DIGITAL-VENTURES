'use server';
import { z } from 'zod';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { requireOwner } from '@/lib/admin-auth';
import { services } from '@/lib/services';
import {
  evidenceSchema,
  MatchError,
  runServiceMatch,
  snapshotSchema,
} from '@/lib/growth/service-match';

const validId = (id: string) => z.string().uuid().safeParse(id).success;
const path = (id: string) => `/admin/growth-os/prospects/${id}/intelligence`;
export async function addEvidence(id: string, fields: FormData) {
  const db = await requireOwner();
  if (!validId(id)) redirect('/admin/growth-os/prospects');
  const parsed = evidenceSchema.safeParse(Object.fromEntries(fields));
  if (!parsed.success) redirect(`${path(id)}?notice=invalid`);
  const { error } = await db.from('growth_evidence').insert({ ...parsed.data, prospect_id: id });
  if (error) redirect(`${path(id)}?notice=failed`);
  revalidatePath(path(id));
  redirect(`${path(id)}?notice=evidence`);
}
export async function matchService(id: string) {
  const db = await requireOwner();
  if (!validId(id)) redirect('/admin/growth-os/prospects');
  const key = process.env.OPENAI_API_KEY;
  const model = process.env.GROWTHOS_OPENAI_MODEL || 'gpt-4o-mini';
  if (!key) redirect(`${path(id)}?notice=not_configured`);
  if (!/^[a-zA-Z0-9._-]{1,100}$/.test(model)) redirect(`${path(id)}?notice=not_configured`);
  const start = await db.rpc('growth_begin_match', { p_prospect: id, p_model: model });
  if (start.error || !start.data) redirect(`${path(id)}?notice=begin_failed`);
  const runId = z.string().uuid().safeParse(start.data.id);
  const snapshot = snapshotSchema.safeParse(start.data.input);
  if (!runId.success) redirect(`${path(id)}?notice=failed`);
  let output = null,
    error: string | null = null,
    inputTokens = null,
    outputTokens = null;
  try {
    if (!snapshot.success) throw new MatchError('invalid_response');
    const result = await runServiceMatch(
      snapshot.data,
      services.map(([slug, name, , summary]) => ({ slug, name, summary })),
      { key, model },
    );
    output = result.output;
    inputTokens = result.inputTokens;
    outputTokens = result.outputTokens;
  } catch (err) {
    error = err instanceof MatchError ? err.code : 'invalid_response';
  }
  const finish = await db.rpc('growth_finish_match', {
    p_run: runId.data,
    p_output: output,
    p_error: error,
    p_input_tokens: inputTokens,
    p_output_tokens: outputTokens,
  });
  if (finish.error || !finish.data) redirect(`${path(id)}?notice=finish_failed`);
  revalidatePath(path(id));
  redirect(`${path(id)}?notice=${error ? 'agent_failed' : 'matched'}`);
}
