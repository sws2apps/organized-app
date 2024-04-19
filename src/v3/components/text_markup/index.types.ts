import { CSSProperties, LegacyRef, MutableRefObject } from 'react';

/**
 * Props for the TextMarkupType component.
 */
export type TextMarkupTypeProps = {
  /**
   * The content of the text.
   */
  content: string;
  /**
   * The class name of the text.
   */
  className: string;
  /**
   * The color of the text.
   */
  color?: string;
  /**
   * The style object for additional styling.
   */
  style?: CSSProperties;
  /**
   * The class name for anchor elements within the text.
   */
  anchorClassName?:
    | 'huge-numbers'
    | 'big-numbers'
    | 'label-small-medium'
    | 'label-small-regular'
    | 'h1'
    | 'h2'
    | 'h2-caps'
    | 'h3'
    | 'h4'
    | 'button-caps'
    | 'body-regular'
    | 'body-small-semibold'
    | 'body-small-regular';
  /**
   * The color of anchor elements within the text.
   */
  anchorColor?: string;
  /**
   * Ref for the anchor element within the text.
   */
  anchorRef?: MutableRefObject<HTMLElement> | LegacyRef<HTMLAnchorElement>;
  /**
   * Additional style for anchor elements within the text.
   */
  anchorStyle?: CSSProperties;
  /**
   * Callback function for when an anchor element within the text is clicked.
   */
  anchorClick?: () => void;
};
