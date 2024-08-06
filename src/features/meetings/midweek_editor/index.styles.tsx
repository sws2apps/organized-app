import { styled } from '@mui/system';
import { Box } from '@mui/material';

export const RowContainer = styled(Box, {
  shouldForwardProp: (prop) => !['desktopUp'].includes(String(prop)),
})<{ desktopUp: boolean }>(({ desktopUp }) => ({
  display: 'flex',
  flexDirection: desktopUp ? 'row' : 'column',
  justifyContent: 'space-between',
  gap: '16px',
}));

export const PersonSelectorContainer = styled(Box, {
  shouldForwardProp: (prop) => !['desktopUp'].includes(String(prop)),
})<{ desktopUp: boolean }>(({ desktopUp }) => ({
  display: 'flex',
  flexDirection: 'column',
  minWidth: desktopUp ? '350px' : '100%',
  gap: '24px',
}));

export const ClassAssignmentContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
});

export const PersonDoubleContainer = styled(Box, {
  shouldForwardProp: (prop) =>
    !['desktopUp', 'laptopUp'].includes(String(prop)),
})<{ desktopUp: boolean; laptopUp: boolean }>(({ desktopUp, laptopUp }) => ({
  display: 'flex',
  flexDirection: desktopUp ? 'column' : laptopUp ? 'row' : 'column',
  gap: '16px',
}));
