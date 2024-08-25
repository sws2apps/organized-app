import { useAppTranslation } from '@hooks/index';
import { QuickSettingsMeetingAttendanceRecordProps } from './index.types';
import MeetingAttendance from '@features/congregation/settings/congregation_basic/meeting_attendance';
import QuickSettings from '@features/quick_settings';

const QuickSettingsMeetingAttendanceRecord = ({
  onClose,
  open,
}: QuickSettingsMeetingAttendanceRecordProps) => {
  const { t } = useAppTranslation();

  return (
    <QuickSettings
      title={t('tr_meetingAttendanceRecord')}
      open={open}
      onClose={onClose}
    >
      <MeetingAttendance />
    </QuickSettings>
  );
};

export default QuickSettingsMeetingAttendanceRecord;
