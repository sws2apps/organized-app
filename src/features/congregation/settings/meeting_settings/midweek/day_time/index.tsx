import { useAppTranslation, useCurrentUser, useBreakpoints } from '@hooks/index';
import { TwoColumnsRow } from '@features/congregation/settings/shared_styles';
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
    <TwoColumnsRow sx={{ flexDirection: tabletUp ? 'row' : 'column', alignItems: tabletUp ? 'center' : 'unset' }}>
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
    </TwoColumnsRow>
  );
};

export default DayTime;
