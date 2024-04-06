import styled from '@emotion/styled';
import { Box } from '@mui/material';

export const StyledModalWindowContainer = styled(Box)({
  maxWidth: '500px',
  backgroundColor: 'var(--white)',
  borderRadius: 'var(--radius-xl)',
  border: '1px solid var(--accent-200)',
  padding: '24px',
  display: 'flex',
  gap: '16px',

  flexDirection: 'column',
  alignItems: 'flex-start',
});

export const StyledRowContainer = styled(Box)({
  borderRadius: 'var(--radius-xl)',
  border: '1px solid var(--accent-300)',
  padding: '16px',
  display: 'flex',
  gap: '16px',
  width: '100%',
});

export const StyledBox = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});
