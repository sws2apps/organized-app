import { FC } from 'react';
import { Box, BoxProps } from '@mui/material';
import { useBreakpoints } from '@hooks/index';

const SwitcherContainer: FC<BoxProps> = (props) => {
  const { laptopUp } = useBreakpoints();

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        flexDirection: laptopUp ? 'row' : 'row-reverse',
        justifyContent: laptopUp ? 'flex-start' : 'space-between',
        flexGrow: 1,
      }}
      {...props}
    />
  );
};

export default SwitcherContainer;
