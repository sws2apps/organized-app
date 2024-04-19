import { ReactNode } from 'react';

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

  /**
   * Children elements to be rendered within the card header.
   */
  children: ReactNode;
};
