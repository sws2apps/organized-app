import { MeetingAttendanceType } from '@definition/meeting_attendance';
import appDb from '@db/appDb';

export const dbMeetingAttendanceSave = async (
  attendance: MeetingAttendanceType
) => {
  await appDb.meeting_attendance.put(attendance);
};
