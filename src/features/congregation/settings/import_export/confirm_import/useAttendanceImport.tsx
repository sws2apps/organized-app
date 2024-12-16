import { MeetingAttendanceType } from '@definition/meeting_attendance';
import { updatedAtOverride } from '@utils/common';
import appDb from '@db/appDb';

const useAttendanceImport = () => {
  const getAttendances = async (attendances: MeetingAttendanceType[]) => {
    const result: MeetingAttendanceType[] = [];

    result.push(...attendances);

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
