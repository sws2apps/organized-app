import type { AssignmentConflict } from '@definition/assignment_conflicts';

export const assignmentConflictGroup = (conflict?: AssignmentConflict) => {
  if (!conflict) return 0;
  return conflict.isDuty ? 2 : 1;
};
