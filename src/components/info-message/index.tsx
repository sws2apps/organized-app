import { Box, IconButton } from '@mui/material';
import { IconClose } from '@icons/index';
import { InfoMessagePropsType } from './index.types';
import Button from '@components/button';
import TextMarkup from '@components/text_markup';
import Typography from '@components/typography';
import { useBreakpoints } from '@hooks/index';

/**
 * Custom component for displaying information messages.
 * @param props The props for the CustomInfoMessage component.
 * @returns JSX element for the CustomInfoMessage component.
 */
const InfoMessage = (props: InfoMessagePropsType) => {
  const { tablet500Down, laptopDown } = useBreakpoints();

  const messageHeader = props.messageHeader || '';
  const message = props.message || '';
  const variant = props.variant || 'message-with-button';

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
        maxWidth: { mobile: '100%', laptop: '600px' },
        minHeight: '78px',
        background: getBackground(),
        padding: laptopDown
          ? '16px'
          : variant === 'message-with-button'
            ? '16px 16px 16px 24px'
            : '16px 24px',
        borderRadius: 'var(--radius-xl)',
        ...props.sx,
      }}
      className={getEffect()}
    >
      {!tablet500Down && props.messageIcon}
      <Box
        sx={{
          minWidth: laptopDown ? '230px' : '300px',
          width: '100%',
          display: 'flex',
          gap: '4px',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flex: 1,
            gap: '12px',
            flexDirection: laptopDown ? 'column' : 'row',
            justifyContent: 'space-between',
            alignItems:
              variant === 'message-with-button' && props.actionClick
                ? 'flex-start'
                : 'center',
          }}
        >
          <Box sx={{ flexGrow: 1 }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: '4px',
                paddingBottom: tablet500Down ? '4px' : 'none',
              }}
            >
              {tablet500Down && props.messageIcon}
              {messageHeader.length > 0 && (
                <Typography
                  className="h4"
                  color="var(--always-white)"
                  sx={{ marginBottom: '2px' }}
                >
                  {messageHeader}
                </Typography>
              )}
            </Box>

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
              sx={{ minHeight: '44px', width: laptopDown ? '100%' : 'auto' }}
              disableAutoStretch
            >
              {props.actionText}
            </Button>
          )}
        </Box>

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
