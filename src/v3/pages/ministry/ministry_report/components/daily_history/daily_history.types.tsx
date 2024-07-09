import { MinistryRecord } from '@pages/ministry/ministry_report/ministry_report.types';

/**
 * DailyHistoryProps represents the props that can be passed to the DailyHistory component.
 */
export type DailyHistoryProps = {
  /**
   * An array of ministry records representing daily activities.
   */
  records: MinistryRecord[];

  /**
   * Callback function invoked when the add button is clicked.
   */
  onAddButtonClick?: VoidFunction;

  /**
   * Callback function invoked when the edit button is clicked for a specific record.
   * @param value The ministry record being edited.
   * @param index The index of the ministry record in the array.
   */
  onEditButtonClick?: (value: MinistryRecord, index: number) => void;
};
