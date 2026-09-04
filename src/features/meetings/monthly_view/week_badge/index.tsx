import { Box } from '@mui/material';
import useAppTranslation from '@hooks/useAppTranslation';
import { ButtonIcon, Typography } from '@components/index';
import IconLoading from '@components/icon_loading';
import Tooltip from '@components/tooltip';
import { IconGenerate } from '@components/icons';
import { WeekBadgeType } from './index.types';
import useWeekBadge from './useWeekBadge';

const ICON_SIZE = 24;
const ICON_BUTTON_PADDING = 4;
const ICON_BUTTON_SIZE = ICON_SIZE + 2 * ICON_BUTTON_PADDING;

const WeekBadge = (props: WeekBadgeType) => {
  const { t } = useAppTranslation();

  const { isProcessing, handleAutofill } = useWeekBadge(props.week);

  return (
    <Box
      sx={{
        flex: '1',
        height: '32px',
        padding: '4px',
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'var(--accent-150)',
        borderRadius: 'var(--radius-s)',
      }}
    >
      {props.week && (
        <Box sx={{ width: `${ICON_BUTTON_SIZE}px`, flexShrink: 0 }} />
      )}

      <Typography
        color="var(--accent-dark)"
        className="h4"
        sx={{ flex: 1, textAlign: 'center' }}
      >
        {props.text}
      </Typography>

      {props.week && (
        <Tooltip
          title={t('tr_autofillThisWeek')}
          show={!isProcessing}
          placement="top"
        >
          <ButtonIcon
            onClick={handleAutofill}
            disabled={isProcessing}
            aria-label={t('tr_autofillThisWeek')}
            sx={{ padding: `${ICON_BUTTON_PADDING}px`, flexShrink: 0 }}
          >
            {isProcessing ? (
              <IconLoading
                width={ICON_SIZE}
                height={ICON_SIZE}
                color="var(--accent-dark)"
              />
            ) : (
              <IconGenerate
                width={ICON_SIZE}
                height={ICON_SIZE}
                color="var(--accent-dark)"
              />
            )}
          </ButtonIcon>
        </Tooltip>
      )}
    </Box>
  );
};

export default WeekBadge;
