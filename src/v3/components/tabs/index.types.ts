import { TabProps } from '@mui/material';
import { ReactElement } from 'react';

/**
 * Props for the TabsPanel component.
 */
export type TabsPanelProps = {
  /**
   * The content of the tab panel.
   */
  children?: React.ReactNode;

  /**
   * The index of the tab panel.
   */
  index: number;

  /**
   * The current value of the tab.
   */
  value: number;
};

/**
 * Custom props for the Tab component.
 */
export interface CustomTabProps extends TabProps {
  /**
   * An array of tabs containing label and corresponding component.
   */
  tabs: {
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
   * The index of the currently selected tab.
   */
  selected?: number;

  /**
   * A boolean indicating whether to display the indicator.
   */
  indicatorMode?: boolean;
}
