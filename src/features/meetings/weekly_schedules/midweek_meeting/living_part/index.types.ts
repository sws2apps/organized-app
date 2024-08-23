import { MidweekMeetingDataType } from '@definition/schedules';

export type LivingPartProps = {
  week: string;
  timings: MidweekMeetingDataType['timing'];
};
