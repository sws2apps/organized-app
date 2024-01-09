import { styled } from '@mui/system';
import { Box, List } from '@mui/material';

export const RemindersCard = styled(Box)({
  padding: '16px',
  width: '512px',
  borderRadius: 'var(--radius-xl)',
  background: 'var(--orange-main)',
  gap: '8px',
  color: 'var(--always-white)',
});

export const RemindersTitle = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  marginBottom: '18px',
});

export const RemindersList = styled(List)({
  padding: '0px',
  '> *:not(:last-child)::after': {
    content: '""',
    display: 'block',
    width: '480px',
    height: '1px',
    opacity: '0.32',
    background: 'var(--always-white)',
    marginBottom: '8px',
    marginTop: '8px',
  },
});

export const RemindersFooter = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  marginTop: '16px',
});
