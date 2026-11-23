import {
  type AssignmentCongregation,
  type SchedWeekType,
} from '@definition/schedules';
import type { HallCleaningLoad } from '@definition/hall_cleaning';
import type { SettingsType } from '@definition/settings';

type Config = NonNullable<
  SettingsType['cong_settings']['hall_cleaning']
>[number];

export function resolveHallCleaningConfig(
  schedule: SchedWeekType | undefined,
  fallback: Config,
  dataView?: string
): Config;
export function resolveHallCleaningConfig(
  schedule: SchedWeekType | undefined,
  fallback: Config | undefined,
  dataView?: string
): Config | undefined;
export function resolveHallCleaningConfig(
  schedule: SchedWeekType | undefined,
  fallback: Config | undefined,
  dataView = fallback?.type
): Config | undefined {
  return (
    schedule?.hall_cleaning?.configuration?.find(
      (entry) => entry.type === dataView
    )?.value ?? fallback
  );
}

export const snapshotHallCleaningConfig = (
  schedule: SchedWeekType,
  config: Config,
  updatedAt: string
): SchedWeekType => {
  const result = structuredClone(schedule);
  result.hall_cleaning = {
    midweek: {},
    weekend: {},
    yearly: {},
    ...result.hall_cleaning,
    configuration: [
      ...(result.hall_cleaning?.configuration ?? []).filter(
        (entry) => entry.type !== config.type
      ),
      { type: config.type, value: structuredClone(config), updatedAt },
    ],
  };
  return result;
};

// Every group turn is counted once per week, even when it covers two meetings.
export const hallCleaningGroupLoad = (
  weeks: { weekOf: string; groups: string[] }[]
): HallCleaningLoad => {
  const load: HallCleaningLoad = new Map();
  for (const week of weeks) {
    for (const group of new Set(week.groups)) {
      addHallCleaningLoad(load, group, week.weekOf);
    }
  }
  return load;
};

export const addHallCleaningLoad = (
  load: HallCleaningLoad,
  key: string,
  weekOf: string
) => {
  const current = load.get(key) ?? { count: 0, last: '' };
  load.set(key, {
    count: current.count + 1,
    last: weekOf > current.last ? weekOf : current.last,
  });
};

export const compareHallCleaningLoad =
  (load: HallCleaningLoad) => (a: string, b: string) => {
    const left = load.get(a) ?? { count: 0, last: '' };
    const right = load.get(b) ?? { count: 0, last: '' };
    return left.count - right.count || left.last.localeCompare(right.last);
  };

// Hidden positions are retained in storage, but do not reserve a publisher.
export const hallCleaningActiveAssignees = (
  entries: AssignmentCongregation[],
  fieldIds: string[],
  dataView: string
) =>
  new Set(
    entries
      .filter(
        (entry) =>
          entry.type === dataView &&
          fieldIds.includes(entry.id ?? '') &&
          entry.value
      )
      .map((entry) => entry.value)
  );

const mergeCleaningEntries = <
  T extends { type: string; id?: string; updatedAt: string },
>(
  current: T[] = [],
  incoming: T[] = []
): T[] => {
  const identity = (entry: T) => `${entry.type}:${entry.id ?? '1'}`;
  const result = new Map(current.map((entry) => [identity(entry), entry]));
  for (const entry of incoming) {
    const previous = result.get(identity(entry));
    if (!previous || entry.updatedAt >= previous.updatedAt)
      result.set(identity(entry), entry);
  }
  return [...result.values()];
};

export const mergeHallCleaningData = (
  current: SchedWeekType['hall_cleaning'],
  incoming: SchedWeekType['hall_cleaning']
): SchedWeekType['hall_cleaning'] => {
  if (!current) return incoming;
  if (!incoming) return current;
  const mergeSlot = (slot: 'midweek' | 'weekend' | 'yearly') => ({
    ...current[slot],
    ...incoming[slot],
    group: mergeCleaningEntries(current[slot]?.group, incoming[slot]?.group),
    persons: mergeCleaningEntries(
      current[slot]?.persons,
      incoming[slot]?.persons
    ),
  });
  return {
    ...current,
    ...incoming,
    midweek: mergeSlot('midweek'),
    weekend: mergeSlot('weekend'),
    yearly: {
      ...mergeSlot('yearly'),
      date: mergeCleaningEntries(current.yearly?.date, incoming.yearly?.date),
    },
    events: mergeCleaningEntries(current.events, incoming.events),
    publication: mergeCleaningEntries(
      current.publication,
      incoming.publication
    ),
    configuration: mergeCleaningEntries(
      current.configuration,
      incoming.configuration
    ),
  };
};

export const mergeHallCleaningWeeks = (
  current: SchedWeekType[],
  updates: SchedWeekType[]
): SchedWeekType[] => {
  const result = new Map(current.map((week) => [week.weekOf, week]));
  for (const update of updates) {
    const latest = result.get(update.weekOf);
    if (!latest) {
      result.set(update.weekOf, update);
      continue;
    }
    result.set(update.weekOf, {
      ...latest,
      hall_cleaning: mergeHallCleaningData(
        latest.hall_cleaning,
        update.hall_cleaning
      ),
    });
  }
  return [...result.values()].sort((a, b) => a.weekOf.localeCompare(b.weekOf));
};
