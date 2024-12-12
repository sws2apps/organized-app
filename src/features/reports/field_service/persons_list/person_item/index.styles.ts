import { styled } from '@mui/system';
import { Box } from '@mui/material';

export const UserCard = styled(Box)({
  border: '1px solid var(--accent-300)',
  borderRadius: 'var(--radius-l)',
  display: 'flex',
  gap: '16px',
  backgroundColor: 'var(--white)',
  cursor: 'pointer',
  padding: '24px',
  justifyContent: 'space-between',
  alignItems: 'center',
  '&:hover': {
    background: 'var(--accent-100)',
    border: '1px solid var(--accent-350)',
    boxShadow: 'var(--hover-shadow)',
  },
}) as unknown as typeof Box;
