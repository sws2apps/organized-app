import { AppRoleType } from '@definition/app';
import { HallAttendantPerson } from '@definition/hall_attendant';
import { MeetingAttendanceType } from '@definition/meeting_attendance';
import { getHallAttendantViews } from '@utils/hall_attendant';

export const getAttendanceDataViews = (
  person: HallAttendantPerson | undefined,
  roles: AppRoleType[]
): string[] | undefined =>
  roles.some((role) =>
    [
      'admin',
      'coordinator',
      'secretary',
      'language_group_overseers',
      'attendance_tracking',
    ].includes(role)
  )
    ? undefined
    : getHallAttendantViews(person, roles);

export const getAttendanceForUpload = (
  records: MeetingAttendanceType[],
  views: string[] | undefined
) => {
  const attendance = structuredClone(records);
  if (views === undefined) return attendance;
  const allowed = new Set(views);
  return attendance.filter((record) => {
    if (record._deleted?.value) return false;
    let hasRecords = false;
    for (const week of [
      record.week_1,
      record.week_2,
      record.week_3,
      record.week_4,
      record.week_5,
    ]) {
      week.midweek = week.midweek.filter((row) => allowed.has(row.type));
      week.weekend = week.weekend.filter((row) => allowed.has(row.type));
      hasRecords ||= week.midweek.length > 0 || week.weekend.length > 0;
    }
    return hasRecords;
  });
};
