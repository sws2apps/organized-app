export type MonthItemType = {
  month: number;
  weeks: string[];
  currentExpanded: string;
  onChangeCurrentExpanded: (value: string) => void;
};
