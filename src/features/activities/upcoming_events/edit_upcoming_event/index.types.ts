import { UpcomingEventType } from '@definition/upcoming_events';

export type EditUpcomingEventProps = {
  data: UpcomingEventType;
  type: 'edit' | 'add';
  onSave: (event: UpcomingEventType) => void;
  onCancel: () => void;
};
