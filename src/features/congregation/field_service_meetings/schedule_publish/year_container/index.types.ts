import { ScheduleListType } from '../index.types';

export type YearContainerProps = {
  data: ScheduleListType;
  onChange: (checked: boolean, value: string) => void;
};
