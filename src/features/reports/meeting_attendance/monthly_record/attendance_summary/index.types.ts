import { MeetingType } from '@definition/app';

export type AttendanceSummaryProps = {
  type: MeetingType;
  month: string;
  summary: 'total' | 'average';
};
