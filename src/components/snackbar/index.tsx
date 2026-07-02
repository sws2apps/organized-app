import { forwardRef } from 'react';
import {
  Fade,
  FadeProps,
  Grow,
  GrowProps,
  Snackbar as MUISnackbar,
  SnackbarCloseReason,
  SnackbarOrigin,
} from '@mui/material';
import { SnackbarPropsType } from './index.types';
import InfoMessage from '@components/info-message';

export const EASING = {
  expoOut: 'cubic-bezier(0.16, 1, 0.3, 1)',
  easeIn: 'cubic-bezier(0.55, 0, 1, 0.45)',
};

const GrowTransition = forwardRef<HTMLDivElement, GrowProps>(
  function GrowTransition(props, ref) {
    return (
      <Grow
        {...props}
        ref={ref}
        timeout={{ enter: 450, exit: 300 }}
        easing={{ enter: EASING.expoOut, exit: EASING.easeIn }}
        style={{ ...props.style, transformOrigin: 'center bottom' }}
      />
    );
  }
);

const FadeTransition = forwardRef<HTMLDivElement, FadeProps>(
  function FadeTransition(props, ref) {
    return (
      <Fade
        {...props}
        ref={ref}
        timeout={{ enter: 400, exit: 250 }}
        easing={{ enter: EASING.expoOut, exit: EASING.easeIn }}
      />
    );
  }
);

const Snackbar = (props: SnackbarPropsType) => {
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

  const getTransition = () => {
    if (position === 'top-center') return FadeTransition;
    return GrowTransition;
  };

  const handleClose = (_, reason: SnackbarCloseReason) => {
    if (reason === 'clickaway') {
      return;
    }

    props.onClose();
  };

  return (
    <MUISnackbar
      open={open}
      onClose={handleClose}
      anchorOrigin={getAnchorOrigin()}
      autoHideDuration={variant === 'message-with-button' ? null : 5000}
      slots={{ transition: getTransition() }}
      slotProps={{
        content: {
          style: {
            boxShadow: 'none',
            backgroundColor: 'transparent',
          },
        },
      }}
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
    />
  );
};

export default Snackbar;
