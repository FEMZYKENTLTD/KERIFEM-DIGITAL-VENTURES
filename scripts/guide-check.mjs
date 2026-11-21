import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createRequire } from 'node:module';

const temp = mkdtempSync(join(tmpdir(), 'kerifem-guide-'));
const require = createRequire(import.meta.url);
try {
  execFileSync(
    process.execPath,
    [
      require.resolve('typescript/bin/tsc'),
      '--outDir',
      temp,
      '--target',
      'es2022',
      '--module',
      'commonjs',
      '--strict',
      '--skipLibCheck',
      'lib/guide-search.ts',
      'lib/guide-answers.ts',
      'lib/public-pages.ts',
    ],
    { stdio: 'inherit' },
  );
  const { searchGuide, indexedGuidePaths } = require(join(temp, 'guide-search.js'));
  const { reviewedGuideMatch } = require(join(temp, 'guide-answers.js'));
  const { publicPages } = require(join(temp, 'public-pages.js'));
  assert.deepEqual([...indexedGuidePaths].sort(), [...publicPages].sort());
  assert.match(reviewedGuideMatch('WHAT IS THE MINIMUM FEE?').answer, /\$100 USD/);
  for (const [question, path] of [
    ['What university did the founder attend?', '/about'],
    ['What does ResumeRank do?', '/portfolio/resumerank'],
    ['What do I receive with WordPress website development?', '/services/web'],
    ['Where is the cookie policy?', '/cookie-policy'],
  ]) {
    assert.ok(
      searchGuide(question).some((result) => result.href === path),
      `Missing ${path} for ${question}`,
    );
  }
  assert.deepEqual(searchGuide('astronaut Neptune trajectory'), []);
  console.log(
    `Guide checks passed: all ${publicPages.length} public pages, sample searches and unknown query.`,
  );
} finally {
  rmSync(temp, { recursive: true, force: true });
}
