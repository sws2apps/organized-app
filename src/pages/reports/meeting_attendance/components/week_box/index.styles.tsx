import { Box, Typography } from '@mui/material';
import TextField from '@components/textfield';
import { styled } from '@mui/system';

export const StyledTextField = styled(TextField)({
  '.MuiInputBase-input': { textAlign: 'center' },
  '& input[type=number]': {
    '-moz-appearance': 'textfield',
  },
  '& input[type=number]::-webkit-outer-spin-button': {
    '-webkit-appearance': 'none',
    margin: 0,
  },
  '& input[type=number]::-webkit-inner-spin-button': {
    '-webkit-appearance': 'none',
    margin: 0,
  },
});

export const StyledTodayTypography = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'color',
})(({ color }: { color: string }) => ({
  textAlign: 'center',
  color: color,
}));

export const StyledWeekBox = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  gap: '4px',
});
