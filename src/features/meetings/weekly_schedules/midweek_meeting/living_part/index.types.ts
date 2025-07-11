import { MidweekMeetingDataType } from '@definition/schedules';

export type LivingPartProps = {
  week: string;
  dataView: string;
  timings: MidweekMeetingDataType['timing'];
};
