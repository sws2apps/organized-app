export type WeekBoxProps = {
  weekNumber: number;
  weekend: boolean;
  onChange: (weekNumber: number, weekend: boolean, value: number) => void;
  value?: number;
};
