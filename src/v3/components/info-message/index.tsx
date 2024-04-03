import { Box, IconButton } from '@mui/material';
import Button from '@components/button';
import TextMarkup from '@components/text_markup';
import Typography from '@components/typography';
import { IconClose } from '@icons/index';
import { InfoMessagePropsType } from './index.types';

const CustomInfoMessage = (props: InfoMessagePropsType) => {
  const messageHeader = props.messageHeader || '';
  const message = props.message || '';
  const variant = props.variant || 'message-with-button';

  const getBackground = () => {
    let color: string;

    if (variant === 'message-with-button') color = 'var(--accent-main)';
    if (variant === 'error') color = 'var(--red-main)';
    if (variant === 'success') color = 'var(--green-main)';

    return color;
  };

  const getEffect = () => {
    let effect: string;

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
      {props.messageIcon}
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: variant === 'message-with-button' && props.actionClick ? 'center' : 'flex-start',
          gap: '4px',
          justifyContent: 'space-between',
        }}
      >
        <Box>
          {messageHeader.length > 0 && (
            <Typography className="h4" color="var(--always-white)" sx={{ marginBottom: '2px' }}>
              {messageHeader}
            </Typography>
          )}
          <TextMarkup
            content={message}
            className="body-small-regular"
            color="var(--always-white)"
            anchorClassName="body-small-regular"
            anchorColor="var(--always-white)"
            anchorStyle={{ textDecoration: 'underline' }}
          />
        </Box>

        {variant === 'message-with-button' && props.actionClick && (
          <Button
            variant="semi-white"
            onClick={props.actionClick}
            startIcon={props.actionIcon}
            sx={{ minHeight: '44px' }}
            disableAutoStretch
          >
            {props.actionText}
          </Button>
        )}
        {props.onClose && (
          <IconButton onClick={props.onClose} sx={{ padding: 0 }}>
            <IconClose color="var(--always-white)" />
          </IconButton>
        )}
      </Box>
    </Box>
  );
};

export default CustomInfoMessage;
