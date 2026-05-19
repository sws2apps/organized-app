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
  marginRight: '16px',
}) as unknown as typeof Typography;
