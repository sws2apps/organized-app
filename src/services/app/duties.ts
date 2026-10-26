import { isCustomDutyIcon } from '@constants/duty_icons';
import {
  resolveRecurringSections,
  snapshotRecurringSections,
} from '@utils/duties_recurring';
import { queueDutyWrite } from '@services/app/duties_queue';
import {
  isolateLegacySections,
  sectionsForView,
  validateDutyName,
  uniqueDutyName,
} from '@utils/duties_sections';
import { SettingsType } from '@definition/settings';
import { settingsState, userDataViewState } from '@states/settings';
import { dbAppSettingsUpdate } from '@services/dexie/settings';
import { updateObject } from '@utils/common';
import { UpdateSpec } from 'dexie';
import { store } from '@states/index';
import {
  AssignmentCongregation,
  DutiesMeetingType,
  DutiesSectionType,
  SchedWeekType,
} from '@definition/schedules';
import { assignmentsHistoryState, schedulesState } from '@states/schedules';
import { dbSchedUpdate } from '@services/dexie/schedules';
import {
  schedulesBuildHistoryList,
  schedulesDutiesMeetingParts,
  schedulesDutiesSections,
} from '@services/app/schedules';
import { formatDate, getWeekDate } from '@utils/date';

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
  second: DutiesSectionType,
  validParts?: string[]
) => {
  if (first.id === second.id) return true;
  if (
    validParts &&
    [...first.parts, ...second.parts].some((part) => !validParts.includes(part))
  )
    return true;

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
  dynamic?: AssignmentCongregation[],
  overrides?: DutiesMeetingType['section_overrides']
) => {
  const changes: Record<string, unknown> = {
    [`duties.${meeting}.sections`]: sections,
    ...(overrides
      ? { [`duties.${meeting}.section_overrides`]: overrides }
      : {}),
  };

  if (dynamic) {
    changes[`duties.${meeting}.dynamic`] = dynamic;
  }

  await dbSchedUpdate(week, changes as unknown as UpdateSpec<SchedWeekType>);

  store.set(schedulesState, (current) =>
    current.map((schedule) => {
      if (schedule.weekOf !== week || !schedule.duties) return schedule;
      return {
        ...schedule,
        duties: {
          ...schedule.duties,
          [meeting]: {
            ...schedule.duties[meeting],
            sections,
            ...(overrides ? { section_overrides: overrides } : {}),
            ...(dynamic ? { dynamic } : {}),
          },
        },
      };
    })
  );
  store.set(assignmentsHistoryState, schedulesBuildHistoryList());
};

const mutateSections = (
  week: string,
  meeting: DutiesMeetingValue,
  mutate: (
    sections: DutiesSectionType[],
    dynamic: AssignmentCongregation[],
    dataView: string
  ) => void,
  expected?: Pick<DutiesSectionType, 'id' | 'updatedAt'>
) => {
  const dataView = store.get(userDataViewState);
  return queueDutyWrite(week, async () => {
    const schedule = scheduleOf(week);
    if (!schedule?.duties) throw new Error('tr_sectionUnavailable');
    if (expected) {
      const current = schedulesDutiesSections(week, meeting, dataView).find(
        (section) =>
          section.id === expected.id || section.legacyId === expected.id
      );
      if (!current) throw new Error('tr_sectionUnavailable');
      if (current.updatedAt !== expected.updatedAt)
        throw new Error('tr_sectionChanged');
    }
    const views =
      store
        .get(settingsState)
        .cong_settings.meeting_duties?.map((config) => config.type) ?? [];
    const snapshot = snapshotRecurringSections(
      schedule.duties[meeting],
      schedulesDutiesSections(week, meeting, dataView),
      dataView,
      new Date().toISOString()
    );
    const { sections, dynamic } = isolateLegacySections(
      snapshot.sections,
      dynamicOf(week, meeting),
      [...views, dataView]
    );
    mutate(sections, dynamic, dataView);
    await saveSections(
      week,
      meeting,
      sections,
      dynamic,
      snapshot.section_overrides
    );
  });
};

const findSection = (
  sections: DutiesSectionType[],
  id: string,
  dataView: string
) => {
  const section = sections.find(
    (record) =>
      record.dataView === dataView &&
      !record._deleted &&
      (record.id === id || record.legacyId === id)
  );
  if (!section) throw new Error('tr_sectionUnavailable');
  return section;
};

