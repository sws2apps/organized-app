export type YearDetailsProps = {
  year: string;
  publisherGroup: string;
  period: string;
};

export type PeriodOption = {
  label: string;
  value: string;
};

export type PublisherGroupOption = {
  label: string;
  value: string;
};

export type PublisherReportOption = {
  section: string;
  reports: {
    label: string;
    value: number;
  }[];
};
