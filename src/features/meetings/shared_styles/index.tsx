import { styled } from '@mui/system';
import { Box } from '@mui/material';
import { styledRemoveProps } from '@utils/common';

export const DoubleFieldContainer = styled(Box, {
  shouldForwardProp: (prop) => styledRemoveProps(prop, ['laptopUp']),
})<{ laptopUp: boolean }>(({ laptopUp }) => ({
  display: 'flex',
  gap: '16px',
  flexDirection: laptopUp ? 'row' : 'column',
}));

export const PrimaryFieldContainer = styled(Box)({
  flex: 1,
});

export const SecondaryFieldContainer = styled(Box, {
  shouldForwardProp: (prop) => styledRemoveProps(prop, ['laptopUp']),
})<{ laptopUp: boolean }>(({ laptopUp }) => ({
  flex: 1,
  maxWidth: laptopUp ? '360px' : '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
}));
