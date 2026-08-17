import { MeetingType } from '@definition/app';

export type DetailsRowProps = {
  type:
    | 'count'
    | 'total'
    | 'average'
    | 'average_online'
    | 'total_deaf'
    | 'average_deaf';
  month: string;
  meeting: MeetingType;
};
