import { MeetingType } from '@definition/app';

export type WeekBoxProps = {
  index: number;
  month: string;
  type: MeetingType;
  view?: string;
};
