import { Box, styled } from '@mui/material';

/**
 * Styled wrapper for the user account item box.
 *
 * @returns {JSX.Element} - JSX element representing the styled wrapper.
 *
 * @example
 * // Use the styled box wrapper in your component:
 * <StyledBoxWrapper>
 *   <YourContent />
 * </StyledBoxWrapper>
 */
export const StyledBoxWrapper = styled(Box)({
  width: '100%',
  borderRadius: 'var(--radius-l)',
  border: '1px solid var(--accent-300)',
  backgroundColor: 'var(--white)',
  padding: '8px 16px 8px 16px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '8px',
  cursor: 'pointer',
  '&:hover': {
    border: '1px solid var(--accent-dark)',
    color: 'var(--accent-dark)',
  },
});
