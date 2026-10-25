import {
  addMonths,
  differenceInCalendarDays,
  differenceInMonths,
  startOfDay,
} from 'date-fns';
import type { Territory, TerritoryAssignment } from '@definition/territory';
import { millisecondsInDay as DAY } from 'date-fns/constants';
import { isTerritoryCoverage as isCoverage } from '@utils/territory_coverage';
const serviceYear = (date: Date) =>
  date.getMonth() >= 8 ? date.getFullYear() + 1 : date.getFullYear();
export const parseDate = (value?: string) => {
  if (!value) return null;

  const [day, month, year] = value.split('.').map(Number);
  if (!day || !month || !year) return null;

  return new Date(year, month - 1, day);
};

export const toStoredDate = (date: Date) =>
  date.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

const serviceMonth = (date: Date) => (date.getMonth() + 4) % 12;

// derived from the dates, never typed in
export const assignmentFromDates = (
  base: TerritoryAssignment,
  publisher: string,
  assignedOn: Date,
  returnedOn: Date | null
) => {
  const end = returnedOn ?? assignedOn;

  const months =
    Math.max(
      0,
      (end.getFullYear() - assignedOn.getFullYear()) * 12 +
        end.getMonth() -
        assignedOn.getMonth()
    ) + 1;

  return {
    ...base,
    ...(publisher !== base.publisher ? { publisherId: undefined } : {}),
    publisher,
    assignedOn: toStoredDate(assignedOn),
    returnedOn: returnedOn ? toStoredDate(returnedOn) : undefined,
    serviceYear: serviceYear(end),
    months,
    startMonth: serviceMonth(assignedOn),
    endMonth: serviceMonth(end),
  } as TerritoryAssignment;
};

export const withAssignments = (
  territory: Territory,
  assignments: TerritoryAssignment[]
): Territory => {
  const time = (value?: string) => parseDate(value)?.getTime() ?? 0;
  const daysAgo = (value: number) =>
    Math.max(0, Math.round((Date.now() - value) / DAY));

  const lastReturned = Math.max(
    0,
    ...assignments.filter(isCoverage).map((item) => time(item.returnedOn))
  );

  const daysSinceCovered = lastReturned
    ? daysAgo(lastReturned)
    : territory.daysSinceCovered;

  const open = assignments
    .filter((item) => !item.returnedOn)
    .sort((a, b) => time(b.assignedOn) - time(a.assignedOn))
    .at(0);

  if (!open) {
    return {
      ...territory,
      assignments,
      daysSinceCovered,
      status: territory.assignedElsewhere ? 'in_work' : 'available',
      holder: undefined,
      holderId: undefined,
      holderGroupId: undefined,
      holderGroup: undefined,
      daysOut: undefined,
    };
  }

  return {
    ...territory,
    assignments,
    daysSinceCovered,
    status: territory.status === 'available' ? 'in_work' : territory.status,
    holder: open.publisher,
    holderId: open.publisherId,
    holderGroupId: open.groupId,
    holderGroup: open.group,
    daysOut: daysAgo(time(open.assignedOn) || Date.now()),
  };
};

// Completed calendar months, then calendar days; never round an unfinished month up.
export const elapsedCalendarDuration = (start: Date, now = new Date()) => {
  const end = startOfDay(now);
  const beginning = startOfDay(start);
  if (beginning >= end) return { months: 0, days: 0 };

  const months = differenceInMonths(end, beginning);
  const days = differenceInCalendarDays(end, addMonths(beginning, months));
  return { months, days };
};
