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

const hearingCount = (total?: number, deaf?: number) => {
  if (!isCount(total) || !isCount(deaf)) return total;

  const hearing = total - deaf;

  return hearing > 0 ? hearing : undefined;
};

// records saved before deaf_separate held the deaf count inside present and
// online as well: keep only the hearing count there
export const attendanceSplitDeaf = (record: AttendanceCongregation) => {
  if (record.deaf_separate || !attendanceHasDeafCount(record)) return false;

  record.present = hearingCount(record.present, record.present_deaf);
  record.online = hearingCount(record.online, record.online_deaf);
  record.deaf_separate = true;

  return true;
};

export const meetingAttendanceSplitDeaf = (
  attendance: MeetingAttendanceType,
  updatedAt?: string
) => {
  let changed = false;

  for (let i = 1; i <= 5; i++) {
    const week = attendance[`week_${i}` as keyof MeetingAttendanceType] as
      | WeeklyAttendance
      | undefined;

    if (!week) continue;

    const records = [...(week.midweek ?? []), ...(week.weekend ?? [])];

    for (const record of records) {
      if (!attendanceSplitDeaf(record)) continue;

      if (updatedAt) record.updatedAt = updatedAt;

      changed = true;
    }
  }

  return changed;
};
