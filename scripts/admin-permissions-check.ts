import assert from 'node:assert/strict';
import { ADMIN_ACTIONS, permitsAdminAction } from '../lib/admin-permissions';

for (const action of ADMIN_ACTIONS) assert.equal(permitsAdminAction('owner', action), true);
for (const action of [
  'view_workspace',
  'manage_enquiries',
  'manage_prospects',
  'manage_tasks',
  'run_research',
  'manage_own_account',
])
  assert.equal(permitsAdminAction('manager', action), true, action);
for (const action of [
  'delete_order',
  'delete_prospect',
  'manage_administrators',
  'manage_connections',
])
  assert.equal(permitsAdminAction('manager', action), false, action);
for (const role of [null, undefined, 'admin', 'OWNER', '', {}])
  for (const action of ADMIN_ACTIONS) assert.equal(permitsAdminAction(role, action), false);
for (const action of [null, '', 'delete_everything', {}, undefined])
  assert.equal(permitsAdminAction('owner', action), false);
console.log(
  'Staged permission matrix passed. This does not test authentication or database authorization.',
);
