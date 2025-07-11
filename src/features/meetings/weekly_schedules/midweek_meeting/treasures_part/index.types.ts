import { MidweekMeetingDataType } from '@definition/schedules';

export type TreasuresPartProps = {
  week: string;
  dataView: string;
  timings: MidweekMeetingDataType['timing'];
};
