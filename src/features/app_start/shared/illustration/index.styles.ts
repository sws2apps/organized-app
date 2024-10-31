import { FC } from 'react';
import { styled, Theme } from '@mui/material/styles';
import { Box, BoxProps } from '@mui/material';

export const SlideItem: FC<BoxProps> = styled(Box)(
  ({ theme }: { theme: Theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
    gap: '24px',
    [theme.breakpoints.up('mobile')]: {
      padding: '0px 24px',
    },
    [theme.breakpoints.up('laptop')]: {
      padding: '0px 48px',
    },
  })
);
