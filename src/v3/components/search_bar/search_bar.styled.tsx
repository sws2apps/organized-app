import { styled } from '@mui/system';
import { Box, Input, Button } from '@mui/material';

export const StyledBox = styled(Box)({
  display: 'flex',
  width: '728px',
  height: '48px',
  alignItems: 'center',
  flexShrink: '0',
  borderRadius: 'var(--radius-m)',
  background: 'var(--grey-100)',
  color: 'var(--grey-350)',
  padding: '4px',
  gap: '4px',
  flex: '1 0 0',
  alignSelf: 'stretch',
});

export const StyledButton = styled(Button)({
  minWidth: '0px',
  padding: '8px',
});

export const StyledInput = styled(Input)({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  flex: '1 0 0',
  alignSelf: 'stretch',
  borderRadius: 'var(--radius-none)',
  fontFamily: 'Inter',
  fontSize: '16px',
  fontStyle: 'normal',
  fontWeight: '420',
  lineHeight: '20px',

  '&::placeholder': {
    color: 'var(--grey-350)',
  },

  '&::input': {
    color: 'var(--black)',
  },
});
