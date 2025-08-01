import { WeekendMeetingTimingsType } from '@definition/schedules';
import { Week } from '@definition/week_type';

export type PublicTalkProps = {
  week: string;
  dataView: string;
  week_type: Week;
  timings: WeekendMeetingTimingsType;
};
