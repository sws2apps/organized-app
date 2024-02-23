import { styled } from '@mui/system';
import { Box, List, ListItem } from '@mui/material';

export const StyledRemindersCard = styled(Box)({
  padding: '16px',
  borderRadius: 'var(--radius-xl)',
  background: 'var(--orange-main)',
  gap: '8px',
  color: 'var(--always-white)',
});

export const StyledRemindersTitle = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  marginBottom: '18px',
});

export const StyledRemindersList = styled(List)({
  padding: '0px',
  '> *:not(:last-child)::after': {
    content: '""',
    display: 'block',
    width: '100%',
    height: '1px',
    opacity: '0.32',
    background: 'var(--always-white)',
    marginBottom: '8px',
    marginTop: '8px',
  },
});

export const StyledRemindersFooter = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  marginTop: '16px',
});

// ReminderItem

export const StyledReminderLi = styled(ListItem)({
  display: 'flex',
  padding: '0px',
  alignItems: 'flex-start',
  flexDirection: 'column',
});

export const StyledReminderBox = styled(Box)({
  display: 'flex',
  gap: '8px',
});

export const StyledPoint = styled(Box)({
  lineHeight: '112%',
});
