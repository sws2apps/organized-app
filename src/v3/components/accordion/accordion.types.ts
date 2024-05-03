import { ReactNode } from 'react';

/**
 * Type representing different variants for CustomAccordion.
 */
export type CustomAccordionVariant = 'accent' | 'orange' | 'dashed' | 'silver' | 'disabled';

/**
 * Props interface for CustomAccordion component.
 */
export interface CustomAccordionProps {
  /**
   * A unique identifier for the accordion.
   */
  value?: string;

  /**
   * The variant of the accordion. Determines its visual appearance.
   */
  variant: CustomAccordionVariant;

  /**
   * The label displayed for the accordion.
   */
  label: string;

  /**
   * Callback function invoked when the accordion state changes.
   */
  onChange?: () => void;

  /**
   * Callback function invoked when the accordion is clicked.
   */
  onClick?: () => void;

  /**
   * The content to be displayed inside the accordion.
   */
  children?: ReactNode;

  /**
   * Specifies whether the accordion is disabled or not.
   */
  disabled?: boolean;
}

/**
 * Props interface for the view of the accordion.
 */
export interface AccordionViewProps {
  /**
   * The variant of the accordion view. Determines its visual appearance.
   */
  view: CustomAccordionVariant;

  /**
   * Callback function invoked when the accordion view icon is clicked.
   */
  onIconClick?: () => void;

  /**
   * Specifies whether the accordion is expanded in desktop view.
   */
  isDesktopExpanded?: boolean;
}
