import { TabOwnProps } from '@mui/material';

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
export interface CustomTabProps extends TabOwnProps {
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
  }[];
  onChange?: (activeTab: number) => void;
}
