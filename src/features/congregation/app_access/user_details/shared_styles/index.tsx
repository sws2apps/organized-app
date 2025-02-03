import { Box, styled } from '@mui/material';

export const DetailsContainer = styled(Box)({
  flex: 1,
  width: '100%',
  borderRadius: 'var(--radius-xl)',
  border: '1px solid var(--accent-300)',
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
  backgroundColor: 'var(--white)',
}) as unknown as typeof Box;

export const SwitchContainer = styled(Box)({
  display: 'flex',
  gap: '16px',
  flexDirection: 'column',
}) as unknown as typeof Box;
