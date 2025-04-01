import { UpcomingEventType } from '@definition/upcoming_events';

export type AddToCalendarButtonProps = {
  event: UpcomingEventType;
  variant?: 'default' | 'icon';
};
