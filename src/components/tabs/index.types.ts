import { ReactElement, ReactNode } from 'react';
import { SxProps, TabOwnProps, Theme } from '@mui/material';

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
 * The look of the tabs.
 * - `chip` - fully rounded tabs, used for the date and period selectors.
 * - `plain` - lightly rounded tabs, used wherever tabs switch a page section.
 */
export type TabsAppearance = 'chip' | 'plain';

/**
 * The width of the tabs.
 * - `auto` - every tab takes the width of its own label.
 * - `stretch` - the tabs share the full width from the tablet breakpoint up,
 *   and fall back to `auto` on smaller screens.
 */
export type TabsLayout = 'auto' | 'stretch';

/**
 * Custom props for the Tab component.
 */
export interface CustomTabProps extends TabOwnProps {
  /**
   * The look of the tabs. (Default: chip)
   */
  appearance?: TabsAppearance;

  /**
   * An array of tabs containing label and corresponding component.
   */
  tabs: {
    /**
     * The label of the tab.
     */
    label: string | ReactNode;

    /**
     * The number displayed in a badge next to the label.
     */
    badge?: number;

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
   * The width of the tabs. (Default: auto)
   */
  layout?: TabsLayout;

  /**
   * The action component to be displayed with the tab.
   */
  actionComponent?: ReactNode;

  /**
   * A boolean indicating whether to display the tabs. (Default: true)
   */
  showTabs?: boolean;

  /**
   * Custom styling applied to the tab component using MUI's `sx` prop.
   */
  sx?: SxProps<Theme>;
}
