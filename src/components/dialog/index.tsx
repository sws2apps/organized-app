import { Dialog as MUIDialog, DialogContent } from '@mui/material';
import { DialogProps } from './index.types';

/**
 * Component for rendering a custom dialog.
 * @param {Object} props - Props for the CustomDialog component.
 * @param {boolean} props.open - Whether the dialog is open.
 * @param {VoidFunction} props.onClose - Function to handle dialog close event.
 * @param {React.ReactNode} props.children - Content to be rendered inside the dialog.
 * @param {SxProps} props.sx - Custom styling for the dialog content.
 * @returns {JSX.Element} CustomDialog component.
 */
const Dialog = ({ open, onClose, children, sx, PaperProps }: DialogProps) => {
  /**
   * Handles the dialog close event.
   * @param {string} reason - The reason for closing the dialog.
   */
  const handleClose = (_, reason) => {
    if (reason === 'clickaway' || reason === 'backdropClick') {
      return;
    }

    onClose();
  };

  return (
    <MUIDialog
      fullWidth
      open={open}
      onClose={handleClose}
      sx={{
        boxSizing: 'border-box',
        '.MuiPaper-root': {
          margin: { mobile: '16px', tablet: '24px', desktop: '32px' },
        },
      }}
      PaperProps={
        PaperProps || {
          className: 'pop-up-shadow',
          style: {
            maxWidth: '560px',
            borderRadius: 'var(--radius-xl)',
            backgroundColor: 'var(--white)',
          },
        }
      }
      slotProps={{
        backdrop: {
          style: {
            backgroundColor: 'var(--accent-dark-overlay)',
          },
        },
      }}
    >
      <DialogContent
        sx={{
          padding: { mobile: '16px', desktop: '32px' },
          display: 'flex',
          flexDirection: 'column',
          gap: { mobile: '16px', desktop: '24px' },
          alignItems: 'flex-start',
          ...sx,
        }}
      >
        {children}
      </DialogContent>
    </MUIDialog>
  );
};

export default Dialog;
