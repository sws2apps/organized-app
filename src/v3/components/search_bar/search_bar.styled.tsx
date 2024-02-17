import { styled } from '@mui/system';
import { Box, Button, Input } from '@mui/material';

export const StyledBox = styled(Box)({
  display: 'flex',
  width: '728px',
  height: '48px',
  alignItems: 'center',
  flexShrink: '0',
  borderRadius: 'var(--radius-m)',
  background: 'var(--grey-100)',
  padding: '4px',
  gap: '4px',
  flex: '1 0 0',
  alignSelf: 'stretch',
});

export const StyledButton = styled(Button)({
  minWidth: '0px',
  padding: '8px',
  '&:hover': {
    color: 'var(--accent-100)',
  },
  '&:active': {
    color: 'var(--accent-300)',
  },
});

export const StyledInput = styled(Input)({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  flex: '1 0 0',
  alignSelf: 'stretch',
  borderRadius: 'var(--radius-none)',

  '& .MuiInput-input::placeholder': {
    color: 'var(--grey-350)',
    opacity: 1,
  },

  '& input': {
    color: 'var(--black)',
  },
});
