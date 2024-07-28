import { Box } from '@mui/material';
import { styled } from '@mui/system';

export const StyledCardBox = styled(Box)({
  border: '1px solid var(--accent-300)',
  borderRadius: 'var(--radius-xl)',
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  backgroundColor: 'var(--white)',
});

export const HorizontalFlex = styled(Box)({
  display: 'flex',
  gap: '16px',
});

export const VerticalFlex = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
});
