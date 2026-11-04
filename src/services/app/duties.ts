import { queueDutyWrite } from '@services/app/duties_queue';
import { validateDutyName } from '@utils/duties_sections';
import { SettingsType } from '@definition/settings';
import { settingsState } from '@states/settings';
import { dbAppSettingsUpdate } from '@services/dexie/settings';
import { updateObject } from '@utils/common';
import { store } from '@states/index';
import {
  AssignmentCongregation,
  DutiesMeetingType,
  DutiesSectionType,
} from '@definition/schedules';
import { assignmentsHistoryState, schedulesState } from '@states/schedules';
import { dbSchedUpdate } from '@services/dexie/schedules';
import { schedulesBuildHistoryList } from '@services/app/schedules';
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
