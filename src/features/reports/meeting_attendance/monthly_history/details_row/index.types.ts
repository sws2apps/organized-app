import { MeetingType } from '@definition/app';

export type DetailsRowProps = {
  type: 'count' | 'total' | 'average' | 'average_online';
  month: string;
  meeting: MeetingType;
};
