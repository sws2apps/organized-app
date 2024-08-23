import { MidweekMeetingDataType } from '@definition/schedules';

export type TreasuresPartProps = {
  week: string;
  timings: MidweekMeetingDataType['timing'];
};
