import {
  AttendanceCongregation,
  AttendanceSaveParams,
} from '@definition/meeting_attendance';
import appDb from '@db/appDb';
import { meetingAttendanceSchema } from '@services/dexie/schema';

const dbUpdateMeetingAttendanceMetadata = async () => {
  const metadata = await appDb.metadata.get(1);

  if (!metadata) return;

  metadata.metadata.meeting_attendance = {
    ...metadata.metadata.meeting_attendance,
    send_local: true,
  };

  await appDb.metadata.put(metadata);
};

type CountField = 'present' | 'online';

/** A time that never goes back, even when the device clock does. */
const nextTimestamp = (previous?: string) =>
  new Date(
    Math.max(Date.now(), (Date.parse(previous ?? '') || 0) + 1)
  ).toISOString();

/** An empty field is no count at all. */
const toCount = (value: string) => (value === '' ? undefined : Number(value));

/** The month's attendance to write into, revived if it had been deleted. */
const attendanceToSave = async (month: string) => {
  const stored = await appDb.meeting_attendance.get(month);
  const isDeleted = stored?._deleted?.value ?? false;

  const attendance = structuredClone(
    stored && !isDeleted ? stored : meetingAttendanceSchema
  );
  attendance.month_date = month;

  if (stored && isDeleted) {
    attendance._deleted = {
      value: false,
      updatedAt: nextTimestamp(stored._deleted.updatedAt),
    };
  }

  return attendance;
};

/** The record of this view, added to the meeting when it has none yet. */
const viewRecord = (records: AttendanceCongregation[], dataView: string) => {
  const existing = records.find((row) => row.type === dataView);
  if (existing) return existing;

  const created: AttendanceCongregation = {
    type: dataView,
    present: undefined,
    online: undefined,
    updatedAt: '',
  };
  records.push(created);

  return created;
};

/** The hearing part of a stored total, for when only the deaf count changes. */
const storedHearing = (
  current: AttendanceCongregation,
  field: CountField,
  deafField: 'present_deaf' | 'online_deaf'
) => {
  const total = current[field];
  if (total === undefined) return '';

  return String(Math.max(0, total - (current[deafField] ?? 0)));
};

/** Writes one count, split into hearing and deaf where those are kept apart. */
const applyCount = (
  current: AttendanceCongregation,
  field: CountField,
  values: AttendanceSaveParams['values'],
  recordDeaf: boolean
) => {
  const deafField = field === 'present' ? 'present_deaf' : 'online_deaf';
  if (!(field in values) && !(deafField in values)) return;

  if (recordDeaf) {
    const hearing =
      field in values
        ? values[field]
        : storedHearing(current, field, deafField);
    const deaf =
      deafField in values
        ? values[deafField]
        : (current[deafField]?.toString() ?? '');

    current[field] =
      hearing === '' && deaf === ''
        ? undefined
        : Number(hearing) + Number(deaf);
    current[deafField] = toCount(deaf ?? '');
  } else {
    const count = values[field];
    if (count !== undefined) current[field] = toCount(count);
  }

  if (current[field] !== undefined && !Number.isSafeInteger(current[field])) {
    throw new Error('error_app_generic-desc');
  }
};

export const dbMeetingAttendanceSave = ({
  month,
  index,
  type,
  dataView,
  values,
  recordDeaf = false,
}: AttendanceSaveParams) =>
  appDb.transaction(
    'rw',
    appDb.meeting_attendance,
    appDb.metadata,
    async () => {
      const attendance = await attendanceToSave(month);

      const week = [
        attendance.week_1,
        attendance.week_2,
        attendance.week_3,
        attendance.week_4,
        attendance.week_5,
      ][index - 1];
      if (!week) throw new Error('error_app_generic-desc');

      const current = viewRecord(week[type], dataView);

      for (const field of ['present', 'online'] as const) {
        applyCount(current, field, values, recordDeaf);
      }

      current.updatedAt = nextTimestamp(current.updatedAt);

      await appDb.meeting_attendance.put(attendance);
      await dbUpdateMeetingAttendanceMetadata();
    }
  );

export const dbMeetingAttendanceClear = async () => {
  const records = await appDb.meeting_attendance.toArray();

  if (records.length === 0) return;

  for (const record of records) {
    record._deleted = { value: true, updatedAt: new Date().toISOString() };
  }

  await appDb.meeting_attendance.bulkPut(records);
};
