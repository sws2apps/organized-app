import { ChangeEvent } from 'react';

export type SpiritualStatusTitleType = {
  checked: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>, checked: boolean) => void;
  title: string;
  isExpanded: boolean;
  onExpand: () => void;
};
