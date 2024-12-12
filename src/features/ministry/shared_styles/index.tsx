import { styled } from '@mui/system';
import { Box } from '@mui/material';

export const CardContainer = styled(Box)({
  border: '1px solid var(--accent-300)',
  borderRadius: 'var(--radius-xl)',
  backgroundColor: 'var(--white)',
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
}) as unknown as typeof Box;
