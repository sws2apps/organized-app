import { MeetingType } from '@definition/app';

export type DetailsRowProps = {
  type: 'count' | 'total' | 'average';
  month: string;
  meeting: MeetingType;
};
