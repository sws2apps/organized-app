import {
  addDays,
  endOfMonth,
  format,
  getWeekOfMonth,
  startOfDay,
  startOfWeek,
} from 'date-fns';
import type {
  CleaningExportRange,
  CleaningExportReadiness,
  CleaningRotationRange,
  CleaningRotationWeek,
} from '@definition/hall_cleaning_export';

export const cleaningYearRange = (
  year: number,
  serviceYear = false
): CleaningExportRange => {
  const firstDate = serviceYear
    ? new Date(year - 1, 8, 1)
    : new Date(year, 0, 1);
  const lastDate = serviceYear ? new Date(year, 7, 31) : new Date(year, 11, 31);
  return {
    start: format(startOfWeek(firstDate, { weekStartsOn: 1 }), 'yyyy/MM/dd'),
    end: format(startOfWeek(lastDate, { weekStartsOn: 1 }), 'yyyy/MM/dd'),
    firstDate: format(firstDate, 'yyyy/MM/dd'),
    lastDate: format(lastDate, 'yyyy/MM/dd'),
  };
};

const appendWeeklyRotation = (
  result: CleaningRotationRange[],
  week: CleaningRotationWeek,
  groups: string[],
  first: string,
  last: string
) => {
  const start = week.week < first ? first : week.week;
  const end = format(
    new Date(
      Math.min(
        addDays(new Date(week.week), 6).getTime(),
        new Date(last).getTime()
      )
    ),
    'yyyy/MM/dd'
  );
  if (start > end) return;
  const previous = result.at(-1);
  const consecutive =
    previous &&
    format(addDays(new Date(previous.end), 1), 'yyyy/MM/dd') === start;
  if (
    previous &&
    !previous.meeting &&
    previous.groups.join() === groups.join() &&
    consecutive
  ) {
    previous.end = end;
    return;
  }
  result.push({ id: week.week, start, end, groups });
};

// Keep different meetings separate; a union would falsely assign both groups to both meetings.
export const cleaningRotationRanges = (
  weeks: CleaningRotationWeek[],
  range: CleaningExportRange
): CleaningRotationRange[] => {
  const result: CleaningRotationRange[] = [];
  const first = range.firstDate ?? range.start;
  const last =
    range.lastDate ?? format(addDays(new Date(range.end), 6), 'yyyy/MM/dd');
  for (const week of weeks) {
    const slots = week.slots.map((slot) => ({
      ...slot,
      groups: [...new Set(slot.groups)].sort((a, b) => a.localeCompare(b)),
    }));
    if (!slots.length) continue;
    const same = slots.every(
      (slot) => slot.groups.join() === slots[0].groups.join()
    );
    if (same && slots[0].groups.length) {
      appendWeeklyRotation(result, week, slots[0].groups, first, last);
    } else {
      for (const slot of slots) {
        if (!slot.groups.length || slot.date < first || slot.date > last)
          continue;
        result.push({
          id: `${week.week}_${slot.meeting}`,
          start: slot.date,
          end: slot.date,
          groups: slot.groups,
          meeting: slot.meeting,
        });
      }
    }
  }
  return result;
};

export const cleaningRotationCalendarRows = (
  weeks: CleaningRotationWeek[],
  range: CleaningExportRange
) =>
  weeks.flatMap((week) =>
    cleaningRotationRanges([week], range).flatMap((turn) => {
      const rows: (CleaningRotationRange & {
        month: string;
        weekNumber: number;
      })[] = [];
      let start = new Date(turn.start);
      const last = new Date(turn.end);
      while (start <= last) {
        const monthEnd = startOfDay(endOfMonth(start));
        const end = monthEnd < last ? monthEnd : last;
        rows.push({
          ...turn,
          id: `${turn.id}_${format(start, 'yyyyMMdd')}`,
          start: format(start, 'yyyy/MM/dd'),
          end: format(end, 'yyyy/MM/dd'),
          month: format(start, 'yyyy/MM'),
          weekNumber: getWeekOfMonth(start, { weekStartsOn: 1 }),
        });
        start = addDays(end, 1);
      }
      return rows;
    })
  );

export const cleaningRotationMonthlyRows = (
  weeks: CleaningRotationWeek[],
  range: CleaningExportRange
) =>
  cleaningRotationRanges(weeks, range).flatMap((turn) => {
    const rows: (CleaningRotationRange & { fullMonth: boolean })[] = [];
    let start = new Date(turn.start);
    const last = new Date(turn.end);
    while (start <= last) {
      const monthEnd = startOfDay(endOfMonth(start));
      const end = monthEnd < last ? monthEnd : last;
      rows.push({
        ...turn,
        id: `${turn.id}_${format(start, 'yyyyMMdd')}`,
        start: format(start, 'yyyy/MM/dd'),
        end: format(end, 'yyyy/MM/dd'),
        fullMonth:
          !turn.meeting &&
          start.getDate() === 1 &&
          end.getTime() === monthEnd.getTime(),
      });
      start = addDays(end, 1);
    }
    return rows;
  });

export const cleaningExportReady = ({
  connected,
  publishedAvailable,
  cleaning,
  rotation,
}: CleaningExportReadiness) =>
  connected &&
  publishedAvailable &&
  (cleaning.selected || rotation.selected) &&
  (!cleaning.selected || (cleaning.rangeValid && cleaning.hasAssignments)) &&
  (!rotation.selected || (rotation.rangeValid && rotation.hasAssignments));
