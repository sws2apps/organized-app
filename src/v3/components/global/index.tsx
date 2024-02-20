import { styled } from '@mui/system';
import { Box, BoxProps } from '@mui/material';

type SwitcherItemProps = BoxProps & {
  laptopUp?: boolean;
};

export const SwitcherItem = styled(Box, { shouldForwardProp: (prop) => prop !== 'laptopUp' })<SwitcherItemProps>(
  ({ laptopUp }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    flexDirection: laptopUp ? 'row' : 'row-reverse',
    justifyContent: laptopUp ? 'flex-start' : 'space-between',
    flexGrow: 1,
  })
);
