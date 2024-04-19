import { ReactElement } from 'react';

export type StatusHistoryType = {
  active: boolean;
  onChange: () => void;
  expanded: boolean;
  showAdd: boolean;
  onExpand: () => void;
  onAdd: () => void;
  history: ReactElement;
};
