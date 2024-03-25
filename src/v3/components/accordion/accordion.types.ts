import { ReactNode } from 'react';

export type CustomAccordionVariant = 'accent' | 'orange' | 'dashed' | 'silver' | 'disabled';

export interface CustomAccordionProps {
  value?: string;
  variant: CustomAccordionVariant;
  label: string;
  onChange?: () => void;
  onClick?: () => void;
  children?: ReactNode;
  disabled?: boolean;
}

export interface AccordionViewProps {
  view: CustomAccordionVariant;
  onIconClick?: () => void;
  isDesktopExpanded?: boolean;
}
