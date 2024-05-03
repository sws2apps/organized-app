import { FC } from 'react';
import { Box, BoxProps } from '@mui/material';
import { useBreakpoints } from '@hooks/index';

/**
 * SwitcherContainer component.
 * This component provides a container with flexible layout based on breakpoints.
 * @param props - The BoxProps for styling and additional configurations.
 */
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
