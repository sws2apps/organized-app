import { MouseEventHandler } from 'react';

export type RemovePublisherModalWindowProps = {
  userName: string;

  groupId: number;
  groupName: number;

  onRemoveButtonClick?: MouseEventHandler<HTMLAnchorElement>;
  onCancelButtonClick?: MouseEventHandler<HTMLAnchorElement>;
};
