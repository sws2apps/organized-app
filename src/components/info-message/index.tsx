import { Box, IconButton } from '@mui/material';
import { IconClose } from '@icons/index';
import { InfoMessagePropsType } from './index.types';
import Button from '@components/button';
import TextMarkup from '@components/text_markup';
import Typography from '@components/typography';

/**
 * Custom component for displaying information messages.
 * @param props The props for the CustomInfoMessage component.
 * @returns JSX element for the CustomInfoMessage component.
 */
const InfoMessage = (props: InfoMessagePropsType) => {
  const messageHeader = props.messageHeader || '';
  const message = props.message || '';
  const variant = props.variant || 'message-with-button';

  const swapToNextRowIfActionTextIsLong = props.actionText.length > 7;

  console.log(swapToNextRowIfActionTextIsLong);

  /**
   * Function to get the background color based on the variant.
   * @returns The background color.
   */
  const getBackground = () => {
    let color: string;

    if (variant === 'message-with-button') color = 'var(--accent-main)';
    if (variant === 'error') color = 'var(--red-main)';
    if (variant === 'success') color = 'var(--green-main)';

    return color;
  };

  /**
   * Function to get the effect based on the variant.
   * @returns The effect name.
   */
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
        padding: swapToNextRowIfActionTextIsLong
          ? '16px'
          : variant === 'message-with-button'
            ? '16px 16px 16px 24px'
            : '16px 24px',
        borderRadius: 'var(--radius-xl)',
        ...props.sx,
      }}
      className={getEffect()}
    >
      {props.messageIcon}
      <Box
        sx={{
          minWidth: '280px',
          width: '100%',
          display: 'flex',
          flexDirection: swapToNextRowIfActionTextIsLong && 'column',
          alignItems:
            variant === 'message-with-button' && props.actionClick
              ? 'center'
              : 'flex-start',
          gap: swapToNextRowIfActionTextIsLong ? '12px' : '4px',
          justifyContent: 'space-between',
        }}
      >
        <Box>
          {messageHeader.length > 0 && (
            <Typography
              className="h4"
              color="var(--always-white)"
              sx={{ marginBottom: '2px' }}
            >
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
            sx={{
              minHeight: '44px',
              marginLeft: !swapToNextRowIfActionTextIsLong ? '24px' : '0px',
              width: swapToNextRowIfActionTextIsLong ? '100%' : 'auto',
            }}
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

export default InfoMessage;
