import { EnrollmentType } from '@definition/person';

export type EnrollmentItemType = {
  id: string;
  startDate: string;
  endDate: string | null;
  onStartDateChange: (id: string, value: Date) => void;
  onEndDateChange: (id: string, value: Date) => void;
  onEnrollmentChange: (id: string, value: string) => void;
  onAdd: () => void;
  onDelete: (id: string) => void;
  isLast: boolean;
  enrollment: EnrollmentType;
};
