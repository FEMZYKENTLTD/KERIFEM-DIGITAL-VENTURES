import assert from 'node:assert/strict';
import { prospectSchema, stages, stageLabel } from '../lib/growthos.ts';

const valid = {
  name: 'Example business',
  website: 'https://example.com',
  industry: '',
  location: '',
  email: 'contact@example.com',
  email_source: 'https://example.com/contact',
  notes: 'Source: company website',
};
assert.equal(prospectSchema.safeParse(valid).success, true);
assert.equal(prospectSchema.safeParse({ ...valid, name: '  ' }).success, false);
assert.equal(prospectSchema.safeParse({ ...valid, website: 'javascript:alert(1)' }).success, false);
assert.equal(
  prospectSchema.safeParse({ ...valid, email_source: 'file:///etc/passwd' }).success,
  false,
);
assert.equal(prospectSchema.safeParse({ ...valid, email: 'invalid' }).success, false);
assert.equal(prospectSchema.safeParse({ ...valid, notes: 'x'.repeat(5001) }).success, false);
assert.equal(new Set(stages.map(([key]) => key)).size, stages.length);
assert.equal(stageLabel('contact_identified'), 'Contact identified');
console.log('GrowthOS validation checks passed.');
