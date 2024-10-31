import { FC } from 'react';
import { styled } from '@mui/material/styles';
import { Box, BoxProps } from '@mui/material';

export const SlideItem: FC<BoxProps> = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  height: '100%',
  gap: '24px',
  padding: '0 24px',
  userSelect: 'none',
  cursor: 'grabbing',
});
