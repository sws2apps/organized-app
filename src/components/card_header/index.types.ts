import { ReactNode } from 'react';
export type CardHeaderSizeType = 'small' | 'large';

/**
 * Props type for the CardHeader component.
 */
export type CardHeaderPropsType = {
  /**
   * Class name for the card header.
   */
  className?:
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
  children?: ReactNode;
  header: string;
  size?: CardHeaderSizeType;
  color?: string;
};
