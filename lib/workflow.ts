export const WORKFLOW_STATUSES = ['pending', 'completed', 'cancelled'] as const;

export type WorkflowStatus = (typeof WORKFLOW_STATUSES)[number];

export const WORKFLOW_LABELS: Record<WorkflowStatus, string> = {
  pending: 'Pending',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export function workflowLabel(status: string) {
  return WORKFLOW_LABELS[status as WorkflowStatus] ?? 'Pending';
}

export function isWorkflowStatus(value: string): value is WorkflowStatus {
  return WORKFLOW_STATUSES.includes(value as WorkflowStatus);
}

export const ACTIVE_ENQUIRIES = 'deleted_at=is.null';
export const BIN_ENQUIRIES = 'deleted_at=not.is.null';
