import { VolunteerActivityType } from '@definition/volunteer_activities';

export type EditActivityProps = {
  data: VolunteerActivityType;
  type: 'add' | 'edit';
  participantsCount: number;
  onSave: (activity: VolunteerActivityType) => void;
  onCancel: VoidFunction;
};
