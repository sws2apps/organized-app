export type ReportMonthType = {
  value: string;
  label: string;
};

export type ServiceYearType = {
  year: string;
  months: ReportMonthType[];
};
