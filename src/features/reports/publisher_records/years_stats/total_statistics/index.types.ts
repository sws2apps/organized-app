import type { PeriodOption } from '../year_details/index.types';

export type TotalStatisticsProps = {
  year: string;
  month: string;
  wholeYear: boolean;
  publisherGroup: string;
  period: PeriodOption;
};
