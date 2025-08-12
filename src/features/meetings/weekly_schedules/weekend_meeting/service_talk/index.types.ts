import { WeekendMeetingTimingsType } from '@definition/schedules';

export type ServiceTalkProps = {
  week: string;
  timings: WeekendMeetingTimingsType;
  dataView?: string;
};
