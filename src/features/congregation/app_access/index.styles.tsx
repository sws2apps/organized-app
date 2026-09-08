import { styled } from '@mui/system';
import { Box } from '@mui/material';

/** Flex-column container for a list of UserAccountItem cards. */
export const UserListContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
}) as unknown as typeof Box;

/** Horizontal row for the empty-state message (icon + text). */
export const EmptyStateRow = styled(Box)({
  display: 'flex',
  gap: '8px',
  alignItems: 'center',
  marginTop: '8px',
}) as unknown as typeof Box;

/** Flex column with 16px gap — generic vertical stack layout. */
export const ColumnStack = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
}) as unknown as typeof Box;

/** Equal-flex panel — fills available space in a row/column layout. */
export const FlexPanel = styled(Box)({
  flex: 1,
}) as unknown as typeof Box;
