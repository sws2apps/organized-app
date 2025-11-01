import { Box } from '@mui/material';
import { BottomMenuProps } from './index.types';

const BottomMenu = (props: BottomMenuProps) => {
  return (
    <Box
      sx={{
        position: 'fixed',
        backgroundColor: 'var(--accent-150)',
        border: '1px solid var(--accent-200)',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        bottom: '16px',
        width: 'fit-content',
        left: '50%',
        transform: 'translate(-50%)',
        zIndex: (theme) => theme.zIndex.drawer + 1,
        boxShadow: 'var(--message-glow)',
        padding: '6px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: '4px',
      }}
    >
      {props.buttons}
    </Box>
  );
};

export default BottomMenu;
