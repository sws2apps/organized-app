export type MonthItemType = {
  month: string;
  weeks: string[];
  currentExpanded: string;
  onChangeCurrentExpanded: (value: string) => void;
};
