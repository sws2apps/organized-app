import { Box, ListItem, styled } from '@mui/material';

export const StyledReminderLi = styled(ListItem)({
  display: 'flex',
  padding: '0px',
  alignItems: 'flex-start',
  flexDirection: 'column',
});

export const StyledReminderBox = styled(Box)({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '8px',
  padding: '8px',

  borderRadius: 'var(--radius-m)',

  '&:hover': {
    backgroundColor: 'var(--white-semi-s)',
  },
});

export const StyledReminderLinkIndicatorBox = styled(Box)({});
