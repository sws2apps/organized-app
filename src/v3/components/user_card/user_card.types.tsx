import { PropsWithChildren } from 'react';

export type CPEUserCardTypes = 'personal' | 'pioneer' | 'publisher';
export interface CPEUserCardProps extends PropsWithChildren {
  name: string;
  type: CPEUserCardTypes;
  chipLabels?: string[];
  onClick?: () => void;
  onDelete?: () => void;
}
