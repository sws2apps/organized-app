import { styled } from '@mui/system';
import TextField from '@components/textfield';

export const TextFieldStandard = styled(TextField)({
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
}) as unknown as typeof TextField;
