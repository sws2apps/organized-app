import {
  AttendanceCongregation,
  AttendanceRecordField,
  MeetingAttendanceType,
  WeeklyAttendance,
} from '@definition/meeting_attendance';

const COUNT_FIELDS: AttendanceRecordField[] = [
  'present',
  'online',
  'present_deaf',
  'online_deaf',
];

const isCount = (value: unknown): value is number => typeof value === 'number';

export const attendanceRecordTotal = (record: AttendanceCongregation) => {
  return COUNT_FIELDS.reduce(
    (acc, field) => acc + (isCount(record[field]) ? record[field] : 0),
    0
  );
};

export const attendanceHasDeafCount = (record: AttendanceCongregation) => {
  return isCount(record.present_deaf) || isCount(record.online_deaf);
};

// a deaf count that is not smaller than the count holding it means broken
// data: keep the meeting total as it was instead of letting the split raise it
const splitCounts = (total?: number, deaf?: number) => {
  if (!isCount(total) || !isCount(deaf)) return { total, deaf };

  if (deaf >= total) return { total: undefined, deaf: total };

  return { total: total - deaf, deaf };
};

// records saved before deaf_separate held the deaf count inside present and
// online as well: keep only the hearing count there
export const attendanceSplitDeaf = (record: AttendanceCongregation) => {
  if (record.deaf_separate || !attendanceHasDeafCount(record)) return false;

  const present = splitCounts(record.present, record.present_deaf);
  const online = splitCounts(record.online, record.online_deaf);

  record.present = present.total;
  record.online = online.total;

  if (isCount(record.present_deaf)) record.present_deaf = present.deaf;
  if (isCount(record.online_deaf)) record.online_deaf = online.deaf;

  record.deaf_separate = true;

  return true;
};

// a cleared count is left out when a record is sent, so a merge would keep the
// old value: give every row each count, empty ones included
export const meetingAttendanceFillCounts = (
  attendance: MeetingAttendanceType
) => {
  for (let i = 1; i <= 5; i++) {
    const week = attendance[`week_${i}` as keyof MeetingAttendanceType] as
      | WeeklyAttendance
      | undefined;

    if (!week) continue;

    const records = [...(week.midweek ?? []), ...(week.weekend ?? [])];

    for (const record of records) {
      for (const field of COUNT_FIELDS) {
        if (!(field in record)) record[field] = undefined;
      }
    }
  }
};

export const meetingAttendanceSplitDeaf = (
  attendance: MeetingAttendanceType
) => {
  let changed = false;

  for (let i = 1; i <= 5; i++) {
    const week = attendance[`week_${i}` as keyof MeetingAttendanceType] as
      | WeeklyAttendance
      | undefined;

    if (!week) continue;

    const records = [...(week.midweek ?? []), ...(week.weekend ?? [])];

    for (const record of records) {
      if (attendanceSplitDeaf(record)) changed = true;
    }
  }

  return changed;
};
