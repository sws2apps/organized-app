import { ReactNode } from 'react';

/**
 * Represents the properties for the UsersContainer component.
 */
export type UsersContainerProps = {
  /**
   * The title of the UsersContainer.
   * @type {string}
   * @required
   */
  title: string;

  /**
   * The description of the UsersContainer.
   * @type {string}
   * @required
   */
  description: string;

  /**
   * The children nodes to be rendered inside the UsersContainer.
   * @type {ReactNode}
   * @optional
   */
  children?: ReactNode;

  gap?: string;
};
