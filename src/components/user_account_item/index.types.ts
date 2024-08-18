/**
 * Props for the UserAccountItem component.
 */
export type UserAccountItemProps = {
  /**
   * The variant of the user account item.
   * Defaults to 'user'.
   * - 'user': Regular user account.
   * - 'admin': Administrator account.
   * - 'baptized': Baptized user account.
   */
  variant?: 'user' | 'admin' | 'baptized';

  /**
   * Function to call when clicking on the arrow icon associated with the user account item.
   */
  clickOnArrow?: VoidFunction;

  /**
   * Function to call when clicking on the user account item.
   */
  clickOnUserAccountItem?: VoidFunction;

  /**
   * The name of the user.
   */
  name: string;

  /**
   * The position or role of the user (optional).
   */
  secondary?: string;
};

export type UserAccountItemTextContentType = {
  variant: 'user' | 'admin' | 'baptized';
  name: string;
  secondary: string;
  color?: string;
};

export type UserAccountItemIconType = {
  variant: 'user' | 'admin' | 'baptized';
  color: string;
};
