import { MouseEventHandler } from 'react';

export type EditGroupModalWindowData = {
  groupName: string;
  groupNumber: string;
  publishers: string[];
};

export type EditGroupModalWindowProps = {
  data: EditGroupModalWindowData;

  onSaveButtonClick: (data: EditGroupModalWindowData) => void;

  onCancelButtonClick?: MouseEventHandler<HTMLAnchorElement>;
  onDeleteButtonClick?: MouseEventHandler<HTMLAnchorElement>;
};
