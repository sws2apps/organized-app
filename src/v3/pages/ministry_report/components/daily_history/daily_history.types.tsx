import { MinistryRecord } from '@pages/ministry_report/ministry_report.types';

export type DailyHistoryProps = {
  records: MinistryRecord[];
  onAddButtonClick?: VoidFunction;
  onEditButtonClick?: (value: MinistryRecord, index: number) => void;
};
