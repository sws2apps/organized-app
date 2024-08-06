import { styled } from '@mui/system';
import { Box } from '@mui/material';

export const ProfileItemContainer = styled(Box)({
  borderRadius: 'var(--radius-xl)',
  border: '1px solid var(--accent-300)',
  padding: '16px',
  display: 'flex',
  gap: '16px',
  flexDirection: 'column',
  backgroundColor: 'var(--white)',
});

export const SettingWithBorderContainer = styled(Box)({
  marginTop: '8px',
  display: 'flex',
  gap: '16px',
  flexDirection: 'column',
  '& > *:not(:last-child)': {
    borderBottom: '1px solid var(--accent-200)',
    paddingBottom: '16px',
  },
});
