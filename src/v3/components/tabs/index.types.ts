import { TabProps } from '@mui/material';

export type TabsPanelProps = {
  children?: React.ReactNode;
  index: number;
  value: number;
};

export interface CustomTabProps extends TabProps {
  tabs: {
    label: string;
    Component: React.ReactNode;
  }[];
}
