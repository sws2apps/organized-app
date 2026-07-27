import { Box } from '@mui/material';
import { useAppTranslation, useCurrentUser } from '@hooks/index';
import {
  UPCOMING_EVENT_MAX_LIST_DAYS,
  UpcomingEventDisplayType,
} from '@definition/upcoming_events';
import useMultiDayDisplay from './useMultiDayDisplay';
import MenuItem from '@components/menuitem';
import Select from '@components/select';
import Typography from '@components/typography';

const MultiDayDisplay = () => {
  const { t } = useAppTranslation();

  const { isAdmin } = useCurrentUser();

  const { display, handleDisplayChange } = useMultiDayDisplay();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <Select
        label={t('tr_multiDayEventsLayout')}
        value={display}
        onChange={(e) =>
          handleDisplayChange(e.target.value as UpcomingEventDisplayType)
        }
        readOnly={!isAdmin}
      >
        <MenuItem value="byDay">{t('tr_separateDays')}</MenuItem>
        <MenuItem value="range">{t('tr_oneDateRange')}</MenuItem>
      </Select>

      <Typography className="label-small-regular" color="var(--grey-350)">
        {t('tr_multiDayEventsHint', { days: UPCOMING_EVENT_MAX_LIST_DAYS })}
      </Typography>
    </Box>
  );
};

export default MultiDayDisplay;
