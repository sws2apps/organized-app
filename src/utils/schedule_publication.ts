import type { SchedWeekType } from '@definition/schedules';
import type { SourceWeekType } from '@definition/sources';
import type { SchedulePublicationState } from '@definition/schedule_publication';

// Compare meaning, not save times or display names resolved by publishing.
export const scheduleContent = (value: unknown, dataView: string): string => {
  const normalize = (node: unknown, key?: string): unknown => {
    if (Array.isArray(node)) {
      const positional = node.every(
        (item) =>
          item &&
          typeof item === 'object' &&
          'type' in item &&
          typeof item.value === 'string'
      );
      // Assignment lists are keyed by view and position; publishing can merge
      // them in a different storage order without changing the schedule.
      const values =
        key === 'events' || positional
          ? [...node].sort((a, b) =>
              `${a?.type}:${a?.id ?? '1'}`.localeCompare(
                `${b?.type}:${b?.id ?? '1'}`
              )
            )
          : node;
      return values
        .filter(
          (item) =>
            !item ||
            typeof item !== 'object' ||
            !('type' in item) ||
            item.type === dataView
        )
        .map((item) => normalize(item));
    }
    if (node && typeof node === 'object') {
      return Object.fromEntries(
        Object.entries(node)
          .filter(
            ([key]) =>
              key !== 'updatedAt' &&
              !(
                key === 'name' &&
                'value' in node &&
                typeof node.value === 'string' &&
                node.value
              )
          )
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([key, item]) => [key, normalize(item, key)])
      );
    }
    return node;
  };
  return JSON.stringify(normalize(value));
};

export const schedulePublicationState = (
  local: unknown,
  published: unknown,
  dataView: string,
  available: boolean
): SchedulePublicationState => {
  if (!available) return 'unknown';
  if (published === undefined) return 'draft';
  return scheduleContent(local, dataView) ===
    scheduleContent(published, dataView)
    ? 'published'
    : 'changes';
};

export const projectScheduleMonth = (
  weeks: SchedWeekType[],
  sources: SourceWeekType[],
  month: string,
  section: 'midweek_meeting' | 'weekend_meeting' | 'duties' | 'hall_cleaning',
  resolve: (week: SchedWeekType) => SchedWeekType = (week) => week
) =>
  weeks
    .filter((week) => week.weekOf.startsWith(month))
    .map(resolve)
    .filter((week) => week[section])
    .sort((a, b) => a.weekOf.localeCompare(b.weekOf))
    .map((week) => {
      const source = sources.find((item) => item.weekOf === week.weekOf);
      return {
        weekOf: week.weekOf,
        schedule: week[section],
        source:
          section === 'midweek_meeting'
            ? source?.midweek_meeting
            : section === 'weekend_meeting'
              ? source?.weekend_meeting
              : undefined,
      };
    });
