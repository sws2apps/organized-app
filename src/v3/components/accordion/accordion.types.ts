import { ReactNode } from 'react';

export type CPEAccordionVariant = 'default' | 'searching' | 'dashed';

export interface CPEAccordionProps {
  value?: string;
  variant?: CPEAccordionVariant;
  label: string;
  onChange?: () => void;
  onClick?: () => void;
  children?: ReactNode;
  disabled?: boolean;
}

export interface AccordionViewProps {
  view: CPEAccordionVariant;
  onIconClick?: () => void;
  isDesktopExpanded?: boolean;
}
