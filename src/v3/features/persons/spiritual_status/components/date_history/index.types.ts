export type DateHistoryType = {
  id: string;
  startDate: string;
  endDate: string | null;
  onStartDateChange: (id: string, value: Date) => void;
  onEndDateChange: (id: string, value: Date) => void;
  onAdd: () => void;
  onDelete: (id: string) => void;
  isLast: boolean;
};