type SectionValues = Pick<DutiesSectionType, 'name' | 'amount' | 'parts'>;

const validateSection = (
  section: SectionValues,
  sections: DutiesSectionType[],
  id?: string
) => {
  const error = validateDutyName(section.name, sections, id);
  if (error) throw new Error(error);
  if (
    !Number.isInteger(section.amount) ||
    section.amount < 1 ||
    section.amount > 4
  )
    throw new Error('tr_dutyInvalidAmount');
};

export const dutiesSectionAdd = (
  week: string,
  meeting: DutiesMeetingValue,
  section: SectionValues
) =>
  mutateSections(week, meeting, (sections, _, dataView) => {
    const active = sectionsForView(sections, dataView);
    if (active.length >= DUTIES_SECTIONS_MAX)
      throw new Error('tr_sectionsLimitReached');
    validateSection(section, active);
    const validParts = new Set(
      schedulesDutiesMeetingParts(week, meeting, dataView).map(
        (part) => part.key
      )
    );
    if (section.parts.some((key) => !validParts.has(key)))
      throw new Error('tr_sectionPartsChanged');
    sections.push({
      ...section,
      name: section.name.trim(),
      id: crypto.randomUUID(),
      dataView,
      order: Math.max(-1, ...active.map((item) => item.order ?? 0)) + 1,
      _deleted: false,
      updatedAt: new Date().toISOString(),
    });
  });

export const dutiesSectionUpdate = (
  week: string,
  meeting: DutiesMeetingValue,
  id: string,
  changes: SectionValues,
  expectedUpdatedAt?: string
) =>
  mutateSections(
    week,
    meeting,
    (sections, dynamic, dataView) => {
      const section = findSection(sections, id, dataView);
      validateSection(changes, sectionsForView(sections, dataView), section.id);
      const validParts = new Set(
        schedulesDutiesMeetingParts(week, meeting, dataView).map(
          (part) => part.key
        )
      );
      if (changes.parts.some((key) => !validParts.has(key)))
        throw new Error('tr_sectionPartsChanged');
      Object.assign(section, changes, {
        name: changes.name.trim(),
        updatedAt: new Date().toISOString(),
      });
      releaseSlots(
        dynamic.filter((entry) => entry.type === dataView),
        (sectionId, position) =>
          sectionId === section.id && position > section.amount
      );
    },
    expectedUpdatedAt ? { id, updatedAt: expectedUpdatedAt } : undefined
  );

export const dutiesSectionDelete = (
  week: string,
  meeting: DutiesMeetingValue,
  id: string
) =>
  mutateSections(week, meeting, (sections, dynamic, dataView) => {
    const section = findSection(sections, id, dataView);
    section._deleted = true;
    section.updatedAt = new Date().toISOString();
    releaseSlots(
      dynamic.filter((entry) => entry.type === dataView),
      (sectionId) => sectionId === section.id
    );
  });

export const dutiesSectionMove = (
  week: string,
  meeting: DutiesMeetingValue,
  id: string,
  direction: -1 | 1
) =>
  mutateSections(week, meeting, (sections, _, dataView) => {
    const section = findSection(sections, id, dataView);
    const active = sectionsForView(sections, dataView);
    const index = active.indexOf(section);
    const target = index + direction;
    if (target < 0 || target >= active.length) return;
    [active[index], active[target]] = [active[target], active[index]];
    const updatedAt = new Date().toISOString();
    active.forEach((record, order) =>
      Object.assign(record, { order, updatedAt })
    );
  });

/** Copy structure only; existing target sections and assignments are never replaced. */
export const dutiesSectionsCopy = (
  week: string,
  meeting: DutiesMeetingValue,
  fromWeek: string
) =>
  mutateSections(week, meeting, (sections, _, dataView) => {
    const source = sectionsForView(sectionsOf(fromWeek, meeting), dataView);
    const active = sectionsForView(sections, dataView);
    if (!source.length) throw new Error('tr_sectionsNothingToCopy');
    if (source.length + active.length > DUTIES_SECTIONS_MAX)
      throw new Error('tr_sectionsLimitReached');
    let order = Math.max(-1, ...active.map((record) => record.order ?? 0));
    for (const section of source) {
      const name = uniqueDutyName(section.name, active);
      const copy = {
        ...structuredClone(section),
        id: crypto.randomUUID(),
        legacyId: undefined,
        dataView,
        name,
        order: ++order,
        updatedAt: new Date().toISOString(),
      };
      sections.push(copy);
      active.push(copy);
    }
  });

