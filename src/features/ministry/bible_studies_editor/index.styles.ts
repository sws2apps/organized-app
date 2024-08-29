import { FC } from 'react';
import { styled } from '@mui/material';
import { TextFieldTypeProps } from '@components/textfield/index.types';
import TextField from '@components/textfield';

export const TextFieldBibleStudies: FC<TextFieldTypeProps> = styled(TextField)({
  '.MuiInputBase-input': {
    textAlign: 'center',
  },
  '.MuiOutlinedInput-root': {
    paddingRight: 'unset !important',
  },
  '& fieldset': {
    border: 'none !important',
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
});
