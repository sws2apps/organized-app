type CPEUserCardTypes = 'personal' | 'pioneer' | 'publisher';
import { PropsWithChildren } from 'react';

export interface CPEUserCardProps extends PropsWithChildren {
  name: string;
  type: CPEUserCardTypes;
  chipLabels: string[];
  onEdit: () => void;
  onDelete: () => void;
}
