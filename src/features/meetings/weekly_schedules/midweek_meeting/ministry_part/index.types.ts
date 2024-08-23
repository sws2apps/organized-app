import { MidweekMeetingDataType } from '@definition/schedules';

export type MinistryPartProps = {
  week: string;
  timings: MidweekMeetingDataType['timing'];
};
