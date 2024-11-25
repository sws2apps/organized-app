import { Box, ListItem, styled } from '@mui/material';

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
