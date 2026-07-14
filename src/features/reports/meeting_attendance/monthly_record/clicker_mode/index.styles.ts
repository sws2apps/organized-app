import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

// Full-height column: header, flexible body, pinned controls.
export const ClickerLayout = styled(Box)({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: 'var(--accent-100)',
}) as unknown as typeof Box;

// Centered body holding the switcher, count, and controls.
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
