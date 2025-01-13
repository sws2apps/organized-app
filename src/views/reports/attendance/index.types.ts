import { MeetingAttendanceExport } from '@definition/meeting_attendance';

export type TemplateS88Props = {
  data: MeetingAttendanceExport;
};

export type AverageRowProps = {
  column: number;
  locale: string;
  average: number;
};

export type TableHeaderProps = { column: number; year: string; locale: string };

export type MonthlyRowProps = {
  column: number;
  last: boolean;
  month: string;
  count: number | string;
  total: number | string;
  average: number | string;
};
