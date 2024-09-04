import { styled } from '@mui/system';
import { Box } from '@mui/material';

export const FieldContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  borderRadius: 'var(--radius-xl)',
  border: '1px solid var(--accent-300)',
  padding: '16px',
  flexDirection: 'column',
});

export const Field = styled(Box)({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
});
