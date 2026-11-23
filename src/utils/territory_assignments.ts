import type {
  AssignmentHolder,
  TerritoryAssignee,
  TerritoryAssignment,
} from '@definition/territory';

const calendarDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

const storedDay = (value: string) => {
  if (!/^\d{2}\.\d{2}\.\d{4}$/.test(value)) return undefined;
  const [day, month, year] = value.split('.').map(Number);
  const date = new Date(year, month - 1, day);
  if (
    date.getDate() !== day ||
    date.getMonth() !== month - 1 ||
    date.getFullYear() !== year
  )
    return undefined;
  return date.getTime();
};

export const parseTerritoryHouseholds = (text: string, fallback: number) => {
  if (!text.trim()) return fallback;
  if (!/^\d+$/.test(text.trim())) return undefined;
  const value = Number(text);
  return Number.isSafeInteger(value) ? value : undefined;
};

export const territoryReturnDateError = (
  assignments: Pick<TerritoryAssignment, 'assignedOn' | 'returnedOn'>[],
  returnedOn: Date | null,
  today = new Date()
) => {
  if (!returnedOn || !Number.isFinite(returnedOn.getTime()))
    return 'tr_territoryDateRequired';
  const end = calendarDay(returnedOn);
  if (end > calendarDay(today)) return 'tr_territoryDateFuture';
  for (const assignment of assignments) {
    if (assignment.returnedOn) continue;
    const start = storedDay(assignment.assignedOn);
    if (start === undefined) return 'tr_territoryAssignmentDateInvalid';
    if (end < start) return 'tr_territoryReturnBeforeAssigned';
  }
  return undefined;
};

// Assigning an occupied territory returns its open assignments on this date.
export const territoryAssignmentDateError = (
  assignments: Pick<TerritoryAssignment, 'assignedOn' | 'returnedOn'>[],
  assignedOn: Date | null,
  today = new Date()
) => {
  const error = territoryReturnDateError(assignments, assignedOn, today);
  if (error === 'tr_territoryDateFuture')
    return 'tr_territoryAssignedDateIsInTheFuture';
  if (error === 'tr_territoryReturnBeforeAssigned')
    return 'tr_territoryTransferBeforeAssigned';
  if (error === 'tr_territoryAssignmentDateInvalid')
    return 'tr_territoryOpenAssignmentDateInvalid';
  return error;
};

export const territoryHolderAvailable = (
  holder: AssignmentHolder,
  assignees: TerritoryAssignee[]
) => {
  const publishers = assignees.filter((item) =>
    holder.publisherId
      ? item.id === holder.publisherId
      : item.name === holder.publisher
  );
  const groups = holder.group
    ? assignees.filter((item) =>
        holder.groupId ? item.id === holder.groupId : item.name === holder.group
      )
    : [];
  return (
    publishers.length === 1 &&
    !publishers[0].group &&
    (!holder.group || (groups.length === 1 && groups[0].group))
  );
};
