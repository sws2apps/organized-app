import { styled } from '@mui/system';
import { Box } from '@mui/material';
import Typography from '@components/typography';

export const GroupsContainer = styled(Box)({
  borderRadius: 'var(--radius-xl)',
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  boxSizing: 'border-box',
  width: '100%',
}) as unknown as typeof Box;

export const GroupsHeader = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
}) as unknown as typeof Box;

export const TitleText = styled(Typography)({
  flexGrow: 1,
  marginInlineEnd: '16px',
}) as unknown as typeof Typography;

/** Column list for language group items with dividers. */
export const GroupItemsList = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
}) as unknown as typeof Box;

/** Horizontal row for the empty-state message (icon + text). */
export const EmptyStateRow = styled(Box)({
  display: 'flex',
  gap: '8px',
  alignItems: 'center',
}) as unknown as typeof Box;
