import { format, startOfWeek } from 'date-fns';
import type {
  MajorCleaningEvent,
  MajorCleaningUpdate,
} from '@definition/hall_cleaning';
import type { SchedWeekType } from '@definition/schedules';

export const activeMajorCleanings = (
  events: MajorCleaningEvent[] | undefined,
  type: string
) =>
  (events ?? [])
    .filter((event) => event.type === type && !event.deleted)
    .sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id));

// Enforced inside the schedule write transaction, including across browser tabs.
export const hasMajorCleaningDateConflict = (
  existing: MajorCleaningEvent[],
  incoming: MajorCleaningEvent
) =>
  !incoming.deleted &&
  existing.some(
    (event) =>
      !event.deleted &&
      event.type === incoming.type &&
      event.date === incoming.date &&
      event.id !== incoming.id
  );

// Older stored and published events remain major cleanings without migration.
export const cleaningActivityLabelKey = (
  activity?: MajorCleaningEvent['activity']
) => {
  if (activity === 'grounds_care') return 'tr_cleaningGroundsCare';
  if (activity === 'cleaning_and_grounds') return 'tr_cleaningCombined';
  return 'tr_yearlyCleaning';
};

export const majorCleaningScheduleUpdates = (
  events: MajorCleaningEvent[],
  weeks: SchedWeekType[]
): MajorCleaningUpdate[] =>
  events.flatMap((event) => {
    const weekOf = format(
      startOfWeek(new Date(event.date), { weekStartsOn: 1 }),
      'yyyy/MM/dd'
    );
    const previous = weeks.flatMap((week) =>
      week.weekOf === weekOf
        ? []
        : (week.hall_cleaning?.events ?? [])
            .filter(
              (entry) =>
                entry.id === event.id &&
                entry.type === event.type &&
                !entry.deleted
            )
            .map((entry) => ({
              weekOf: week.weekOf,
              event: { ...entry, deleted: true, updatedAt: event.updatedAt },
            }))
    );
    return [...previous, { weekOf, event }];
  });
