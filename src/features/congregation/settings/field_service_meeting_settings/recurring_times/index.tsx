import { Stack } from '@mui/material';
import { useAtomValue } from 'jotai';
import { useAppTranslation } from '@hooks/index';
import Typography from '@components/typography';
import DaySelector from '@components/day_selector';
import TimePicker from '@components/time_picker';
import { TwoColumnsRow } from '@features/congregation/settings/shared_styles';
import { hour24FormatState } from '@states/settings';
import useRecurringTimes from './useRecurringTimes';

/**
 * Per-group editor for the recurring field service meeting day & time.
 * Reused on the Congregation settings page and in the page's quick settings.
 * The surrounding heading/description is provided by the parent surface.
 */
const RecurringTimes = () => {
  const { t } = useAppTranslation();
  const hour24 = useAtomValue(hour24FormatState);
  const { rows, handleDayChange, handleTimeChange } = useRecurringTimes();

  return (
    <Stack spacing="16px" width="100%">
      {rows.map((row) => (
        <Stack key={row.groupId} spacing="8px">
          <Typography className="h4">{row.label}</Typography>
          <TwoColumnsRow>
            <DaySelector
              label={t('tr_meetingDay')}
              value={row.weekday}
              onChange={(value) => handleDayChange(row.groupId, value)}
              readOnly={row.readOnly}
            />
            <TimePicker
              label={t('tr_timerLabelTime')}
              ampm={!hour24}
              value={row.time}
              onChange={(time) => handleTimeChange(row.groupId, time)}
              readOnly={row.readOnly}
            />
          </TwoColumnsRow>
        </Stack>
      ))}
    </Stack>
  );
};

export default RecurringTimes;
