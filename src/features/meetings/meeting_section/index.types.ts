import { ReactElement } from 'react';

export type MeetingSectionType = {
  part: string;
  color: string;
  icon: ReactElement;
  expanded?: boolean;
  onToggle?: VoidFunction;
  alwaysExpanded?: boolean;
};
