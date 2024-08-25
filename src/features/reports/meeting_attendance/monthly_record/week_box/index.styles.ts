import { SxProps, Theme } from '@mui/material';

export const TextFieldStyles: SxProps<Theme> = {
  '.MuiInputBase-input': {
    textAlign: 'center',
    padding: '0! important',
    paddingLeft: '5px !important',
  },
  '& input': {
    padding: '0! important',
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
