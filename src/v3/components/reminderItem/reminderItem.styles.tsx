import { styled } from '@mui/system';
import { Box, ListItem } from '@mui/material';

export const ReminderLi = styled(ListItem)({
  display: 'flex',
  padding: '0px',
  alignItems: 'flex-start',
  flexDirection: 'column',
});

export const ReminderBox = styled(Box)({
  display: 'flex',
  gap: '8px',
});

export const StyledPoint = styled(Box)({
  lineHeight: '112%',
});
