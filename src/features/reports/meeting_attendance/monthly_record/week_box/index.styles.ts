import { SxProps, Theme } from '@mui/material';

export const TextFieldStyles: SxProps<Theme> = {
  '.MuiInputBase-input': { textAlign: 'center' },
  '& input': {
    MozAppearance: 'textfield',
  },
  '& input::-webkit-outer-spin-button': {
    WebkitAppearance: 'none',
    margin: 0,
  },
  '& input::-webkit-inner-spin-button': {
    WebkitAppearance: 'none',
    margin: 0,
  },
};
