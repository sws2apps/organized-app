import PropTypes from 'prop-types';
import { Snackbar } from '@mui/material';
import { InfoMessage } from '@components';

const CPESnackbar = ({
  open = false,
  messageHeader = '',
  message = '',
  variant = 'message-with-button',
  messageIcon,
  actionIcon,
  actionClick,
  actionText,
  position = 'bottom-center',
  onClose,
}) => {
  const getAnchorOrigin = () => {
    const anchor = {};

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

  return (
    <Snackbar
      open={open}
      onClose={onClose}
      anchorOrigin={getAnchorOrigin()}
      autoHideDuration={variant === 'message-with-button' ? null : 5000}
      sx={{
        padding: 0,
        top: '80px',
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
          messageIcon={messageIcon}
          messageHeader={messageHeader}
          message={message}
          variant={variant}
          actionText={actionText}
          actionClick={actionClick}
          actionIcon={actionIcon}
          onClose={onClose}
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

CPESnackbar.propTypes = {
  open: PropTypes.bool,
  variant: PropTypes.oneOf(['error', 'success', 'message-with-button']),
  actionClick: PropTypes.func,
  actionText: PropTypes.string,
  messageIcon: PropTypes.element,
  actionIcon: PropTypes.element,
  messageHeader: PropTypes.string,
  message: PropTypes.string,
  onClose: PropTypes.func,
  position: PropTypes.oneOf(['bottom-center', 'top-center']),
};

export default CPESnackbar;
