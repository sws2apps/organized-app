import { ReactElement } from 'react';

/**
 * Props for the NavBarButton component.
 */
export type NavBarButtonProps = {
  /**
   * The text label displayed inside the button.
   *
   * This is only shown when:
   * - The screen is large enough (desktop), or
   * - `textImportant` is set to true.
   */
  text: string;

  /**
   * The icon displayed in the button or compact icon-only mode.
   */
  icon: ReactElement;

  /**
   * Optional click handler for when the button is pressed.
   */
  onClick?: VoidFunction;

  /**
   * If true, applies the "main" variant styling.
   *
   * @default false
   */
  main?: boolean;

  /**
   * If true, always shows the text label regardless of screen size.
   *
   * @default false
   */
  textImportant?: boolean;
};
