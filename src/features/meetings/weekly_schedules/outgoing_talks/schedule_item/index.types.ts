import { OutgoingTalkScheduleType } from '@definition/schedules';

export type ScheduleItemProps = {
  schedule_id: string;
  week: string;
};

export type TalkScheduleType = OutgoingTalkScheduleType & {
  name: string;
  talk: string;
};
