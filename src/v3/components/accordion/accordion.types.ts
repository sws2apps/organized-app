import { ReactNode } from 'react';

export type CPEAccordionVariant = 'accent' | 'orange' | 'dashed' | 'silver' | 'disabled';

export interface CPEAccordionProps {
  value?: string;
  variant: CPEAccordionVariant;
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
