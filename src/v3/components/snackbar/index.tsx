import { Fade, FadeProps, Snackbar, SnackbarCloseReason, SnackbarOrigin } from '@mui/material';
import InfoMessage from '@components/info-message';
import { SnackbarPropsType } from './index.types';

const FadeTransition = (props: FadeProps) => {
  return <Fade {...props} />;
};

const CustomSnackbar = (props: SnackbarPropsType) => {
  const open = props.open || false;
  const messageHeader = props.messageHeader || '';
  const message = props.message || '';
  const variant = props.variant || 'message-with-button';
  const position = props.position || 'bottom-center';

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

  const handleClose = (_, reason: SnackbarCloseReason) => {
    if (reason === 'clickaway') {
      return;
    }

    props.onClose();
  };

  return (
    <Snackbar
      TransitionComponent={FadeTransition}
      open={open}
      onClose={handleClose}
      anchorOrigin={getAnchorOrigin()}
      autoHideDuration={variant === 'message-with-button' ? null : 5000}
      sx={{
        padding: 0,
        top: position === 'top-center' ? '80px' : 'unset',
        bottom: position === 'bottom-center' ? '24px' : 'unset',
        '.MuiSnackbarContent-message': {
          width: '100%',
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

export default CustomSnackbar;
