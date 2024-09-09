import { FC } from 'react';
import { styled } from '@mui/system';
import { Box, BoxProps } from '@mui/material';

export const GroupContainer: FC<BoxProps> = styled(Box)({
  padding: '8px',
  gap: '8px',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: 'var(--white)',
  borderRadius: 'var(--radius-xl)',
});
