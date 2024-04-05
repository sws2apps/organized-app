import * as CSS from 'csstype';

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
};

/**
 * Props for CustomDropdownMenu component.
 */
export type CustomDropdownMenuProps = {
  /**
   * Variant of the dropdown. Either 'studies' or 'schools'.
   */
  variant?: 'studies' | 'schools';
  /**
   * Width of the dropdown menu.
   */
  width?: string;
  /**
   * Boolean indicating whether the dropdown menu is open.
   */
  open: boolean;
  /**
   * Callback function triggered when a value is selected.
   * @param value - The selected value.
   */
  callback?: (value) => void;
  /**
   * Function triggered when the edit button for an item is clicked.
   * @param index - Index of the item being edited.
   * @param item - The item being edited.
   */
  editItemButtonClick?: (index: number, item: string) => void;
  /**
   * The anchor element to which the dropdown menu is attached.
   */
  anchorElement: HTMLElement;
  /**
   * The z-index of the dropdown menu.
   */
  zIndex?: CSS.Property.ZIndex | string;

  /**
   * An array of items to be displayed in the dropdown menu. Only used for 'studies' variant.
   */
  items?: string[];
};
