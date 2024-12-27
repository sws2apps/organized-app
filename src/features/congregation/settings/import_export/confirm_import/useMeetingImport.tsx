import { SchedWeekType } from '@definition/schedules';
import { SourceWeekType } from '@definition/sources';
import { scheduleSchema } from '@services/dexie/schema';
import { updatedAtOverride } from '@utils/common';

const useMeetingImport = () => {
  const getSources = (sources: SourceWeekType[]) => {
    return sources.map((record) => {
      const data = updatedAtOverride(record);
      return data;
    });
  };

  const getSchedules = (
    schedules: SchedWeekType[],
    midweek: boolean,
    weekend: boolean
  ) => {
    return schedules.map((record) => {
      const midweekData = midweek
        ? record.midweek_meeting
        : scheduleSchema.midweek_meeting;

      const weekendData = weekend
        ? record.weekend_meeting
        : scheduleSchema.weekend_meeting;

      record.midweek_meeting = midweekData;
      record.weekend_meeting = weekendData;

      updatedAtOverride(record);

      return record;
    });
  };

  return { getSources, getSchedules };
};

export default useMeetingImport;
