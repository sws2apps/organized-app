import { AutocompleteProps } from '@mui/material';

/**
 * Props type for the Autocomplete component.
 */
export type AutocompleteMutilePropsType<T> = Omit<
  AutocompleteProps<
    T,
    boolean | undefined,
    boolean | undefined,
    boolean | undefined
  >,
  'renderInput'
> & {
  /**
   * Label text for the Autocomplete component.
   */
  label?: string;

  /**
   * Placeholder text for the Autocomplete component.
   */
  placeholder?: string;
  height?: number;
};
