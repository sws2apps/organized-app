import { styled } from '@mui/system';
import { Input, Box } from '@mui/material';

export const StyledBox = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  flex: '1 0 0',
  alignSelf: 'stretch',
  borderRadius: 'var(--radius-none, 0px)',
});

export const StyledInput = styled(Input)({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  flex: '1 0 0',
  alignSelf: 'stretch',
  borderRadius: 'var(--radius-none, 0px)',
  '&::placeholder': {
    color: 'var(--grey-350)',
    fontFamily: 'Inter',
    fontSize: '16px',
    fontStyle: 'normal',
    fontWeight: '420',
    lineHeight: '20px',
  },
});
