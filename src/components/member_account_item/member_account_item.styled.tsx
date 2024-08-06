import { Box, styled } from '@mui/material';

/**
 * Styled wrapper for the member account item box.
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
  borderRadius: 'var(--radius-l)',
  border: '1px solid var(--accent-300)',
  backgroundColor: 'var(--white)',
  padding: '8px 16px 8px 16px',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '8px',
});
