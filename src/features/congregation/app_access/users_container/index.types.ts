import { PropsWithChildren } from 'react';

/**
 * Represents the properties for the UsersContainer component.
 */
export type UsersContainerProps = PropsWithChildren & {
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

  gap?: string;
};
