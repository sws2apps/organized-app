import { TFunction } from 'i18next';

export type MeetingAttendanceReportToolbarProps = {
  t: TFunction<'translation', undefined>;
};

export type MeetingAttendanceReportToolbarData = {
  selectedYear: number;
  selectedMonth: number;
};
