import { useAppTranslation } from '@hooks/index';
import SwitchWithLabel from '@components/switch_with_label';
import useMeetingAttendance from './useMeetingAttendance';

const MeetingAttendance = () => {
  const { t } = useAppTranslation();

  const { recordOnline, handleRecordOnlineToggle } = useMeetingAttendance();

  return (
    <SwitchWithLabel
      label={t('tr_recordOnlineAttendance')}
      helper={t('tr_recordOnlineAttendanceDesc')}
      checked={recordOnline}
      onChange={handleRecordOnlineToggle}
    />
  );
};

export default MeetingAttendance;
