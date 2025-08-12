import { MidweekMeetingDataType } from '@definition/schedules';

export type MinistryPartProps = {
  week: string;
  dataView: string;
  timings: MidweekMeetingDataType['timing'];
};
