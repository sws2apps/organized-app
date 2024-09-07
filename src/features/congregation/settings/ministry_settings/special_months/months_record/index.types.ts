import { SpecialMonthType } from '@definition/settings';

export type MonthsRecordProps = {
  month: SpecialMonthType;
  isLast: boolean;
  onAdd: VoidFunction;
  onDelete: (id: string) => void;
};
