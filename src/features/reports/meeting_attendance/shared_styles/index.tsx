import { styled } from '@mui/system';
import { Box } from '@mui/material';

export const CardContainer = styled(Box)({
  backgroundColor: 'var(--white)',
  border: '1px solid var(--accent-300)',
  borderRadius: 'var(--radius-xl)',
  padding: '16px',
  display: 'flex',
  gap: '24px',
  flexDirection: 'column',
});
