import { useAppTranslation, useCurrentUser } from '@hooks/index';
import Select from '@components/select';
import MenuItem from '@components/menuitem';
import useScheduleMode from '@features/congregation/settings/meeting_duties/schedule_mode/useScheduleMode';

const DutiesScheduleMode = () => {
  const { t } = useAppTranslation();
  const { isDutiesEditor } = useCurrentUser();
  const { weekly, saving, handleChange } = useScheduleMode();
  return (
    <Select
      label={t('tr_dutiesScheduleMode')}
      inputProps={{ 'aria-label': t('tr_dutiesScheduleMode') }}
      value={weekly ? 'weeks' : 'meetings'}
      onChange={handleChange}
      readOnly={!isDutiesEditor}
      disabled={saving}
      helperText={t(
        weekly ? 'tr_dutiesScheduleWeeksDesc' : 'tr_dutiesScheduleMeetingsDesc'
      )}
    >
      <MenuItem value="weeks">{t('tr_dutiesScheduleWeeks')}</MenuItem>
      <MenuItem value="meetings">{t('tr_dutiesScheduleMeetings')}</MenuItem>
    </Select>
  );
};
export default DutiesScheduleMode;
