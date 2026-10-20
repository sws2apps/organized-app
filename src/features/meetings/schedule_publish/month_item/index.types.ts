import type { SchedulePublicationState } from '@definition/schedule_publication';
export type MonthItemProps = {
  data: {
    month: string;
    checked: boolean;
    status: SchedulePublicationState;
  };
  readOnly?: boolean;
  disabled?: boolean;
  onChange: (checked: boolean, value: string) => void;
};
