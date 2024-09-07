import { ReactNode } from 'react';

export type CustomAccordionVariant =
  | 'accent'
  | 'orange'
  | 'dashed'
  | 'silver'
  | 'disabled';

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

/*
 * Props for the PublicWitnessingPlaceCard component.
 */
export interface PublicWitnessingPlaceCardProps {
  /*
   * The label for the card.
   */
  label: string;

  /*
   * Callback function when the card is clicked.
   */
  onClick?: () => void;

  /*
   * Determines if the card is disabled.
   */
  disabled?: boolean;

  /*
   * Determines if the delete functionality is enabled for the card.
   */
  isDelete?: boolean;

  /*
   * Callback function when the delete action is clicked.
   */
  onDelete?: () => void;
}

/*
 * Props for the PublicWitnessingTimeCard component.
 */
export interface PublicWitnessingTimeCardProps {
  /*
   * List of witnesses.
   */
  witnesses?: string[];

  /*
   * Number of witnesses needed.
   */
  needWitnesses?: number;

  /*
   * Minimum number of witnesses required.
   */
  minWitnesses?: number;

  /*
   * Indicates if it's a day event.
   */
  isDay?: boolean;
}

/*
 * Props for the PublicWitnessingCard component.
 */
export interface PublicWitnessingCardProps
  extends Omit<CustomAccordionProps, 'disabled' | 'variant'>,
    PublicWitnessingTimeCardProps {
  /*
   * Indicates if the event is in the past.
   */
  isPast?: boolean;
}

/*
 * Props for the PublicWitnessingView component.
 */
export interface PublicWitnessingViewProps
  extends Omit<CustomAccordionProps, 'disabled'>,
    PublicWitnessingTimeCardProps {
  /*
   * Indicates if the content is visible.
   */
  isContent: boolean;

  /*
   * Indicates if the event is in the past.
   */
  isPast?: boolean;
}
