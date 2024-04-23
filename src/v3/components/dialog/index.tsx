import { Dialog, DialogContent, SxProps } from '@mui/material';

/**
 * Component for rendering a custom dialog.
 * @param {Object} props - Props for the CustomDialog component.
 * @param {boolean} props.open - Whether the dialog is open.
 * @param {VoidFunction} props.onClose - Function to handle dialog close event.
 * @param {React.ReactNode} props.children - Content to be rendered inside the dialog.
 * @param {SxProps} props.sx - Custom styling for the dialog content.
 * @returns {JSX.Element} CustomDialog component.
 */
const CustomDialog = ({
  open,
  onClose,
  children,
  sx,
}: {
  open: boolean;
  onClose: VoidFunction;
  children: React.ReactNode;
  sx?: SxProps;
}) => {
  /**
   * Handles the dialog close event.
   * @param {Event} event - The event object.
   * @param {string} reason - The reason for closing the dialog.
   */
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
        sx={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'flex-start', ...sx }}
      >
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default CustomDialog;
