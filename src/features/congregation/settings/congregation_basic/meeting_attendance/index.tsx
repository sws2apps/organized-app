import { useAppTranslation, useCurrentUser } from '@hooks/index';
import SwitchWithLabel from '@components/switch_with_label';
import useMeetingAttendance from './useMeetingAttendance';

const MeetingAttendance = () => {
  const { t } = useAppTranslation();

  const { isAdmin } = useCurrentUser();

  const { recordOnline, handleRecordOnlineToggle } = useMeetingAttendance();

  return (
    <SwitchWithLabel
      label={t('tr_recordOnlineAttendance')}
      helper={t('tr_recordOnlineAttendanceDesc')}
      checked={recordOnline}
      onChange={handleRecordOnlineToggle}
      readOnly={!isAdmin}
    />
  );
};

export default MeetingAttendance;
