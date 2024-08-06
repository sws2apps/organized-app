import styled from '@emotion/styled';
import { Box } from '@mui/material';

export const StyledContainerForDetails = styled(Box)({
  borderRadius: 'var(--radius-xl)',
  border: '1px solid var(--accent-300)',
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
  backgroundColor: 'var(--white)',
});

export const StyledCheckboxContainer = styled(Box)({
  display: 'flex',
  gap: '8px',
  alignItems: 'center',
});

export const StyledBoxForSwitches = styled(Box)({
  display: 'flex',
  gap: '8px',
  flexDirection: 'column',
});
