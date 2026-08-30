import { MouseEventHandler, ReactElement, ReactNode } from 'react';
import { SxProps, Theme } from '@mui/material';

/**
 * Props type for the Button component.
 */
export type ButtonPropsType = {
  /**
   * Class name for the button.
   */
  className?: 'button-caps' | 'button-small-caps' | 'body-small-semibold';

  /**
   * Children elements to be rendered within the button.
   */
  children?: ReactNode;

  /**
   * Click event handler for the button.
   */
  onClick?: MouseEventHandler<HTMLAnchorElement>;

  /**
   * Indicates whether the button is disabled.
   */
  disabled?: boolean;

  /**
   * Forces the pressed (`:active`) look via an `is-pressed` class.
   *
   * Use when the browser skips `:active` for a press — e.g. the first press
   * right after focus moves (switching tabs). Pair with an `&.is-pressed`
   * selector in `sx` for non-default variants.
   */
  pressed?: boolean;

  /**
   * Variant style of the button.
   */
  variant?:
    | 'main'
    | 'secondary'
    | 'tertiary'
    | 'small'
    | 'semi-white'
    | 'group';

  /**
   * Icon displayed at the start of the button.
   */
  startIcon?: ReactElement;

  /**
   * Icon displayed at the end of the button.
   */
  endIcon?: ReactElement;

  /**
   * Color of the button.
   */
  color?: string;

  /**
   * Custom styles for the button.
   */
  sx?: SxProps<Theme>;

  /**
   * Indicates whether auto-stretch of the button is disabled.
   */
  disableAutoStretch?: boolean;

  /**
   * The relationship between the current document and the linked document.
   */
  rel?: string | undefined;

  /**
   * The URL of the linked document when the button is used as an anchor element.
   */
  href?: string;

  /**
   * The browsing context for the linked document (e.g., '_blank' to open in a new tab).
   */
  target?: string;

  /**
   * Minimum height of the button, in pixels.
   * Useful for ensuring consistent sizing across different layouts or devices.
   */
  minHeight?: number;

  /**
   * Accessible label for screen readers.
   *
   * Use when the button has no visible text (e.g., icon-only buttons).
   */
  ariaLabel?: string;
};
