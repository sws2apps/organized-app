import { MeetingPartType } from '../meeting_part/index.types';

export type PartDurationType = {
  length: number;
  defaultValue?: number;
  type: MeetingPartType['type'];
  week: string;
};
