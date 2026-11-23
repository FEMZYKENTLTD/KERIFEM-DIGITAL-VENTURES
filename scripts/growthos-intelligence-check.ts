import assert from 'node:assert/strict';
import {
  evidenceSchema,
  MatchError,
  runServiceMatch,
  validateMatch,
  type Snapshot,
} from '../lib/growth/service-match';
import { parseProspectCsv } from '../lib/growth/csv';

async function main() {
  const evidenceId = '33333333-3333-4333-8333-333333333333';
  const snapshot: Snapshot = {
    name: 'Example School',
    industry: 'Education',
    location: 'Lagos',
    evidence: [
      {
        id: evidenceId,
        kind: 'observed',
        claim: 'The school lists admissions information.',
        source_url: 'https://example.com/admissions',
        created_at: '2026-01-01T00:00:00Z',
      },
    ],
  };
  const output = {
    recommendations: [
      {
        service: 'web',
        confidence: 'low',
        rationale: 'The school has admissions information.',
        opportunity: 'Consider a clearer admissions journey.',
        outreach_angle: 'Ask about admissions.',
        evidence_ids: [evidenceId],
      },
    ],
    unknowns: ['Mobile usability has not been assessed.'],
  };
  assert.equal(
    evidenceSchema.safeParse({ kind: 'observed', claim: 'A finding', source_url: '' }).success,
    false,
  );
  assert.equal(
    evidenceSchema.safeParse({ kind: 'inference', claim: 'A possibility', source_url: '' }).success,
    true,
  );
  assert.equal(
    evidenceSchema.safeParse({
      kind: 'observed',
      claim: 'A finding',
      source_url: 'javascript:alert(1)',
    }).success,
    false,
  );
  assert.equal(validateMatch(output, snapshot).recommendations.length, 1);
  assert.throws(() =>
    validateMatch(
      {
        ...output,
        recommendations: [
          { ...output.recommendations[0], evidence_ids: ['44444444-4444-4444-8444-444444444444'] },
        ],
      },
      snapshot,
    ),
  );
  assert.throws(() =>
    validateMatch(
      { ...output, recommendations: [output.recommendations[0], output.recommendations[0]] },
      snapshot,
    ),
  );
  let requestBody: { tools?: unknown; messages: { content: string }[] } = { messages: [] };
  const mockFetch: typeof fetch = async (_url, init) => {
    requestBody = JSON.parse(String(init?.body));
    return new Response(
      JSON.stringify({
        choices: [{ message: { content: JSON.stringify(output) } }],
        usage: { prompt_tokens: 123, completion_tokens: 45 },
      }),
      { status: 200 },
    );
  };
  const result = await runServiceMatch(
    snapshot,
    [{ slug: 'web', name: 'Web Development', summary: 'Websites' }],
    { key: 'test', model: 'gpt-4o-mini', fetcher: mockFetch },
  );
  assert.equal(result.inputTokens, 123);
  assert.equal(result.output.recommendations[0].service, 'web');
  assert.equal(requestBody.tools, undefined);
  assert.match(requestBody.messages[0].content, /untrusted data/);
  await assert.rejects(
    () =>
      runServiceMatch(snapshot, [], {
        key: 'test',
        model: 'test',
        fetcher: async () => new Response('failed', { status: 429 }),
      }),
    (err: unknown) => err instanceof MatchError && err.code === 'provider_error',
  );
  await assert.rejects(
    () =>
      runServiceMatch(snapshot, [], {
        key: 'test',
        model: 'test',
        fetcher: async () => new Response('{"choices":[{"message":{"content":"{}"}}]}'),
      }),
    (err: unknown) => err instanceof MatchError && err.code === 'invalid_response',
  );
  const csv = parseProspectCsv(
    'name,website,location,notes\n"Example, Inc",https://example.com,Lagos,"Line one\nLine two"\n',
  );
  assert.equal(csv.length, 1);
  assert.equal(csv[0].name, 'Example, Inc');
  assert.equal(csv[0].notes, 'Line one\nLine two');
  assert.throws(() => parseProspectCsv('name,name\na,b'));
  assert.throws(() => parseProspectCsv('name,website\nTest,javascript:bad'));
  assert.throws(() => parseProspectCsv('name\n' + 'x'.repeat(65537)));
  console.log('AI provider mock, evidence references, validation and CSV checks passed.');
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
