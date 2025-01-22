import { Box, List, styled } from '@mui/material';

export const StyledRemindersCard = styled(Box)({
  padding: '16px',
  borderRadius: 'var(--radius-xl)',
  background: 'var(--orange-main)',
  gap: '8px',
  color: 'var(--always-white)',
  position: 'fixed',
  bottom: '15px',
  right: '15px',
}) as unknown as typeof Box;

export const StyledRemindersTitle = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '8px',
  marginBottom: '18px',
}) as unknown as typeof Box;

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
}) as unknown as typeof List;

export const StyledRemindersFooter = styled(Box)({
  marginTop: '16px',
}) as unknown as typeof Box;
