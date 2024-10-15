import { useAppTranslation, useCurrentUser } from '@hooks/index';
import { TwoColumnsRow } from '@features/congregation/settings/shared_styles';
import useDayTime from './useDayTime';
import DaySelector from '@components/day_selector';
import TimePicker from '@components/time_picker';

const DayTime = () => {
  const { t } = useAppTranslation();

  const { isMidweekEditor } = useCurrentUser();

  const {
    handleMeetingDayChange,
    handleMeetingTimeChange,
    hour24,
    meetingDay,
    meetingTime,
  } = useDayTime();

  return (
    <TwoColumnsRow>
      <DaySelector
        label={t('tr_meetingDay')}
        value={meetingDay}
        onChange={handleMeetingDayChange}
        readOnly={!isMidweekEditor}
      />

      <TimePicker
        label={t('tr_timerLabelTime')}
        ampm={!hour24}
        value={meetingTime}
        onChange={(time) => handleMeetingTimeChange(time)}
        readOnly={!isMidweekEditor}
      />
    </TwoColumnsRow>
  );
};

export default DayTime;
