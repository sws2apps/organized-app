import { CSSProperties, LegacyRef, MutableRefObject } from 'react';
import { CustomClassName } from '@definition/app';

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
  className: CustomClassName | 'string';
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
  anchorClassName?: CustomClassName;
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
  tagClassNames?: { [tag: string]: CustomClassName }; // New prop
};
