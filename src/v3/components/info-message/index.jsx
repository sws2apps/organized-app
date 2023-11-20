import PropTypes from 'prop-types';
import { Box, IconButton } from '@mui/material';
import { Button, Typography } from '@components';
import { IconClose } from '@icons';

const CPEInfoMessage = ({
  messageHeader = '',
  message = '',
  variant = 'message-with-button',
  messageIcon,
  actionIcon,
  actionClick,
  actionText,
  onClose,
}) => {
  const getBackground = () => {
    let color;

    if (variant === 'message-with-button') color = 'var(--accent-main)';
    if (variant === 'error') color = 'var(--red-main)';
    if (variant === 'success') color = 'var(--green-main)';

    return color;
  };

  const getEffect = () => {
    let effect;

    if (variant === 'message-with-button') effect = 'message-glow';
    if (variant === 'error') effect = 'error-glow';
    if (variant === 'success') effect = 'success-glow';

    return effect;
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        justifyContent: 'space-between',
        '& svg, & svg g, & svg g path': {
          fill: 'var(--always-white)',
        },
        width: '100%',
        maxWidth: { mobile: '100%', laptop: '544px' },
        minHeight: '78px',
        background: getBackground(),
        padding: variant === 'message-with-button' ? '16px 16px 16px 24px' : '16px 24px',
        borderRadius: 'var(--radius-xl)',
      }}
      className={getEffect()}
    >
      {messageIcon && messageIcon}
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: variant === 'message-with-button' ? 'center' : 'flex-start',
          gap: '4px',
          justifyContent: 'space-between',
        }}
      >
        <Box>
          {messageHeader.length > 0 && (
            <Typography variant="h4" color="var(--always-white)" sx={{ marginBottom: '2px' }}>
              {messageHeader}
            </Typography>
          )}
          <Typography variant="body-small-regular" color="var(--always-white)">
            {message}
          </Typography>
        </Box>

        {variant === 'message-with-button' && (
          <Button
            variant="semi-white"
            onClick={actionClick}
            startIcon={actionIcon}
            sx={{ minHeight: '44px' }}
            disableAutoStretch
          >
            {actionText}
          </Button>
        )}
        {variant !== 'message-with-button' && (
          <IconButton onClick={onClose}>
            <IconClose color="var(--always-white)" />
          </IconButton>
        )}
      </Box>
    </Box>
  );
};

CPEInfoMessage.propTypes = {
  variant: PropTypes.oneOf(['error', 'success', 'message-with-button']),
  actionClick: PropTypes.func,
  actionText: PropTypes.string,
  messageIcon: PropTypes.element,
  actionIcon: PropTypes.element,
  messageHeader: PropTypes.string,
  message: PropTypes.string,
  onClose: PropTypes.func,
};

export default CPEInfoMessage;
