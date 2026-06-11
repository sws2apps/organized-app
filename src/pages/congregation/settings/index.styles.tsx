import { styled } from '@mui/system';
import { Box } from '@mui/material';

/** Top-level page wrapper — vertical column with 16px gap. */
export const PageContainer = styled(Box)({
  display: 'flex',
  gap: '16px',
  flexDirection: 'column',
}) as unknown as typeof Box;

/** Horizontal split layout for sidebar + content on desktop/tablet. */
export const SplitLayout = styled(Box)({
  display: 'flex',
  gap: '24px',
  alignItems: 'flex-start',
}) as unknown as typeof Box;

/** Content area that fills the remaining space next to the sidebar. */
export const ContentArea = styled(Box)({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  minWidth: 0,
}) as unknown as typeof Box;

/** Center-aligned wrapper for action buttons (e.g. Delete). */
export const CenteredAction = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  marginTop: '8px',
}) as unknown as typeof Box;
