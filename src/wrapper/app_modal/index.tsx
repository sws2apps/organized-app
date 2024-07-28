import { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import useModal from './useModal';
import AppLoading from '@components/loading';

const AppModalWrapper = ({ children }: { children?: ReactNode }) => {
  const { handleClose, open } = useModal();

  return (
    <>
      <Box>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-close-title"
          aria-describedby="alert-dialog-description"
          PaperProps={{
            sx: {
              color: 'unset',
              backgroundColor: 'unset',
              boxShadow: 'none',
              borderRadius: 'var(--radius-xxl)',
            },
            className: 'pop-up-shadow',
          }}
        >
          <AppLoading />
        </Dialog>
      </Box>
      {children}
    </>
  );
};

export default AppModalWrapper;
