import { styled } from '@mui/system';
import { StyledTextFieldProps } from './index.types';
import TextField from '@mui/material/TextField';

const StyledTextField = styled(TextField, {
  shouldForwardProp: (prop) => !['varHeight'].includes(String(prop)),
})<StyledTextFieldProps>((props) => ({
  '.MuiInputBase-root': {
    height: `${props.height}px`,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  '& .MuiSelect-icon': {
    color: 'var(--black) !important', // change the color of the dropdown icon
  },
  '.MuiInputBase-input': {
    paddingTop: `calc(14.5px - ${props.varHeight}px)`,
    paddingBottom: `calc(14.5px - ${props.varHeight}px)`,
    flex: '1 0 0',
    '&.MuiSelect-select': {
      minHeight: 'unset',
    },
    '.MuiTypography-root': {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    '&.Mui-disabled': {
      WebkitTextFillColor: 'var(--black)',
    },
  },
  '.MuiOutlinedInput-root': {
    borderRadius: 'var(--radius-l)',
    color: 'var(--black)',
    '& svg': {
      color: 'var(--accent-350)',
      boxSizing: 'content-box',
    },
    '&.Mui-focused svg': {
      color: 'var(--black)',
    },
    '& fieldset': {
      border: '1px solid var(--accent-350)',
    },
    '&:hover fieldset': {
      border: '1px solid var(--accent-main)',
    },
    '&.Mui-focused fieldset': {
      border: '1px solid var(--accent-main)',
    },
  },
  '.MuiInputLabel-root': {
    color: 'var(--accent-350)',
    '&.Mui-focused': {
      color: 'var(--accent-main)',
    },
    '&.Mui-disabled': {
      color: 'var(--accent-350)',
    },
  },
  '.MuiFormLabel-root[data-shrink="false"]': {
    top: `-${props.varHeight}px`,
  },
}));

export default StyledTextField;
