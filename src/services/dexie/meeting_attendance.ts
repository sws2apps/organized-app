import {
  AttendanceCongregation,
  AttendanceRecordField,
  AttendanceSaveParams,
} from '@definition/meeting_attendance';
import appDb from '@db/appDb';
import { meetingAttendanceSchema } from '@services/dexie/schema';
import {
  attendanceHasDeafCount,
  attendanceSplitDeaf,
} from '@utils/meeting_attendance';

const dbUpdateMeetingAttendanceMetadata = async () => {
  const metadata = await appDb.metadata.get(1);

  if (!metadata) return;

  metadata.metadata.meeting_attendance = {
    ...metadata.metadata.meeting_attendance,
    send_local: true,
  };

  await appDb.metadata.put(metadata);
};

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

export const dbMeetingAttendanceSave = ({
  month,
  index,
  type,
  dataView,
  values,
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

      // a record still holding the deaf inside its totals is split before
      // any of its counts is replaced
      attendanceSplitDeaf(current);

      const entries = Object.entries(values) as [
        AttendanceRecordField,
        string,
      ][];

      for (const [field, count] of entries) {
        current[field] = toCount(count);

        if (
          current[field] !== undefined &&
          !Number.isSafeInteger(current[field])
        ) {
          throw new Error('error_app_generic-desc');
        }
      }

      if (attendanceHasDeafCount(current)) current.deaf_separate = true;

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
