import { MouseEventHandler } from 'react';

export type DeleteGroupModalWindowProps = {
  groupId: number;

  onDeleteButtonClick?: MouseEventHandler<HTMLAnchorElement>;
  onCancelButtonClick?: MouseEventHandler<HTMLAnchorElement>;
};
