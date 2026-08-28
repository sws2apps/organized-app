import { FC } from 'react';
import { Box } from '@mui/material';
import { useBreakpoints } from '@hooks/index';
import { DialogActionsProps } from './index.types';

const DialogActions: FC<DialogActionsProps> = ({ children, sx }) => {
  const { tabletUp } = useBreakpoints();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: tabletUp ? 'row' : 'column-reverse',
        gap: '8px',
        width: '100%',
        ...(tabletUp && {
          '& > :last-child': { marginLeft: 'auto' },
          '&& > *': { minWidth: '96px' },
        }),
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};

export default DialogActions;
