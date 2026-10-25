import type { TerritoryAssignment } from '@definition/territory';

export type AssignmentIssue =
  | 'assigned_future'
  | 'returned_future'
  | 'returned_before_assigned';

// dd.mm.yyyy, as stored; kept here so the check has no app imports
const dayOf = (value?: string) => {
  const [day, month, year] = (value ?? '').split('.').map(Number);
  if (!day || !month || !year) return null;

  return new Date(year, month - 1, day).getTime();
};

// dates that can't be right, whether typed, imported or synced; none blocks saving
export const assignmentIssues = (
  assignment: Pick<TerritoryAssignment, 'assignedOn' | 'returnedOn'>,
  today = new Date()
) => {
  const now = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  ).getTime();
  const assigned = dayOf(assignment.assignedOn);
  const returned = dayOf(assignment.returnedOn);

  const issues: AssignmentIssue[] = [];
  if (assigned !== null && assigned > now) issues.push('assigned_future');
  if (returned !== null && returned > now) issues.push('returned_future');
  if (assigned !== null && returned !== null && returned < assigned) {
    issues.push('returned_before_assigned');
  }

  return issues;
};

// a new assignment returns the open one on its start date, so it can't start before it
export const startsBeforeOpen = (
  assignments: Pick<TerritoryAssignment, 'assignedOn' | 'returnedOn'>[],
  start: string
) => {
  const open = assignments.find((item) => !item.returnedOn);

  return (
    !!open &&
    assignmentIssues({
      assignedOn: open.assignedOn,
      returnedOn: start,
    }).includes('returned_before_assigned')
  );
};

// blank keeps the count it had; null is a count that can't be right
export const parseHouseholds = (text: string, fallback: number) => {
  if (!text.trim()) return fallback;

  const value = Number(text);

  return Number.isInteger(value) && value >= 0 ? value : null;
};

// two devices apart can each hand out the same territory, and a sync keeps both;
// these are the open ones besides the newest, which is the one that counts
export const olderOpenAssignments = <
  T extends Pick<TerritoryAssignment, 'assignedOn' | 'returnedOn'>,
>(
  assignments: T[]
) =>
  assignments
    .map((assignment, index) => ({ assignment, index }))
    .filter(({ assignment }) => !assignment.returnedOn)
    .sort(
      (a, b) =>
        (dayOf(b.assignment.assignedOn) ?? 0) -
          (dayOf(a.assignment.assignedOn) ?? 0) || b.index - a.index
    )
    .slice(1)
    .map(({ assignment }) => assignment);

export const ISSUE_TEXT: Record<AssignmentIssue, string> = {
  assigned_future: 'tr_territoryAssignedDateIsInTheFuture',
  returned_future: 'tr_territoryReturnedDateIsInTheFuture',
  returned_before_assigned: 'tr_territoryReturnedBeforeItWasAssigned',
};
