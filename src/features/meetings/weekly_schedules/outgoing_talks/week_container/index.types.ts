import { Ref } from 'react';
import { OutgoingTalkSchedules } from '../index.types';

export type WeekContainerProps = {
  talkSchedules: OutgoingTalkSchedules;
  ref?: Ref<HTMLDivElement>;
};
