import { FC } from 'react';
import { Box, BoxProps, styled } from '@mui/material';

export const FieldContainer: FC<BoxProps> = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  borderRadius: 'var(--radius-xl)',
  border: '1px solid var(--accent-300)',
  padding: '16px',
  flexDirection: 'column',
});

export const Field: FC<BoxProps> = styled(Box)({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
});
