import { Box } from '@mui/material';
import { IconCancelCicle, IconEdit, IconRaiseHand } from '@components/icons';
import { PreachingPartnerRowProps } from '@features/ministry/preaching_partner/request_row/index.types';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import useRequestRow from '@features/ministry/preaching_partner/request_row/useRequestRow';
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

  const { tablet688Up } = useBreakpoints();

  const {
    canAct,
    pending,
    isMine,
    isArranged,
    timeLabel,
    typeLabel,
    publisherName,
    partnerName,
    action,
    actionAriaLabel,
  } = useRequestRow(props);

  const variant = isMine ? 'accent' : 'orange';

  const borderColor =
    variant === 'accent' ? 'var(--accent-main)' : 'var(--orange-dark)';

  const backgroundColor =
    variant === 'accent' ? 'var(--accent-150)' : 'var(--orange-secondary)';

  const textColor = 'var(--black)';

  const ActionIcon = ACTION_ICONS[action.variant];

  const badgeSize = tablet688Up ? 'medium' : 'small';

  const comment = props.request.request_data.comment;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        flexWrap: tablet688Up ? 'nowrap' : 'wrap',
        gap: tablet688Up ? '16px' : '12px',
      }}
    >
      <Box
        sx={{
          flexShrink: 0,
          width: tablet688Up ? '120px' : '72px',
          minHeight: tablet688Up ? '46px' : '40px',
          padding: tablet688Up ? '8px 12px' : '4px 6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          borderRadius: 'var(--radius-s)',
          border: `1px solid ${borderColor}`,
          backgroundColor,
        }}
      >
        {/* a range breaks after its dash when the chip is narrow */}
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
            columnGap: '8px',
            rowGap: '4px',
            flexWrap: 'wrap',
          }}
        >
          <Typography className="h4" sx={{ wordBreak: 'break-word' }}>
            {publisherName}
          </Typography>

          <Badge
            size={badgeSize}
            color={isMine ? 'accent' : 'grey'}
            text={typeLabel}
            multiLine
            sx={{ maxWidth: '100%', overflowWrap: 'anywhere' }}
          />

          {pending && (
            <Badge
              size={badgeSize}
              color="grey"
              multiLine
              text={t(
                pending.error
                  ? 'tr_partnerSyncFailedLabel'
                  : 'tr_partnerSyncPendingLabel'
              )}
            />
          )}
          {isArranged && (
            <Badge size={badgeSize} color="accent" text={t('tr_arranged')} />
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

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 1,
          justifyContent: 'flex-end',
          width: tablet688Up ? 'auto' : '100%',
        }}
      >
        {isArranged && props.onCalendar && (
          <Button
            variant="small"
            disableAutoStretch
            onClick={() => props.onCalendar?.(props.request)}
          >
            {t('tr_addToCalendar')}
          </Button>
        )}
        <Button
          variant="small"
          disableAutoStretch
          startIcon={<ActionIcon />}
          onClick={action.onClick}
          disabled={!canAct}
          ariaLabel={actionAriaLabel}
          sx={{ flexShrink: 0 }}
        >
          {action.label}
        </Button>
      </Box>
    </Box>
  );
};

export default PreachingPartnerRow;
