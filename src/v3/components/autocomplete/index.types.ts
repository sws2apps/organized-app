import { ReactElement, ReactNode } from 'react';
import { AutocompleteProps, AutocompleteRenderInputParams } from '@mui/material';

/**
 * Props type for the Autocomplete component.
 */
export type AutocompletePropsType<T> = Omit<
  AutocompleteProps<T, boolean | undefined, boolean | undefined, boolean | undefined>,
  'renderInput'
> & {
  /**
   * Icon displayed at the start of the Autocomplete component.
   */
  startIcon?: ReactElement;

  /**
   * Icon displayed at the end of the Autocomplete component.
   */
  endIcon?: ReactElement;

  /**
   * Label text for the Autocomplete component.
   */
  label: string;

  /**
   * Function to render the input of the Autocomplete component.
   * @param {AutocompleteRenderInputParams} params - Parameters for rendering the input.
   * @returns {ReactNode} JSX.Element for the input.
   */
  renderInput?: (params: AutocompleteRenderInputParams) => ReactNode;
};
