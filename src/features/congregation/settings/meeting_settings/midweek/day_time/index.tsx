import { useAppTranslation, useCurrentUser, useBreakpoints } from '@hooks/index';
import { Box } from '@mui/material';
import useDayTime from './useDayTime';
import DaySelector from '@components/day_selector';
import TimePicker from '@components/time_picker';

const DayTime = () => {
  const { t } = useAppTranslation();

  const { tabletUp } = useBreakpoints();
  const { isMidweekEditor } = useCurrentUser();

  const {
    handleMeetingDayChange,
    handleMeetingTimeChange,
    hour24,
    meetingDay,
    meetingTime,
  } = useDayTime();

  return (
    <Box sx={{ display: 'flex', gap: '16px', flexDirection: tabletUp ? 'row' : 'column', alignItems: tabletUp ? 'center' : 'stretch' }}>
      <DaySelector
        label={t('tr_meetingDay')}
        value={meetingDay}
        onChange={handleMeetingDayChange}
        readOnly={!isMidweekEditor}
        sx={{ flex: tabletUp ? 65 : 1 }}
      />

      <TimePicker
        label={t('tr_timerLabelTime')}
        ampm={!hour24}
        value={meetingTime}
        onChange={(time) => handleMeetingTimeChange(time)}
        readOnly={!isMidweekEditor}
        sx={{ flex: tabletUp ? 35 : 1 }}
      />
    </Box>
  );
};

export default DayTime;
