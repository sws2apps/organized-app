export type DateHistoryType = {
  id: string;
  start_date: string;
  end_date: string | null;
  onStartDateChange: (id: string, value: Date) => void;
  onEndDateChange: (id: string, value: Date) => void;
  onAdd: () => void;
  onDelete: (id: string) => void;
  isLast: boolean;
  readOnly?: boolean;
};
