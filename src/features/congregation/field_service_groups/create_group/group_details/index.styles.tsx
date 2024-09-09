import { FC } from 'react';
import { styled } from '@mui/system';
import Typography from '@components/typography';
import { TypographyTypeProps } from '@components/typography/index.types';

export const GroupHeader: FC<TypographyTypeProps> = styled(Typography)({
  position: 'sticky',
  top: '-8px',
  padding: '8px 10px',
  backgroundColor: 'var(--white)',
  color: 'var(--accent-dark)',
});

export const GroupItems = styled('ul')({
  padding: 0,
});
