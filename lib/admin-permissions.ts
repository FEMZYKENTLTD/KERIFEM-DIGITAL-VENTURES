// Staged permission policy only. Never treat a browser-supplied role as trusted.
// This policy is not connected to sessions or database RLS yet; current routes
// remain owner-only until a reviewed migration and end-to-end tests are complete.
export const ADMIN_ACTIONS = [
  'view_workspace',
  'manage_enquiries',
  'manage_prospects',
  'manage_tasks',
  'run_research',
  'manage_own_account',
  'delete_order',
  'delete_prospect',
  'manage_administrators',
  'manage_connections',
] as const;

export type AdminAction = (typeof ADMIN_ACTIONS)[number];
export type AdminRole = 'owner' | 'manager';

const managerActions: ReadonlySet<AdminAction> = new Set([
  'view_workspace',
  'manage_enquiries',
  'manage_prospects',
  'manage_tasks',
  'run_research',
  'manage_own_account',
]);

export function permitsAdminAction(role: unknown, action: unknown): boolean {
  if (typeof action !== 'string' || !ADMIN_ACTIONS.includes(action as AdminAction)) return false;
  if (role === 'owner') return true;
  return role === 'manager' && managerActions.has(action as AdminAction);
}
