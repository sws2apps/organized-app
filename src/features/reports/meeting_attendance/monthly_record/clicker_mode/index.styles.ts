import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

/**
 * Full-height column filling the overlay: header, flexible body, pinned
 * controls.
 */
export const ClickerLayout = styled(Box)({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: 'var(--accent-100)',
}) as unknown as typeof Box;

/**
 * Scrollable body holding the switcher, the count, and the controls.
 */
export const ClickerBody = styled(Box)({
  flex: 1,
  minHeight: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  padding: '16px',
  maxWidth: '480px',
  width: '100%',
  margin: '0 auto',
}) as unknown as typeof Box;
