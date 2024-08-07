export type MeetingTimeType = {
  label: string;
  weekday: number;
  onWeekdayChange: (value: number) => void;
  time: Date;
  onTimeChange: (value: Date) => void;
};
