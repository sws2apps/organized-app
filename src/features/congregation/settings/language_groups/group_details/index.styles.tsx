import { FC } from 'react';
import { styled } from '@mui/system';
import { Box, BoxProps } from '@mui/material';

type DetailsGridOwnProps = {
  $layout?: 'row' | 'popup';
};

export const DetailsGrid = styled(Box, {
  shouldForwardProp: (prop) => prop !== '$layout',
})<DetailsGridOwnProps>(({ theme, $layout = 'row' }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: '16px',
  [theme.breakpoints.up('desktop')]: {
    gridTemplateColumns:
      $layout === 'popup' ? '1fr 1fr' : 'repeat(3, 1fr)',
  },
})) as unknown as FC<BoxProps & DetailsGridOwnProps>;