export type DutiesStaticKey = Exclude<
  keyof DutiesMeetingType,
  'sections' | 'dynamic' | 'section_overrides'
>;

type ReleasePositionsParams = {
  dataView: string;
  amount: number;
  keys?: DutiesStaticKey[];
  customId?: string;
};

const releaseStaticPositions = (
  duties: DutiesMeetingType,
  { dataView, amount, keys = [] }: ReleasePositionsParams,
  now: string
) => {
  let released = false;

  for (const key of keys) {
    for (const [field, entries] of Object.entries(duties[key] ?? {})) {
      const position = Number(field.replace('position_', ''));

      if (position <= amount) continue;

      for (const entry of entries) {
        if (entry.type !== dataView || entry.value === '') continue;

        entry.value = '';
        entry.updatedAt = now;
        released = true;
      }
    }
  }

  return released;
};

const releaseCustomPositions = (
  duties: DutiesMeetingType,
  { dataView, amount, customId }: ReleasePositionsParams
) => {
  if (!customId || !duties.dynamic) return false;

  const entries = duties.dynamic.filter((entry) => entry.type === dataView);

  return releaseSlots(
    entries,
    (sourceId, position) => sourceId === customId && position > amount
  );
};

/**
 * Clears the brothers of the positions a lower duty amount no longer shows,
 * from the current week on, so raising the amount again starts empty instead
 * of bringing old assignments back. Past weeks keep what was served.
 */
export const dutiesReleasePositions = async (
  params: ReleasePositionsParams
) => {
  const currentWeek = formatDate(getWeekDate(), 'yyyy/MM/dd');
  const weeks = store
    .get(schedulesState)
    .filter((schedule) => schedule.weekOf >= currentWeek && schedule.duties)
    .map((schedule) => schedule.weekOf);
  await Promise.all(
    weeks.map((week) =>
      queueDutyWrite(week, async () => {
        const latest = scheduleOf(week);
        if (!latest?.duties) return;
        const updated = structuredClone(latest.duties);
        const now = new Date().toISOString();
        let released = false;
        for (const meeting of ['midweek', 'weekend'] as const) {
          const staticReleased = releaseStaticPositions(
            updated[meeting],
            params,
            now
          );
          const customReleased = releaseCustomPositions(
            updated[meeting],
            params
          );
          released = staticReleased || customReleased || released;
        }
        if (!released) return;
        await dbSchedUpdate(week, { duties: updated });
        store.set(schedulesState, (current) =>
          current.map((schedule) =>
            schedule.weekOf === week
              ? { ...schedule, duties: updated }
              : schedule
          )
        );
      })
    )
  );
  store.set(assignmentsHistoryState, schedulesBuildHistoryList());
};

const DUTY_AMOUNT_KEYS = {
  audio_amount: ['audio', 'audio_video'],
  video_amount: ['video'],
  mic_amount: ['microphones'],
  stage_amount: ['stage'],
  entrance_attendant_amount: ['entrance_attendant'],
  auditorium_attendant_amount: ['auditorium_attendant'],
  hospitality_amount: ['hospitality'],
  videoconference_host_amount: ['videoconference_host'],
} satisfies Record<string, DutiesStaticKey[]>;

type DutySettings = SettingsType['cong_settings']['meeting_duties'];
type DutyConfig = DutySettings[number];

const validateCustomDutyChanges = (config: DutyConfig, before?: DutyConfig) => {
  for (const duty of config.custom ?? []) {
    const old = before?.custom?.find((item) => item.id === duty.id);
    if (
      duty.icon !== undefined &&
      duty.icon !== old?.icon &&
      !isCustomDutyIcon(duty.icon)
    )
      throw new Error('tr_dutyInvalidIcon');
    if (
      duty._deleted ||
      (old?.name === duty.name && old?.amount === duty.amount)
    )
      continue;
    const error = validateDutyName(duty.name, config.custom, duty.id);
    if (error) throw new Error(error);
    if (!Number.isInteger(duty.amount) || duty.amount < 0 || duty.amount > 4)
      throw new Error('tr_dutyInvalidAmount');
  }
};

