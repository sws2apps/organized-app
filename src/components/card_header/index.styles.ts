import { Box } from '@mui/material';
import { styled } from '@mui/system';
import { CardHeaderSizeType } from './index.types';

/** A small header is tinted, a large one is filled with the colour itself. */
const headerBackground = (color: string, size: CardHeaderSizeType) => {
  if (size !== 'small') return `var(--${color})`;

  return color === 'red' ? 'var(--red-secondary)' : `var(--${color}-150)`;
};

export const StyledContentBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'color' && prop !== 'size',
})<{ color: string; size: CardHeaderSizeType }>(({ color, size }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  padding: '4px 8px',
  alignSelf: 'stretch',
  borderRadius: 'var(--radius-m)',
  background: headerBackground(color, size),
}));
