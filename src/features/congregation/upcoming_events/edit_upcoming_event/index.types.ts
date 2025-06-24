import { UpcomingEventType } from '@definition/upcoming_events';

export type EditUpcomingEventProps = {
  data: UpcomingEventType;
  type: 'edit' | 'add';
  onSave: (events: UpcomingEventType[]) => void;
  onCancel: () => void;
};
