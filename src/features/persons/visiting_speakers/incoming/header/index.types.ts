export type IncomingCongregationHeaderType = {
  expanded: boolean;
  onExpandChange: (value: string) => void;
  editMode: boolean;
  onEditModeChange: VoidFunction;
  cong_name: string;
  cong_number: string;
  cong_synced: boolean;
  onDelete: VoidFunction;
};
