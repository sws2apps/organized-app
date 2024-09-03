import { FC } from 'react';
import { Box, BoxProps, styled } from '@mui/material';

export const UserCard: FC<BoxProps> = styled(Box)({
  border: '1px solid var(--accent-300)',
  borderRadius: 'var(--radius-l)',
  display: 'flex',
  gap: '16px',
  backgroundColor: 'var(--white)',
  cursor: 'pointer',
  padding: '24px',
  justifyContent: 'space-between',
  alignItems: 'center',
});
