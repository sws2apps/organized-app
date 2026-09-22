import { Box } from '@mui/material';
import { IconCancelCicle, IconEdit, IconRaiseHand } from '@components/icons';
import { PreachingPartnerRowProps } from './index.types';
import { useAppTranslation } from '@hooks/index';
import useRequestRow from './useRequestRow';
import Badge from '@components/badge';
import Button from '@components/button';
import Typography from '@components/typography';

const ACTION_ICONS = {
  edit: IconEdit,
  join: IconRaiseHand,
  cancel: IconCancelCicle,
};

const PreachingPartnerRow = (props: PreachingPartnerRowProps) => {
  const { t } = useAppTranslation();

  const {
    isMine,
    isArranged,
    timeLabel,
    typeLabel,
    publisherName,
    partnerName,
    action,
  } = useRequestRow(props);

  const variant = isMine ? 'accent' : 'orange';

  const borderColor =
    variant === 'accent' ? 'var(--accent-main)' : 'var(--orange-dark)';

  const backgroundColor =
    variant === 'accent' ? 'var(--accent-150)' : 'var(--orange-secondary)';

  const textColor =
    variant === 'accent' ? 'var(--accent-dark)' : 'var(--orange-dark)';

  const ActionIcon = ACTION_ICONS[action.variant];

  const comment = props.request.request_data.comment;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        flexWrap: 'wrap',
      }}
    >
      {/* the chip and the details stay on one line, so only the action wraps */}
      <Box
        sx={{
          flex: '1 1 240px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          minWidth: 0,
        }}
      >
        <Box
          sx={{
            flexShrink: 0,
            minWidth: '96px',
            minHeight: '46px',
            padding: '8px 12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 'var(--radius-s)',
            border: `1px solid ${borderColor}`,
            backgroundColor,
          }}
        >
          <Typography className="body-small-semibold" color={textColor}>
            {timeLabel}
          </Typography>
        </Box>

        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
            minWidth: 0,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              flexWrap: 'wrap',
            }}
          >
            <Typography className="h4">{publisherName}</Typography>

            <Badge size="medium" color={variant} text={typeLabel} />

            {isArranged && (
              <Badge size="medium" color="green" text={t('tr_arranged')} />
            )}
          </Box>

          {isArranged && partnerName.length > 0 && (
            <Typography className="label-small-regular" color="var(--grey-400)">
              {t('tr_arrangementWith', { publisherName: partnerName })}
            </Typography>
          )}

          {comment.length > 0 && (
            <Typography
              className="label-small-regular"
              color="var(--grey-400)"
              sx={{ wordBreak: 'break-word' }}
            >
              {comment}
            </Typography>
          )}
        </Box>
      </Box>

      <Button
        variant="small"
        startIcon={<ActionIcon />}
        onClick={action.onClick}
        sx={{ marginInlineStart: 'auto', flexShrink: 0 }}
      >
        {action.label}
      </Button>
    </Box>
  );
};

export default PreachingPartnerRow;
