import { Box } from '@mui/material';
import { styled } from '@mui/system';
import { CardHeaderSizeType } from './index.types';

export const StyledContentBox = styled(Box)<{ color: string; size: CardHeaderSizeType }>((props) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  padding: '4px 8px',
  alignSelf: 'stretch',
  borderRadius: 'var(--radius-m)',
  background: props.size == 'small' ? `var(--${props.color}-150)` : `var(--${props.color})`,
}));
