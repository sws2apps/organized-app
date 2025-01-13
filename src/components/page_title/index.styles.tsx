import { FC } from 'react';
import { Box, BoxProps } from '@mui/material';
import { styled } from '@mui/system';
import { useBreakpoints } from '@hooks/index';

export const PageTitleBlock = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  cursor: 'default',
});

export const PageTitleArrowBox = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
});

export const PageTitleContainer: FC<BoxProps> = (props) => {
  const { laptopUp } = useBreakpoints();

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: laptopUp ? 'center' : 'flex-start',
        flexWrap: 'wrap',
        gap: '24px',
        flexDirection: laptopUp ? 'row' : 'column',
      }}
      {...props}
    />
  );
};

export const PageTitleButtonsContainer: FC<BoxProps> = (props) => {
  const { laptopUp } = useBreakpoints();

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        flexDirection: laptopUp ? 'row' : 'column-reverse',
        width: laptopUp ? 'fit-content' : '100%',
        '& .MuiButton-root': {
          width: laptopUp ? 'auto' : '100%',
        },
      }}
      {...props}
    />
  );
};
