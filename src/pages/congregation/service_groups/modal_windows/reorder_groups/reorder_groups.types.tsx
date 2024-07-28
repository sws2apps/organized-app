import { MouseEventHandler } from 'react';

export type ReorderGroupsModalWindowProps = {
  groups: { groupNum: string; groupName: string }[];

  onChange: (value: { groupNum: string; groupName: string }[]) => void;
  onCancelButtonClick?: MouseEventHandler<HTMLAnchorElement>;
};
