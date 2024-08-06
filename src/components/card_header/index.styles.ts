import { Box } from '@mui/material';
import { styled } from '@mui/system';
import { CardHeaderSizeType } from './index.types';

export const StyledContentBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'color' && prop !== 'size',
})<{ color: string; size: CardHeaderSizeType }>(({ color, size }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  padding: '4px 8px',
  alignSelf: 'stretch',
  borderRadius: 'var(--radius-m)',
  background: size === 'small' ? `var(--${color}-150)` : `var(--${color})`,
}));
