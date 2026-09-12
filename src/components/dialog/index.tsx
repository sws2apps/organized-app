import { Dialog as MUIDialog, DialogContent } from '@mui/material';
import { DialogProps } from './index.types';

/**
 * Component for rendering a custom dialog.
 *
 * @param {Object} props - Props for the CustomDialog component.
 * @param {boolean} props.open - Whether the dialog is open.
 * @param {VoidFunction} props.onClose - Function to handle the dialog close event.
 * @param {'default' | 'large'} [props.size='default'] - Controls the dialog's maximum width. Use `default` for a maximum width of 560px or `large` for 680px.
 * @param {React.ReactNode} props.children - Content to be rendered inside the dialog.
 * @param {SxProps} [props.sx] - Custom styles applied to the dialog.
 * @param {MUIDialogProps['PaperProps']} [props.PaperProps] - Additional props passed to the underlying Material UI `Dialog` Paper component.
 *
 * @returns {JSX.Element} The rendered CustomDialog component.
 */
const Dialog = ({
  open,
  onClose,
  children,
  sx,
  PaperProps,
  size,
}: DialogProps) => {
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

  const maxWidth = size === 'large' ? 680 : 560;

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
            maxWidth: maxWidth,
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
