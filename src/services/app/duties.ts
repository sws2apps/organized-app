import { UpdateSpec } from 'dexie';
import { store } from '@states/index';
import { DutiesSectionType, SchedWeekType } from '@definition/schedules';
import { schedulesState } from '@states/schedules';
import { dbSchedUpdate } from '@services/dexie/schedules';

export type DutiesMeetingValue = 'midweek' | 'weekend';

const sectionsOf = (week: string, meeting: DutiesMeetingValue) => {
  const schedules = store.get(schedulesState);

  const schedule = schedules.find((record) => record.weekOf === week);

  return structuredClone(schedule?.duties?.[meeting].sections ?? []);
};

const saveSections = async (
  week: string,
  meeting: DutiesMeetingValue,
  sections: DutiesSectionType[]
) => {
  await dbSchedUpdate(week, {
    [`duties.${meeting}.sections`]: sections,
  } as unknown as UpdateSpec<SchedWeekType>);
};

export const dutiesSectionAdd = async (
  week: string,
  meeting: DutiesMeetingValue,
  section: Omit<DutiesSectionType, 'id' | '_deleted' | 'updatedAt'>
) => {
  const sections = sectionsOf(week, meeting);

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

  await saveSections(week, meeting, sections);
};

export const dutiesSectionDelete = async (
  week: string,
  meeting: DutiesMeetingValue,
  id: string
) => {
  await dutiesSectionUpdate(week, meeting, id, { _deleted: true });
};

/**
 * A congregation that keeps the same shifts week after week sets them up once
 * and brings them over, without the persons of that week.
 */
export const dutiesSectionsCopyFromWeek = async (
  fromWeek: string,
  toWeek: string,
  meeting: DutiesMeetingValue
) => {
  const source = sectionsOf(fromWeek, meeting).filter(
    (record) => !record._deleted
  );

  if (source.length === 0) return;

  const now = new Date().toISOString();

  const sections = sectionsOf(toWeek, meeting);

  for (const section of source) {
    sections.push({
      ...section,
      id: crypto.randomUUID(),
      _deleted: false,
      updatedAt: now,
    });
  }

  await saveSections(toWeek, meeting, sections);
};

/**
 * The closest earlier week that has sections for this meeting, so the editor
 * can offer to bring them over.
 */
export const dutiesSectionsPreviousWeek = (
  week: string,
  meeting: DutiesMeetingValue
) => {
  const schedules = store.get(schedulesState);

  const previous = schedules
    .filter((record) => record.weekOf < week)
    .sort((a, b) => b.weekOf.localeCompare(a.weekOf))
    .find(
      (record) =>
        (record.duties?.[meeting].sections?.filter(
          (section) => !section._deleted
        ).length ?? 0) > 0
    );

  return previous?.weekOf ?? '';
};