// Match the optional-field defaults used when generating duty fields.
const DUTY_AMOUNT_DEFAULTS: Partial<
  Record<keyof typeof DUTY_AMOUNT_KEYS, number>
> = {
  auditorium_attendant_amount: 1,
  videoconference_host_amount: 0,
};
const dutyAmountOf = (config: DutyConfig, key: keyof typeof DUTY_AMOUNT_KEYS) =>
  config[key]?.value ?? DUTY_AMOUNT_DEFAULTS[key] ?? 0;

const reducedPositions = (
  config: DutyConfig,
  before: DutyConfig
): ReleasePositionsParams[] => {
  const staticChanges = (
    Object.keys(DUTY_AMOUNT_KEYS) as (keyof typeof DUTY_AMOUNT_KEYS)[]
  )
    .filter((key) => dutyAmountOf(config, key) < dutyAmountOf(before, key))
    .map((key) => ({
      dataView: config.type,
      amount: dutyAmountOf(config, key),
      keys: DUTY_AMOUNT_KEYS[key],
    }));
  const customChanges = (config.custom ?? []).flatMap((custom) => {
    const old = before.custom?.find((record) => record.id === custom.id);
    const amount = custom._deleted ? 0 : custom.amount;
    return old && amount < old.amount
      ? [{ dataView: config.type, amount, customId: custom.id }]
      : [];
  });
  return [...staticChanges, ...customChanges];
};

// Serialize settings writes so two quick changes cannot replace each other's
// newer fields. Position releases use the same order and read each preceding result.
let settingsWrite: Promise<void> = Promise.resolve();
export const dutiesSaveSettings = (
  incoming: DutySettings,
  validate?: () => void
) => {
  const save = async () => {
    validate?.();
    const previous =
      store.get(settingsState).cong_settings.meeting_duties ?? [];
    const merged = updateObject(
      { meeting_duties: structuredClone(previous) },
      { meeting_duties: incoming }
    ).meeting_duties;
    const releases: ReleasePositionsParams[] = [];
    for (const config of merged) {
      const before = previous.find((item) => item.type === config.type);
      validateCustomDutyChanges(config, before);
      if (before) releases.push(...reducedPositions(config, before));
    }
    await dbAppSettingsUpdate({ 'cong_settings.meeting_duties': merged });
    store.set(settingsState, (current) => ({
      ...current,
      cong_settings: { ...current.cong_settings, meeting_duties: merged },
    }));
    // Releasing positions mutates shared week records, so preserve write order.
    await releases.reduce(
      (pending, params) => pending.then(() => dutiesReleasePositions(params)),
      Promise.resolve()
    );
    store.set(assignmentsHistoryState, schedulesBuildHistoryList());
  };
  const pending = settingsWrite.then(save);
  settingsWrite = pending.catch(() => undefined);
  return pending;
};

/** Replace only this view's section layout; retain clears for removed assignments. */
export const dutiesSectionsRestore = (
  week: string,
  meeting: DutiesMeetingValue
) =>
  mutateSections(week, meeting, (sections, dynamic, dataView) => {
    const config = store
      .get(settingsState)
      .cong_settings.meeting_duties?.find((item) => item.type === dataView);
    const active = sectionsForView(sections, dataView);
    const ids = new Set(active.map((section) => section.id));
    const updatedAt = new Date().toISOString();
    for (const section of active) {
      section._deleted = true;
      section.updatedAt = updatedAt;
    }
    releaseSlots(
      dynamic.filter((entry) => entry.type === dataView),
      (id) => ids.has(id)
    );
    const defaults = resolveRecurringSections({
      duties: { sections: [] },
      templates: config?.section_templates ?? [],
      meeting,
      dataView,
      partKeys: schedulesDutiesMeetingParts(week, meeting, dataView).map(
        (part) => part.key
      ),
    });
    sections.push(
      ...defaults.map((section) => ({
        ...section,
        id: crypto.randomUUID(),
        updatedAt,
      }))
    );
  });
