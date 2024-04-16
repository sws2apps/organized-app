import { MouseEventHandler, PropsWithChildren } from 'react';

export type CustomUserCardTypes = 'person' | 'pioneer' | 'publisher';

export interface CustomUserCardProps extends PropsWithChildren {
  name: string;
  type: CustomUserCardTypes;
  chipLabels?: string[];
  female: boolean;
  onClick?: () => void;
  onDelete?: MouseEventHandler<HTMLButtonElement>;
}
