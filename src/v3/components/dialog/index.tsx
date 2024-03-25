import { Dialog, DialogContent } from '@mui/material';

const CustomDialog = ({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: VoidFunction;
  children: React.ReactNode;
}) => {
  const handleClose = (event, reason) => {
    if (reason === 'clickaway' || reason === 'backdropClick') {
      return;
    }

    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      sx={{
        '.MuiPaper-root': {
          margin: { mobile: '16px', tablet: '24px', desktop: '32px' },
        },
      }}
      PaperProps={{
        className: 'pop-up-shadow',
        style: {
          maxWidth: '560px',
          borderRadius: 'var(--radius-xl)',
          backgroundColor: 'var(--white)',
        },
      }}
      slotProps={{
        backdrop: {
          style: {
            backgroundColor: 'var(--accent-dark-overlay)',
          },
        },
      }}
    >
      <DialogContent
        sx={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'flex-start' }}
      >
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default CustomDialog;
