import { ChangeEvent, ReactNode } from 'react';
import { CustomClassName } from '@definition/app';
import { SxProps } from '@mui/material';

/**
 * Props type for the Checkbox component.
 */
export type CheckboxPropsType = {
  /**
   * Whether the checkbox is checked.
   */
  checked?: boolean;

  /**
   * Whether the checkbox is in an indeterminate state.
   */
  indeterminate?: boolean;

  /**
   * Whether the checkbox is disabled.
   */
  disabled?: boolean;

  /**
   * Function triggered when the checkbox state changes.
   * @param {ChangeEvent<HTMLInputElement>} event - The event object.
   * @param {boolean} checked - The new checked state of the checkbox.
   */
  onChange?: (event: ChangeEvent<HTMLInputElement>, checked: boolean) => void;

  /**
   * Label for the checkbox.
   */
  label?: string | ReactNode;

  /**
   * Additional description for the label.
   */
  labelDescription?: string;

  /**
   * Whether to display a border around the checkbox.
   */
  isBorder?: boolean;

  /**
   * Custom class name for the checkbox.
   */
  className?: CustomClassName;

  /**
   * Custom styling for the checkbox.
   */
  sx?: SxProps;

  readOnly?: boolean;

  stopPropagation?: boolean;
};
