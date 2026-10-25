import { UpcomingEventType } from '@definition/upcoming_events';

export type UpcomingEventsListProps = {
  emptyMessage?: string;
  data: UpcomingEventType[];
  isAdding: boolean;
};
