import styled from '@emotion/styled';
import { Box } from '@mui/material';

/**
 * Styled container for the modal window.
 */
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

/**
 * Styled container for a row within the modal window.
 */
export const StyledRowContainer = styled(Box)({
  borderRadius: 'var(--radius-xl)',
  border: '1px solid var(--accent-300)',
  padding: '16px',
  display: 'flex',
  gap: '16px',
  width: '100%',
});

/**
 * Styled container with flex layout and centered alignment.
 */
export const StyledBox = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});
