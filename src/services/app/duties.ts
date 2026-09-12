import { UpdateSpec } from 'dexie';
import { store } from '@states/index';
import {
  AssignmentCongregation,
  DutiesSectionType,
  SchedWeekType,
} from '@definition/schedules';
import { schedulesState } from '@states/schedules';
import { dbSchedUpdate } from '@services/dexie/schedules';

export type DutiesMeetingValue = 'midweek' | 'weekend';

/**
 * A meeting has a handful of parts, so a congregation asking for more sections
 * than this is after something the sections are not meant to do.
 */
export const DUTIES_SECTIONS_MAX = 10;

/**
 * The section or custom duty a dynamic duty field belongs to. Such a field is
 * stored as `<source id>_<position>`, and the ids are UUIDs.
 */
export const dutiesSourceId = (scheduleId: string) =>
  scheduleId.substring(0, scheduleId.lastIndexOf('_'));

const dutiesSlotPosition = (scheduleId: string) =>
  Number(scheduleId.substring(scheduleId.lastIndexOf('_') + 1));

/**
 * Whether two sections are served at the same time. Sections are shifts: they
 * run side by side only when they share a part, and a section without parts
 * covers the whole meeting.
 */
export const dutiesSectionsShareTime = (
  first: DutiesSectionType,
  second: DutiesSectionType
) => {
  if (first.id === second.id) return true;

  if (first.parts.length === 0 || second.parts.length === 0) return true;

  return first.parts.some((part) => second.parts.includes(part));
};

const scheduleOf = (week: string) =>
  store.get(schedulesState).find((record) => record.weekOf === week);

const sectionsOf = (week: string, meeting: DutiesMeetingValue) =>
  structuredClone(scheduleOf(week)?.duties?.[meeting].sections ?? []);

const dynamicOf = (week: string, meeting: DutiesMeetingValue) =>
  structuredClone(scheduleOf(week)?.duties?.[meeting].dynamic ?? []);

/**
 * Clears the brothers of the slots a predicate reports as gone, the same way
 * the picker clears one: the entry stays behind, so the change still syncs.
 *
 * @returns whether anything was cleared
 */
const releaseSlots = (
  entries: AssignmentCongregation[],
  isGone: (sectionId: string, position: number) => boolean
) => {
  const now = new Date().toISOString();

  let released = false;

  for (const entry of entries) {
    if (!entry.id || entry.value === '') continue;

    if (!isGone(dutiesSourceId(entry.id), dutiesSlotPosition(entry.id))) {
      continue;
    }

    entry.value = '';
    entry.updatedAt = now;
    released = true;
  }

  return released;
};

/**
 * The sections of a week travel with the rest of its schedule, so the whole
 * list is written at once. Each section carries its own `updatedAt`, which is
 * what a field-level merge would need if the sync ever gains one.
 */
const saveSections = async (
  week: string,
  meeting: DutiesMeetingValue,
  sections: DutiesSectionType[],
  dynamic?: AssignmentCongregation[]
) => {
  const changes: Record<string, unknown> = {
    [`duties.${meeting}.sections`]: sections,
  };

  if (dynamic) {
    changes[`duties.${meeting}.dynamic`] = dynamic;
  }

  await dbSchedUpdate(week, changes as unknown as UpdateSpec<SchedWeekType>);
};

export const dutiesSectionAdd = async (
  week: string,
  meeting: DutiesMeetingValue,
  section: Omit<DutiesSectionType, 'id' | '_deleted' | 'updatedAt'>
) => {
  const sections = sectionsOf(week, meeting);

  const active = sections.filter((record) => !record._deleted);

  if (active.length >= DUTIES_SECTIONS_MAX) return;

  sections.push({
    ...section,
    id: crypto.randomUUID(),
    _deleted: false,
    updatedAt: new Date().toISOString(),
  });

  await saveSections(week, meeting, sections);
};

export const dutiesSectionUpdate = async (
  week: string,
  meeting: DutiesMeetingValue,
  id: string,
  changes: Partial<Omit<DutiesSectionType, 'id'>>
) => {
  const sections = sectionsOf(week, meeting);

  const section = sections.find((record) => record.id === id);

  if (!section) return;

  Object.assign(section, changes, { updatedAt: new Date().toISOString() });

  // a smaller section must not keep the brothers of the slots it dropped, or
  // making it larger again would bring them back
  const dynamic = dynamicOf(week, meeting);

  const released = releaseSlots(
    dynamic,
    (sectionId, position) => sectionId === id && position > section.amount
  );

  await saveSections(week, meeting, sections, released ? dynamic : undefined);
};

export const dutiesSectionDelete = async (
  week: string,
  meeting: DutiesMeetingValue,
  id: string
) => {
  const sections = sectionsOf(week, meeting);

  const section = sections.find((record) => record.id === id);

  if (!section) return;

  section._deleted = true;
  section.updatedAt = new Date().toISOString();

  // the brothers of a deleted section are released with it: nothing is left
  // behind to reappear if a section with the same name is created later
  const dynamic = dynamicOf(week, meeting);

  const released = releaseSlots(dynamic, (sectionId) => sectionId === id);

  await saveSections(week, meeting, sections, released ? dynamic : undefined);
};
