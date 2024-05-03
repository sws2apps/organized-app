import { TabProps } from '@mui/material';
import { FormEventHandler } from 'react';

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
  onChangeTab?: (newValue: number) => void;
  value?: number;
}
