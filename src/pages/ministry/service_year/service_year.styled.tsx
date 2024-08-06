import styled from '@emotion/styled';
import { Box } from '@mui/material';

export const StyledInfoCard = styled(Box)({
  border: '1px solid var(--accent-300)',
  borderRadius: 'var(--radius-xl)',
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  backgroundColor: 'var(--white)',
});

export const StyledCardContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  padding: '8px 0px 8px 0px',
});

export const StyledKeyValueBox = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});
