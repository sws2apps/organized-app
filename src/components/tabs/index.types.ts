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

  /**
   * Callback function triggered when the active tab changes.
   * Provides the new active tab index as a parameter.
   *
   * @param activeTab - The index of the newly selected tab.
   */
  onChange?: (activeTab: number) => void;

  /**
   * Optional class name for styling the tab container or component.
   */
  className?: string;

  /**
   * The variant of the tabs, aligning with the MUI `TabsOwnProps` variant.
   * Examples include `"scrollable"` or `"standard"`.
   */
  variant?: TabsOwnProps['variant'];

  /**
   * Minimum height for the tab component.
   * Useful for ensuring consistent tab sizes.
   */
  minHeight?: string;

  /**
   * The number of tabs that should be displayed on the screen at once.
   * Useful for responsive layouts or custom tab implementations.
   */
  tabsCountOnScreen?: number;

  /**
   * Custom styling applied to the tab component using MUI's `sx` prop.
   */
  sx?: SxProps<Theme>;
}
