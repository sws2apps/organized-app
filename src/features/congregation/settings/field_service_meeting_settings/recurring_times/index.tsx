import { Stack } from '@mui/material';
import { useAtomValue } from 'jotai';
import { useAppTranslation } from '@hooks/index';
import Typography from '@components/typography';
import DaySelector from '@components/day_selector';
import TimePicker from '@components/time_picker';
import { hour24FormatState } from '@states/settings';
import useRecurringTimes from '@features/congregation/settings/field_service_meeting_settings/recurring_times/useRecurringTimes';

/**
 * Per-group editor for the recurring meeting day & time, shown both in the
 * congregation settings and in the page's quick settings. The heading and
 * description come from the parent surface.
 */
const RecurringTimes = () => {
  const { t } = useAppTranslation();
  const hour24 = useAtomValue(hour24FormatState);
  const { rows, handleDayChange, handleTimeChange } = useRecurringTimes();

  return (
    <Stack spacing="16px" sx={{ width: '100%' }}>
      {rows.map((row) => (
        <Stack key={row.groupId} spacing="8px">
          <Typography className="h4">{row.label}</Typography>
          <Stack spacing="16px" sx={{ width: '100%', minWidth: 0 }}>
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
          </Stack>
        </Stack>
      ))}
    </Stack>
  );
};

export default RecurringTimes;
