import { TwoColumnsRow } from '@features/congregation/shared_styles/components';
import { useAppTranslation } from '@hooks/index';
import useDayTime from './useDayTime';
import DaySelector from '@components/day_selector';
import TimePicker from '@components/time_picker';

const DayTime = () => {
  const { t } = useAppTranslation();

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
      />

      <TimePicker
        label={t('tr_timerLabelTime')}
        ampm={!hour24}
        value={meetingTime}
        onChange={(time) => handleMeetingTimeChange(time)}
      />
    </TwoColumnsRow>
  );
};

export default DayTime;
