import { ReactElement, ReactNode } from 'react';
import { SxProps, TabOwnProps, TabsOwnProps, Theme } from '@mui/material';

/**
 * Props for the TabsPanel component.
 */
export type TabsPanelProps = {
  /**
   * The content of the tab panel.
   */
  children?: ReactNode;

  /**
   * The index of the tab panel.
   */
  index: number;

  /**
   * The current value of the tab.
   */
  value: number | boolean;
};

/**
 * Custom props for the Tab component.
 */
export interface CustomTabProps extends TabOwnProps {
  /**
   * An array of tabs containing label and corresponding component.
   */
  tabs: {
    /**
     * The label of the tab.
     */
    label: string | ReactNode;

    /**
     * The component to be rendered in the tab.
     */
    Component?: ReactNode;

    /**
     * The icon element to be displayed with the tab.
     */
    icon?: ReactElement;

    className?: string;
  }[];

  /**
   * The index of the currently selected tab.
   */
  value?: number | boolean;

  /**
   * A boolean indicating whether to display the indicator.
   */
  indicatorMode?: boolean;

  onChange?: (activeTab: number) => void;

  className?: string;

  variant?: TabsOwnProps['variant'];

  minHeight?: string;

  tabsCountOnScreen?: number;

  sx?: SxProps<Theme>;
}
