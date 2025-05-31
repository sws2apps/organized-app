import { OutgoingTalkSchedule } from '../index.types';

export type ScheduleItemProps = {
  schedule: OutgoingTalkSchedule;
};

export type TalkScheduleType = OutgoingTalkSchedule & {
  name: string;
  talk_title: string;
};
