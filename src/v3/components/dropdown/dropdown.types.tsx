import { SxProps, Theme } from '@mui/material';
import * as CSS from 'csstype';
import { ReactElement, ReactNode } from 'react';

/**
 * Props for CustomDropdownContainer component.
 */
export type CustomDropdownContainerProps = {
  /**
   * Function to handle click event on the container.
   */
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  /**
   * Label for the dropdown.
   */
  label: string;

  /**
   * Reference
   */
  reference?: React.Ref<HTMLElement>;

  /**
   * Boolean flag indicating whether the dropdown is open.
   */
  open: boolean;
};

/**
 * Props for CustomDropdownMenu component.
 */
export type CustomDropdownMenuProps = {
  /**
   * Width of the dropdown menu.
   */
  width?: string;
  /**
   * Boolean indicating whether the dropdown menu is open.
   */
  open: boolean;
  /**
   * The anchor element to which the dropdown menu is attached.
   */
  anchorElement: HTMLElement;
  /**
   * The z-index of the dropdown menu.
   * Can be a number, string, or a function taking theme as an argument and returning a number.
   */
  zIndex?: CSS.Property.ZIndex | string | ((theme: Theme) => number);

  /**
   * Content inside the dropdown menu.
   */
  children?: React.ReactNode;

  /**
   * Reference
   */
  reference?: React.Ref<HTMLDivElement>;
};

/**
 * Props for CustomDropdownItem component.
 */
export type CustomDropdownItemProps = {
  /**
   * Variant of the dropdown item.
   * Options: 'studies', 'schools', 'standard', 'checkboxes', 'custom'.
   */
  variant?: 'studies' | 'schools' | 'standard' | 'checkboxes' | 'custom';

  /**
   * Indicates if the item is checked.
   */
  checked?: boolean;

  /**
   * Icon to display for the item.
   */
  icon?: ReactElement;

  /**
   * Callback function triggered when the item is selected.
   * @param value - The value associated with the selected item.
   */
  callback?: (value) => void;

  /**
   * Callback function triggered when the edit button for the item is clicked.
   * @param value - The value associated with the item.
   */
  editButtonClick?: VoidFunction;

  /**
   * Label for the dropdown item.
   */
  label?: string;

  /**
   * Description of the item (for 'schools' variant).
   */
  description?: string;

  /**
   * Additional content for the item (for 'custom' variant).
   */
  children?: ReactNode;

  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx?: SxProps<Theme>;

  /**
   * Reference
   */
  reference?: React.Ref<HTMLElement>;
};
