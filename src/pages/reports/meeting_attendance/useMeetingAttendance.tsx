import appDb from '@db/appDb';
import { MeetingAttendanceType } from '@definition/meeting_attendance';

const useMeetingAttendance = () => {
  const handleGetMeetingAttendance = async (monthDate: string) => {
    const result = await appDb.meeting_attendance
      .where('month_date')
      .equals(monthDate)
      .first();
    return result;
  };

  const handleAddMeetingAttendance = async (data: MeetingAttendanceType) => {
    const existingValue = await appDb.meeting_attendance
      .where('month_date')
      .equals(data.month_date)
      .first();
    if (existingValue) {
      await appDb.meeting_attendance
        .where('month_date')
        .equals(data.month_date)
        .modify(data);
    } else {
      await appDb.meeting_attendance.add(data);
    }
  };

  const handleGetMeetingAttendanceHistory = async (year: number) => {
    const result = await appDb.meeting_attendance
      .where('month_date')
      .startsWith(`${year}-`)
      .toArray();
    const result2 = await appDb.meeting_attendance
      .where('month_date')
      .startsWith(`${year + 1}-`)
      .toArray();
    return result.concat(result2);
  };

  return {
    handleAddMeetingAttendance,
    handleGetMeetingAttendance,
    handleGetMeetingAttendanceHistory,
  };
};

export default useMeetingAttendance;
