import { styled, Theme } from '@mui/material/styles';
import { Box } from '@mui/material';

export const SlideItem = styled(Box)(
  ({ theme }: { theme: Theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
    gap: '24px',
    cursor: 'grabbing',
    [theme.breakpoints.up('mobile')]: {
      padding: '0px 24px',
    },
    [theme.breakpoints.up('laptop')]: {
      padding: '0px 48px',
    },
  })
);
