import { MeetingAttendanceType } from '@definition/meeting_attendance';
import { updatedAtOverride } from '@utils/common';
import { meetingAttendanceSplitDeaf } from '@utils/meeting_attendance';
import appDb from '@db/appDb';

const useAttendanceImport = () => {
  const getAttendances = async (attendances: MeetingAttendanceType[]) => {
    const result: MeetingAttendanceType[] = [];

    // the parsed backup is left untouched: the import can still be cancelled
    for (const attendance of attendances) {
      const record = structuredClone(attendance);

      meetingAttendanceSplitDeaf(record);

      result.push(record);
    }

    const oldAttendances = await appDb.meeting_attendance.toArray();

    for (const oldAttendance of oldAttendances) {
      const newAttendance = attendances.find(
        (record) => record.month_date === oldAttendance.month_date
      );

      if (!newAttendance) {
        oldAttendance._deleted = {
          value: true,
          updatedAt: new Date().toISOString(),
        };

        result.push(oldAttendance);
      }
    }

    return result.map((record) => {
      const data = updatedAtOverride(record);
      return data;
    });
  };

  return { getAttendances };
};

export default useAttendanceImport;
