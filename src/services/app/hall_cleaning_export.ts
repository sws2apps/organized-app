import {
  WEEK_TYPE_NO_MEETING,
  WEEK_TYPE_LANGUAGE_GROUPS,
} from '@constants/index';
import { Week } from '@definition/week_type';
import { store } from '@states/index';
import { fieldServiceGroupsState } from '@states/field_service_groups';
import type { SchedWeekType } from '@definition/schedules';
import type { HallCleaningConfig } from '@definition/hall_cleaning';
import type { CleaningExportRange } from '@definition/hall_cleaning_export';
import { schedulesHallCleaningSlots } from '@services/app/schedules';
import { resolveHallCleaningConfig } from '@utils/hall_cleaning';

export const hallCleaningPublishedConfig = (
  schedules: SchedWeekType[],
  dataView: string
) =>
  [...schedules]
    .sort((a, b) => b.weekOf.localeCompare(a.weekOf))
    .flatMap((week) => week.hall_cleaning?.configuration ?? [])
    .find((entry) => entry.type === dataView)?.value;

export const hallCleaningExportWeeks = (
  schedules: SchedWeekType[],
  range: CleaningExportRange
) =>
  schedules
    .filter((week) => week.weekOf >= range.start && week.weekOf <= range.end)
    .sort((a, b) => a.weekOf.localeCompare(b.weekOf));

export const hallCleaningExportSlots = (
  week: SchedWeekType,
  config: HallCleaningConfig | undefined
) => {
  const resolved = resolveHallCleaningConfig(week, config);
  const publication = week.hall_cleaning?.publication?.find(
    (entry) => entry.type === resolved?.type
  );
  if (publication) return publication.slots.map((entry) => entry.slot);
  const slots = schedulesHallCleaningSlots(resolved, week);
  if (!resolved) return slots;
  const group = store
    .get(fieldServiceGroupsState)
    .find((entry) => entry.group_id === resolved.type);
  const held = (meeting: 'midweek' | 'weekend') => {
    const type =
      week[`${meeting}_meeting`]?.week_type.find(
        (entry) => entry.type === resolved.type
      )?.value ?? Week.NORMAL;
    return (
      !WEEK_TYPE_NO_MEETING.includes(type) &&
      (resolved.type === 'main' ||
        (!WEEK_TYPE_LANGUAGE_GROUPS.includes(type) &&
          (group?.group_data[`${meeting}_meeting`] ?? true)))
    );
  };
  // Published assignments remain available after meeting materials expire.
  for (const slot of schedulesHallCleaningSlots(resolved)) {
    if (
      slot !== 'yearly' &&
      !(resolved.period.value === 'week'
        ? held('midweek') || held('weekend')
        : held(slot))
    )
      continue;
    const data = week.hall_cleaning?.[slot];
    const assigned = [...(data?.group ?? []), ...(data?.persons ?? [])].some(
      (entry) => entry.type === resolved.type && entry.value
    );
    if (assigned && !slots.includes(slot)) slots.push(slot);
  }
  return slots;
};
