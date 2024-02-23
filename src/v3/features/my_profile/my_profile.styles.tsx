import { styled } from '@mui/system';
import { Box } from '@mui/material';

export const ProfileItemContainer = styled(Box)({
  borderRadius: 'var(--radius-xl)',
  border: '1px solid var(--accent-300)',
  padding: '16px',
  display: 'flex',
  gap: '16px',
  flexDirection: 'column',
});
