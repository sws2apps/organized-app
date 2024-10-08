import { FC } from 'react';
import { styled } from '@mui/system';
import { Box, BoxProps } from '@mui/material';
import { ButtonPropsType } from '@components/button/index.types';
import Button from '@components/button';

export const LabelContainer: FC<BoxProps> = styled(Box)(({ theme }) => ({
  borderRadius: 'var(--radius-s)',
  padding: '8px 32px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  width: '100%',
  [theme.containerQueries.up(350)]: {
    width: '50%',
  },
  userSelect: 'none',
}));

export const ActionButton: FC<ButtonPropsType> = styled(Button)({
  minHeight: '40px',
  height: '40px',
  flex: 1,
  width: '50%',
});
