import { FC } from 'react';
import { Box, BoxProps, styled } from '@mui/material';

export const Field: FC<BoxProps> = styled(Box)({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
});
