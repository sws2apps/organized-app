export type TimeAwayItemType = {
  start_date: string;
  end_date: string | null;
  comments: string;
  id: string;
  onAdd: () => void;
  onStartDateChange: (id: string, value: Date) => void;
  onEndDateChange: (id: string, value: Date) => void;
  onCommentsChange: (id: string, value: string) => void;
  onDelete: (id: string) => void;
  isLast: boolean;
};
