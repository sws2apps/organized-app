import { Key } from 'react';
import { UpcomingEventType } from '@definition/upcoming_events';

export type UpcomingEventProps = {
  data: UpcomingEventType;
  key?: Key;
};
