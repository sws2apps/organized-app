import { PropsWithChildren } from 'react';

export type CustomUserCardTypes = 'personal' | 'pioneer' | 'publisher';
export interface CustomUserCardProps extends PropsWithChildren {
  name: string;
  type: CustomUserCardTypes;
  chipLabels?: string[];
  female: boolean;
  onClick?: () => void;
  onDelete?: () => void;
}
