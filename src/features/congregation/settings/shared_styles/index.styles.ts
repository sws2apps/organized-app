import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

export const CardSection = styled(Box)({
  backgroundColor: 'var(--white)',
  padding: '15px',
  border: '1px solid var(--accent-300)',
  borderRadius: 'var(--radius-l)',
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
});

export const TwoColumnsRow = styled(Box)({
  display: 'flex',
  gap: '16px',
  alignItems: 'center',
  '> *': {
    flex: '1 0 0',
  },
});
