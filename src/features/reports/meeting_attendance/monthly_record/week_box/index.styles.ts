import { SxProps, Theme } from '@mui/material';

export const TextFieldStyles: SxProps<Theme> = {
  '.MuiInputBase-root': {
    padding: '0! important',
  },
  '.MuiInputBase-input': {
    textAlign: 'center',
  },
  '& input': {
    padding: '10.5px 2px',
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
