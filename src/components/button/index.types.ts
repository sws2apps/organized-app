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
   * Accessible label applied as `aria-label` on the rendered button. Useful for
   * icon-only or text-truncated buttons where the visible content is not a
   * sufficient accessible name.
   */
  ariaLabel?: string;
};
