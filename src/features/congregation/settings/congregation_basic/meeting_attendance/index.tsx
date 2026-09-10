import { Stack } from '@mui/material';
import { useAppTranslation, useCurrentUser } from '@hooks/index';
import useMeetingAttendance from './useMeetingAttendance';
import SwitchWithLabel from '@components/switch_with_label';

const MeetingAttendance = () => {
  const { t } = useAppTranslation();

  const { isSettingsEditor } = useCurrentUser();

  const {
    recordOnline,
    handleRecordOnlineToggle,
    recordDeaf,
    handleRecordDeafToggle,
  } = useMeetingAttendance();

  return (
    <Stack spacing="16px">
      <SwitchWithLabel
        label={t('tr_recordOnlineAttendance')}
        helper={t('tr_recordOnlineAttendanceDesc')}
        checked={recordOnline}
        onChange={handleRecordOnlineToggle}
        readOnly={!isSettingsEditor}
      />

      <SwitchWithLabel
        label={t('tr_recordDeafAttendance')}
        helper={t('tr_recordDeafAttendanceDesc')}
        checked={recordDeaf}
        onChange={handleRecordDeafToggle}
        readOnly={!isSettingsEditor}
      />
    </Stack>
  );
};

export default MeetingAttendance;
