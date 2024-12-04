import {
  Fade,
  FadeProps,
  Snackbar as MUISnackbar,
  SnackbarCloseReason,
  SnackbarOrigin,
} from '@mui/material';
import { SnackbarPropsType } from './index.types';
import InfoMessage from '@components/info-message';

/**
 * Custom transition component for the Snackbar.
 */
const FadeTransition = (props: FadeProps) => {
  return <Fade {...props} />;
};

/**
 * Custom Snackbar component.
 */
const Snackbar = (props: SnackbarPropsType) => {
  const open = props.open || false;
  const messageHeader = props.messageHeader || '';
  const message = props.message || '';
  const variant = props.variant || 'message-with-button';
  const position = props.position || 'bottom-center';

  /**
   * Gets the anchor origin for the Snackbar based on the specified position.
   * @returns SnackbarOrigin - The anchor origin for the Snackbar.
   */
  const getAnchorOrigin = () => {
    const anchor = {} as SnackbarOrigin;

    if (position === 'top-center') {
      anchor.vertical = 'top';
      anchor.horizontal = 'center';
    }

    if (position === 'bottom-center') {
      anchor.vertical = 'bottom';
      anchor.horizontal = 'center';
    }

    return anchor;
  };

  /**
   * Handles the Snackbar close event.
   * @param _ - The event.
   * @param reason - The reason for closing the Snackbar.
   */
  const handleClose = (_, reason: SnackbarCloseReason) => {
    if (reason === 'clickaway') {
      return;
    }

    props.onClose();
  };

  return (
    <MUISnackbar
      TransitionComponent={FadeTransition}
      open={open}
      onClose={handleClose}
      anchorOrigin={getAnchorOrigin()}
      autoHideDuration={variant === 'message-with-button' ? null : 5000}
      sx={{
        padding: 0,
        top: position === 'top-center' ? '80px' : 'unset',
        bottom: position === 'bottom-center' ? '24px' : 'unset',
        left: '50%',
        right: 'auto',
        transform: 'translateX(-50%)',
        '.MuiSnackbarContent-message': {
          display: 'flex',
          justifyContent: 'center',
          padding: 0,
          '& > div:first-of-type': {
            border: '1px solid var(--accent-300)',
          },
        },
        '.MuiSnackbarContent-root': {
          padding: 0,
        },
      }}
      message={
        <InfoMessage
          messageIcon={props.messageIcon}
          messageHeader={messageHeader}
          message={message}
          variant={variant}
          actionText={props.actionText}
          actionClick={props.actionClick}
          actionIcon={props.actionIcon}
          onClose={props.onClose}
        />
      }
      ContentProps={{
        style: {
          boxShadow: 'none',
          backgroundColor: 'transparent',
        },
      }}
    />
  );
};

export default Snackbar;
