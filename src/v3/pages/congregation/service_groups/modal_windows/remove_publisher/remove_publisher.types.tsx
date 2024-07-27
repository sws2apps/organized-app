import { MouseEventHandler } from 'react';

export type RemovePublisherModalWindowProps = {
  userName: string;

  groupId: number;
  groupName: string;

  onRemoveButtonClick?: MouseEventHandler<HTMLAnchorElement>;
  onCancelButtonClick?: MouseEventHandler<HTMLAnchorElement>;
};
