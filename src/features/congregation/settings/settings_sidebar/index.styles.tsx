import { styled } from '@mui/system';
import { Box } from '@mui/material';

export const SidebarContainer = styled(Box)({
  flexShrink: 0,
  backgroundColor: 'var(--white)',
  border: '1px solid var(--accent-300)',
  borderRadius: 'var(--radius-xl)',
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  alignSelf: 'flex-start',
  width: '100%',
  boxSizing: 'border-box',
}) as unknown as typeof Box;

export const TabList = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
}) as unknown as typeof Box;
