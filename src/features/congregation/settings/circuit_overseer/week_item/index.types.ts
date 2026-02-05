import { CircuitOverseerVisitType } from '@definition/settings';

export type WeekItemType = {
  visit: CircuitOverseerVisitType;
  error?: boolean;
  helperText?: string;
  onWeekChange?: (id: string, nextWeekOf: string) => void;
  onDelete?: (id: string) => void;
};
