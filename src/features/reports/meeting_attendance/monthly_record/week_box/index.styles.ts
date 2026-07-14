import { SxProps, Theme } from '@mui/material';

export const TextFieldStyles: SxProps<Theme> = {
  '.MuiInputBase-root': {
    padding: '0! important',
  },
  // Left-align the entered value so it lines up under the field's label
  // (e.g. the date / "Present" / "Online" placeholder), matching the rest of
  // the form. Any browser spin arrows sit to the right of the value.
  '.MuiInputBase-input': {
    textAlign: 'left',
  },
  '& input': {
    padding: '10.5px 14px',
  },
  '& input::-webkit-outer-spin-button': {
    WebkitAppearance: 'none',
    margin: 0,
  },
  '& input::-webkit-inner-spin-button': {
    WebkitAppearance: 'none',
    margin: 0,
  },
  '.MuiInputAdornment-root': {
    marginLeft: '0px !important',
  },
};
