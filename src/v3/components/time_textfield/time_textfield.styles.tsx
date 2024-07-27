import styled from '@emotion/styled';
import { TextField } from '@mui/material';

// Define an interface for the custom props
type CustomTextFieldProps = {
  fontColor?: string;
};

// Use the interface in the styled component
export const StyledCustomTimeTextField = styled(TextField, {
  shouldForwardProp: (prop) => !['fontColor'].includes(String(prop)),
})<CustomTextFieldProps>(({ fontColor }) => ({
  '& .MuiInputBase-root': {
    border: 'none',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
  '& input[type="time"]::-webkit-clear-button': {
    display: 'none',
  },
  '& input[type="time"]::-webkit-inner-spin-button': {
    display: 'none',
  },
  '& input[type="time"]::-webkit-calendar-picker-indicator': {
    opacity: 0,
    display: 'none',
  },
  '& input[type="time"]::-moz-clear-button': {
    display: 'none',
  },
  '& input[type="time"]::-moz-inner-spin-button': {
    display: 'none',
  },

  'input[type=time]::-webkit-datetime-edit-hour-field:focus, input[type=time]::-webkit-datetime-edit-minute-field:focus, input[type=time]::-webkit-datetime-edit-second-field:focus, input[type=time]::-webkit-datetime-edit-ampm-field:focus':
    {
      backgroundColor: 'var(--accent-300)',
    },

  '& input': {
    color: fontColor || 'var(--black)',
    fontWeight: '550',
    lineHeight: '24px',
  },
  '& input[type="time"]::-moz-calendar-picker-indicator': {
    opacity: 0,
    display: 'none',
  },
  '& input[type="time"]::-ms-clear': {
    display: 'none',
  },
  '& input[type="time"]::-ms-inner-spin-button': {
    display: 'none',
  },
  '& input[type="time"]::-ms-calendar-picker-indicator': {
    opacity: 0,
    display: 'none',
  },
}));
