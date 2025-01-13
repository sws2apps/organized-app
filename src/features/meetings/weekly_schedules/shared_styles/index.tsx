import { styled } from '@mui/system';
import { Box } from '@mui/material';
import { styledRemoveProps } from '@utils/common';

export const DoubleFieldContainer = styled(Box, {
  shouldForwardProp: (prop) => styledRemoveProps(prop, ['laptopUp']),
})<{ laptopUp: boolean }>(({ laptopUp }) => ({
  display: 'flex',
  gap: '8px',
  flexDirection: laptopUp ? 'row' : 'column',
})) as unknown as typeof Box;

export const PrimaryFieldContainer = styled(Box)({
  flex: 1,
  display: 'flex',
  gap: '8px',
  padding: '4px 2px',
}) as unknown as typeof Box;

export const SecondaryFieldContainer = styled(Box, {
  shouldForwardProp: (prop) => styledRemoveProps(prop, ['laptopUp']),
})<{ laptopUp: boolean }>(({ laptopUp }) => ({
  flex: 1,
  maxWidth: laptopUp ? '320px' : '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  alignSelf: 'self-start',
})) as unknown as typeof Box;
