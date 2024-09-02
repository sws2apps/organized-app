import { FC } from 'react';
import { Box, BoxProps, styled } from '@mui/material';

const Card: FC<BoxProps> = styled(Box)({
  border: '1px solid var(--accent-300)',
  borderRadius: 'var(--radius-xl)',
  backgroundColor: 'var(--white)',
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
});

export default Card;
