import { ScheduleListType } from '../index.types';

export type YearContainerProps = {
  data: ScheduleListType;
  readOnly?: boolean;
  disabled?: boolean;
  onChange: (checked: boolean, value: string) => void;
};
