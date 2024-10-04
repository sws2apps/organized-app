import { MouseEventHandler, PropsWithChildren } from 'react';

/**
 * Types of custom user card: 'person', 'pioneer', 'publisher'.
 */
export type CustomUserCardTypes = 'person' | 'pioneer' | 'publisher';

export interface CustomUserCardProps extends PropsWithChildren {
  /**
   * The name of the user.
   */
  name: string;

  /**
   * The type of the user card.
   */
  type: CustomUserCardTypes;

  /**
   * Optional chip labels to display on the user card.
   */
  chipLabels?: string[];

  /**
   * Specifies if the user is female.
   */
  female: boolean;

  /**
   * Callback function to handle click events on the user card.
   */
  onClick?: () => void;

  /**
   * Callback function to handle delete events on the user card.
   */
  onDelete?: MouseEventHandler<HTMLButtonElement>;

  showArrow?: boolean;
}
