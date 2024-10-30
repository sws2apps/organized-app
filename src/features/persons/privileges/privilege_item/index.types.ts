import { PrivilegeType } from '@definition/person';

export type PrivilegeItemType = {
  id: string;
  start_date: string;
  end_date: string | null;
  onStartDateChange: (id: string, value: Date) => void;
  onEndDateChange: (id: string, value: Date) => void;
  onPrivilegeChange: (id: string, value: string) => void;
  onAdd: () => void;
  onDelete: (id: string) => void;
  isLast: boolean;
  privilege: PrivilegeType;
  readOnly?: boolean;
};
