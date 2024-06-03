import { TFunction } from 'i18next';

export type MeetingAttendanceReportToolbarProps = {
  t: TFunction<'translation', undefined>;
  onChangeDate: (monthDate: string) => void;
};

export type MeetingAttendanceReportToolbarData = {
  selectedYear: number;
  selectedMonth: number;
};
