import { useAppTranslation, useCurrentUser } from '@hooks/index';
import useMeetingAttendance from './useMeetingAttendance';
import SwitchWithLabel from '@components/switch_with_label';

const MeetingAttendance = () => {
  const { t } = useAppTranslation();

  const { isSettingsEditor } = useCurrentUser();

  const { recordOnline, handleRecordOnlineToggle } = useMeetingAttendance();

  return (
    <SwitchWithLabel
      label={t('tr_recordOnlineAttendance')}
      helper={t('tr_recordOnlineAttendanceDesc')}
      checked={recordOnline}
      onChange={handleRecordOnlineToggle}
      readOnly={!isSettingsEditor}
    />
  );
};

export default MeetingAttendance;
