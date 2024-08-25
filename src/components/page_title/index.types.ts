import { ReactElement } from 'react';
/**
 * Props for the PageTitle component.
 */
export type PageTitleProps = {
  /**
   * The title of the page.
   */
  title: string;

  /**
   * Optional buttons to be displayed in the page title.
   */
  buttons?: ReactElement;

  quickAction?: VoidFunction;
};
