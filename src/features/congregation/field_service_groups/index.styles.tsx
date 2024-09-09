import { FC } from 'react';
import { styled } from '@mui/system';
import { Masonry, MasonryProps } from '@mui/lab';

export const GroupsContainer: FC<MasonryProps> = styled(Masonry)(
  ({ theme }) => ({
    [theme.breakpoints.down('tablet688')]: {
      '&>*': {
        width: '100%',
      },
    },
    [theme.breakpoints.up('tablet688')]: {
      '&>*': {
        width: 'calc(50%)',
        minWidth: 'unset',
      },
    },
    [theme.breakpoints.up('desktop')]: {
      '&>*': {
        width: 'calc(33%)',
        minWidth: 'unset',
      },
    },
  })
);
