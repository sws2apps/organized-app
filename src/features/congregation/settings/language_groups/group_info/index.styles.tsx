import { styled } from '@mui/system';
import { Box } from '@mui/material';

export const DialogSectionsContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '32px',
  margin: '8px 0',
}) as unknown as typeof Box;

export const DialogSection = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
}) as unknown as typeof Box;

export const DeleteRow = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  marginTop: '8px',
}) as unknown as typeof Box;
