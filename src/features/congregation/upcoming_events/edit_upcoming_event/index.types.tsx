import { DateUpcomingEventType } from '@definition/upcoming_events';

export type EditUpcomingEventProps = {
  data: DateUpcomingEventType;
  type: 'edit' | 'add';
  onSave: (dates: DateUpcomingEventType[]) => void;
  onCancel: () => void;
};
