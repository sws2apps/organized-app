import { MidweekMeetingDataType } from '@definition/schedules';
import { SourceAssignmentType } from '@definition/sources';

export type PartRowProps = {
  week: string;
  dataView: string;
  type: SourceAssignmentType;
  timings: MidweekMeetingDataType['timing'];
};
