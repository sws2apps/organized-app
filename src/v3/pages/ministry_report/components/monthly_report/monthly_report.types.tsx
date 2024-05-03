import { MinistryRecord, MinistryReportVariants } from '@pages/ministry_report/ministry_report.types';
import { ReactElement } from 'react';

export type MonthlyReportProps = {
  variant?: MinistryReportVariants;

  /**
   * An array of Bible studies list.
   */
  bibleStudiesList: string[];

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

  onChange?: (record: MinistryRecord) => void;
  record: MinistryRecord;
};
