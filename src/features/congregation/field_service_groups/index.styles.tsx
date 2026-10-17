import { FC } from 'react';
import { styled } from '@mui/material/styles';
import { Masonry, MasonryProps } from '@mui/lab';

export const GroupsContainer: FC<MasonryProps> = styled(Masonry)({
  margin: 'unset',
  marginLeft: '-8px',
  width: 'calc(100% + 16px)',
});
