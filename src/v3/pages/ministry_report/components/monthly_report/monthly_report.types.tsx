import { MinistryRecord, MinistryReportVariants } from '@pages/ministry_report/ministry_report.types';
import { ReactElement } from 'react';

export type MonthlyReportProps = {
  /**
   * Specifies the variant of the monthly report.
   */
  variant?: MinistryReportVariants;

  /**
   * An array of tabs representing different months.
   */
  months: {
    /**
     * The label of the tab.
     */
    label: string;

    /**
     * The component to be rendered in the tab.
     */
    Component: React.ReactNode;

    /**
     * The icon element to be displayed with the tab.
     */
    icon?: ReactElement;
  }[];

  /**
   * The ministry record data for the monthly report.
   */
  record: MinistryRecord;

  /**
   * Specifies whether to show credit hours in the monthly report.
   */
  showCreditHours?: boolean;

  /**
   * Callback function invoked when the comment is changed.
   * @param value The new value of the comment.
   */
  commentOnChange: (value: string) => void;
};
