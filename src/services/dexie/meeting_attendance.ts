import { MeetingAttendanceType } from '@definition/meeting_attendance';
import { updateObject } from '@utils/common';
import { meetingAttendanceSchema } from './schema';
import appDb from '@db/appDb';

export const dbMeetingAttendanceSave = async (
  attendance: MeetingAttendanceType
) => {
  const findAttendance = await appDb.meeting_attendance.get(
    attendance.month_date
  );

  if (!findAttendance) {
    const newAttendance = structuredClone(meetingAttendanceSchema);
    newAttendance.month_date = attendance.month_date;

    await appDb.meeting_attendance.put(newAttendance);
  }

  const dbAttendance = await appDb.meeting_attendance.get(
    attendance.month_date
  );

  const newAttendance = structuredClone(dbAttendance);
  updateObject(newAttendance, attendance);

  await appDb.meeting_attendance.put(newAttendance);
};
