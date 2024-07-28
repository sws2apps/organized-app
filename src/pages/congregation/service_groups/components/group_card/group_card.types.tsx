import { MouseEventHandler, ReactElement } from 'react';

export type GroupCardContainerProps = {
  color: string;

  children?: React.ReactNode;
};

export type GroupCardHeaderProps = {
  groupNumber: number;
  groupName: string;
  isMyGroup?: boolean;

  visitorsCount: number;

  onEditButtonClick?: MouseEventHandler<HTMLDivElement>;
};

export type GroupCardContentItemProps = {
  groupNumber: number;
  primaryText: string;
  descriptionText?: string;
  thirdText?: string;

  icon: ReactElement;

  isBaptized?: boolean;

  onMakeGroupOverseerClick?: MouseEventHandler<HTMLDivElement>;
  onMakeAssistantClick?: MouseEventHandler<HTMLDivElement>;
  onRemoveFromTheGroupClick?: MouseEventHandler<HTMLDivElement>;
};

export type GroupCardMenuProps = {
  isBaptized?: boolean;
  anchorElement: HTMLElement;
  open: boolean;

  reference?: React.Ref<HTMLDivElement>;

  onMakeGroupOverseerClick?: MouseEventHandler<HTMLDivElement>;
  onMakeAssistantClick?: MouseEventHandler<HTMLDivElement>;
  onRemoveFromTheGroupClick?: MouseEventHandler<HTMLDivElement>;
};

export type GroupCardDividerProps = {
  groupNumber: number;
};
